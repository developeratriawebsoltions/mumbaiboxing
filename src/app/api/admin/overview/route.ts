import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

    // Admin dashboard is ONLY for admin.
    // Super Admin has its own dashboard.
    if (payload.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const now = new Date();

    const [
      totalBoxers,
      totalCoaches,
      totalAcademies,
      totalTournaments,
      totalDocuments,
      totalCertificates,
      totalTournamentEntries,

      activeMembers,
      expiredMembers,
      pendingMembers,

      paidPayments,
      pendingPayments,
      failedPayments,

      revenueResult,

      recentUsers,
      upcomingTournaments,
      recentPayments,

      pendingDocuments,
    ] = await Promise.all([
      prisma.boxer.count(),

      prisma.coach.count(),

      prisma.academy.count(),

      prisma.tournament.count(),

      prisma.document.count(),

      prisma.certificate.count(),

      prisma.tournamententry.count(),

      // Active memberships
      prisma.user.count({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
          registrationStatus: "ACTIVE",
          membershipExpiry: {
            gte: now,
          },
        },
      }),

      // Expired memberships
      prisma.user.count({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
          membershipExpiry: {
            lt: now,
          },
        },
      }),

      // Users still waiting for payment
      prisma.user.count({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
          registrationStatus: "PAYMENT_PENDING",
        },
      }),

      // Paid payments
      prisma.payment.count({
        where: {
          status: {
            in: ["Paid", "paid", "Captured", "captured"],
          },
        },
      }),

      // Pending payments
      prisma.payment.count({
        where: {
          status: {
            in: ["Pending", "pending"],
          },
        },
      }),

      // Failed payments
      prisma.payment.count({
        where: {
          status: {
            in: ["Failed", "failed"],
          },
        },
      }),

      // Revenue
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: {
            in: ["Paid", "paid", "Captured", "captured"],
          },
        },
      }),

      // Recent registrations
      prisma.user.findMany({
        where: {
          role: {
            in: ["boxer", "coach", "academy"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          email: true,
          role: true,
          registrationStatus: true,
          membershipId: true,
          membershipExpiry: true,
          createdAt: true,
        },
      }),

      // Upcoming tournaments
      prisma.tournament.findMany({
        where: {
          OR: [
            {
              startDate: {
                gte: now,
              },
            },
            {
              endDate: {
                gte: now,
              },
            },
          ],
        },
        orderBy: [
          {
            startDate: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        take: 5,
        select: {
          id: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
          weightClass: true,
          status: true,
          entryFee: true,
        },
      }),

      // Recent payments
      prisma.payment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          type: true,
          amount: true,
          method: true,
          status: true,
          invoiceNumber: true,
          createdAt: true,
          boxer: {
            select: {
              name: true,
            },
          },
          coach: {
            select: {
              name: true,
            },
          },
          academy: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Pending documents
      prisma.document.count({
        where: {
          status: "Pending",
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalBoxers,
        totalCoaches,
        totalAcademies,
        totalTournaments,
        totalDocuments,
        totalCertificates,
        totalTournamentEntries,
      },

      memberships: {
        active: activeMembers,
        expired: expiredMembers,
        paymentPending: pendingMembers,
      },

      payments: {
        paid: paidPayments,
        pending: pendingPayments,
        failed: failedPayments,
        revenue: revenueResult._sum.amount ?? 0,
      },

      pendingDocuments,

      recentUsers,

      upcomingTournaments,

      recentPayments,
    });
  } catch (error) {
    console.error("Admin overview error:", error);

    return NextResponse.json(
      {
        error: "Failed to load admin dashboard",
      },
      {
        status: 500,
      }
    );
  }
}