import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.role === "superadmin") {
    const certs = await prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
    });
    return NextResponse.json(certs);
  }

  if (payload.role === "coach") {
    const coach = await prisma.coach.findUnique({ where: { userId: payload.id } });
    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    const certs = await prisma.certificate.findMany({
      where: { coachId: coach.id },
      orderBy: { issuedAt: "desc" },
    });
    return NextResponse.json(certs);
  }

  // boxer (default)
  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });

  const certs = await prisma.certificate.findMany({
    where: { boxerId: boxer.id },
    orderBy: { issuedAt: "desc" },
  });
  return NextResponse.json(certs);
}
