import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import {
  isPrivateTournamentHistoryDocumentPath,
  requiresTournamentHistoryProof,
  validateTournamentHistorySubmission,
} from "@/lib/tournament-history-validation";
import { privateTournamentHistoryDocumentExists } from "@/lib/tournament-history-documents";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("mba_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "boxer") {
      return NextResponse.json(
        { error: "Boxer access required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const historyId = Number(id);
    if (!Number.isSafeInteger(historyId) || historyId <= 0) {
      return NextResponse.json(
        { error: "Invalid tournament record." },
        { status: 400 }
      );
    }

    const boxer = await prisma.boxer.findUnique({
      where: { userId: payload.id },
      select: { id: true, userId: true },
    });
    if (!boxer) {
      return NextResponse.json(
        { error: "Boxer profile not found." },
        { status: 404 }
      );
    }

    const existing = await prisma.boxer_tournament_history.findFirst({
      where: { id: historyId, boxerId: boxer.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Tournament record not found." },
        { status: 404 }
      );
    }
    if (existing.status !== "REJECTED") {
      return NextResponse.json(
        { error: "Only rejected tournament records can be edited." },
        { status: 409 }
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

    const duplicate = await prisma.boxer_tournament_history.findFirst({
      where: {
        boxerId: boxer.id,
        tournamentDate: validation.data.tournamentDate,
        tournamentName: validation.data.tournamentName,
        NOT: { id: historyId },
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Another record for this tournament and date already exists in your history.",
        },
        { status: 409 }
      );
    }

    const documentPath =
      typeof body?.documentPath === "string" && body.documentPath
        ? body.documentPath
        : existing.documentPath;
    const documentName =
      typeof body?.documentName === "string" && body.documentName.trim()
        ? body.documentName.trim().slice(0, 190)
        : existing.documentName;

    if (
      documentPath &&
      !isPrivateTournamentHistoryDocumentPath(documentPath, boxer.userId) &&
      documentPath !== existing.documentPath
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

    const history = await prisma.boxer_tournament_history.update({
      where: { id: historyId },
      data: {
        ...validation.data,
        documentPath,
        documentName,
        status: "PENDING_REVIEW",
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Updated tournament record submitted for review.",
      history,
    });
  } catch (error) {
    console.error("PATCH /api/boxer/tournament-history/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to resubmit the tournament record right now." },
      { status: 500 }
    );
  }
}
