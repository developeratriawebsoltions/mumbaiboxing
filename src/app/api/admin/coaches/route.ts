import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value ?? "";

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "superadmin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const coaches = await prisma.coach.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
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
        academy: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Admin coaches API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 }
    );
  }
}