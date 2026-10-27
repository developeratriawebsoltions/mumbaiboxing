import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

const ROLE_FEES = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
  referee_judge: 1000,
} as const;

type RegistrationRole = keyof typeof ROLE_FEES;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_payment_token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "payment_pending") {
      return NextResponse.json(
        { error: "A valid pending registration session is required." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        registrationStatus: true,
        boxer: { select: { id: true } },
        coach: { select: { id: true } },
        academy: { select: { id: true } },
        refereeJudge: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.registrationStatus !== "PAYMENT_PENDING") {
      return NextResponse.json(
        { error: "This account is not awaiting payment." },
        { status: 409 }
      );
    }

    const role = String(user.role).toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(ROLE_FEES, role)) {
      return NextResponse.json(
        { error: "This account is not eligible for membership payment." },
        { status: 400 }
      );
    }

    const registrationRole = role as RegistrationRole;
    const profileId =
      registrationRole === "boxer"
        ? user.boxer?.id
        : registrationRole === "coach"
          ? user.coach?.id
          : registrationRole === "academy"
            ? user.academy?.id
            : user.refereeJudge?.id;

    if (!profileId) {
      return NextResponse.json(
        { error: "The membership profile for this account was not found." },
        { status: 400 }
      );
    }

    const profileWhere =
      registrationRole === "boxer"
        ? { boxerId: profileId }
        : registrationRole === "coach"
          ? { coachId: profileId }
          : registrationRole === "academy"
            ? { academyId: profileId }
            : { refereeJudgeId: profileId };

    const existingPayment = await prisma.payment.findFirst({
      where: {
        ...profileWhere,
        type: "Membership",
        method: "Cash",
        status: "Pending",
      },
      select: { id: true },
    });

    const payment =
      existingPayment ??
      (await prisma.payment.create({
        data: {
          ...profileWhere,
          type: "Membership",
          amount: ROLE_FEES[registrationRole],
          method: "Cash",
          status: "Pending",
        },
        select: { id: true },
      }));

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message:
        "Your cash payment request has been submitted. Your account will be activated after the association confirms receipt.",
    });
  } catch (error) {
    console.error("Offline membership payment request error:", error);
    return NextResponse.json(
      { error: "Could not submit your cash payment request." },
      { status: 500 }
    );
  }
}
