import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ redirect: `/dashboard/${user.role}` });
    res.cookies.set("mba_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
