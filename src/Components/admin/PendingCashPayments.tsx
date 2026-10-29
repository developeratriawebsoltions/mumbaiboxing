"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

type PendingPayment = {
  id: number;
  amount: number;
  createdAt: string;
  name: string;
  email: string;
  role: string;
  paymentType: "membership" | "tournament";
  tournamentName?: string;
  receiptRetry?: boolean;
};

export default function PendingCashPayments() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [paymentToConfirm, setPaymentToConfirm] =
    useState<PendingPayment | null>(null);

  const fetchPayments = useCallback(async () => {
    const response = await fetch("/api/admin/offline-payments", {
      credentials: "include",
      cache: "no-store",
    });
    const data: { payments: PendingPayment[]; error?: string } =
      await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not load cash payment requests.");
    }

    return data.payments;
  }, []);

  useEffect(() => {
    let active = true;

    fetchPayments()
      .then((result) => {
        if (active) setPayments(result);
      })
      .catch((loadError: unknown) => {
        console.error(loadError);
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load cash payment requests."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchPayments]);

  async function confirmCashReceived(payment: PendingPayment) {
    setProcessingId(payment.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/offline-payments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id }),
      });
      const data: {
        error?: string;
        receiptEmailSent?: boolean;
        emailError?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not confirm cash payment.");
      }

      if (payment.paymentType === "tournament" && !data.receiptEmailSent) {
        setNoticeIsError(true);
        setNotice(
          data.emailError ||
            "Payment was approved, but the receipt email could not be sent. Retry it from this page.",
        );
      } else {
        setPayments((current) =>
          current.filter((item) => item.id !== payment.id)
        );
        setNoticeIsError(false);
        setNotice(
          payment.paymentType === "tournament"
            ? `Cash payment confirmed for ${payment.tournamentName}. Receipt emailed to ${payment.email}.`
            : `${payment.name}'s membership is active; they can now log in.`,
        );
      }
      setPaymentToConfirm(null);
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not confirm cash payment."
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Offline Payments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Confirm cash only after receiving it. Membership cash payments activate accounts; tournament cash payments confirm event registrations and send a receipt by email.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError("");
            fetchPayments()
              .then(setPayments)
              .catch((loadError: unknown) => {
                console.error(loadError);
                setError(
                  loadError instanceof Error
                    ? loadError.message
                    : "Could not load cash payment requests."
                );
              })
              .finally(() => setLoading(false));
          }}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="m-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:mx-6">
          {error}
        </p>
      )}
      {notice && (
        <p role={noticeIsError ? "alert" : "status"} className={`m-5 rounded-xl p-3 text-sm sm:mx-6 ${noticeIsError ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-700"}`}>
          {notice}
        </p>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading payment requests...
        </div>
      ) : payments.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
          <p className="mt-3 text-sm font-semibold text-slate-800">
            No cash payments awaiting confirmation
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {payment.name}
                </p>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {payment.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    {payment.paymentType === "tournament"
                      ? payment.tournamentName
                      : `${payment.role.replaceAll("_", " ")} membership`}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee size={13} />
                    {payment.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} />
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(new Date(payment.createdAt))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked="false"
                aria-label={
                  payment.receiptRetry
                    ? `Retry receipt email for ${payment.name}`
                    : `Confirm cash received from ${payment.name}`
                }
                disabled={processingId !== null}
                onClick={() => setPaymentToConfirm(payment)}
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
              >
                <span className="relative h-5 w-9 rounded-full bg-white/30">
                  <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                </span>
                {processingId === payment.id
                  ? payment.receiptRetry
                    ? "Sending receipt..."
                    : "Confirming..."
                  : payment.receiptRetry
                    ? "Retry receipt email"
                    : "Cash received"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {paymentToConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && processingId === null) {
              setPaymentToConfirm(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && processingId === null) {
              setPaymentToConfirm(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cash-confirm-title"
            aria-describedby="cash-confirm-description"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.35)]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 pb-7 pt-6 text-white sm:px-8">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
              />
              <button
                type="button"
                onClick={() => setPaymentToConfirm(null)}
                disabled={processingId !== null}
                aria-label="Close confirmation"
                className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/15 text-emerald-300 shadow-inner">
                <ShieldCheck size={29} />
              </div>
              <p className="relative mt-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                Admin confirmation
              </p>
              <h3
                id="cash-confirm-title"
                className="relative mt-2 text-2xl font-black tracking-tight"
              >
                {paymentToConfirm.receiptRetry
                  ? "Retry receipt email?"
                  : "Confirm cash received?"}
              </h3>
              <p
                id="cash-confirm-description"
                className="relative mt-2 max-w-sm text-sm leading-6 text-slate-300"
              >
                {paymentToConfirm.receiptRetry
                  ? "This cash payment is already approved. Retry sending its receipt to the email address below."
                  : "Confirm only after the association has physically received the full payment."}
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {paymentToConfirm.name}
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {paymentToConfirm.email}
                    </p>
                    <p className="mt-2 text-xs font-semibold capitalize text-slate-500">
                      {paymentToConfirm.paymentType === "tournament"
                        ? paymentToConfirm.tournamentName
                        : `${paymentToConfirm.role.replaceAll("_", " ")} membership`}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-slate-200">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </p>
                    <p className="mt-0.5 inline-flex items-center text-lg font-black text-slate-900">
                      <IndianRupee size={16} />
                      {paymentToConfirm.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <AlertTriangle
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-amber-600"
                />
                <p className="text-xs leading-5 text-amber-900">
                  {paymentToConfirm.receiptRetry
                    ? "Retrying sends the receipt email again; it will not create another tournament registration."
                    : paymentToConfirm.paymentType === "tournament"
                      ? "Confirming marks the payment as paid, confirms this tournament registration, and emails a PDF receipt."
                      : "Confirming marks the payment as paid, activates the membership, and enables this member to log in."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentToConfirm(null)}
                  disabled={processingId !== null}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmCashReceived(paymentToConfirm)}
                  disabled={processingId !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />
                  {processingId === paymentToConfirm.id
                    ? paymentToConfirm.receiptRetry
                      ? "Sending..."
                      : "Confirming..."
                    : paymentToConfirm.receiptRetry
                      ? "Retry receipt email"
                      : "Confirm receipt"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
