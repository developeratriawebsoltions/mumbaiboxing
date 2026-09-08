import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const ROLE_FEES = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
  referee_judge: 1000,
} as const;

type RegistrationRole = keyof typeof ROLE_FEES;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userId = Number(body?.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    /*
     * Get the user and all possible registration profiles.
     * The browser does not control the role or payment amount.
     */
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        registrationStatus: true,

        boxer: {
          select: {
            id: true,
          },
        },

        coach: {
          select: {
            id: true,
          },
        },

        academy: {
          select: {
            id: true,
          },
        },

        refereeJudge: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.registrationStatus !== "PAYMENT_PENDING") {
      return NextResponse.json(
        {
          error: "Payment is not pending for this account",
          registrationStatus: user.registrationStatus,
        },
        { status: 400 }
      );
    }

    /*
     * Convert Prisma enum to the role used by the payment system.
     */
    const roleValue = String(user.role).toLowerCase();

    if (!Object.prototype.hasOwnProperty.call(ROLE_FEES, roleValue)) {
      return NextResponse.json(
        {
          error: "This account is not eligible for membership payment",
        },
        { status: 400 }
      );
    }

    const role = roleValue as RegistrationRole;
    const amount = ROLE_FEES[role];

    /*
     * Extract profile IDs BEFORE role narrowing.
     *
     * This avoids TypeScript incorrectly narrowing a relation
     * to `never`.
     */
    const boxerId = user.boxer?.id ?? null;
    const coachId = user.coach?.id ?? null;
    const academyId = user.academy?.id ?? null;
    const refereeJudgeId = user.refereeJudge?.id ?? null;

    /*
     * Make sure the correct role-specific profile exists.
     */
    if (role === "boxer" && boxerId === null) {
      return NextResponse.json(
        { error: "Boxer profile not found" },
        { status: 400 }
      );
    }

    if (role === "coach" && coachId === null) {
      return NextResponse.json(
        { error: "Coach profile not found" },
        { status: 400 }
      );
    }

    if (role === "academy" && academyId === null) {
      return NextResponse.json(
        { error: "Academy profile not found" },
        { status: 400 }
      );
    }

    if (role === "referee_judge" && refereeJudgeId === null) {
      return NextResponse.json(
        { error: "Referee / Judge profile not found" },
        { status: 400 }
      );
    }

    /*
     * Razorpay configuration.
     */
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay environment variables are missing");

      return NextResponse.json(
        { error: "Payment service is not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    /*
     * Create Razorpay order.
     *
     * Amount comes from ROLE_FEES on the server.
     */
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `mba_${user.id}_${Date.now()}`,
      notes: {
        userId: String(user.id),
        role,
        email: user.email,
      },
    });

    /*
     * Create local payment record.
     */
    const payment = await prisma.payment.create({
      data: {
        type: "Membership",
        amount,
        method: "Razorpay",
        status: "Pending",

        razorpayOrderId: order.id,

        isDeveloperBypass: false,

        boxerId,
        coachId,
        academyId,
        refereeJudgeId,
      },

      select: {
        id: true,
        razorpayOrderId: true,
        amount: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: order.id,
      amount,
      currency: "INR",
      role,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);

    return NextResponse.json(
      {
        error: "Failed to create payment order",
      },
      { status: 500 }
    );
  }
}