import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import {
  CertificateEmailError,
  createCertificatePdf,
  emailMembershipCertificate,
  getCertificateEmailFailureMessage,
} from "@/lib/membership-certificate";

async function getCertificateAccess(req: NextRequest, id: string) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "");
  if (!payload) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    } as const;
  }

  const certificateId = Number(id);
  if (!Number.isSafeInteger(certificateId) || certificateId <= 0) {
    return {
      error: NextResponse.json({ error: "Invalid certificate." }, { status: 400 }),
    } as const;
  }

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      boxer: { select: { userId: true, name: true } },
      coach: { select: { userId: true, name: true } },
      refereeJudge: { select: { userId: true, name: true } },
    },
  });

  if (!certificate) {
    return {
      error: NextResponse.json({ error: "Certificate not found." }, { status: 404 }),
    } as const;
  }

  const isOwner =
    certificate.userId === payload.id ||
    (payload.role === "boxer" && certificate.boxer?.userId === payload.id) ||
    (payload.role === "coach" && certificate.coach?.userId === payload.id) ||
    (payload.role === "referee_judge" &&
      certificate.refereeJudge?.userId === payload.id);

  if (!isOwner) {
    return {
      error: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    } as const;
  }

  const memberName =
    certificate.memberName ||
    certificate.boxer?.name ||
    certificate.coach?.name ||
    certificate.refereeJudge?.name ||
    "Member";

  return {
    payload,
    certificate,
    memberName,
    email:
      certificate.user?.email ||
      (await prisma.user.findUnique({
        where: { id: payload.id },
        select: { email: true },
      }))?.email ||
      null,
  } as const;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const access = await getCertificateAccess(req, id);
    if ("error" in access) return access.error;

    const pdf = createCertificatePdf({
      ...access.certificate,
      memberName: access.memberName,
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="MBA-CERT-${String(access.certificate.id).padStart(6, "0")}.pdf"`,
        "Content-Length": String(pdf.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Certificate download failed:", error);
    return NextResponse.json(
      { error: "Unable to download the certificate." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const access = await getCertificateAccess(req, id);
    if ("error" in access) return access.error;

    if (!access.certificate.membershipId || !access.email) {
      return NextResponse.json(
        { error: "This membership certificate cannot be emailed." },
        { status: 400 }
      );
    }

    await prisma.certificate.update({
      where: { id: access.certificate.id },
      data: { membershipEmailAttemptedAt: new Date() },
    });

    await emailMembershipCertificate(access.email, {
      ...access.certificate,
      memberName: access.memberName,
    });
    await prisma.certificate.update({
      where: { id: access.certificate.id },
      data: { membershipEmailSentAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate emailed to your registered email address.",
    });
  } catch (error) {
    if (error instanceof CertificateEmailError) {
      return NextResponse.json(
        { error: getCertificateEmailFailureMessage(error.kind) },
        { status: error.kind === "configuration" ? 503 : 502 }
      );
    }

    console.error("Certificate email resend failed:", error);
    return NextResponse.json(
      { error: "Unable to email the certificate. Please try again later." },
      { status: 500 }
    );
  }
}
