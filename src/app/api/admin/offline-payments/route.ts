import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import {
  issueMembershipCertificate,
  sendMembershipCertificateEmailOnce,
} from "@/lib/membership-certificate";
import { sendTournamentPaymentReceipt } from "@/lib/tournament-payment-receipt";

const ROLE_FEES = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
  referee_judge: 1000,
} as const;

type RegistrationRole = keyof typeof ROLE_FEES;

type PendingCashPayment = {
  id: number;
  amount: number;
  createdAt: Date;
  name: string;
  email: string;
  role: string;
  paymentType: "membership" | "tournament";
  tournamentName?: string;
  receiptRetry?: boolean;
};

function isTransientDatabaseError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P1001", "P1002", "P1017", "P2024"].includes(error.code)
  );
}

async function retryAfterConnectionDrop<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientDatabaseError(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, 200));
    return operation();
  }
}

function getRole(value: string): RegistrationRole | null {
  return Object.prototype.hasOwnProperty.call(ROLE_FEES, value)
    ? (value as RegistrationRole)
    : null;
}

function authorizedRole(payload: { role: string } | null) {
  return payload?.role === "admin" || payload?.role === "superadmin";
}

async function getAdminPayload(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;
  return token ? verifyToken(token) : null;
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getAdminPayload(req);
    if (!authorizedRole(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: {
        method: "Cash",
        OR: [
          { type: "Membership", status: "Pending" },
          {
            tournamentId: { not: null },
            OR: [
              { status: "Pending" },
              { status: "Paid", receiptEmailSentAt: null },
            ],
          },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        status: true,
        paidAt: true,
        tournamentId: true,
        receiptEmailSentAt: true,
        tournament: { select: { name: true } },
        boxer: {
          select: {
            name: true,
            user: { select: { email: true, role: true, registrationStatus: true } },
          },
        },
        coach: {
          select: {
            name: true,
            user: { select: { email: true, role: true, registrationStatus: true } },
          },
        },
        academy: {
          select: {
            name: true,
            user: { select: { email: true, role: true, registrationStatus: true } },
          },
        },
        refereeJudge: {
          select: {
            name: true,
            user: { select: { email: true, role: true, registrationStatus: true } },
          },
        },
      },
    });

    const pendingPayments = payments.flatMap((payment): PendingCashPayment[] => {
      if (payment.tournamentId !== null) {
        const boxer = payment.boxer;
        if (!boxer || !payment.tournament) return [];
        return [
          {
            id: payment.id,
            amount: payment.amount,
            createdAt: payment.createdAt,
            name: boxer.name,
            email: boxer.user.email,
            role: boxer.user.role,
            paymentType: "tournament" as const,
            tournamentName: payment.tournament.name,
            receiptRetry: payment.status === "Paid",
          },
        ];
      }

      const profile =
        payment.boxer ??
        payment.coach ??
        payment.academy ??
        payment.refereeJudge;
      if (!profile || profile.user.registrationStatus !== "PAYMENT_PENDING") {
        return [];
      }

      return [
        {
          id: payment.id,
          amount: payment.amount,
          createdAt: payment.createdAt,
          name: profile.name,
          email: profile.user.email,
          role: profile.user.role,
          paymentType: "membership" as const,
        },
      ];
    });

    return NextResponse.json({ payments: pendingPayments });
  } catch (error) {
    console.error("Load pending cash payments error:", error);
    return NextResponse.json(
      { error: "Could not load pending cash payments." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getAdminPayload(req);
    if (!authorizedRole(payload)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const paymentId = Number(body?.paymentId);
    const action = body?.action ?? "approve";
    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return NextResponse.json({ error: "Invalid payment ID." }, { status: 400 });
    }
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid payment action." }, { status: 400 });
    }

    const payment = await retryAfterConnectionDrop(() =>
      prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
          id: true,
          type: true,
          amount: true,
          method: true,
          status: true,
          paidAt: true,
          tournamentId: true,
          invoiceNumber: true,
          receiptEmailSentAt: true,
          tournament: {
            select: { id: true, name: true },
          },
          boxer: { select: { id: true, userId: true, name: true } },
          coach: { select: { id: true, userId: true, name: true } },
          academy: { select: { id: true, userId: true, name: true } },
          refereeJudge: { select: { id: true, userId: true, name: true } },
        },
      })
    );

    if (action === "reject") {
      if (
        !payment ||
        payment.method !== "Cash" ||
        payment.status !== "Pending" ||
        (payment.tournamentId === null && payment.type !== "Membership")
      ) {
        return NextResponse.json(
          { error: "This cash payment request is no longer pending." },
          { status: 409 },
        );
      }

      const rejected = await prisma.payment.updateMany({
        where: {
          id: payment.id,
          method: "Cash",
          status: "Pending",
        },
        data: { status: "Rejected" },
      });
      if (rejected.count !== 1) {
        return NextResponse.json(
          { error: "This cash payment request has already been processed." },
          { status: 409 },
        );
      }

      return NextResponse.json({ success: true, paymentId: payment.id });
    }

    if (payment?.tournamentId !== null && payment?.tournamentId !== undefined) {
      if (
        !payment.type.startsWith("Tournament: ") ||
        payment.method !== "Cash" ||
        !payment.tournament ||
        !payment.boxer
      ) {
        return NextResponse.json(
          { error: "This tournament cash payment could not be verified." },
          { status: 409 },
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: payment.boxer.userId },
        select: { email: true, role: true },
      });
      if (!user || user.role !== "boxer") {
        return NextResponse.json(
          { error: "The boxer account could not be verified." },
          { status: 400 },
        );
      }

      let invoiceNumber = payment.invoiceNumber;
      let paidAt = payment.paidAt ?? new Date();
      if (payment.status === "Pending") {
        paidAt = new Date();
        invoiceNumber = `MBA-TOUR-${paidAt.getFullYear()}-${String(payment.id).padStart(6, "0")}`;
        await prisma.$transaction(async (tx) => {
          const updated = await tx.payment.updateMany({
            where: {
              id: payment.id,
              tournamentId: payment.tournamentId,
              method: "Cash",
              status: "Pending",
            },
            data: {
              status: "Paid",
              invoiceNumber,
              paidAt,
            },
          });
          if (updated.count !== 1) {
            throw new Error("Tournament cash payment has already been processed.");
          }

          const existingEntry = await tx.tournamententry.findFirst({
            where: {
              tournamentId: payment.tournamentId!,
              boxerId: payment.boxer!.id,
            },
            select: { id: true },
          });
          if (!existingEntry) {
            await tx.tournamententry.create({
              data: {
                tournamentId: payment.tournamentId!,
                boxerId: payment.boxer!.id,
              },
            });
          }
        });
      } else if (payment.status === "Paid" && payment.receiptEmailSentAt === null) {
        invoiceNumber ??= `MBA-TOUR-${paidAt.getFullYear()}-${String(payment.id).padStart(6, "0")}`;
      } else if (payment.status === "Paid") {
        return NextResponse.json({
          success: true,
          alreadyConfirmed: true,
          receiptEmailSent: true,
        });
      } else {
        return NextResponse.json(
          { error: "This cash payment is no longer pending." },
          { status: 409 },
        );
      }

      if (!invoiceNumber) {
        return NextResponse.json(
          { error: "Could not create a receipt number." },
          { status: 500 },
        );
      }

      try {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { invoiceNumber, paidAt },
        });
        await sendTournamentPaymentReceipt({
          email: user.email,
          name: payment.boxer.name || user.email,
          tournamentName: payment.tournament.name,
          amount: payment.amount,
          invoiceNumber,
          paidAt,
        });
        await prisma.payment.update({
          where: { id: payment.id },
          data: { receiptEmailSentAt: new Date() },
        });
        return NextResponse.json({
          success: true,
          paymentId: payment.id,
          receiptEmailSent: true,
          invoiceNumber,
        });
      } catch (error) {
        const smtpError =
          typeof error === "object" && error !== null
            ? (error as { code?: unknown; responseCode?: unknown })
            : {};
        console.error("Tournament payment receipt email failed.", {
          code: typeof smtpError.code === "string" ? smtpError.code : undefined,
          responseCode:
            typeof smtpError.responseCode === "number"
              ? smtpError.responseCode
              : undefined,
        });
        return NextResponse.json({
          success: true,
          paymentId: payment.id,
          receiptEmailSent: false,
          invoiceNumber,
          emailError:
            "Payment was approved, but the receipt email could not be sent. Retry the receipt from this page.",
        });
      }
    }

    if (
      !payment ||
      payment.type !== "Membership" ||
      payment.method !== "Cash"
    ) {
      return NextResponse.json(
        { error: "This cash payment request could not be found." },
        { status: 409 }
      );
    }

    const profile =
      payment.boxer ??
      payment.coach ??
      payment.academy ??
      payment.refereeJudge;
    if (!profile) {
      return NextResponse.json(
        { error: "Payment is not associated with a member profile." },
        { status: 400 }
      );
    }

    const role = getRole(
      payment.boxer
        ? "boxer"
        : payment.coach
          ? "coach"
          : payment.academy
            ? "academy"
            : "referee_judge"
    );
    if (!role || payment.amount !== ROLE_FEES[role]) {
      return NextResponse.json(
        { error: "The membership payment amount is invalid." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: profile.userId },
      select: {
        id: true,
        email: true,
        role: true,
        registrationStatus: true,
        membershipId: true,
      },
    });
    if (!user || user.role !== role) {
      return NextResponse.json(
        { error: "The member account could not be verified." },
        { status: 400 }
      );
    }

    if (payment.status === "Paid" && user.registrationStatus === "ACTIVE" && user.membershipId) {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        paymentId: payment.id,
        membershipId: user.membershipId,
      });
    }

    if (payment.status !== "Pending") {
      return NextResponse.json(
        { error: "This cash payment is no longer pending." },
        { status: 409 }
      );
    }

    if (user.registrationStatus !== "PAYMENT_PENDING") {
      return NextResponse.json(
        { error: "This account is no longer awaiting payment." },
        { status: 409 }
      );
    }

    const validFrom = new Date();
    const expiry = new Date(validFrom);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const activatedAt = validFrom;
    const membershipId = `MBA-${validFrom.getFullYear()}-${String(user.id).padStart(6, "0")}`;

    const result = await prisma.$transaction(async (tx) => {
      const duplicateMembership = await tx.user.findUnique({
        where: { membershipId },
        select: { id: true },
      });
      if (duplicateMembership && duplicateMembership.id !== user.id) {
        throw new Error("Membership ID collision. Please try again.");
      }

      const paymentUpdate = await tx.payment.updateMany({
        where: {
          id: payment.id,
          type: "Membership",
          method: "Cash",
          status: "Pending",
        },
        data: {
          status: "Paid",
          method: "Cash",
          paidAt: validFrom,
          membershipExpiry: expiry,
          invoiceNumber: `MBA-INV-${validFrom.getFullYear()}-${String(payment.id).padStart(6, "0")}`,
        },
      });
      if (paymentUpdate.count !== 1) {
        throw new Error("Cash payment has already been processed.");
      }

      const userUpdate = await tx.user.updateMany({
        where: {
          id: user.id,
          registrationStatus: "PAYMENT_PENDING",
        },
        data: {
          registrationStatus: "ACTIVE",
          membershipId,
          membershipValidFrom: validFrom,
          membershipExpiry: expiry,
          membershipActivatedAt: activatedAt,
        },
      });
      if (userUpdate.count !== 1) {
        throw new Error("Member account has already been activated.");
      }

      if (role === "boxer" && payment.boxer) {
        await tx.boxer.update({
          where: { id: payment.boxer.id },
          data: { membershipExpiry: expiry },
        });
      } else if (role === "coach" && payment.coach) {
        await tx.coach.update({
          where: { id: payment.coach.id },
          data: { membershipExpiry: expiry },
        });
      } else if (role === "academy" && payment.academy) {
        await tx.academy.update({
          where: { id: payment.academy.id },
          data: { membershipExpiry: expiry },
        });
      } else if (role === "referee_judge" && payment.refereeJudge) {
        await tx.referee_judge.update({
          where: { id: payment.refereeJudge.id },
          data: { membershipExpiry: expiry },
        });
      }

      const certificate = await issueMembershipCertificate(tx, {
        userId: user.id,
        boxerId: payment.boxer?.id,
        coachId: payment.coach?.id,
        refereeJudgeId: payment.refereeJudge?.id,
        membershipId,
        memberName: profile.name || user.email,
        role,
        issuedAt: activatedAt,
        membershipExpiresAt: expiry,
      });

      return { certificate };
    });

    const certificateEmail = await sendMembershipCertificateEmailOnce(
      result.certificate.id,
      user.email,
      result.certificate
    );

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      membershipId,
      certificateEmailSent: certificateEmail.sent,
      certificateEmailError: certificateEmail.error,
    });
  } catch (error) {
    console.error("Confirm cash membership payment error:", error);
    if (isTransientDatabaseError(error)) {
      return NextResponse.json(
        {
          error:
            "The database connection was interrupted. No confirmation was reported; please retry in a few seconds.",
        },
        { status: 503, headers: { "Retry-After": "3" } }
      );
    }
    return NextResponse.json(
      { error: "Could not confirm the cash payment. Please try again." },
      { status: 500 }
    );
  }
}
