import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { calculateTournamentPoints } from "@/lib/points";
import {
  isPrivateTournamentHistoryDocumentPath,
  requiresTournamentHistoryProof,
} from "@/lib/tournament-history-validation";
import { privateTournamentHistoryDocumentExists } from "@/lib/tournament-history-documents";

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getAuthenticatedUser(req);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (payload.role !== "superadmin") {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const historyId = Number(id);

    if (!Number.isInteger(historyId) || historyId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tournament history ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const action = body?.action;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Action must be APPROVE or REJECT",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.boxer_tournament_history.findUnique({
        where: {
          id: historyId,
        },
        include: {
          boxer: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament history record not found",
        },
        { status: 404 }
      );
    }

    /*
     * Prevent approving/rejecting the same record twice.
     */
    if (existing.status !== "PENDING_REVIEW") {
      return NextResponse.json(
        {
          success: false,
          message: `This record has already been ${existing.status
            .toLowerCase()
            .replace("_", " ")}`,
        },
        { status: 409 }
      );
    }

    let rejectionReason: string | null = null;

    if (action === "REJECT") {
      rejectionReason =
        typeof body?.rejectionReason === "string"
          ? body.rejectionReason.trim()
          : "";

      if (!rejectionReason) {
        return NextResponse.json(
          {
            success: false,
            message: "Rejection reason is required",
          },
          { status: 400 }
        );
      }
    }

    const reviewedAt = new Date();

    /*
     * APPROVE
     */
    if (action === "APPROVE") {
      if (
        requiresTournamentHistoryProof({
          medal: existing.medal || "NONE",
          position: existing.position,
        }) &&
        (!isPrivateTournamentHistoryDocumentPath(
          existing.documentPath,
          existing.boxer.userId
        ) ||
          !(await privateTournamentHistoryDocumentExists(
            existing.documentPath,
            existing.boxer.userId
          )))
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A private supporting document is required before approving a medal or placing claim.",
          },
          { status: 400 }
        );
      }

      const points = calculateTournamentPoints({
        tournamentType: existing.tournamentType,
        medal: existing.medal,
      });

      const result = await prisma.$transaction(async (tx) => {
        /*
         * Re-check the record inside the transaction.
         *
         * This protects against two approval requests arriving
         * at almost the same time.
         */
        const current =
          await tx.boxer_tournament_history.findUnique({
            where: {
              id: historyId,
            },
          });

        if (!current) {
          throw new Error("TOURNAMENT_HISTORY_NOT_FOUND");
        }

        if (current.status !== "PENDING_REVIEW") {
          throw new Error("TOURNAMENT_ALREADY_REVIEWED");
        }

        /*
         * Mark tournament history as APPROVED.
         */
        const updated =
          await tx.boxer_tournament_history.update({
            where: {
              id: historyId,
            },
            data: {
              status: "APPROVED",
              reviewedBy: Number(payload.id),
              reviewedAt,
              rejectionReason: null,
            },
            include: {
              boxer: {
                select: {
                  id: true,
                  name: true,
                  userId: true,
                },
              },
            },
          });

        /*
         * Create points ledger entry.
         *
         * historyId is UNIQUE in boxer_points, so one
         * tournament history record can only receive points once.
         */
        const pointsRecord =
          points > 0
            ? await tx.boxer_points.create({
                data: {
                  boxerId: updated.boxer.id,
                  historyId: updated.id,
                  tournamentName: updated.tournamentName,
                  tournamentType:
                    updated.tournamentType?.trim().toUpperCase() ||
                    "DISTRICT",
                  medal:
                    updated.medal?.trim().toUpperCase() ||
                    "NONE",
                  points,
                  season: (
                    updated.tournamentDate ??
                    updated.createdAt
                  ).getFullYear(),
                },
              })
            : null;

        /*
         * Notify boxer.
         */
        await tx.notification.create({
          data: {
            userId: updated.boxer.userId,
            title: "Tournament Record Approved",
            message:
              points > 0
                ? `Your tournament record "${updated.tournamentName}" has been approved. You earned ${points} ranking points.`
                : `Your tournament record "${updated.tournamentName}" has been approved.`,
          },
        });

        return {
          updated,
          pointsRecord,
        };
      });

      return NextResponse.json({
        success: true,
        message:
          points > 0
            ? "Tournament record approved and points awarded successfully"
            : "Participation record approved; no ranking points were awarded",
        history: result.updated,
        points: result.pointsRecord,
      });
    }

    /*
     * REJECT
     *
     * No points record is created.
     */
    const result = await prisma.$transaction(async (tx) => {
      /*
       * Re-check inside transaction.
       */
      const current =
        await tx.boxer_tournament_history.findUnique({
          where: {
            id: historyId,
          },
        });

      if (!current) {
        throw new Error("TOURNAMENT_HISTORY_NOT_FOUND");
      }

      if (current.status !== "PENDING_REVIEW") {
        throw new Error("TOURNAMENT_ALREADY_REVIEWED");
      }

      const updated =
        await tx.boxer_tournament_history.update({
          where: {
            id: historyId,
          },
          data: {
            status: "REJECTED",
            reviewedBy: Number(payload.id),
            reviewedAt,
            rejectionReason,
          },
          include: {
            boxer: {
              select: {
                id: true,
                name: true,
                userId: true,
              },
            },
          },
        });

      await tx.notification.create({
        data: {
          userId: updated.boxer.userId,
          title: "Tournament Record Rejected",
          message: `Your tournament record "${updated.tournamentName}" was rejected. Reason: ${rejectionReason}`,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Tournament record rejected successfully",
      history: result,
      points: null,
    });
  } catch (error) {
    /*
     * Handle expected transaction errors cleanly.
     */
    if (
      error instanceof Error &&
      error.message === "TOURNAMENT_HISTORY_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Tournament history record not found",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "TOURNAMENT_ALREADY_REVIEWED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This tournament record has already been reviewed",
        },
        { status: 409 }
      );
    }

    console.error(
      "PATCH /api/admin/tournament-history/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update tournament history",
      },
      { status: 500 }
    );
  }
}