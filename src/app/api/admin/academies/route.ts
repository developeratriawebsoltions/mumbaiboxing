import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload || payload.role !== "superadmin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const academies = await prisma.academy.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { documents: { select: { id: true, label: true, filePath: true, fileType: true } } },
      },
      boxers: { select: { id: true } },
      coaches: { select: { id: true } },
    },
  });

  return NextResponse.json(academies);
}
