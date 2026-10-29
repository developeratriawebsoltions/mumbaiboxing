import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(
    req.cookies.get("mba_token")?.value ?? "",
  ).catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (payload.role !== "boxer") {
    return NextResponse.json(
      { error: "Only boxers can enter tournaments" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const tournamentId = Number(
    (body as Record<string, unknown>).tournamentId,
  );
  if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
    return NextResponse.json(
      { error: "A valid tournament ID is required" },
      { status: 400 },
    );
  }

  const boxer = await prisma.boxer.findUnique({
    where: { userId: payload.id },
    select: { id: true },
  });
  if (!boxer) {
    return NextResponse.json({ error: "Boxer profile not found" }, { status: 404 });
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { id: true, name: true, status: true, entryFee: true },
  });
  if (!tournament) {
    return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  }
  if (tournament.status !== "open") {
    return NextResponse.json(
      { error: "Registration is not open for this tournament" },
      { status: 400 },
    );
  }

  const registered = await prisma.tournamententry.findFirst({
    where: { tournamentId, boxerId: boxer.id },
    select: { id: true },
  });
  if (registered) {
    return NextResponse.json({ error: "Already registered" }, { status: 409 });
  }

  const pendingRequest = await prisma.payment.findFirst({
    where: {
      boxerId: boxer.id,
      tournamentId,
      method: "Cash",
      status: "Pending",
    },
    select: { id: true },
  });
  if (pendingRequest) {
    return NextResponse.json({
      success: true,
      pending: true,
      message: "Your cash payment is already awaiting admin confirmation.",
    });
  }

  const amount = tournament.entryFee ?? 500;
  if (!Number.isInteger(amount) || amount < 0) {
    return NextResponse.json(
      { error: "Tournament entry fee is invalid" },
      { status: 400 },
    );
  }

  await prisma.payment.create({
    data: {
      boxerId: boxer.id,
      tournamentId,
      type: `Tournament: ${tournament.name}`,
      amount,
      method: "Cash",
      status: "Pending",
    },
  });

  return NextResponse.json({
    success: true,
    pending: true,
    tournamentName: tournament.name,
    message:
      "Cash payment request submitted. Your registration will be confirmed after an admin receives and approves the payment.",
  });
}
