import { Prisma } from "@prisma/client";
import { createTransport } from "nodemailer";
import { jsPDF } from "jspdf";
import { prisma } from "@/lib/prisma";

export type MembershipCertificateRole =
  | "boxer"
  | "coach"
  | "academy"
  | "referee_judge";

export async function ensureActiveMemberCertificate(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      registrationStatus: true,
      membershipId: true,
      membershipValidFrom: true,
      membershipExpiry: true,
      membershipActivatedAt: true,
      createdAt: true,
      boxer: { select: { id: true, name: true } },
      coach: { select: { id: true, name: true } },
      academy: { select: { id: true, name: true } },
      refereeJudge: { select: { id: true, name: true } },
    },
  });

  if (
    !user ||
    user.registrationStatus !== "ACTIVE" ||
    !user.membershipId ||
    !user.membershipExpiry
  ) {
    return null;
  }

  const role = user.role.toLowerCase();
  if (
    role !== "boxer" &&
    role !== "coach" &&
    role !== "academy" &&
    role !== "referee_judge"
  ) {
    return null;
  }

  const memberName =
    user.boxer?.name ||
    user.coach?.name ||
    user.academy?.name ||
    user.refereeJudge?.name ||
    user.email;

  const certificate = await prisma.$transaction((tx) =>
    issueMembershipCertificate(tx, {
      userId: user.id,
      boxerId: user.boxer?.id,
      coachId: user.coach?.id,
      refereeJudgeId: user.refereeJudge?.id,
      membershipId: user.membershipId!,
      memberName,
      role,
      issuedAt:
        user.membershipActivatedAt ||
        user.membershipValidFrom ||
        user.createdAt,
      membershipExpiresAt: user.membershipExpiry!,
    })
  );

  const emailResult = await sendMembershipCertificateEmailOnce(
    certificate.id,
    user.email,
    certificate
  );
  if (emailResult.error) {
    console.error("Automatic membership certificate email failed.", {
      userId: user.id,
      certificateId: certificate.id,
      error: emailResult.error,
    });
  }

  return certificate;
}

type CertificateRecord = {
  id: number;
  type: string;
  event: string;
  issuedAt: Date;
  qrStatus: string;
  membershipId: string | null;
  memberName: string | null;
  membershipRole: string | null;
  membershipExpiresAt: Date | null;
};

type CertificateEmailFailureKind =
  | "configuration"
  | "authentication"
  | "delivery";

export class CertificateEmailError extends Error {
  constructor(readonly kind: CertificateEmailFailureKind) {
    super(getCertificateEmailFailureMessage(kind));
    this.name = "CertificateEmailError";
  }
}

export function getCertificateEmailFailureMessage(
  kind: CertificateEmailFailureKind
) {
  if (kind === "configuration") {
    return "Certificate email is not configured. Please contact the association; you can still download the certificate from your dashboard.";
  }

  if (kind === "authentication") {
    return "We couldn't email your certificate right now. Your certificate is ready to download from your dashboard. Please try emailing it again later.";
  }

  return "We couldn't email your certificate right now. Your certificate is ready to download from your dashboard. Please try again later.";
}

export async function sendMembershipCertificateEmailOnce(
  certificateId: number,
  email: string,
  certificate: CertificateRecord
) {
  const claim = await prisma.certificate.updateMany({
    where: {
      id: certificateId,
      membershipEmailAttemptedAt: null,
      membershipEmailSentAt: null,
    },
    data: {
      membershipEmailAttemptedAt: new Date(),
    },
  });

  if (claim.count === 0) {
    const deliveryStatus = await prisma.certificate.findUnique({
      where: { id: certificateId },
      select: {
        membershipEmailAttemptedAt: true,
        membershipEmailSentAt: true,
      },
    });
    if (deliveryStatus?.membershipEmailSentAt) {
      return { sent: true, error: null };
    }
    return {
      sent: false,
      error: deliveryStatus?.membershipEmailAttemptedAt
        ? getCertificateEmailFailureMessage("delivery")
        : null,
    };
  }

  try {
    await emailMembershipCertificate(email, certificate);
    await prisma.certificate.update({
      where: { id: certificateId },
      data: { membershipEmailSentAt: new Date() },
    });
    return { sent: true, error: null };
  } catch (error) {
    if (error instanceof CertificateEmailError) {
      return {
        sent: false,
        error: getCertificateEmailFailureMessage(error.kind),
      };
    }

    console.error("Automatic membership certificate email failed.", {
      certificateId,
      error,
    });
    return {
      sent: false,
      error: getCertificateEmailFailureMessage("delivery"),
    };
  }
}

export async function issueMembershipCertificate(
  tx: Prisma.TransactionClient,
  input: {
    userId: number;
    boxerId?: number | null;
    coachId?: number | null;
    refereeJudgeId?: number | null;
    membershipId: string;
    memberName: string;
    role: MembershipCertificateRole;
    issuedAt: Date;
    membershipExpiresAt: Date;
  }
) {
  const { membershipId } = input;
  return tx.certificate.upsert({
    where: { membershipId },
    update: {},
    create: {
      userId: input.userId,
      boxerId: input.boxerId ?? null,
      coachId: input.coachId ?? null,
      refereeJudgeId: input.refereeJudgeId ?? null,
      membershipId,
      memberName: input.memberName,
      membershipRole: input.role,
      membershipExpiresAt: input.membershipExpiresAt,
      type: "Membership Certificate",
      event: `Mumbai Boxing Association Membership ${input.issuedAt.getFullYear()}-${input.membershipExpiresAt.getFullYear()}`,
      issuedAt: input.issuedAt,
      qrStatus: "verified",
    },
    select: {
      id: true,
      type: true,
      event: true,
      issuedAt: true,
      qrStatus: true,
      membershipId: true,
      memberName: true,
      membershipRole: true,
      membershipExpiresAt: true,
    },
  });
}

