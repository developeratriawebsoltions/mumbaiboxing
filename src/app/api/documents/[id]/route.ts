import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    /* =====================================================
       1. AUTHENTICATION
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
       2. ADMIN AUTHORIZATION
       ===================================================== */

    if (
      payload.role !== "admin" &&
      payload.role !== "superadmin"
    ) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to review documents.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       3. GET DOCUMENT ID
       ===================================================== */

    const { id } = await context.params;

    const documentId = Number(id);

    if (
      !Number.isInteger(documentId) ||
      documentId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid document ID.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       4. READ REQUEST BODY
       ===================================================== */

    let body: {
      action?: string;
      rejectionReason?: string;
    };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const action = body.action;

    /* =====================================================
       5. VALIDATE ACTION
       ===================================================== */

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid action. Use "approve" or "reject".',
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       6. VALIDATE REJECTION REASON
       ===================================================== */

    let rejectionReason: string | null = null;

    if (action === "reject") {
      rejectionReason =
        typeof body.rejectionReason === "string"
          ? body.rejectionReason.trim()
          : "";

      if (!rejectionReason) {
        return NextResponse.json(
          {
            error:
              "Rejection reason is required.",
          },
          {
            status: 400,
          }
        );
      }

      if (rejectionReason.length > 1000) {
        return NextResponse.json(
          {
            error:
              "Rejection reason cannot exceed 1000 characters.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================================================
       7. FIND DOCUMENT
       ===================================================== */

    const document =
      await prisma.document.findUnique({
        where: {
          id: documentId,
        },
      });

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       8. CHECK CURRENT DOCUMENT STATUS
       ===================================================== */

    const currentStatus = String(
      document.status ?? "pending"
    )
      .trim()
      .toLowerCase();

    /*
     * Do not allow a document that has already been
     * approved or rejected to be reviewed again.
     */

    if (
      currentStatus === "approved" ||
      currentStatus === "verified" ||
      currentStatus === "valid"
    ) {
      return NextResponse.json(
        {
          error:
            "This document has already been approved.",
          document,
        },
        {
          status: 409,
        }
      );
    }

    if (
      currentStatus === "rejected" ||
      currentStatus === "invalid"
    ) {
      return NextResponse.json(
        {
          error:
            "This document has already been rejected.",
          document,
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       9. DETERMINE NEW STATUS
       ===================================================== */

    const newStatus =
      action === "approve"
        ? "approved"
        : "rejected";

    /* =====================================================
       10. UPDATE DATABASE
       ===================================================== */

    const updatedDocument =
      await prisma.document.update({
        where: {
          id: documentId,
        },

        data: {
          status: newStatus,

          /*
           * Approved documents have no rejection reason.
           *
           * Rejected documents store the reason.
           */
          rejectionReason:
            action === "approve"
              ? null
              : rejectionReason,
        },
      });

    /* =====================================================
       11. RETURN UPDATED DOCUMENT
       ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          action === "approve"
            ? "Document approved successfully."
            : "Document rejected successfully.",

        document: updatedDocument,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/documents/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update document.",
      },
      {
        status: 500,
      }
    );
  }
}