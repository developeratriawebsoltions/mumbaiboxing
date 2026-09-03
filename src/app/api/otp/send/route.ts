import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { setOtp } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const otp = `${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    // Always store OTP first.
    setOtp(normalizedEmail, otp);

    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    const from =
      process.env.SMTP_FROM?.trim() ||
      process.env.EMAIL_FROM?.trim() ||
      "noreply@example.com";

    const hasSmtp = Boolean(host && user && pass);

    // Development fallback:
    // If SMTP isn't configured, expose the OTP for local testing.
    if (!hasSmtp) {
      console.info(`[OTP DEV] ${normalizedEmail}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: "OTP generated for local testing.",
        devOtp: otp,
      });
    }

    try {
      const transporter = createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: normalizedEmail,
        subject: "Your Mumbai Boxing Association OTP",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Mumbai Boxing Association</h2>
            <p>Your OTP for registration is:</p>
            <h1 style="letter-spacing: 6px;">${otp}</h1>
            <p>This OTP expires in 5 minutes.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully.",
      });
    } catch (smtpError) {
      console.error("SMTP OTP send failed:", smtpError);

      // NEVER expose OTP in production.
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[OTP DEV FALLBACK] ${normalizedEmail}: ${otp}`
        );

        return NextResponse.json({
          success: true,
          message: "Email unavailable. OTP generated for local testing.",
          devOtp: otp,
          emailDeliveryFailed: true,
        });
      }

      return NextResponse.json(
        { error: "Unable to send OTP right now." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("OTP send failed:", error);

    return NextResponse.json(
      { error: "Unable to send OTP right now." },
      { status: 500 }
    );
  }
}