export function createCertificatePdf(certificate: CertificateRecord) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  const center = width / 2;
  const isMembershipCertificate =
    Boolean(certificate.membershipId) ||
    certificate.type.toLowerCase().includes("membership");
  const dateLabel = (value: Date | null) =>
    value
      ? new Intl.DateTimeFormat("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(value)
      : "—";

  pdf.setFillColor(250, 250, 248);
  pdf.rect(0, 0, width, height, "F");
  pdf.setDrawColor(185, 28, 28);
  pdf.setLineWidth(3);
  pdf.roundedRect(28, 28, width - 56, height - 56, 14, 14, "S");
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(40, 40, width - 80, height - 80, 10, 10, "S");

  pdf.setTextColor(185, 28, 28);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("MUMBAI BOXING ASSOCIATION", center, 104, { align: "center" });

  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(31);
  pdf.text(
    isMembershipCertificate
      ? "MEMBERSHIP CERTIFICATE"
      : certificate.type.toUpperCase(),
    center,
    164,
    { align: "center", maxWidth: width - 120 }
  );

  pdf.setTextColor(71, 85, 105);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text("This certifies that", center, 211, { align: "center" });

  pdf.setTextColor(30, 41, 59);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(27);
  pdf.text(certificate.memberName || "Member", center, 258, {
    align: "center",
    maxWidth: width - 160,
  });

  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(1.2);
  pdf.line(center - 155, 274, center + 155, 274);

  pdf.setTextColor(71, 85, 105);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text(
    isMembershipCertificate
      ? `is registered as a ${certificate.membershipRole?.replace("_", " ") || "member"} of the Mumbai Boxing Association.`
      : `has been awarded this certificate for ${certificate.event || certificate.type}.`,
    center,
    310,
    { align: "center", maxWidth: width - 150 }
  );

  if (isMembershipCertificate) {
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(`Membership ID: ${certificate.membershipId || "—"}`, center, 356, {
      align: "center",
    });
  } else {
    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(certificate.event || certificate.type, center, 356, {
      align: "center",
      maxWidth: width - 140,
    });
  }

  pdf.setTextColor(71, 85, 105);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(
    isMembershipCertificate
      ? `Issued ${dateLabel(certificate.issuedAt)}   |   Valid until ${dateLabel(certificate.membershipExpiresAt)}`
      : `Issued ${dateLabel(certificate.issuedAt)}`,
    center,
    383,
    { align: "center" }
  );

  pdf.setDrawColor(148, 163, 184);
  pdf.line(86, height - 112, 242, height - 112);
  pdf.line(width - 242, height - 112, width - 86, height - 112);
  pdf.setFontSize(10);
  pdf.text("Authorized Association Representative", 164, height - 92, {
    align: "center",
  });
  pdf.text(
    `Certificate No. MBA-CERT-${String(certificate.id).padStart(6, "0")}`,
    center,
    height - 65,
    { align: "center" }
  );
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(185, 28, 28);
  pdf.text("MUMBAI BOXING ASSOCIATION", width - 164, height - 92, {
    align: "center",
  });

  return Buffer.from(pdf.output("arraybuffer"));
}

export async function emailMembershipCertificate(
  email: string,
  certificate: CertificateRecord
) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const configuredPass = process.env.SMTP_PASS?.trim();
  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    user;

  if (!host || !user || !configuredPass || !from) {
    throw new CertificateEmailError("configuration");
  }

  const normalizedHost = host.toLowerCase();
  const pass =
    normalizedHost === "smtp.gmail.com" ||
    normalizedHost === "smtp.googlemail.com"
      ? configuredPass.replace(/\s/g, "")
      : configuredPass;

  const pdf = createCertificatePdf(certificate);
  const transporter = createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Your Mumbai Boxing Association membership certificate",
      text: `Hello ${certificate.memberName || "Member"},\n\nYour Mumbai Boxing Association membership certificate is attached. You can also download it from your member dashboard.\n\nMembership ID: ${certificate.membershipId || "—"}\nValid until: ${certificate.membershipExpiresAt?.toLocaleDateString("en-IN") || "—"}\n`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
          <h2 style="color:#b91c1c">Mumbai Boxing Association</h2>
          <p>Hello ${escapeHtml(certificate.memberName || "Member")},</p>
          <p>Your membership is active. Your official membership certificate is attached as a PDF.</p>
          <p><strong>Membership ID:</strong> ${escapeHtml(certificate.membershipId || "—")}<br />
          <strong>Valid until:</strong> ${escapeHtml(certificate.membershipExpiresAt?.toLocaleDateString("en-IN") || "—")}</p>
          <p>You can download it again anytime from your member dashboard.</p>
        </div>
      `,
      attachments: [
        {
          filename: `MBA-CERT-${String(certificate.id).padStart(6, "0")}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    const smtpError =
      typeof error === "object" && error !== null
        ? (error as {
            code?: unknown;
            responseCode?: unknown;
            command?: unknown;
          })
        : {};
    const authenticationFailed =
      smtpError.code === "EAUTH" || smtpError.responseCode === 535;

    console.error("Membership certificate SMTP delivery failed.", {
      code:
        typeof smtpError.code === "string"
          ? smtpError.code
          : undefined,
      responseCode:
        typeof smtpError.responseCode === "number"
          ? smtpError.responseCode
          : undefined,
      command:
        typeof smtpError.command === "string"
          ? smtpError.command
          : undefined,
    });

    throw new CertificateEmailError(
      authenticationFailed ? "authentication" : "delivery"
    );
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
