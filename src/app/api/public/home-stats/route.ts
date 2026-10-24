import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [boxers, coaches, academies, tournaments, tournamentEntries] =
      await Promise.all([
        prisma.boxer.count(),
        prisma.coach.count(),
        prisma.academy.count(),
        prisma.tournament.count({
          where: {
            status: {
              notIn: ["completed", "cancelled"],
            },
          },
        }),
        prisma.tournamententry.count(),
      ]);

    return NextResponse.json(
      {
        success: true,
        stats: {
          boxers,
          coaches,
          academies,
          tournaments,
          tournamentEntries,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Public homepage statistics error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Homepage statistics are temporarily unavailable.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
