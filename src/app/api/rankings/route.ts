import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const boxers = await prisma.boxer.findMany({
    where: { rank: { not: null } },
    orderBy: { rank: "asc" },
    select: {
      id: true,
      userId: true,
      name: true,
      weight: true,
      ageGroup: true,
      rank: true,
      academy: { select: { name: true } },
    },
  });

  return NextResponse.json(
    boxers.map((b) => ({ ...b, isMe: b.userId === payload.id }))
  );
}
