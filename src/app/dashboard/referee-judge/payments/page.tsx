"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  IndianRupee,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type PaymentItem = {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentGateway: string | null;
  transactionId: string | null;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
};

type DashboardData = {
  success: boolean;

  user: {
    id: number;
    email: string;
    role: string;
    registrationStatus: string;
  };

  membership: {
    id: string | null;
    validFrom: string | null;
    expiry: string | null;
    activatedAt: string | null;
    active: boolean;
  };

  payments: PaymentItem[];
};

/* =========================================================
   PAGE
   ========================================================= */

export default function RefereeJudgePaymentsPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/referee-judge",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Failed to load your payment receipts."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load payment receipts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  /* =======================================================
     FORMAT DATE
     ======================================================= */

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =======================================================
     FORMAT DATE + TIME
     ======================================================= */

  const formatDateTime = (
    value: string | null | undefined
  ) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /* =======================================================
     FORMAT AMOUNT
     ======================================================= */

  const formatAmount = (
    amount: number | null | undefined
  ) => {
    const value = Number(amount || 0);

    return `₹${value.toLocaleString("en-IN")}`;
  };

  /* =======================================================
     PAYMENTS
     ======================================================= */

  const payments = useMemo(
    () => data?.payments ?? [],
    [data]
  );

  /* =======================================================
     TOTAL PAID
     ======================================================= */

  const totalPaid = useMemo(() => {
    return payments
      .filter((payment) => {
        const status =
          payment.status.toLowerCase();

        return (
          status === "paid" ||
          status === "success" ||
          status === "successful" ||
          status === "completed"
        );
      })
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );
  }, [payments]);

  /* =======================================================
     SUCCESSFUL PAYMENTS
     ======================================================= */

  const successfulPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status =
        payment.status.toLowerCase();

      return (
        status === "paid" ||
        status === "success" ||
        status === "successful" ||
        status === "completed"
      );
    });
  }, [payments]);

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div
              className="
                w-10
                h-10
                border-4
                border-slate-200
                border-t-red-600
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your payment receipts...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error || !data) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-600
            "
          >
            {error ||
              "Unable to load payment receipts."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     MAIN
     ======================================================= */

  return (
    <DashboardLayout role="referee_judge">
      <div className="max-w-[1500px] mx-auto space-y-7 text-slate-900">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            justify-between
            gap-4
          "
        >
          <div>
            <Link
              href="/dashboard/referee-judge"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-500
                hover:text-red-600
                transition-colors
                mb-4
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1
              className="
                text-3xl
                sm:text-[38px]
                font-extrabold
                tracking-tight
                text-[#0b1729]
              "
            >
              Payment Receipts
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              View your MBA membership payment history
              and receipts
            </p>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-red-50
              px-4
              py-2
              text-sm
              font-semibold
              text-red-600
              w-fit
            "
          >
            <ReceiptText size={17} />
            Payments
          </span>
        </div>

        {/* ==================================================
            SUMMARY
            ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >
          <SummaryCard
            icon={<IndianRupee size={21} />}
            title={formatAmount(totalPaid)}
            label="Total Paid"
            description="Successful payments"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            icon={<ReceiptText size={21} />}
            title={String(successfulPayments.length)}
            label="Successful Payments"
            description="Completed transactions"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<CreditCard size={21} />}
            title={String(payments.length)}
            label="Payment Records"
            description="All payment attempts"
            iconClass="bg-violet-50 text-violet-600"
          />

          <SummaryCard
            icon={<ShieldCheck size={21} />}
            title={data.membership.active ? "Active" : "Inactive"}
            label="Membership"
            description={
              data.membership.expiry
                ? `Valid until ${formatDate(
                    data.membership.expiry
                  )}`
                : "Membership status"
            }
            iconClass={
              data.membership.active
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-50 text-slate-500"
            }
          />
        </div>

        {/* ==================================================
            MEMBERSHIP PAYMENT
            ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-100
            bg-white
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              justify-between
              gap-5
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-red-50
                  text-red-600
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <WalletCards size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Referee / Judge Membership
                </p>

                <h2
                  className="
                    mt-1
                    text-xl
                    font-bold
                    text-[#0b1729]
                  "
                >
                  Membership Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your membership payment and validity
                  information
                </p>
              </div>
            </div>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                gap-4
              "
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Membership ID
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {data.membership.id || "—"}
                </p>
              </div>

              <div
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-bold
                  w-fit
                  ${
                    data.membership.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
              >
                <CheckCircle2 size={15} />

                {data.membership.active
                  ? "Active Membership"
                  : "Inactive Membership"}
              </div>
            </div>
          </div>

          <div
            className="
              mt-6
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-4
            "
          >
            <MembershipInfo
              label="Valid From"
              value={formatDate(
                data.membership.validFrom
              )}
            />

            <MembershipInfo
              label="Expiry Date"
              value={formatDate(
                data.membership.expiry
              )}
            />

            <MembershipInfo
              label="Activated"
              value={formatDate(
                data.membership.activatedAt
              )}
            />
          </div>
        </section>

        {/* ==================================================
            PAYMENT HISTORY
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <ReceiptText size={21} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0b1729]
                "
              >
                Payment History
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Your membership payment records
              </p>
            </div>
          </div>

          {payments.length === 0 ? (
            <EmptyPayments />
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  formatAmount={formatAmount}
                />
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            FOOTER
            ================================================== */}

        <div className="flex justify-start">
          <Link
            href="/dashboard/referee-judge"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#ed1c24]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              hover:bg-[#d71920]
              transition-colors
            "
          >
            Back to Dashboard
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   PAYMENT CARD
   ========================================================= */

function PaymentCard({
  payment,
  formatDate,
  formatDateTime,
  formatAmount,
}: {
  payment: PaymentItem;
  formatDate: (
    value: string | null | undefined
  ) => string;
  formatDateTime: (
    value: string | null | undefined
  ) => string;
  formatAmount: (
    value: number | null | undefined
  ) => string;
}) {
  const normalizedStatus =
    payment.status.toLowerCase();

  const isSuccessful =
    normalizedStatus === "paid" ||
    normalizedStatus === "success" ||
    normalizedStatus === "successful" ||
    normalizedStatus === "completed";

  const isFailed =
    normalizedStatus === "failed" ||
    normalizedStatus === "failure" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled";

  const statusLabel = isSuccessful
    ? "Paid"
    : isFailed
      ? "Failed"
      : payment.status || "Pending";

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-5
        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          gap-5
        "
      >
        {/* Icon */}

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-slate-50
            text-slate-600
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <ReceiptText
            size={27}
            strokeWidth={1.7}
          />
        </div>

        {/* Main */}

        <div className="flex-1 min-w-0">
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              gap-2
            "
          >
            <h3 className="text-lg font-bold text-[#0b1729]">
              MBA Membership Payment
            </h3>

            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                w-fit
                ${
                  isSuccessful
                    ? "bg-emerald-50 text-emerald-700"
                    : isFailed
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                }
              `}
            >
              {isSuccessful ? (
                <CheckCircle2 size={13} />
              ) : (
                <ClockIcon />
              )}

              {statusLabel}
            </span>
          </div>

          <div
            className="
              mt-4
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-7
              gap-y-4
            "
          >
            <InfoItem
              icon={<IndianRupee size={16} />}
              label="Amount"
              value={formatAmount(payment.amount)}
            />

            <InfoItem
              icon={<CalendarDays size={16} />}
              label="Payment Date"
              value={formatDate(
                payment.paidAt ||
                  payment.createdAt
              )}
            />

            <InfoItem
              icon={<CreditCard size={16} />}
              label="Payment Method"
              value={
                payment.paymentMethod ||
                payment.paymentGateway ||
                "Online Payment"
              }
            />

            <InfoItem
              icon={<FileText size={16} />}
              label="Invoice"
              value={
                payment.invoiceNumber || "—"
              }
            />
          </div>

          <div
            className="
              mt-4
              pt-4
              border-t
              border-slate-100
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >
            <InfoItem
              icon={<ReceiptText size={15} />}
              label="Transaction"
              value={maskIdentifier(
                payment.transactionId
              )}
            />

            <InfoItem
              icon={<CalendarDays size={15} />}
              label="Recorded"
              value={formatDateTime(
                payment.createdAt
              )}
            />
          </div>
        </div>

        {/* Receipt */}

        {payment.invoiceUrl && (
          <div className="shrink-0">
            <a
              href={payment.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-700
                hover:border-red-200
                hover:text-red-600
                transition-colors
              "
            >
              <Download size={17} />
              Receipt
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  icon,
  title,
  label,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-100
        shadow-sm
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-extrabold text-[#0b1729]">
            {title}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MEMBERSHIP INFO
   ========================================================= */

function MembershipInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-slate-50
        border
        border-slate-100
        px-4
        py-4
      "
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   INFO ITEM
   ========================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <div
        className="
          mt-0.5
          text-slate-400
          shrink-0
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyPayments() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-slate-200
        bg-slate-50/50
        px-6
        py-14
        text-center
      "
    >
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-white
          border
          border-slate-100
          text-slate-300
          flex
          items-center
          justify-center
          mx-auto
        "
      >
        <ReceiptText
          size={32}
          strokeWidth={1.5}
        />
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-bold
          text-slate-800
        "
      >
        No payment records
      </h3>

      <p
        className="
          mt-2
          max-w-md
          mx-auto
          text-sm
          leading-6
          text-slate-500
        "
      >
        Your MBA membership payment records will
        appear here after a payment is processed.
      </p>
    </div>
  );
}

/* =========================================================
   SMALL ICON
   ========================================================= */

function ClockIcon() {
  return <span className="inline-block w-3 h-3 rounded-full border-2 border-current" />;
}

/* =========================================================
   MASK IDENTIFIER
   ========================================================= */

function maskIdentifier(
  value: string | null | undefined
) {
  if (!value) return "—";

  if (value.length <= 8) {
    return value;
  }

  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}