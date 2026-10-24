import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: {
        status: {
          notIn: ["completed", "cancelled"],
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { startDate: "asc" },
      ],
      take: 20,
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        endDate: true,
        weightClass: true,
        status: true,
        isFeatured: true,
      },
    });
    const now = Date.now();
    const tournament =
      tournaments.find(
        (item) =>
          item.startDate &&
          item.startDate.getTime() > now &&
          item.isFeatured
      ) ??
      tournaments.find(
        (item) =>
          item.startDate &&
          item.startDate.getTime() > now
      ) ??
      tournaments.find((item) => item.isFeatured) ??
      tournaments.find((item) => item.status === "open") ??
      tournaments[0] ??
      null;

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
        error: "Featured tournament information is temporarily unavailable.",
      },
      { status: 503 }
    );
  }
}