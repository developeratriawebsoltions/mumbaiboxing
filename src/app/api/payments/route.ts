import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.role === "superadmin") {
    const payments = await prisma.payment.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(payments);
  }

  if (payload.role === "coach") {
    const coach = await prisma.coach.findUnique({ where: { userId: payload.id } });
    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    const payments = await prisma.payment.findMany({ where: { coachId: coach.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(payments);
  }

  if (payload.role === "academy") {
    const academy = await prisma.academy.findUnique({ where: { userId: payload.id } });
    if (!academy) return NextResponse.json({ error: "Academy not found" }, { status: 404 });
    const payments = await prisma.payment.findMany({ where: { academyId: academy.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(payments);
  }

  const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id } });
  if (!boxer) return NextResponse.json({ error: "Boxer not found" }, { status: 404 });
  const payments = await prisma.payment.findMany({ where: { boxerId: boxer.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(payments);
}
