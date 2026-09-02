import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);

  // Public: no token — return all non-completed tournaments
  if (!payload) {
    const tournaments = await prisma.tournament.findMany({
      where: { status: { not: "completed" } },
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json(tournaments.map((t) => ({ ...t, registered: false })));
  }

  if (payload.role === "superadmin") {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(tournaments.map((t) => ({ ...t, registered: false })));
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "desc" },
    include: {
      tournamententry: boxer
  ? { where: { boxerId: boxer.id } }
  : false,
    },
  });

  return NextResponse.json(
    tournaments.map((t) => ({
      ...t,
      registered: boxer ? t.tournamententry.length > 0 : false,
    }))
  );
}
