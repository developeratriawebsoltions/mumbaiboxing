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
      gender,
      weight,
      ageGroup,
      address,

      // Referee / Judge fields
      officialDesignation,
      officiatingLevel,
      officialQualification,
      officiatingExperience,
      officialAffiliation,
      officialIdNumber,
      tournamentsOfficiated,
      officialAchievements,
      officialAddress,
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

    const rawRole = String(role).trim().toLowerCase();

    /*
     * Convert the frontend display role:
     *
     * Referee / Judge
     *
     * into the Prisma enum value:
     *
     * referee_judge
     */
    const normalizedRole =
      rawRole === "referee / judge" ||
      rawRole === "referee/judge" ||
      rawRole === "referee" ||
      rawRole === "judge" ||
      rawRole === "official"
        ? "referee_judge"
        : rawRole;

    const allowedRoles = [
      "boxer",
      "coach",
      "academy",
      "referee_judge",
    ] as const;

    if (
      !allowedRoles.includes(
        normalizedRole as (typeof allowedRoles)[number],
      )
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

    /*
     * Validate date before passing it to Prisma.
     */
    let parsedDob: Date | null = null;

    if (dob) {
      const date = new Date(dob);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid date of birth",
          },
          { status: 400 },
        );
      }

      parsedDob = date;
    }

    const hashed = await bcrypt.hash(password, 12);

    const dbRole = normalizedRole as
      | "boxer"
      | "coach"
      | "academy"
      | "referee_judge";

    /*
     * Create the account and role-specific profile
     * in one Prisma operation.
     */
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        role: dbRole,

        /*
         * Account remains inactive until payment is verified
         * or an authorized developer bypass is used.
         */
        registrationStatus: "PAYMENT_PENDING",

        updatedAt: new Date(),

        /*
         * BOXER
         */
        ...(dbRole === "boxer" &&
          name && {
            boxer: {
              create: {
                name: String(name).trim(),
                dob: parsedDob,
                gender: gender || null,
                phone: phone || null,
                address: address || null,
                weight: weight || null,
                ageGroup: ageGroup || null,
              },
            },
          }),

        /*
         * COACH
         */
        ...(dbRole === "coach" &&
          name && {
            coach: {
              create: {
                name: String(name).trim(),
                phone: phone || null,
              },
            },
          }),

        /*
         * ACADEMY
         */
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

        /*
         * REFEREE / JUDGE
         */
        ...(dbRole === "referee_judge" &&
          name && {
            refereeJudge: {
              create: {
                name: String(name).trim(),
                phone: phone || null,
                dob: parsedDob,
                gender: gender || null,

                designation: officialDesignation || null,
                officiatingLevel: officiatingLevel || null,
                qualification: officialQualification || null,

                officiatingExperience:
                  officiatingExperience || null,

                federationAffiliation:
                  officialAffiliation || null,

                aadhaarPan: officialIdNumber || null,

                tournamentsOfficiated:
                  tournamentsOfficiated || null,

                achievements:
                  officialAchievements || null,

                address: officialAddress || null,
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