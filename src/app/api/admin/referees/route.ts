import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value ?? "";
    const payload = await verifyToken(token);

    if (!payload || (payload.role !== "admin" && payload.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const referees = await prisma.referee_judge.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
            registrationStatus: true,
            membershipId: true,
          },
        },
      },
    });

    return NextResponse.json(referees);
  } catch (error) {
    console.error("Admin referees API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referees and judges" },
      { status: 500 }
    );
  }
}
