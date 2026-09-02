import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
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

    const notification =
      await prisma.notification.create({
        data: {
          userId: payload.id,
          title: "Test Notification",
          message:
            "This is a test notification from the Mumbai Boxing Association dashboard.",
        },
        select: {
          id: true,
          title: true,
          message: true,
          read: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(
      "Test notification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create test notification",
      },
      { status: 500 }
    );
  }
}