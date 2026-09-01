import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mba_token")?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let name: string | null = null;
  let membershipExpiry: Date | null = null;

  if (payload.role === "boxer") {
    const boxer = await prisma.boxer.findUnique({ where: { userId: payload.id }, select: { name: true, membershipExpiry: true } });
    name = boxer?.name ?? null;
    membershipExpiry = boxer?.membershipExpiry ?? null;
  } else if (payload.role === "coach") {
    const coach = await prisma.coach.findUnique({ where: { userId: payload.id }, select: { name: true, membershipExpiry: true } });
    name = coach?.name ?? null;
    membershipExpiry = coach?.membershipExpiry ?? null;
  } else if (payload.role === "academy") {
    const academy = await prisma.academy.findUnique({ where: { userId: payload.id }, select: { name: true, membershipExpiry: true } });
    name = academy?.name ?? null;
    membershipExpiry = academy?.membershipExpiry ?? null;
  }

  return NextResponse.json({ id: payload.id, email: payload.email, role: payload.role, name, membershipExpiry });
}
