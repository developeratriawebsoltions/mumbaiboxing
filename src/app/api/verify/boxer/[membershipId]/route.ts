import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    membershipId: string;
  }>;
};

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const { membershipId } = await params;

    const normalizedMembershipId = decodeURIComponent(
      membershipId || ""
    ).trim();

    if (!normalizedMembershipId) {
      return NextResponse.json(
        {
          verified: false,
          status: "INVALID",
          error: "Membership ID is required.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        membershipId: normalizedMembershipId,
      },

      select: {
        membershipId: true,
        registrationStatus: true,
        membershipValidFrom: true,
        membershipExpiry: true,

        boxer: {
          select: {
            name: true,

            // Actual fields used by the boxer profile / ID card
            category: true,
            weight: true,
            weightCategory: true,

            academy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.boxer || !user.membershipId) {
      return NextResponse.json(
        {
          verified: false,
          status: "NOT_FOUND",
          error: "Membership could not be verified.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const now = new Date();

    const validFrom = user.membershipValidFrom;
    const expiry = user.membershipExpiry;

    const registrationActive =
      user.registrationStatus === "ACTIVE";

    const withinValidity =
      (!validFrom || now >= validFrom) &&
      (!expiry || now <= expiry);

    const verified =
      registrationActive && withinValidity;

    let status:
      | "ACTIVE"
      | "INACTIVE"
      | "EXPIRED"
      | "NOT_YET_ACTIVE" = "ACTIVE";

    if (!registrationActive) {
      status = "INACTIVE";
    } else if (expiry && now > expiry) {
      status = "EXPIRED";
    } else if (validFrom && now < validFrom) {
      status = "NOT_YET_ACTIVE";
    }

    return NextResponse.json(
      {
        verified,
        status,

        member: {
          name: user.boxer.name,

          membershipId: user.membershipId,

          // If database category is empty,
          // the user's role is still verified as Boxer.
          category:
            user.boxer.category || "Boxer",

          // Use weightCategory if available,
          // otherwise use the actual weight field.
          weightCategory:
            user.boxer.weightCategory ||
            user.boxer.weight ||
            null,

          academy:
            user.boxer.academy?.name || null,

          validFrom:
            user.membershipValidFrom,

          validUntil:
            user.membershipExpiry,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Public boxer verification error:",
      error
    );

    return NextResponse.json(
      {
        verified: false,
        status: "ERROR",
        error: "Unable to verify membership right now.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}