import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const selectedRole = String(body?.role ?? "").trim().toLowerCase();
    const requestedTournamentId = Number(body?.tournamentId);

    const roleMap: Record<string, string> = {
      boxer: "boxer",
      coach: "coach",
      academy: "academy",
      "referee/judge": "referee_judge",
    };
    const expectedRole = roleMap[selectedRole];

    if (!expectedRole) {
      return NextResponse.json(
        {
          error: "Please select a valid account role.",
          code: "INVALID_ROLE",
        },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password required",
        },
        { status: 400 }
      );
    }

    /*
     * Find user by normalized email.
     */
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    /*
     * Do not reveal whether the email exists.
     */
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    /*
     * Verify password.
     */
    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (
      Number.isInteger(requestedTournamentId) &&
      requestedTournamentId > 0 &&
      user.role !== "boxer"
    ) {
      return NextResponse.json(
        {
          error:
            "Tournament entry is for boxer accounts. Please sign in with a boxer account to continue.",
          code: "BOXER_ACCOUNT_REQUIRED",
        },
        { status: 403 }
      );
    }

    if (user.role === "admin" || user.role === "superadmin") {
      return NextResponse.json(
        {
          error: "Use the sign-in page for your account role.",
          code: "ROLE_SPECIFIC_LOGIN_REQUIRED",
        },
        { status: 403 }
      );
    }

    /*
     * Validate selected role matches actual DB role.
     */
    if (user.role !== expectedRole) {
      return NextResponse.json(
        {
          error: `This account is not registered as ${body?.role}. Please select the correct role.`,
          code: "ROLE_MISMATCH",
        },
        { status: 403 }
      );
    }

    /*
     * NORMAL MEMBERS
     *
     * Boxer / Coach / Academy accounts must be ACTIVE.
     *
     * PAYMENT_PENDING users must not receive a JWT.
     */
    if (user.registrationStatus !== "ACTIVE") {
      const paymentToken = await signToken({
        id: user.id,
        email: user.email,
        role: "payment_pending",
      });
      const res = NextResponse.json(
        {
          error: "Membership payment is pending",
          code: "PAYMENT_PENDING",
          registrationStatus: user.registrationStatus,
          message:
            "Please complete your membership payment to activate your account.",
        },
        { status: 403 }
      );
      res.cookies.set("mba_payment_token", paymentToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return res;
    }

    /*
     * Active members must have membership information.
     */
    if (!user.membershipId || !user.membershipExpiry) {
      console.error(
        `Active user ${user.id} is missing membership information`
      );

      return NextResponse.json(
        {
          error: "Membership information is incomplete",
          code: "MEMBERSHIP_INCOMPLETE",
        },
        { status: 403 }
      );
    }

    /*
     * Check membership expiry.
     */
    const now = new Date();
    const membershipExpiry = new Date(user.membershipExpiry);

    if (membershipExpiry <= now) {
      return NextResponse.json(
        {
          error: "Membership has expired",
          code: "MEMBERSHIP_EXPIRED",
          membershipId: user.membershipId,
          membershipExpiry: user.membershipExpiry,
        },
        { status: 403 }
      );
    }

    /*
     * Validate supported member roles.
     */
    const allowedMemberRoles = [
  "boxer",
  "coach",
  "academy",
  "referee_judge",
] as const;

    if (
      !allowedMemberRoles.includes(
        user.role as (typeof allowedMemberRoles)[number]
      )
    ) {
      console.error(
        `Invalid member role for user ${user.id}: ${user.role}`
      );

      return NextResponse.json(
        {
          error: "Invalid account role",
        },
        { status: 403 }
      );
    }

    /*
     * Everything is valid.
     *
     * Only now generate the authentication token.
     */
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    /*
     * Redirect based on role.
     */
    const redirect =
  user.role === "referee_judge"
    ? "/dashboard/referee-judge"
    : `/dashboard/${user.role}`;

    const res = NextResponse.json({
      success: true,
      redirect,
      role: user.role,
      membershipId: user.membershipId,
      membershipValidFrom: user.membershipValidFrom,
      membershipExpiry: user.membershipExpiry,
      membershipActivatedAt: user.membershipActivatedAt,
    });

    /*
     * Authentication cookie.
     */
    res.cookies.set("mba_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);

    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}