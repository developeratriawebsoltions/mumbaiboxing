import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function adminOnly(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload || payload.role !== "superadmin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const entriesFor = searchParams.get("entries");

  if (entriesFor) {
    const entries = await prisma.tournamententry.findMany({
      where: { tournamentId: Number(entriesFor) },
      include: {
        boxer: {
          select: {
            id: true,
            name: true,
            weight: true,
            ageGroup: true,
            academy: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(entries);
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: { _count: { select: { tournamententry: true } } },
  });

  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, location, startDate, endDate, weightClass, status, entryFee } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const tournament = await prisma.tournament.create({
    data: {
      name,
      location: location || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      weightClass: weightClass || null,
      status: status || "upcoming",
      entryFee: entryFee !== "" && entryFee != null ? Number(entryFee) : null,
    },
  });

  return NextResponse.json(tournament, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, location, startDate, endDate, weightClass, status, entryFee } = await req.json();
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const tournament = await prisma.tournament.update({
    where: { id: Number(id) },
    data: {
      name,
      location: location || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      weightClass: weightClass || null,
      status,
      entryFee: entryFee !== "" && entryFee != null ? Number(entryFee) : null,
    },
  });

  return NextResponse.json(tournament);
}

export async function DELETE(req: NextRequest) {
  if (!(await adminOnly(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await prisma.tournamententry.deleteMany({ where: { tournamentId: Number(id) } });
  await prisma.tournament.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
