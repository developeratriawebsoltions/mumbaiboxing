"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CompleteRegistrationForm() {
  const searchParams = useSearchParams();
  const requestedTournamentId = Number(searchParams.get("tournamentId"));
  const tournamentId =
    Number.isInteger(requestedTournamentId) && requestedTournamentId > 0
      ? requestedTournamentId
      : null;
  const [loading, setLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function requestCashPayment() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/offline-request", {
        method: "POST",
        credentials: "include",
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your cash payment request.");
      }
      setRequestSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your cash payment request."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          Mumbai Boxing Association
        </p>
        {tournamentId && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-bold text-slate-900">
              Tournament entry is waiting
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Activate your membership first. After sign-in, you’ll return to
              this event to complete registration.
            </p>
            <Link
              href={`/events/${tournamentId}`}
              className="mt-2 inline-flex text-xs font-semibold text-red-600 hover:underline"
            >
              Review event details
            </Link>
          </div>
        )}
        {requestSubmitted ? (
          <>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              Cash payment request submitted
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Pay your membership fee in cash to the Mumbai Boxing
              Association. An administrator or super administrator will
              activate your account after confirming receipt.
            </p>
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Login is disabled until the association confirms your cash
              payment.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Return to home
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              Complete your membership
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your registration is saved, but your membership is inactive.
              Submit a cash payment request and pay the fee to the association.
              Login will be enabled after an administrator confirms receipt.
            </p>
            <button
              type="button"
              onClick={requestCashPayment}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting request..." : "Request cash payment"}
            </button>
            <Link
              href={
                tournamentId
                  ? `/login?tournamentId=${tournamentId}`
                  : "/login"
              }
              className="mt-5 inline-block text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              Back to sign in
            </Link>
            {!tournamentId && (
              <Link
                href="/events"
                className="ml-5 inline-block text-sm font-semibold text-red-600 hover:underline"
              >
                Browse events
              </Link>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <CompleteRegistrationForm />
    </Suspense>
  );
}
