import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function adminOnly(req: NextRequest) {
  const payload = await verifyToken(
    req.cookies.get("mba_token")?.value ?? ""
  );

  if (!payload || payload.role !== "superadmin") {
    return null;
  }

  return payload;
}

export async function GET(req: NextRequest) {
  if (!(await adminOnly(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const entriesFor = searchParams.get("entries");

  // Get tournament entries
  if (entriesFor) {
    const tournamentId = Number(entriesFor);

    if (!Number.isFinite(tournamentId)) {
      return NextResponse.json(
        { error: "Invalid tournament ID" },
        { status: 400 }
      );
    }

    const entries = await prisma.tournamententry.findMany({
      where: {
        tournamentId,
      },
      include: {
        boxer: {
          select: {
            id: true,
            name: true,
            weight: true,
            ageGroup: true,
            academy: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(entries);
  }

  // Get all tournaments
  const tournaments = await prisma.tournament.findMany({
    orderBy: {
      startDate: "asc",
    },
    include: {
      _count: {
        select: {
          tournamententry: true,
        },
      },
    },
  });

  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  if (!(await adminOnly(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    name,
    location,
    startDate,
    endDate,
    weightClass,
    status,
    entryFee,
    isFeatured,
  } = body;

  if (!name || !String(name).trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const shouldFeature = Boolean(isFeatured);

  const tournament = await prisma.$transaction(async (tx) => {
    // If this tournament is selected for the homepage,
    // remove the featured flag from every other tournament.
    if (shouldFeature) {
      await tx.tournament.updateMany({
        where: {
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });
    }

    return tx.tournament.create({
      data: {
        name: String(name).trim(),

        location:
          location && String(location).trim()
            ? String(location).trim()
            : null,

        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate: endDate
          ? new Date(endDate)
          : null,

        weightClass:
          weightClass && String(weightClass).trim()
            ? String(weightClass).trim()
            : null,

        status:
          status && String(status).trim()
            ? String(status).trim()
            : "upcoming",

        entryFee:
          entryFee !== "" && entryFee != null
            ? Number(entryFee)
            : null,

        isFeatured: shouldFeature,
      },
    });
  });

  return NextResponse.json(
    tournament,
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  if (!(await adminOnly(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    id,
    name,
    location,
    startDate,
    endDate,
    weightClass,
    status,
    entryFee,
    isFeatured,
  } = body;

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  const tournamentId = Number(id);

  if (!Number.isFinite(tournamentId)) {
    return NextResponse.json(
      { error: "Invalid tournament ID" },
      { status: 400 }
    );
  }

  const shouldFeature = Boolean(isFeatured);

  const tournament = await prisma.$transaction(async (tx) => {
    // If this tournament should appear on the homepage,
    // make sure every other tournament is unfeatured.
    if (shouldFeature) {
      await tx.tournament.updateMany({
        where: {
          id: {
            not: tournamentId,
          },
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });
    }

    return tx.tournament.update({
      where: {
        id: tournamentId,
      },

      data: {
        name:
          name && String(name).trim()
            ? String(name).trim()
            : undefined,

        location:
          location && String(location).trim()
            ? String(location).trim()
            : null,

        startDate: startDate
          ? new Date(startDate)
          : null,

        endDate: endDate
          ? new Date(endDate)
          : null,

        weightClass:
          weightClass && String(weightClass).trim()
            ? String(weightClass).trim()
            : null,

        status:
          status && String(status).trim()
            ? String(status).trim()
            : "upcoming",

        entryFee:
          entryFee !== "" && entryFee != null
            ? Number(entryFee)
            : null,

        isFeatured: shouldFeature,
      },
    });
  });

  return NextResponse.json(tournament);
}

export async function DELETE(req: NextRequest) {
  if (!(await adminOnly(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }

  const tournamentId = Number(id);

  if (!Number.isFinite(tournamentId)) {
    return NextResponse.json(
      { error: "Invalid tournament ID" },
      { status: 400 }
    );
  }

  await prisma.tournamententry.deleteMany({
    where: {
      tournamentId,
    },
  });

  await prisma.tournament.delete({
    where: {
      id: tournamentId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}