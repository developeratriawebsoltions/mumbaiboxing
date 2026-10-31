import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value ?? "";
    const payload = await verifyToken(token);

    if (!payload || (payload.role !== "admin" && payload.role !== "superadmin")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const academies = await prisma.academy.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
            document: {
              select: {
                id: true,
                label: true,
                filePath: true,
                fileType: true,
              },
            },
          },
        },
        boxer: {
          select: {
            id: true,
          },
        },
        coach: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(
      academies.map(({ user, boxer, coach, ...academy }) => ({
        ...academy,
        user: {
          email: user.email,
          createdAt: user.createdAt,
          documents: user.document,
        },
        boxers: boxer,
        coaches: coach,
      }))
    );
  } catch (error) {
    console.error("Admin academies API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch academies" },
      { status: 500 }
    );
  }
}