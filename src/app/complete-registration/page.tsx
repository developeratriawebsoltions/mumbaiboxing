"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type PaymentOrder = {
  orderId: string;
  amount: number;
  currency: string;
  role: string;
};

function CompleteRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTournamentId = Number(searchParams.get("tournamentId"));
  const tournamentId =
    Number.isInteger(requestedTournamentId) && requestedTournamentId > 0
      ? requestedTournamentId
      : null;
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => setError("Payment service could not be loaded. Please refresh and try again.");
    document.body.appendChild(script);
  }, []);

  async function startPayment() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const order: PaymentOrder & { error?: string } = await response.json();
      if (!response.ok) {
        setError(order.error || "Unable to create a payment order.");
        setLoading(false);
        return;
      }
      const RazorpayCheckout = window.Razorpay;
      if (!RazorpayCheckout) {
        setError("Payment service is still loading. Please try again.");
        setLoading(false);
        return;
      }

      const checkout = new RazorpayCheckout({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Mumbai Boxing Association",
        description: `Annual Membership Fee – ${order.role}`,
        order_id: order.orderId,
        theme: { color: "#DC2626" },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (payment: RazorpayResponse) => {
          try {
            const verification = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            });
            const result = await verification.json();
            if (!verification.ok) {
              setError(result.error || "Payment verification failed. Contact support if money was deducted.");
              return;
            }
            setPaymentDone(true);
          } catch {
            setError("Payment verification failed. Contact support if money was deducted.");
          } finally {
            setLoading(false);
          }
        },
      });
      checkout.open();
    } catch {
      setError("Unable to start payment. Please try again.");
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
        {paymentDone ? (
          <>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              Membership activated
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your payment is verified and your membership is active. Sign in
              to open your dashboard.
            </p>
            <button
              type="button"
              onClick={() =>
                router.replace(
                  tournamentId
                    ? `/login?tournamentId=${tournamentId}`
                    : "/login"
                )
              }
              className="mt-7 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500"
            >
              Continue to sign in
            </button>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
              Complete your membership
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your account is saved, but membership payment is still pending.
              Complete the payment to activate your account. You can safely
              return here if you need to retry.
            </p>
            <button
              type="button"
              onClick={startPayment}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Preparing payment..." : "Pay membership fee"}
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
