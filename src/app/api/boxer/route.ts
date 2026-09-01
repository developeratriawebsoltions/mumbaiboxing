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
