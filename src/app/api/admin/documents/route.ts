import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

type DocumentWithUser = Prisma.documentGetPayload<{
  include: {
    user: {
      select: {
        role: true;
        boxer: { select: { name: true } };
        coach: { select: { name: true } };
        academy: { select: { name: true } };
      };
    };
  };
}>;

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload || payload.role !== "superadmin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const documents: DocumentWithUser[] = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          role: true,
          boxer: { select: { name: true } },
          coach: { select: { name: true } },
          academy: { select: { name: true } },
        },
      },
    },
  });

  const result = documents.map((d) => ({
    id: d.id,
    label: d.label,
    filePath: d.filePath,
    fileType: d.fileType,
    createdAt: d.createdAt,
    userRole: d.user.role,
    userName:
      d.user.boxer?.name ?? d.user.coach?.name ?? d.user.academy?.name ?? "Unknown",
  }));

  return NextResponse.json(result);
}
