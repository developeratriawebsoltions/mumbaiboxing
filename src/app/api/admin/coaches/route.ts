import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload || payload.role !== "superadmin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coaches = await prisma.coach.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { documents: { select: { id: true, label: true, filePath: true, fileType: true } } },
      },
      academy: { select: { name: true } },
    },
  });

  return NextResponse.json(coaches);
}
