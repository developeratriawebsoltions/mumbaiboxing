import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (payload.role !== "boxer") {
    return NextResponse.json({ error: "Only boxers can view their entries" }, { status: 403 });
  }

  const boxer = await prisma.boxer.findUnique({
    where: { userId: payload.id },
    select: { id: true },
  });
  if (!boxer) return NextResponse.json({ error: "Boxer profile not found" }, { status: 404 });

  // Confirmed entries (payment done or free)
  const confirmed = await prisma.tournamententry.findMany({
    where: { boxerId: boxer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      answers: true,
      tournament: {
        select: {
          id: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
          weightClass: true,
          categories: true,
          entryFee: true,
          status: true,
        },
      },
    },
  });

  // Cash-pending entries (payment submitted, awaiting admin approval)
  const cashPending = await prisma.payment.findMany({
    where: {
      boxerId: boxer.id,
      method: "Cash",
      status: "Pending",
      tournamentId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      amount: true,
      tournament: {
        select: {
          id: true,
          name: true,
          location: true,
          startDate: true,
          endDate: true,
          weightClass: true,
          categories: true,
          entryFee: true,
          status: true,
        },
      },
    },
  });

  return NextResponse.json({
    confirmed: confirmed.map((e) => ({
      ...e,
      pending: false,
    })),
    cashPending: cashPending.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      answers: null,
      pending: true,
      amount: p.amount,
      tournament: p.tournament,
    })),
  });
}
