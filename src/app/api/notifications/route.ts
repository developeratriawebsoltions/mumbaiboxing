import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("mba_token")?.value;

    const payload = token
      ? await verifyToken(token)
      : null;

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId: payload.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        select: {
          id: true,
          title: true,
          message: true,
          read: true,
          createdAt: true,
        },
      });

    return NextResponse.json(
      notifications
    );
  } catch (error) {
    console.error(
      "GET /api/notifications error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load notifications",
      },
      { status: 500 }
    );
  }
}