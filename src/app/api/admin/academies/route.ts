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

    const academies = await prisma.academy.findMany({
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
      },
    });

    return NextResponse.json(academies);
  } catch (error) {
    console.error("Admin academies API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch academies" },
      { status: 500 }
    );
  }
}