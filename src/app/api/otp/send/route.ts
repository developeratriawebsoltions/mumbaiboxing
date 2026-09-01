import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { setOtp } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    setOtp(normalizedEmail, otp);

    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();
    const from = process.env.SMTP_FROM?.trim() || process.env.EMAIL_FROM?.trim() || "noreply@example.com";
    const hasSmtp = Boolean(host && user && pass);

    if (hasSmtp) {
      const transporter = createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user, pass },
      });

      await transporter.sendMail({
        from,
        to: normalizedEmail,
        subject: "Your Mumbai Boxing Association OTP",
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
      });
    } else {
      console.info(`[OTP] ${normalizedEmail}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: hasSmtp ? "OTP sent successfully." : "OTP generated for local testing.",
      ...(process.env.NODE_ENV !== "production" && !hasSmtp ? { devOtp: otp } : {}),
    });
  } catch (error) {
    console.error("OTP send failed", error);
    return NextResponse.json({ error: "Unable to send OTP right now." }, { status: 500 });
  }
}
