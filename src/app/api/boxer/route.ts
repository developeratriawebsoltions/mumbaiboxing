import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const boxer = await prisma.boxer.findUnique({
    where: { userId: payload.id },
    include: {
      user: {
        include: { documents: { select: { id: true, label: true, filePath: true, fileType: true, createdAt: true } } },
      },
      academy: { select: { name: true } },
    },
  });

  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  return NextResponse.json(boxer);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;
  const payload = token ? await verifyToken(token).catch(() => null) : null;

  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, dob, weight, ageGroup } = body ?? {};

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  const updateData: {
    name?: string;
    dob?: Date | null;
    weight?: string | null;
    ageGroup?: string | null;
  } = {};

  if (typeof name === "string" && name.trim()) updateData.name = name.trim();
  if (dob === null || dob === "") updateData.dob = null;
  else if (typeof dob === "string" && dob.trim()) updateData.dob = new Date(dob);

  if (weight === null || weight === "") updateData.weight = null;
  else if (typeof weight === "string") updateData.weight = weight.trim() || null;

  if (ageGroup === null || ageGroup === "") updateData.ageGroup = null;
  else if (typeof ageGroup === "string") updateData.ageGroup = ageGroup.trim() || null;

  const updated = await prisma.boxer.update({
    where: { id: boxer.id },
    data: updateData,
    include: {
      user: {
        include: { documents: { select: { id: true, label: true, filePath: true, fileType: true, createdAt: true } } },
      },
      academy: { select: { name: true } },
    },
  });

  return NextResponse.json(updated);
}
