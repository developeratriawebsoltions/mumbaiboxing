import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const ROLE_FEES = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
} as const;

type RegistrationRole = keyof typeof ROLE_FEES;

function generateMembershipId(userId: number) {
  const year = new Date().getFullYear();

  return `MBA-${year}-${String(userId).padStart(6, "0")}`;
}

function generateInvoiceNumber(paymentId: number) {
  const year = new Date().getFullYear();

  return `MBA-INV-${year}-${String(paymentId).padStart(6, "0")}`;
}

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const payload = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const razorpayOrderId = String(
      body?.razorpay_order_id || ""
    ).trim();

    const razorpayPaymentId = String(
      body?.razorpay_payment_id || ""
    ).trim();

    const razorpaySignature = String(
      body?.razorpay_signature || ""
    ).trim();

    const userId = Number(body?.userId);

    /*
     * ---------------------------------------------------------
     * 1. Validate request
     * ---------------------------------------------------------
     */

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          error:
            "Incomplete Razorpay payment information",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. Razorpay configuration
     * ---------------------------------------------------------
     */

    const razorpaySecret =
      process.env.RAZORPAY_KEY_SECRET;

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID;

    if (!razorpaySecret || !razorpayKeyId) {
      console.error(
        "Razorpay environment variables are missing"
      );

      return NextResponse.json(
        {
          error: "Payment service is not configured",
        },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 3. Verify Razorpay signature
     * ---------------------------------------------------------
     */

    const validSignature =
      verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        razorpaySecret
      );

    if (!validSignature) {
      return NextResponse.json(
        {
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Find our internal payment
     * ---------------------------------------------------------
     */

    const payment =
      await prisma.payment.findUnique({
        where: {
          razorpayOrderId,
        },

        include: {
          boxer: {
            include: {
              user: true,
            },
          },

          coach: {
            include: {
              user: true,
            },
          },

          academy: {
            include: {
              user: true,
            },
          },
        },
      });

    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment order not found",
        },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 5. Determine the user and role from our database
     * ---------------------------------------------------------
     */

    let paymentUserId: number | null = null;
    let dbRole: RegistrationRole | null = null;

    if (payment.boxer) {
      paymentUserId = payment.boxer.userId;
      dbRole = "boxer";
    } else if (payment.coach) {
      paymentUserId = payment.coach.userId;
      dbRole = "coach";
    } else if (payment.academy) {
      paymentUserId = payment.academy.userId;
      dbRole = "academy";
    }

    if (!paymentUserId || !dbRole) {
      return NextResponse.json(
        {
          error:
            "Payment is not associated with a valid membership profile",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 6. Make sure this payment belongs to this user
     * ---------------------------------------------------------
     */

    if (paymentUserId !== userId) {
      return NextResponse.json(
        {
          error:
            "Payment does not belong to this user",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 7. Fetch current user
     * ---------------------------------------------------------
     */

    const user =
      await prisma.user.findUnique({
        where: {
          id: paymentUserId,
        },

        select: {
          id: true,
          email: true,
          role: true,
          registrationStatus: true,
          membershipId: true,
          membershipValidFrom: true,
          membershipExpiry: true,
          membershipActivatedAt: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 8. Verify role
     * ---------------------------------------------------------
     */

    if (
      String(user.role).toLowerCase() !==
      dbRole
    ) {
      return NextResponse.json(
        {
          error: "Payment role mismatch",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 9. Verify membership fee
     * ---------------------------------------------------------
     */

    const expectedAmount =
      ROLE_FEES[dbRole];

    if (payment.amount !== expectedAmount) {
      console.error(
        "Payment amount mismatch",
        {
          paymentId: payment.id,
          databaseAmount: payment.amount,
          expectedAmount,
          userId: paymentUserId,
        }
      );

      return NextResponse.json(
        {
          error: "Payment amount mismatch",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 10. Fetch payment directly from Razorpay
     * ---------------------------------------------------------
     */

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
    });

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

    /*
     * Make sure payment belongs to this order.
     */

    if (
      razorpayPayment.order_id !==
      razorpayOrderId
    ) {
      return NextResponse.json(
        {
          error:
            "Payment does not belong to this order",
        },
        { status: 400 }
      );
    }

    /*
     * Razorpay amount is in paise.
     */

    if (
      razorpayPayment.amount !==
      expectedAmount * 100
    ) {
      return NextResponse.json(
        {
          error:
            "Razorpay payment amount mismatch",
        },
        { status: 400 }
      );
    }

    /*
     * Only captured payments activate membership.
     */

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return NextResponse.json(
        {
          error:
            `Payment is not captured. Current status: ${razorpayPayment.status}`,
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 11. Already processed payment
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     * Return the SAME response structure expected
     * by the registration page.
     * ---------------------------------------------------------
     */

    if (
      payment.status === "Paid" &&
      payment.razorpayPaymentId ===
        razorpayPaymentId &&
      user.registrationStatus === "ACTIVE" &&
      user.membershipId
    ) {
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,

        membership: {
          membershipId:
            user.membershipId,

          role: String(
            user.role
          ).toLowerCase(),

          validFrom:
            user.membershipValidFrom,

          expiry:
            user.membershipExpiry,

          activatedAt:
            user.membershipActivatedAt,
        },

        payment: {
          id: payment.id,
          amount: payment.amount,
          method:
            payment.method ||
            "Razorpay",
          status: payment.status,
          invoiceNumber:
            payment.invoiceNumber || "",
          isDeveloperBypass:
            payment.isDeveloperBypass,
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * 12. Do not process an already-paid order twice
     * ---------------------------------------------------------
     */

    if (payment.status === "Paid") {
      return NextResponse.json(
        {
          error:
            "This payment order has already been processed",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 13. Generate membership dates
     * ---------------------------------------------------------
     */

    const membershipValidFrom =
      new Date();

    const membershipExpiry =
      new Date(
        membershipValidFrom
      );

    membershipExpiry.setFullYear(
      membershipExpiry.getFullYear() + 1
    );

    /*
     * ---------------------------------------------------------
     * 14. Generate membership ID
     * ---------------------------------------------------------
     */

    const membershipId =
      generateMembershipId(
        user.id
      );

    /*
     * ---------------------------------------------------------
     * 15. Update payment + membership atomically
     * ---------------------------------------------------------
     */

    const result =
      await prisma.$transaction(
        async (tx) => {
          /*
           * Check membership ID collision.
           */

          const existingMembership =
            await tx.user.findUnique({
              where: {
                membershipId,
              },

              select: {
                id: true,
              },
            });

          if (
            existingMembership &&
            existingMembership.id !==
              user.id
          ) {
            throw new Error(
              "Membership ID collision. Please try again."
            );
          }

          /*
           * Mark payment as paid.
           */

          const updatedPayment =
            await tx.payment.update({
              where: {
                id: payment.id,
              },

              data: {
                status: "Paid",
                method: "Razorpay",

                razorpayPaymentId,
                razorpaySignature,

                membershipExpiry,
              },
            });

          /*
           * Generate invoice number.
           */

          const invoiceNumber =
            generateInvoiceNumber(
              updatedPayment.id
            );

          const paymentWithInvoice =
            await tx.payment.update({
              where: {
                id: updatedPayment.id,
              },

              data: {
                invoiceNumber,
              },
            });

          /*
           * Activate user.
           */

          const updatedUser =
            await tx.user.update({
              where: {
                id: user.id,
              },

              data: {
                registrationStatus:
                  "ACTIVE",

                membershipId,

                membershipValidFrom,

                membershipExpiry,

                membershipActivatedAt:
                  new Date(),
              },

              select: {
                id: true,
                email: true,
                role: true,
                registrationStatus: true,
                membershipId: true,
                membershipValidFrom: true,
                membershipExpiry: true,
                membershipActivatedAt: true,
              },
            });

          /*
           * Keep role-specific expiry synchronized.
           */

          if (dbRole === "boxer") {
            await tx.boxer.update({
              where: {
                id: payment.boxer!.id,
              },

              data: {
                membershipExpiry,
              },
            });
          }

          if (dbRole === "coach") {
            await tx.coach.update({
              where: {
                id: payment.coach!.id,
              },

              data: {
                membershipExpiry,
              },
            });
          }

          if (dbRole === "academy") {
            await tx.academy.update({
              where: {
                id: payment.academy!.id,
              },

              data: {
                membershipExpiry,
              },
            });
          }

          return {
            user: updatedUser,
            payment: paymentWithInvoice,
          };
        }
      );

    /*
     * ---------------------------------------------------------
     * 16. Return EXACT structure expected by frontend
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      membership: {
        membershipId:
          result.user.membershipId!,

        role: String(
          result.user.role
        ).toLowerCase(),

        validFrom:
          result.user.membershipValidFrom!,

        expiry:
          result.user.membershipExpiry!,

        activatedAt:
          result.user.membershipActivatedAt!,
      },

      payment: {
        id: result.payment.id,

        amount:
          result.payment.amount,

        method:
          result.payment.method,

        status:
          result.payment.status,

        invoiceNumber:
          result.payment.invoiceNumber!,

        isDeveloperBypass:
          result.payment.isDeveloperBypass,
      },
    });
  } catch (err) {
    console.error(
      "Payment verification error:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Verification failed",
      },
      { status: 500 }
    );
  }
}