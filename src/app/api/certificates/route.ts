import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ensureActiveMemberCertificate } from "@/lib/membership-certificate";

export async function GET(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.role === "superadmin") {
    const certs = await prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
    });
    return NextResponse.json(certs);
  }

  if (!["boxer", "coach", "academy", "referee_judge"].includes(payload.role)) {
    return NextResponse.json({ error: "Member access required." }, { status: 403 });
  }

  await ensureActiveMemberCertificate(payload.id);

  const certs = await prisma.certificate.findMany({
    where: {
      OR: [
        { userId: payload.id },
        ...(payload.role === "boxer"
          ? [{ boxer: { userId: payload.id } }]
          : []),
        ...(payload.role === "coach"
          ? [{ coach: { userId: payload.id } }]
          : []),
        ...(payload.role === "referee_judge"
          ? [{ refereeJudge: { userId: payload.id } }]
          : []),
      ],
    },
    orderBy: { issuedAt: "desc" },
  });
  return NextResponse.json(certs);
}
