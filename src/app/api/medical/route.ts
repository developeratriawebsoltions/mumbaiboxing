import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

/* =========================================================
   EXACT MEDICAL DOCUMENT LABELS
   ========================================================= */

const MEDICAL_DOCUMENT_LABELS = [
  "Medical Fitness Certificate by (MBBS) Dr.",
  "HIV / Hepatitis B & C Test Report",
];

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

    /* -------------------------------------------------------
       FILTER APPROVED MEDICAL DOCUMENTS

       We intentionally use the exact labels so that Aadhaar,
       Birth Certificate and Passport Photo are NOT included.
    ------------------------------------------------------- */

    const approvedMedicalDocuments =
      user.document.filter(
        (document) => {
          const isMedicalDocument =
            MEDICAL_DOCUMENT_LABELS.includes(
              document.label
            );

          const isApproved =
            document.status
              .trim()
              .toLowerCase() ===
            "approved";

          return (
            isMedicalDocument &&
            isApproved
          );
        }
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

        /* -----------------------------------------------
           APPROVED MEDICAL DOCUMENTS
        ----------------------------------------------- */

        documents:
          approvedMedicalDocuments.map(
            (document) => ({
              id: document.id,

              label: document.label,

              filePath:
                document.filePath,

              fileType:
                document.fileType,

              status:
                document.status,

              rejectionReason:
                document.rejectionReason,

              createdAt:
                document.createdAt,
            })
          ),
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