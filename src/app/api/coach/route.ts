import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coach = await prisma.coach.findUnique({
    where: { userId: payload.id },
    include: {
      user: {
        include: { document: { select: { id: true, label: true, filePath: true, fileType: true, createdAt: true } } },
      },
      academy: {
        select: {
          name: true,
          boxer: {
            select: {
              id: true, name: true, weight: true, rank: true,
              medical: { select: { fitnessStatus: true } },
            },
          },
        },
      },
    },
  });

  if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

  return NextResponse.json(coach);
}
