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
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (payload.role !== "superadmin") {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin access required",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");

    const validStatuses = [
      "PENDING_REVIEW",
      "APPROVED",
      "REJECTED",
    ];

    const where =
      status && validStatuses.includes(status)
        ? {
            status,
          }
        : {};

    const history =
      await prisma.boxer_tournament_history.findMany({
        where,

        orderBy: [
          {
            status: "asc",
          },
          {
            createdAt: "desc",
          },
        ],

        include: {
          boxer: {
            select: {
              id: true,
              name: true,
              gender: true,
              weight: true,
              weightCategory: true,
              ageGroup: true,
              category: true,
              membershipExpiry: true,

              user: {
                select: {
                  id: true,
                  email: true,
                  membershipId: true,
                  registrationStatus: true,
                },
              },

              academy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/tournament-history error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tournament history",
      },
      { status: 500 }
    );
  }
}