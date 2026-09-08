import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    const tournament =
      await prisma.tournament.findFirst({
        where: {
          isFeatured: true,

          startDate: {
            gt: now,
          },

          status: {
            not: "completed",
          },
        },

        orderBy: {
          startDate: "asc",
        },

        select: {
          id: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
          weightClass: true,
          status: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        tournament,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Upcoming tournament API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        tournament: null,
      },
      { status: 500 }
    );
  }
}