import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import {
  isPrivateTournamentHistoryDocumentPath,
  requiresTournamentHistoryProof,
  validateTournamentHistorySubmission,
} from "@/lib/tournament-history-validation";
import { privateTournamentHistoryDocumentExists } from "@/lib/tournament-history-documents";

async function getAuthenticatedBoxer(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== "boxer") {
    return null;
  }

  const boxer = await prisma.boxer.findUnique({
    where: {
      userId: payload.id,
    },
    select: {
      id: true,
      userId: true,
      name: true,
    },
  });

  return boxer;
}

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Get the logged-in boxer's tournament history.
*/
export async function GET(req: NextRequest) {
  try {
    const boxer = await getAuthenticatedBoxer(req);

    if (!boxer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const history = await prisma.boxer_tournament_history.findMany({
      where: {
        boxerId: boxer.id,
      },
      orderBy: [
        {
          tournamentDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(
      "GET /api/boxer/tournament-history error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load tournament history.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
| Submit a previous tournament for association verification.
*/
export async function POST(req: NextRequest) {
  try {
    const boxer = await getAuthenticatedBoxer(req);

    if (!boxer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = validateTournamentHistorySubmission(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const documentPath =
      body && typeof body.documentPath === "string"
        ? body.documentPath
        : null;
    const documentName =
      body && typeof body.documentName === "string"
        ? body.documentName.trim().slice(0, 190)
        : null;

    if (
      documentPath &&
      !isPrivateTournamentHistoryDocumentPath(
        documentPath,
        boxer.userId
      )
    ) {
      return NextResponse.json(
        { error: "The supporting document is invalid. Please upload it again." },
        { status: 400 }
      );
    }

    if (
      documentPath &&
      (!documentName ||
        !(await privateTournamentHistoryDocumentExists(
          documentPath,
          boxer.userId
        )))
    ) {
      return NextResponse.json(
        { error: "The supporting document could not be found. Please upload it again." },
        { status: 400 }
      );
    }

    if (
      requiresTournamentHistoryProof(validation.data) &&
      !documentPath
    ) {
      return NextResponse.json(
        {
          error:
            "Upload a certificate or official result proof for medal or placing claims.",
        },
        { status: 400 }
      );
    }

    const duplicate = await prisma.boxer_tournament_history.findFirst({
      where: {
        boxerId: boxer.id,
        tournamentDate: validation.data.tournamentDate,
        tournamentName: validation.data.tournamentName,
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "This tournament and date are already in your history. Open the existing record if it was rejected.",
        },
        { status: 409 }
      );
    }

    /*
     * Create the submission.
     *
     * IMPORTANT:
     * boxerId comes from the authenticated user.
     * It is NEVER accepted from the browser.
     */
    const history =
      await prisma.boxer_tournament_history.create({
        data: {
          boxerId: boxer.id,
          ...validation.data,
          documentPath,
          documentName,

          /*
           * Every new submission starts as pending.
           */
          status: "PENDING_REVIEW",

          rejectionReason: null,
          reviewedBy: null,
          reviewedAt: null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Tournament record submitted successfully. It is now pending verification.",
        history,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/boxer/tournament-history error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit tournament history.",
      },
      {
        status: 500,
      }
    );
  }
}