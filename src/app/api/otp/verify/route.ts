import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const isValid = verifyOtp(email.toLowerCase(), otp);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP verify failed", error);
    return NextResponse.json({ error: "Unable to verify OTP right now." }, { status: 500 });
  }
}
