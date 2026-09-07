import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payload.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [
      totalBoxers,
      totalCoaches,
      totalAcademies,
      totalTournaments,
      activeMembers,
      expiredMembers,
      pendingDocuments,
      recentUsers,
      upcomingTournaments,
    ] = await Promise.all([
      prisma.boxer.count(),

      prisma.coach.count(),

      prisma.academy.count(),

      prisma.tournament.count(),

      prisma.user.count({
        where: {
          registrationStatus: "ACTIVE",
          membershipExpiry: {
            gte: new Date(),
          },
          role: {
            in: ["boxer", "coach", "academy"],
          },
        },
      }),

      prisma.user.count({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
          membershipExpiry: {
            lt: new Date(),
          },
        },
      }),

      prisma.document.count({
        where: {
          status: "Pending",
        },
      }),

      prisma.user.findMany({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          email: true,
          role: true,
          registrationStatus: true,
          membershipId: true,
          createdAt: true,
        },
      }),

      prisma.tournament.findMany({
        where: {
          startDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          startDate: "asc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          location: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalBoxers,
        totalCoaches,
        totalAcademies,
        totalTournaments,
        activeMembers,
        expiredMembers,
        pendingDocuments,
      },
      recentUsers,
      upcomingTournaments,
    });
  } catch (error) {
    console.error("Super Admin overview error:", error);

    return NextResponse.json(
      { error: "Failed to load Super Admin overview" },
      { status: 500 }
    );
  }
}