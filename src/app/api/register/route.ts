import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, name, phone, dob, weight, ageGroup, address } = body;

    if (!email || !password || !role)
      return NextResponse.json({ error: "Email, password and role are required" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 8);
    const dbRole = role.toLowerCase() as "boxer" | "coach" | "academy" | "association" | "school" | "taluka";

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: dbRole,
        ...(dbRole === "boxer" && name && {
          boxer: {
            create: {
              name,
              dob: dob ? new Date(dob) : null,
              weight: weight ?? null,
              ageGroup: ageGroup ?? null,
            },
          },
        }),
        ...(dbRole === "coach" && name && {
          coach: {
            create: {
              name,
              phone: phone ?? null,
            },
          },
        }),
        ...(dbRole === "academy" && name && {
          academy: {
            create: {
              name,
              address: address ?? null,
              phone: phone ?? null,
            },
          },
        }),
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
