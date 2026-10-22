import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    /* =====================================================
       AUTHENTICATION
       ===================================================== */

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

    /* =====================================================
       AUTHORIZATION
       ===================================================== */

    if (
      payload.role !== "admin" &&
      payload.role !== "superadmin"
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to view documents.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       GET PENDING DOCUMENTS
       =====================================================

       Your Prisma schema says:

       status: string

       Therefore we CANNOT use:

       { status: null }

       Only actual string values are used.
       ===================================================== */

    const documents =
      await prisma.document.findMany({
        where: {
          status: {
            in: [
              "pending",
              "Pending",
              "uploaded",
              "Uploaded",
              "under_review",
              "Under Review",
            ],
          },
        },

        include: {
          user: {
            select: {
              email: true,
              role: true,
              boxer: { select: { name: true } },
              coach: { select: { name: true } },
              academy: { select: { name: true } },
              refereeJudge: { select: { name: true } },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const formattedDocuments =
      documents.map((document) => ({
        id: document.id,

        label: document.label,

        filePath: document.filePath,

        fileType: document.fileType,

        createdAt:
          document.createdAt,

        status:
          document.status,

        rejectionReason:
          document.rejectionReason,

        /*
         * We still return userId because it exists directly
         * on your Document model.
         */
        userId: document.userId,
        userRole: document.user.role,
        userName:
          document.user.boxer?.name ??
          document.user.coach?.name ??
          document.user.academy?.name ??
          document.user.refereeJudge?.name ??
          document.user.email,
      }));

    /* =====================================================
       RESPONSE
       ===================================================== */

    return NextResponse.json(
      formattedDocuments,
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
      "GET /api/admin/documents error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load documents.",
      },
      {
        status: 500,
      }
    );
  }
}