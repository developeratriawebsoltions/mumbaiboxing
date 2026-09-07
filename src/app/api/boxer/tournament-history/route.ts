import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

    const {
      tournamentName,
      location,
      tournamentDate,
      tournamentType,
      weightCategory,
      result,
      medal,
      position,
      coachName,
      notes,
      documentPath,
      documentName,
    } = body;

    /*
     * Required field
     */
    if (
      !tournamentName ||
      typeof tournamentName !== "string" ||
      !tournamentName.trim()
    ) {
      return NextResponse.json(
        {
          error: "Tournament name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate medal if supplied.
     */
    const allowedMedals = [
      "GOLD",
      "SILVER",
      "BRONZE",
      "NONE",
    ];

    const normalizedMedal =
      typeof medal === "string"
        ? medal.trim().toUpperCase()
        : null;

    if (
      normalizedMedal &&
      !allowedMedals.includes(normalizedMedal)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid medal. Use GOLD, SILVER, BRONZE or NONE.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate position if supplied.
     */
    let normalizedPosition: number | null = null;

    if (
      position !== undefined &&
      position !== null &&
      position !== ""
    ) {
      normalizedPosition = Number(position);

      if (
        !Number.isInteger(normalizedPosition) ||
        normalizedPosition <= 0
      ) {
        return NextResponse.json(
          {
            error: "Position must be a positive whole number.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * Validate date if supplied.
     */
    let normalizedDate: Date | null = null;

    if (tournamentDate) {
      const parsedDate = new Date(tournamentDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid tournament date.",
          },
          {
            status: 400,
          }
        );
      }

      normalizedDate = parsedDate;
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

          tournamentName: tournamentName.trim(),

          location:
            typeof location === "string" &&
            location.trim()
              ? location.trim()
              : null,

          tournamentDate: normalizedDate,

          tournamentType:
            typeof tournamentType === "string" &&
            tournamentType.trim()
              ? tournamentType.trim()
              : null,

          weightCategory:
            typeof weightCategory === "string" &&
            weightCategory.trim()
              ? weightCategory.trim()
              : null,

          result:
            typeof result === "string" &&
            result.trim()
              ? result.trim()
              : null,

          medal: normalizedMedal,

          position: normalizedPosition,

          coachName:
            typeof coachName === "string" &&
            coachName.trim()
              ? coachName.trim()
              : null,

          notes:
            typeof notes === "string" &&
            notes.trim()
              ? notes.trim()
              : null,

          documentPath:
            typeof documentPath === "string" &&
            documentPath.trim()
              ? documentPath.trim()
              : null,

          documentName:
            typeof documentName === "string" &&
            documentName.trim()
              ? documentName.trim()
              : null,

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