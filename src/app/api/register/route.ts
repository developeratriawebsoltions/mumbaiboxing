import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      role,
      name,
      phone,
      dob,
      weight,
      ageGroup,
      address,
    } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        {
          error: "Email, password and role are required",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = String(role).trim().toLowerCase();

    const allowedRoles = ["boxer", "coach", "academy"] as const;

    if (
      !allowedRoles.includes(normalizedRole as (typeof allowedRoles)[number])
    ) {
      return NextResponse.json(
        {
          error: "Invalid registration role",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "Email already registered",
        },
        { status: 409 },
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters",
        },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const dbRole = normalizedRole as "boxer" | "coach" | "academy";

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        role: dbRole,

        // IMPORTANT:
        // The account is NOT active until payment is verified
        // or an authorized developer bypass is used.
        registrationStatus: "PAYMENT_PENDING",

        // Required by the Prisma User model
        updatedAt: new Date(),

        ...(dbRole === "boxer" &&
          name && {
            boxer: {
              create: {
                name: String(name).trim(),
                dob: dob ? new Date(dob) : null,
                weight: weight || null,
                ageGroup: ageGroup || null,
              },
            },
          }),

        ...(dbRole === "coach" &&
          name && {
            coach: {
              create: {
                name: String(name).trim(),
                phone: phone || null,
              },
            },
          }),

        ...(dbRole === "academy" &&
          name && {
            academy: {
              create: {
                name: String(name).trim(),
                address: address || null,
                phone: phone || null,
              },
            },
          }),
      },

      select: {
        id: true,
        email: true,
        role: true,
        registrationStatus: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: user.id,
        email: user.email,
        role: user.role,
        registrationStatus: user.registrationStatus,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Registration error:", err);

    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 },
    );
  }
}
