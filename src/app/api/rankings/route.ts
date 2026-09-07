import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const seasonParam = searchParams.get("season");
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const weightCategory = searchParams.get("weightCategory");
    const limitParam = searchParams.get("limit");

    /*
     * Default season = current year.
     *
     * Use ?season=all for all-time rankings.
     */
    const currentYear = new Date().getFullYear();

    let season: number | null = currentYear;

    if (seasonParam?.toLowerCase() === "all") {
      season = null;
    } else if (seasonParam) {
      const parsedSeason = Number(seasonParam);

      if (
        !Number.isInteger(parsedSeason) ||
        parsedSeason < 2000 ||
        parsedSeason > currentYear + 10
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid season",
          },
          { status: 400 }
        );
      }

      season = parsedSeason;
    }

    /*
     * Optional result limit.
     */
    let limit = 100;

    if (limitParam) {
      const parsedLimit = Number(limitParam);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 500
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Limit must be between 1 and 500",
          },
          { status: 400 }
        );
      }

      limit = parsedLimit;
    }

    /*
     * Build boxer filters.
     */
    const boxerWhere: {
      category?: string;
      gender?: string;
      weightCategory?: string;
    } = {};

    if (category) {
      boxerWhere.category = category;
    }

    if (gender) {
      boxerWhere.gender = gender;
    }

    if (weightCategory) {
      boxerWhere.weightCategory = weightCategory;
    }

    /*
     * Get points ledger entries.
     *
     * We also verify the linked tournament history is APPROVED.
     * This gives us an additional safety layer.
     */
    const pointsRecords = await prisma.boxer_points.findMany({
      where: {
        ...(season !== null ? { season } : {}),

        history: {
          status: "APPROVED",
        },

        boxer: boxerWhere,
      },

      include: {
        boxer: {
          select: {
            id: true,
            name: true,
            gender: true,
            category: true,
            weight: true,
            weightCategory: true,
            ageGroup: true,
            rank: true,
            academy: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                membershipId: true,
                registrationStatus: true,
              },
            },
          },
        },

        history: {
          select: {
            id: true,
            tournamentDate: true,
            tournamentType: true,
            medal: true,
          },
        },
      },
    });

    /*
     * Group all points by boxer.
     */
    const boxerMap = new Map<
      number,
      {
        boxerId: number;
        name: string;
        membershipId: string | null;
        gender: string | null;
        category: string | null;
        weight: string | null;
        weightCategory: string | null;
        ageGroup: string | null;
        academy: {
          id: number;
          name: string;
        } | null;
        points: number;
        tournaments: number;
        gold: number;
        silver: number;
        bronze: number;
        latestTournamentDate: Date | null;
      }
    >();

    for (const record of pointsRecords) {
      const boxer = record.boxer;

      let entry = boxerMap.get(boxer.id);

      if (!entry) {
        entry = {
          boxerId: boxer.id,
          name: boxer.name,
          membershipId: boxer.user.membershipId,
          gender: boxer.gender,
          category: boxer.category,
          weight: boxer.weight,
          weightCategory: boxer.weightCategory,
          ageGroup: boxer.ageGroup,
          academy: boxer.academy,
          points: 0,
          tournaments: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          latestTournamentDate: null,
        };

        boxerMap.set(boxer.id, entry);
      }

      entry.points += record.points;
      entry.tournaments += 1;

      const medal = String(record.medal || "")
        .trim()
        .toUpperCase();

      if (medal === "GOLD") {
        entry.gold += 1;
      } else if (medal === "SILVER") {
        entry.silver += 1;
      } else if (medal === "BRONZE") {
        entry.bronze += 1;
      }

      const tournamentDate = record.history.tournamentDate;

      if (
        tournamentDate &&
        (!entry.latestTournamentDate ||
          tournamentDate > entry.latestTournamentDate)
      ) {
        entry.latestTournamentDate = tournamentDate;
      }
    }

    /*
     * Ranking order:
     *
     * 1. Total points
     * 2. Gold medals
     * 3. Silver medals
     * 4. Bronze medals
     * 5. Most recent achievement
     * 6. Boxer name alphabetically
     */
    const rankings = Array.from(boxerMap.values()).sort(
      (a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.gold !== a.gold) {
          return b.gold - a.gold;
        }

        if (b.silver !== a.silver) {
          return b.silver - a.silver;
        }

        if (b.bronze !== a.bronze) {
          return b.bronze - a.bronze;
        }

        const aDate = a.latestTournamentDate?.getTime() ?? 0;
        const bDate = b.latestTournamentDate?.getTime() ?? 0;

        if (bDate !== aDate) {
          return bDate - aDate;
        }

        return a.name.localeCompare(b.name);
      }
    );

    /*
     * Add ranking number.
     */
    const rankedResults = rankings
      .slice(0, limit)
      .map((boxer, index) => ({
        rank: index + 1,
        boxerId: boxer.boxerId,
        name: boxer.name,
        membershipId: boxer.membershipId,
        gender: boxer.gender,
        category: boxer.category,
        weight: boxer.weight,
        weightCategory: boxer.weightCategory,
        ageGroup: boxer.ageGroup,
        academy: boxer.academy,

        points: boxer.points,
        tournaments: boxer.tournaments,

        medals: {
          gold: boxer.gold,
          silver: boxer.silver,
          bronze: boxer.bronze,
        },

        latestTournamentDate:
          boxer.latestTournamentDate,
      }));

    return NextResponse.json({
      success: true,

      /*
       * null means All-Time.
       */
      season,

      rankingType:
        season === null ? "ALL_TIME" : "SEASON",

      count: rankedResults.length,

      rankings: rankedResults,
    });
  } catch (error) {
    console.error(
      "GET /api/rankings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch rankings",
      },
      { status: 500 }
    );
  }
}