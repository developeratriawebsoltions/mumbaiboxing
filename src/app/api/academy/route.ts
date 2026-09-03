import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function getAuthenticatedUser(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getAuthenticatedUser(req);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Make sure the logged-in account is an academy
     * ---------------------------------------------------------
     */

    if (String(payload.role).toLowerCase() !== "academy") {
      return NextResponse.json(
        { error: "Academy access required." },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Load academy
     * ---------------------------------------------------------
     */

    const academy = await prisma.academy.findUnique({
      where: {
        userId: payload.id,
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            registrationStatus: true,
            membershipId: true,
            membershipValidFrom: true,
            membershipExpiry: true,
            membershipActivatedAt: true,

            document: {
              select: {
                id: true,
                label: true,
                filePath: true,
                fileType: true,
                status: true,
                rejectionReason: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },

        boxer: {
          orderBy: {
            name: "asc",
          },

          select: {
            id: true,
            name: true,
            gender: true,
            weight: true,
            weightCategory: true,
            ageGroup: true,
            category: true,
            rank: true,
            membershipExpiry: true,

            medical: {
              select: {
                fitnessStatus: true,
                expiryDate: true,
                eligible: true,
              },
            },
          },
        },

        coach: {
          orderBy: {
            name: "asc",
          },

          select: {
            id: true,
            name: true,
            phone: true,
            membershipExpiry: true,

            user: {
              select: {
                email: true,
                registrationStatus: true,
                membershipId: true,
              },
            },
          },
        },
      },
    });

    if (!academy) {
      return NextResponse.json(
        {
          error:
            "Academy profile not found. Please contact the association.",
        },
        { status: 404 }
      );
    }

    /*
     * ---------------------------------------------------------
     * Return dashboard-safe data
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      id: academy.id,

      name: academy.name,
      address: academy.address,
      phone: academy.phone,

      membershipExpiry: academy.membershipExpiry,

      user: {
        email: academy.user.email,
        createdAt: academy.user.createdAt,
        registrationStatus:
          academy.user.registrationStatus,

        membershipId:
          academy.user.membershipId,

        membershipValidFrom:
          academy.user.membershipValidFrom,

        membershipExpiry:
          academy.user.membershipExpiry,

        membershipActivatedAt:
          academy.user.membershipActivatedAt,

        documents: academy.user.document,
      },

      boxers: academy.boxer,
      coaches: academy.coach,
    });
  } catch (error) {
    console.error(
      "Academy dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load academy dashboard.",
      },
      { status: 500 }
    );
  }
}