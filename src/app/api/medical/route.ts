import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.role === "superadmin") {
    const medicals = await prisma.medical.findMany({
      include: { boxer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(medicals);
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  const medical = await prisma.medical.findUnique({ where: { boxerId: boxer.id } });
  return NextResponse.json(medical);
}
