import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tournamentId } = await req.json();
  if (!tournamentId) return NextResponse.json({ error: "Tournament ID required" }, { status: 400 });

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer profile not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  if (tournament.status === "completed") return NextResponse.json({ error: "Tournament is closed" }, { status: 400 });

  const existing = await prisma.tournamentEntry.findFirst({
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
