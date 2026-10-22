import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: String(email).trim().toLowerCase(),
      },
    });

    /*
     * This endpoint is ONLY for Admin accounts.
     */
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      redirect: "/dashboard/admin",
      role: "admin",
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
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Unable to process login." },
      { status: 500 }
    );
  }
}