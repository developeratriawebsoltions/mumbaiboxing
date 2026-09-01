import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const ROLE_FEES: Record<string, number> = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
};

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, role } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const amount = ROLE_FEES[role?.toLowerCase()] ?? 100;
    const dbRole = role?.toLowerCase();
    const membershipExpiry = new Date();
    membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1);

    if (dbRole === "boxer") {
      const boxer = await prisma.boxer.findUnique({ where: { userId: Number(userId) } });
      if (boxer) {
        await prisma.boxer.update({ where: { id: boxer.id }, data: { membershipExpiry } });
        await prisma.payment.create({
          data: { boxerId: boxer.id, type: "Annual Membership Fee", amount, method: "Razorpay", status: "Paid", membershipExpiry },
        });
      }
    } else if (dbRole === "coach") {
      const coach = await prisma.coach.findUnique({ where: { userId: Number(userId) } });
      if (coach) {
        await prisma.coach.update({ where: { id: coach.id }, data: { membershipExpiry } });
        await prisma.payment.create({
          data: { coachId: coach.id, type: "Annual Membership Fee", amount, method: "Razorpay", status: "Paid", membershipExpiry },
        });
      }
    } else if (dbRole === "academy") {
      const academy = await prisma.academy.findUnique({ where: { userId: Number(userId) } });
      if (academy) {
        await prisma.academy.update({ where: { id: academy.id }, data: { membershipExpiry } });
        await prisma.payment.create({
          data: { academyId: academy.id, type: "Annual Membership Fee", amount, method: "Razorpay", status: "Paid", membershipExpiry },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
