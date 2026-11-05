import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cloudinaryUpload } from "@/lib/cloudinary";

type TournamentFields = Record<
  string,
  string | number | boolean | null | undefined
>;

const MAX_TOURNAMENT_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TOURNAMENT_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

async function readTournamentRequest(req: NextRequest) {
  if (req.headers.get("content-type")?.includes("multipart/form-data")) {
    const formData = await req.formData();
    const fields: TournamentFields = {};
    let image: File | null = null;

    for (const [key, value] of formData.entries()) {
      if (key === "image" && value instanceof File && value.size > 0) {
        image = value;
      } else if (typeof value === "string") {
        fields[key] = value;
      }
    }

    return { fields, image };
  }

  const body: unknown = await req.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Invalid tournament data");
  }

  const fields: TournamentFields = {};
  for (const [key, value] of Object.entries(body)) {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      fields[key] = value;
    }
  }

  return { fields, image: null };
}

function validateTournamentImage(image: File | null) {
  if (!image) return null;
  if (!ALLOWED_TOURNAMENT_IMAGE_TYPES.has(image.type)) {
    return "Tournament image must be a JPG, PNG, or WebP file.";
  }
  if (image.size > MAX_TOURNAMENT_IMAGE_SIZE) {
    return "Tournament image must be 5 MB or smaller.";
  }
  return null;
}

function isFeaturedValue(value: TournamentFields[string]) {
  return value === true || value === "true";
}

async function uploadTournamentImage(image: File | null) {
  if (!image) return null;
  const buffer = Buffer.from(await image.arrayBuffer());
  return cloudinaryUpload(
    buffer,
    "mba/tournaments",
    `tournament-${randomUUID()}`,
  );
}

async function canManageTournaments(req: NextRequest) {
  const payload = await verifyToken(
    req.cookies.get("mba_token")?.value ?? ""
  );

  if (
    !payload ||
    (payload.role !== "admin" && payload.role !== "superadmin")
  ) {
    return null;
  }

  return payload;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await canManageTournaments(req))) {
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

      // Also fetch tournament's custom questions so admin can pair them with answers
      const tournamentData = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        select: { customQuestions: true },
      });

      return NextResponse.json(
        entries.map((entry) => ({
          ...entry,
          answers: entry.answers ?? null,
          customQuestions: tournamentData?.customQuestions ?? null,
        }))
      );
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

    return NextResponse.json(
      tournaments.map(({ _count, ...tournament }) => ({
        ...tournament,
        _count: { entries: _count.tournamententry },
      })),
    );
  } catch (error) {
    console.error("Admin tournament listing failed:", error);
    return NextResponse.json(
      { error: "Could not load tournaments. Please retry." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await canManageTournaments(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { fields: body, image } = await readTournamentRequest(req);
  const imageError = validateTournamentImage(image);
  if (imageError) {
    return NextResponse.json({ error: imageError }, { status: 400 });
  }

  const {
    name,
    location,
    startDate,
    endDate,
    registrationStartDate,
    registrationEndDate,
    weightClass,
    categories,
    description,
    disclaimer,
    status,
    entryFee,
    isFeatured,
    customQuestions,
  } = body;

  if (!name || !String(name).trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadTournamentImage(image);
  } catch (error) {
    console.error("Tournament image upload failed:", error);
    return NextResponse.json(
      { error: "Tournament image upload failed. Please try again." },
      { status: 500 },
    );
  }

  const shouldFeature = isFeaturedValue(isFeatured);

  const tournament = await prisma.$transaction(async (tx) => {
    if (shouldFeature) {
      await tx.tournament.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    return tx.tournament.create({
      data: {
        name: String(name).trim(),
        location: location && String(location).trim() ? String(location).trim() : null,
        startDate: startDate ? new Date(String(startDate)) : null,
        endDate: endDate ? new Date(String(endDate)) : null,
        registrationStartDate: registrationStartDate ? new Date(String(registrationStartDate)) : null,
        registrationEndDate: registrationEndDate ? new Date(String(registrationEndDate)) : null,
        weightClass: weightClass && String(weightClass).trim() ? String(weightClass).trim() : null,
        categories: categories && String(categories).trim() ? String(categories).trim() : null,
        description: description && String(description).trim() ? String(description).trim() : null,
        disclaimer: disclaimer && String(disclaimer).trim() ? String(disclaimer).trim() : null,
        status: status && String(status).trim() ? String(status).trim() : "upcoming",
        entryFee: entryFee !== "" && entryFee != null ? Number(entryFee) : null,
        isFeatured: shouldFeature,
        imageUrl,
        customQuestions: customQuestions && String(customQuestions).trim() ? String(customQuestions).trim() : null,
      },
    });
  });

  return NextResponse.json(
    tournament,
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  if (!(await canManageTournaments(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { fields: body, image } = await readTournamentRequest(req);
  const imageError = validateTournamentImage(image);
  if (imageError) {
    return NextResponse.json({ error: imageError }, { status: 400 });
  }

  const {
    id,
    name,
    location,
    startDate,
    endDate,
    registrationStartDate,
    registrationEndDate,
    weightClass,
    categories,
    description,
    disclaimer,
    status,
    entryFee,
    isFeatured,
    customQuestions,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const tournamentId = Number(id);

  if (!Number.isFinite(tournamentId)) {
    return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 });
  }

  let imageUrl: string | null | undefined;
  try {
    imageUrl = image ? await uploadTournamentImage(image) : undefined;
  } catch (error) {
    console.error("Tournament image upload failed:", error);
    return NextResponse.json(
      { error: "Tournament image upload failed. Please try again." },
      { status: 500 },
    );
  }

  const shouldFeature = isFeaturedValue(isFeatured);

  const tournament = await prisma.$transaction(async (tx) => {
    if (shouldFeature) {
      await tx.tournament.updateMany({
        where: { id: { not: tournamentId }, isFeatured: true },
        data: { isFeatured: false },
      });
    }

    return tx.tournament.update({
      where: { id: tournamentId },
      data: {
        name: name && String(name).trim() ? String(name).trim() : undefined,
        location: location && String(location).trim() ? String(location).trim() : null,
        startDate: startDate ? new Date(String(startDate)) : null,
        endDate: endDate ? new Date(String(endDate)) : null,
        registrationStartDate: registrationStartDate ? new Date(String(registrationStartDate)) : null,
        registrationEndDate: registrationEndDate ? new Date(String(registrationEndDate)) : null,
        weightClass: weightClass && String(weightClass).trim() ? String(weightClass).trim() : null,
        categories: categories && String(categories).trim() ? String(categories).trim() : null,
        description: description && String(description).trim() ? String(description).trim() : null,
        disclaimer: disclaimer && String(disclaimer).trim() ? String(disclaimer).trim() : null,
        status: status && String(status).trim() ? String(status).trim() : "upcoming",
        entryFee: entryFee !== "" && entryFee != null ? Number(entryFee) : null,
        isFeatured: shouldFeature,
        imageUrl,
        customQuestions: customQuestions !== undefined ? (customQuestions && String(customQuestions).trim() ? String(customQuestions).trim() : null) : undefined,
      },
    });
  });

  return NextResponse.json(tournament);
}

export async function DELETE(req: NextRequest) {
  if (!(await canManageTournaments(req))) {
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

  await prisma.$transaction(async (tx) => {
    await tx.tournamententry.deleteMany({
      where: {
        tournamentId,
      },
    });

    await tx.tournament.delete({
      where: {
        id: tournamentId,
      },
    });
  });

  return NextResponse.json({
    success: true,
  });
}