import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "superadmin" || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ redirect: "/dashboard/superadmin" });
    res.cookies.set("mba_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
