import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tournamentId } = await req.json();

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.tournamentEntry.create({ data: { tournamentId, boxerId: boxer.id } }),
    prisma.payment.create({
      data: {
        boxerId: boxer.id,
        type: `Tournament: ${tournament.name}`,
        amount: tournament.entryFee ?? 500,
        method: "Razorpay",
        status: "Paid",
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
