// In-memory OTP store: email -> { otp, expiresAt }
export const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const OTP_TTL_MS = 5 * 60 * 1000;

export function setOtp(email: string, otp: string) {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

export function verifyOtp(email: string, otp: string) {
  const normalizedEmail = email.toLowerCase();
  const entry = otpStore.get(normalizedEmail);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return false;
  }

  const isMatch = entry.otp === otp;
  if (isMatch) otpStore.delete(normalizedEmail);
  return isMatch;
}
