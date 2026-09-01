import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const ROLE_FEES: Record<string, number> = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
};

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const { role, userId } = await req.json();
    const amount = ROLE_FEES[role?.toLowerCase()] ?? 100;

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `mba_${role}_${userId}_${Date.now()}`,
      notes: { role, userId: String(userId) },
    });

    return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
