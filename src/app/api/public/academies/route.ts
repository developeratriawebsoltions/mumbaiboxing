import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const academies = await prisma.academy.findMany({
    where: { user: { registrationStatus: "ACTIVE" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(academies);
}
