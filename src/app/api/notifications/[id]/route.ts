import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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

    const { id } =
      await context.params;

    const notificationId =
      Number(id);

    if (
      !Number.isInteger(
        notificationId
      )
    ) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    const notification =
      await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: payload.id,
        },
      });

    if (!notification) {
      return NextResponse.json(
        {
          error:
            "Notification not found",
        },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE notification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete notification",
      },
      { status: 500 }
    );
  }
}