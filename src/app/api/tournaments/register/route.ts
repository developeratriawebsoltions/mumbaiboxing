import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tournamentId } = await req.json();
  const parsedTournamentId = Number(tournamentId);

  if (!Number.isInteger(parsedTournamentId) || parsedTournamentId <= 0) {
    return NextResponse.json({ error: "Tournament ID required" }, { status: 400 });
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer profile not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: parsedTournamentId } });
  if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  if (tournament.status === "completed") return NextResponse.json({ error: "Tournament is closed" }, { status: 400 });

  const existing = await prisma.tournamentEntry.findFirst({
    where: { tournamentId: parsedTournamentId, boxerId: boxer.id },
  });
  if (existing) return NextResponse.json({ error: "Already registered" }, { status: 400 });

  const feeInRupees = Number(tournament.entryFee ?? 500);
  if (!Number.isFinite(feeInRupees) || feeInRupees <= 0) {
    return NextResponse.json({ error: "Tournament entry fee is invalid" }, { status: 400 });
  }

  const MAX_RAZORPAY_AMOUNT = 100000000;
  const amount = Math.round(feeInRupees * 100);
  if (amount < 100 || amount > MAX_RAZORPAY_AMOUNT) {
    return NextResponse.json({ error: "Tournament entry fee must be between ₹1 and ₹1,000,000" }, { status: 400 });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `t${parsedTournamentId}_b${boxer.id}`,
      notes: { tournamentId: String(parsedTournamentId), boxerId: String(boxer.id) },
    });

    return NextResponse.json({ orderId: order.id, amount, tournamentName: tournament.name });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Unable to create payment order for this tournament." }, { status: 500 });
  }
}
