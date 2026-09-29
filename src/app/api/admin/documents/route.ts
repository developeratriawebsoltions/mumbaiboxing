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
          OR: [
            {
              status: "pending",
            },
            {
              status: "uploaded",
            },
            {
              status: "under_review",
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /* =====================================================
       FORMAT RESPONSE
       =====================================================

       Do NOT use document.user here because your generated
       Prisma client does not expose a user relation on
       Document.
       ===================================================== */

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