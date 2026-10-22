import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment service is not configured" }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (payload.role !== "boxer") {
    return NextResponse.json({ error: "Only boxers can enter tournaments" }, { status: 403 });
  }

  const { tournamentId } = await req.json();
  if (!Number.isInteger(tournamentId) || tournamentId <= 0) {
    return NextResponse.json({ error: "A valid tournament ID is required" }, { status: 400 });
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer profile not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  if (tournament.status !== "open") {
    return NextResponse.json({ error: "Registration is not open for this tournament" }, { status: 400 });
  }

  const existing = await prisma.tournamententry.findFirst({
    where: { tournamentId, boxerId: boxer.id },
  });
  if (existing) return NextResponse.json({ error: "Already registered" }, { status: 400 });

  const amount = (tournament.entryFee ?? 500) * 100; // paise

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `t${tournamentId}_b${boxer.id}`,
    notes: { tournamentId: String(tournamentId), boxerId: String(boxer.id) },
  });

  return NextResponse.json({ orderId: order.id, amount, tournamentName: tournament.name });
}
