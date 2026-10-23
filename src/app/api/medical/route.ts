import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { isMedicalDocumentLabel } from "@/lib/medical-documents";
import { cloudinaryUpload } from "@/lib/cloudinary";

/* =========================================================
   GET /api/medical
   ========================================================= */

export async function GET(req: NextRequest) {
  try {
    /* -------------------------------------------------------
       AUTHENTICATION
    ------------------------------------------------------- */

    const token =
      req.cookies.get("mba_token")?.value ?? "";

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* -------------------------------------------------------
       LOAD USER

       IMPORTANT:
       Prisma relation is `document`, NOT `documents`.
    ------------------------------------------------------- */

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },

      include: {
        boxer: {
          include: {
            medical: true,
          },
        },

        document: true,
      },
    });

    /* -------------------------------------------------------
       USER NOT FOUND
    ------------------------------------------------------- */

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------------
       BOXER PROFILE NOT FOUND
    ------------------------------------------------------- */

    if (!user.boxer) {
      return NextResponse.json(
        {
          error: "Boxer profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    const medicalDocuments = user.document.filter((document) =>
      isMedicalDocumentLabel(document.label)
    );

    /* -------------------------------------------------------
       FORMAT RESPONSE
    ------------------------------------------------------- */

    return NextResponse.json(
      {
        boxer: {
          id: user.boxer.id,
          name: user.boxer.name,
        },

        /* -----------------------------------------------
           STRUCTURED MEDICAL RECORD
        ----------------------------------------------- */

        medical: user.boxer.medical
          ? {
            id:
              user.boxer.medical.id,

            fitnessStatus:
              user.boxer.medical
                .fitnessStatus,

            expiryDate:
              user.boxer.medical
                .expiryDate,

            injury:
              user.boxer.medical
                .injury,

            eligible:
              user.boxer.medical
                .eligible,

            updatedAt:
              user.boxer.medical
                .updatedAt,

            createdAt:
              user.boxer.medical
                .createdAt,
          }
          : null,

        documents: medicalDocuments.map((document) => ({
          id: document.id,
          label: document.label,
          filePath: document.filePath,
          fileType: document.fileType,
          status: document.status,
          rejectionReason: document.rejectionReason,
          issueDate: document.issueDate,
          createdAt: document.createdAt,
        })),
      },

      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/medical error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load medical records.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH /api/medical
   Renew a medical document + recalculate medical expiry
   Body: multipart/form-data
     - docType: "medical-fitness-certificate-by-mbbs-dr" | "hiv-hepatitis-b-c-test-report"
     - issueDate: "YYYY-MM-DD"
     - file: File
   ========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value ?? "";
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const docType = String(formData.get("docType") ?? "").trim();
    const issueDate = String(formData.get("issueDate") ?? "").trim();
    const file = formData.get("file");

    if (!docType || !issueDate || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "docType, issueDate and file are required" }, { status: 400 });
    }

    if (!isMedicalDocumentLabel(docType)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    const parsedIssue = new Date(issueDate);
    if (Number.isNaN(parsedIssue.getTime())) {
      return NextResponse.json({ error: "Invalid issue date" }, { status: 400 });
    }

    // Calculate expiry: HIV = 6 months, Medical cert = 1 year
    const newExpiry = new Date(parsedIssue);
    if (docType === "hiv-hepatitis-b-c-test-report") {
      newExpiry.setMonth(newExpiry.getMonth() + 6);
    } else {
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    }

    // Upload to cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type.startsWith("image/") ? "image" : "raw";
    const url = await cloudinaryUpload(buffer, `mba/${payload.id}`, docType, fileType as "image" | "raw");

    // Upsert document record — reset status to Pending for re-review
    await prisma.document.upsert({
      where: { userId_label: { userId: payload.id, label: docType } },
      update: {
        filePath: url,
        fileType: fileType === "image" ? "image" : "pdf",
        issueDate: parsedIssue,
        status: "Pending",
      },
      create: {
        userId: payload.id,
        label: docType,
        filePath: url,
        fileType: fileType === "image" ? "image" : "pdf",
        issueDate: parsedIssue,
      },
    });

    const boxer = await prisma.boxer.findUnique({
      where: { userId: payload.id },
      select: { id: true, medical: { select: { id: true, expiryDate: true } } },
    });

    if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

    const now = new Date();

    // Use minimum of new expiry and existing other-doc expiry
    let finalExpiry = newExpiry;
    if (boxer.medical?.expiryDate) {
      const existing = new Date(boxer.medical.expiryDate);
      finalExpiry = newExpiry < existing ? newExpiry : existing;
    }

    const isExpired = finalExpiry < now;
    const isExpiringSoon = !isExpired && (finalExpiry.getTime() - now.getTime()) < 30 * 24 * 60 * 60 * 1000;
    const fitnessStatus = isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Valid";

    if (boxer.medical) {
      await prisma.medical.update({
        where: { boxerId: boxer.id },
        data: { expiryDate: finalExpiry, fitnessStatus, eligible: !isExpired, updatedAt: new Date() },
      });
    } else {
      await prisma.medical.create({
        data: { boxerId: boxer.id, expiryDate: finalExpiry, fitnessStatus, eligible: !isExpired, updatedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, expiryDate: finalExpiry, fitnessStatus });
  } catch (error) {
    console.error("PATCH /api/medical error:", error);
    return NextResponse.json({ error: "Failed to renew medical document." }, { status: 500 });
  }
}