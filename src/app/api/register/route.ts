import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

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
      academyName,
      medicalCertIssueDate,
      hivReportIssueDate,

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

    // Resolve academyId and hash password in parallel
    const [foundAcademy, hashed] = await Promise.all([
      academyName && academyName !== "__none__"
        ? prisma.academy.findFirst({ where: { name: academyName }, select: { id: true } })
        : Promise.resolve(null),
      bcrypt.hash(password, 10),
    ]);
    const resolvedAcademyId: number | null = foundAcademy?.id ?? null;

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
                academyId: resolvedAcademyId,
                medical: medicalCertIssueDate || hivReportIssueDate ? {
                  create: (() => {
                    // Medical cert valid 1 year, HIV report valid 6 months
                    const dates: Date[] = [];
                    if (medicalCertIssueDate) {
                      const d = new Date(medicalCertIssueDate);
                      d.setFullYear(d.getFullYear() + 1);
                      dates.push(d);
                    }
                    if (hivReportIssueDate) {
                      const d = new Date(hivReportIssueDate);
                      d.setMonth(d.getMonth() + 6);
                      dates.push(d);
                    }
                    // Use the earlier expiry so boxer is flagged when any doc expires
                    const expiryDate = dates.sort((a, b) => a.getTime() - b.getTime())[0];
                    const now = new Date();
                    const isExpired = expiryDate < now;
                    const isExpiringSoon = !isExpired && (expiryDate.getTime() - now.getTime()) < 30 * 24 * 60 * 60 * 1000;
                    return {
                      expiryDate,
                      fitnessStatus: isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Valid",
                      eligible: !isExpired,
                      updatedAt: new Date(),
                    };
                  })(),
                } : undefined,
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
                academyId: resolvedAcademyId,
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

    const paymentToken = await signToken({
      id: user.id,
      email: user.email,
      role: "payment_pending",
    });
    const response = NextResponse.json(
      {
        success: true,
        id: user.id,
        email: user.email,
        role: user.role,
        registrationStatus: user.registrationStatus,
      },
      { status: 201 },
    );
    response.cookies.set("mba_payment_token", paymentToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (err) {
    console.error("Registration error:", err);

    if (
      err instanceof Prisma.PrismaClientInitializationError &&
      (err.errorCode === "P1001" ||
        err.message.includes("Can't reach database server"))
    ) {
      return NextResponse.json(
        {
          error:
            "Registration is temporarily unavailable because the database cannot be reached. Your form details are still here. Please try again after the service is restored.",
        },
        {
          status: 503,
          headers: {
            "Retry-After": "30",
          },
        },
      );
    }

    return NextResponse.json(
      {
        error: "Registration could not be completed. Please try again.",
      },
      { status: 500 },
    );
  }
}