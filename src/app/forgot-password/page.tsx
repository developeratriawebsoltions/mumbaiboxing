"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const requestedTournamentId = Number(searchParams.get("tournamentId"));
  const tournamentId =
    Number.isInteger(requestedTournamentId) && requestedTournamentId > 0
      ? requestedTournamentId
      : null;
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password-reset" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send a verification code.");
        return;
      }

      setCodeSent(true);
      if (data.devOtp) setOtp(data.devOtp);
      setMessage(
        data.devOtp
          ? "Local development code generated."
          : "If an account uses this email, a verification code has been sent."
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset your password.");
        return;
      }

      setCodeSent(false);
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setMessage(data.message);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          North Bombay District Amateur Boxing Association (NBDABA)
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Verify your email to set a new password for your account.
        </p>

        {!codeSent ? (
          <form onSubmit={requestCode} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-red-500"
                placeholder="you@example.com"
              />
            </label>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">
              Verification code requested for <strong>{email}</strong>.
            </p>
            <label className="block text-sm font-semibold text-slate-700">
              6-digit verification code
              <input
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 tracking-[0.3em] outline-none focus:border-red-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              New password
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Confirm new password
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-500"
              />
            </label>
            <button
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setError("");
                setMessage("");
              }}
              className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Use a different email address
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <Link
          href={
            tournamentId
              ? `/login?tournamentId=${tournamentId}`
              : "/login"
          }
          className="mt-6 inline-block text-sm font-semibold text-red-600 hover:underline"
        >
          Back to sign in
        </Link>
        {!tournamentId && (
          <Link
            href="/events"
            className="ml-5 mt-6 inline-block text-sm font-semibold text-slate-500 hover:text-red-600"
          >
            Browse events
          </Link>
        )}
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
