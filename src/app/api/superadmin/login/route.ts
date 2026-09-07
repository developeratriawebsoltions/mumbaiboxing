import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || user.role !== "superadmin") {
      return NextResponse.json(
        {
          error: "Invalid Super Admin credentials.",
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          error: "Invalid Super Admin credentials.",
        },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: "superadmin",
    });

    const response = NextResponse.json({
      success: true,
      redirect: "/dashboard/superadmin",
      role: "superadmin",
    });

    response.cookies.set("mba_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Super Admin login error:", error);

    return NextResponse.json(
      {
        error: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}