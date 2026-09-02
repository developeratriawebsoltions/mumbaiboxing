import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ROLE_FEES = {
  boxer: 100,
  coach: 1000,
  academy: 1500,
} as const;

type RegistrationRole = keyof typeof ROLE_FEES;

function generateMembershipId(userId: number): string {
  const year = new Date().getFullYear();

  return `MBA-${year}-${String(userId).padStart(6, "0")}`;
}

function generateInvoiceNumber(paymentId: number): string {
  const year = new Date().getFullYear();

  return `MBA-INV-${year}-${String(paymentId).padStart(6, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    /*
     * ---------------------------------------------------------
     * 1. Developer bypass must NEVER work in production.
     * ---------------------------------------------------------
     */
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error: "Developer bypass is disabled in production",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. Check environment switch.
     * ---------------------------------------------------------
     */
    if (process.env.PAYMENT_BYPASS_ENABLED !== "true") {
      return NextResponse.json(
        {
          error: "Developer bypass is disabled",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 3. Verify developer secret.
     * ---------------------------------------------------------
     */
    const developerSecret = process.env.DEVELOPER_BYPASS_SECRET;

    if (!developerSecret) {
      console.error(
        "DEVELOPER_BYPASS_SECRET is not configured"
      );

      return NextResponse.json(
        {
          error: "Developer bypass is not configured",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const userId = Number(body?.userId);
    const providedSecret = String(body?.secret ?? "");

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    if (!providedSecret) {
      return NextResponse.json(
        {
          error: "Developer secret is required",
        },
        { status: 401 }
      );
    }

    if (providedSecret !== developerSecret) {
      return NextResponse.json(
        {
          error: "Invalid developer authorization",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Get the user from the database.
     *
     * IMPORTANT:
     * We do NOT trust role or amount from the browser.
     * ---------------------------------------------------------
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
     * 5. Developer bypass is only for normal membership roles.
     * ---------------------------------------------------------
     */
    const role = String(user.role).toLowerCase();

    if (!(role in ROLE_FEES)) {
      return NextResponse.json(
        {
          error: "Developer bypass is not available for this role",
        },
        { status: 400 }
      );
    }

    const registrationRole = role as RegistrationRole;
    const amount = ROLE_FEES[registrationRole];

    /*
     * ---------------------------------------------------------
     * 6. Make sure the correct profile exists.
     * ---------------------------------------------------------
     */
    if (registrationRole === "boxer" && !user.boxer) {
      return NextResponse.json(
        {
          error: "Boxer profile not found",
        },
        { status: 400 }
      );
    }

    if (registrationRole === "coach" && !user.coach) {
      return NextResponse.json(
        {
          error: "Coach profile not found",
        },
        { status: 400 }
      );
    }

    if (registrationRole === "academy" && !user.academy) {
      return NextResponse.json(
        {
          error: "Academy profile not found",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 7. Don't bypass an already active membership.
     * ---------------------------------------------------------
     */
    if (user.registrationStatus === "ACTIVE") {
      return NextResponse.json(
        {
          error: "Membership is already active",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 8. Create membership dates.
     * ---------------------------------------------------------
     */
    const membershipValidFrom = new Date();

    const membershipExpiry = new Date(
      membershipValidFrom
    );

    membershipExpiry.setFullYear(
      membershipExpiry.getFullYear() + 1
    );

    /*
     * ---------------------------------------------------------
     * 9. Create payment + activate membership atomically.
     * ---------------------------------------------------------
     */
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          type: "Annual Membership Fee",
          amount,
          method: "Developer Bypass",
          status: "Paid",
          membershipExpiry,
          isDeveloperBypass: true,

          ...(registrationRole === "boxer" && {
            boxerId: user.boxer!.id,
          }),

          ...(registrationRole === "coach" && {
            coachId: user.coach!.id,
          }),

          ...(registrationRole === "academy" && {
            academyId: user.academy!.id,
          }),
        },
      });

      const membershipId = generateMembershipId(user.id);
      const invoiceNumber = generateInvoiceNumber(payment.id);

      /*
       * Save invoice number.
       */
      const updatedPayment = await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          invoiceNumber,
        },
      });

      /*
       * Update user membership.
       */
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          registrationStatus: "ACTIVE",
          membershipId,
          membershipValidFrom,
          membershipExpiry,
          membershipActivatedAt: new Date(),
        },
      });

      /*
       * Keep role-specific membership expiry synchronized.
       */
      if (registrationRole === "boxer") {
        await tx.boxer.update({
          where: {
            id: user.boxer!.id,
          },
          data: {
            membershipExpiry,
          },
        });
      }

      if (registrationRole === "coach") {
        await tx.coach.update({
          where: {
            id: user.coach!.id,
          },
          data: {
            membershipExpiry,
          },
        });
      }

      if (registrationRole === "academy") {
        await tx.academy.update({
          where: {
            id: user.academy!.id,
          },
          data: {
            membershipExpiry,
          },
        });
      }

      return {
        user: updatedUser,
        payment: updatedPayment,
      };
    });

    /*
     * ---------------------------------------------------------
     * 10. Return membership information.
     * ---------------------------------------------------------
     */
    return NextResponse.json({
      success: true,

      message: "Developer membership activated successfully",

      membership: {
        membershipId: result.user.membershipId,
        role: registrationRole,
        validFrom: result.user.membershipValidFrom,
        expiry: result.user.membershipExpiry,
        activatedAt: result.user.membershipActivatedAt,
      },

      payment: {
        id: result.payment.id,
        amount: result.payment.amount,
        method: result.payment.method,
        status: result.payment.status,
        invoiceNumber: result.payment.invoiceNumber,
        isDeveloperBypass:
          result.payment.isDeveloperBypass,
      },
    });
  } catch (error) {
    console.error(
      "Developer membership bypass error:",
      error
    );

    return NextResponse.json(
      {
        error: "Developer bypass failed",
      },
      { status: 500 }
    );
  }
}