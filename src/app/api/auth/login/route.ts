import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

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

    /*
     * SUPERADMIN / ADMIN
     *
     * Superadmins are created directly by the system and
     * do not need membership payment.
     */
    if (user.role === "superadmin") {
      const token = await signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const res = NextResponse.json({
        success: true,
        redirect: "/admin",
        role: user.role,
      });

      res.cookies.set("mba_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    /*
     * NORMAL MEMBERS
     *
     * Boxer / Coach / Academy accounts must be ACTIVE.
     *
     * PAYMENT_PENDING users must not receive a JWT.
     */
    if (user.registrationStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Membership payment is pending",
          code: "PAYMENT_PENDING",
          registrationStatus: user.registrationStatus,
          message:
            "Please complete your membership payment before logging in.",
        },
        { status: 403 }
      );
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
    const redirect = `/dashboard/${user.role}`;

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