import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (payload.role !== "boxer") {
    return NextResponse.json({ error: "Only boxers can enter tournaments" }, { status: 403 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tournamentId } = await req.json();
  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    !Number.isInteger(tournamentId) ||
    tournamentId <= 0
  ) {
    return NextResponse.json({ error: "Invalid payment details" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!secret || !keyId) {
    return NextResponse.json({ error: "Payment service is not configured" }, { status: 500 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(razorpay_signature, "hex");
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  if (tournament.status !== "open") {
    return NextResponse.json({ error: "Registration is not open for this tournament" }, { status: 400 });
  }

  const existing = await prisma.tournamententry.findFirst({
    where: { tournamentId, boxerId: boxer.id },
  });
  if (existing) return NextResponse.json({ success: true, alreadyRegistered: true });

  const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
  const order = await razorpay.orders.fetch(razorpay_order_id);
  const expectedAmount = (tournament.entryFee ?? 500) * 100;
  if (
    String(order.notes?.tournamentId ?? "") !== String(tournamentId) ||
    String(order.notes?.boxerId ?? "") !== String(boxer.id) ||
    order.amount !== expectedAmount ||
    order.currency !== "INR" ||
    order.status !== "paid"
  ) {
    return NextResponse.json({ error: "Payment does not match this tournament entry" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.tournamententry.create({ data: { tournamentId, boxerId: boxer.id } }),
    prisma.payment.create({
      data: {
        boxerId: boxer.id,
        tournamentId,
        type: `Tournament: ${tournament.name}`,
        amount: tournament.entryFee ?? 500,
        method: "Razorpay",
        status: "Paid",
        paidAt: new Date(),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
