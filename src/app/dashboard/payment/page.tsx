
"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Home,
  Loader2,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
  X,
  AlertTriangle,
} from "lucide-react";

type Payment = {
  id: number;
  type: string;
  amount: number;
  method: string | null;
  status: string;
  createdAt: string;
  membershipExpiry: string | null;
};

type PaymentFilter = "All" | "Paid" | "Pending";

const PAGE_SIZE = 8;

const money = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatLongDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const receiptNumber = (id: number) =>
  `PAY-${String(id).padStart(3, "0")}`;

const isPaid = (status: string) =>
  status.toLowerCase() === "paid";

const isPending = (status: string) =>
  status.toLowerCase() === "pending";

/* =====================================================
   PDF RECEIPT — PRESERVED FUNCTIONALITY
===================================================== */

async function downloadReceipt(
  payment: Payment,
  userName: string
) {
  if (!isPaid(payment.status)) return;

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const W = doc.internal.pageSize.getWidth();
  const receipt = receiptNumber(payment.id);

  // Header
  doc.setFillColor(7, 20, 38);
  doc.rect(0, 0, W, 115, "F");

  doc.setFillColor(235, 22, 39);
  doc.rect(0, 110, W, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("MUMBAI BOXING ASSOCIATION", W / 2, 43, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(200, 210, 222);
  doc.text("OFFICIAL PAYMENT RECEIPT", W / 2, 66, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text(receipt, W / 2, 88, {
    align: "center",
  });

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Payment Confirmation", 45, 160);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for your payment.", 45, 180);

  // Paid badge
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(W - 133, 145, 87, 27, 8, 8, "F");
  doc.setTextColor(21, 128, 61);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PAID", W - 89, 162, {
    align: "center",
  });

  const rows = [
    ["Receipt Number", receipt],
    ["Member Name", userName],
    ["Fee Type", payment.type],
    ["Amount Paid", `Rs. ${payment.amount.toLocaleString("en-IN")}`],
    ["Payment Method", payment.method ?? "—"],
    ["Payment Date", formatLongDate(payment.createdAt)],
    ["Payment Status", payment.status],
  ];

  let y = 215;

  rows.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(40, y - 17, W - 80, 34, 4, 4, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(label, 55, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(String(value), 230, y + 4);

    y += 40;
  });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(40, y + 24, W - 40, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);

  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    W / 2,
    y + 45,
    { align: "center" }
  );

  doc.text(
    "Mumbai Boxing Association | mumbaiboxing.in",
    W / 2,
    y + 60,
    { align: "center" }
  );

  doc.save(`MBA-Receipt-${receipt}.pdf`);
}

/* =====================================================
   MAIN PAYMENT DASHBOARD
===================================================== */

export default function PaymentDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("Member");
  const [membershipExpiry, setMembershipExpiry] = useState<
    string | null
  >(null);

  const [filter, setFilter] = useState<PaymentFilter>("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(
    null
  );
  const [receiptError, setReceiptError] = useState("");

  async function loadPayments(initial = false) {
    try {
      if (initial) setLoading(true);
      else setRefreshing(true);

      setError("");

      const [meRes, payRes] = await Promise.all([
        fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        }),
        fetch("/api/payments", {
          cache: "no-store",
          credentials: "include",
        }),
      ]);

      if (!meRes.ok || !payRes.ok) {
        throw new Error("Unable to load payment information.");
      }

      const me = await meRes.json();
      const pay = await payRes.json();

      if (me.role) setRole(me.role);
      if (me.name) setUserName(me.name);
      else if (me.email) setUserName(me.email);

      setMembershipExpiry(me.membershipExpiry ?? null);

      if (pay?.error) {
        throw new Error(pay.error);
      }

      setPayments(Array.isArray(pay) ? pay : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load payments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPayments(true);
  }, []);

  const membership = useMemo(() => {
    if (!membershipExpiry) return null;

    const expiry = new Date(membershipExpiry);
    if (Number.isNaN(expiry.getTime())) return null;

    const daysLeft = Math.ceil(
      (expiry.getTime() - Date.now()) / 86400000
    );

    return {
      expiry,
      daysLeft,
      expired: daysLeft <= 0,
      expiringSoon: daysLeft > 0 && daysLeft <= 30,
    };
  }, [membershipExpiry]);

  const totalPaid = payments
    .filter((payment) => isPaid(payment.status))
    .reduce((total, payment) => total + payment.amount, 0);

  const totalPending = payments
    .filter((payment) => isPending(payment.status))
    .reduce((total, payment) => total + payment.amount, 0);

  const paidCount = payments.filter((p) => isPaid(p.status)).length;
  const pendingCount = payments.filter((p) =>
    isPending(p.status)
  ).length;

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments
      .filter((payment) => {
        if (filter === "Paid" && !isPaid(payment.status))
          return false;

        if (filter === "Pending" && !isPending(payment.status))
          return false;

        if (query) {
          const searchable = [
            receiptNumber(payment.id),
            payment.type,
            payment.method ?? "",
            payment.status,
            String(payment.amount),
          ]
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        const date = new Date(payment.createdAt);
        if (Number.isNaN(date.getTime())) return false;

        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`);
          if (date < start) return false;
        }

        if (endDate) {
          const end = new Date(`${endDate}T23:59:59.999`);
          if (date > end) return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [payments, filter, search, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [filter, search, startDate, endDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function handleReceipt(payment: Payment) {
    try {
      setReceiptError("");
      setDownloadingId(payment.id);
      await downloadReceipt(payment, userName);
    } catch {
      setReceiptError(
        "Unable to generate the receipt. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role={role || undefined}>
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <Loader2
            size={34}
            className="animate-spin text-red-600"
          />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading payment records...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role || undefined}>
      <div className="min-w-0 space-y-5 pb-12 sm:space-y-6">

        {/* ================= PAGE HEADER ================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Home size={14} className="text-red-600" />
              <span className="text-slate-400">
                {role === "academy" ? "Academy" : "Member"}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-red-600">
                Payment Receipts
              </span>
            </div>

            <h1 className="mt-4 text-[27px] font-black tracking-[-0.04em] text-[#101828] sm:text-[34px]">
              Payment Receipts
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {role === "coach"
                ? "Manage your coaching fee payments and receipts."
                : "Manage your fee payments, transaction history and receipts."}
            </p>
          </div>

          <button
            onClick={() => loadPayments()}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Payments
          </button>
        </div>

        {/* ================= MEMBERSHIP BANNER ================= */}

        {membership && (
          <section className="relative overflow-hidden rounded-[22px] bg-[#071426] text-white shadow-sm">
            <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-[90px]" />

            <div className="pointer-events-none absolute right-[16%] top-[-40%] hidden h-[240%] w-20 rotate-[22deg] bg-red-600/30 lg:block" />
            <div className="pointer-events-none absolute right-[12%] top-[-40%] hidden h-[240%] w-5 rotate-[22deg] bg-red-500/20 lg:block" />

            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-600/25 text-red-400 sm:h-16 sm:w-16">
                  <ReceiptText size={27} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-400">
                    Membership Overview
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                    {membership.expired
                      ? "Membership Expired"
                      : membership.expiringSoon
                        ? "Membership Expiring Soon"
                        : "Membership Active"}
                  </h2>

                  <p className="mt-1.5 text-xs text-slate-300 sm:text-sm">
                    {membership.expired
                      ? "Your membership validity has ended."
                      : membership.expiringSoon
                        ? `Your membership expires in ${membership.daysLeft} days.`
                        : "Your association membership is currently active and valid."}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-300">
                    <CalendarDays size={15} className="text-red-400" />
                    Valid until: {formatLongDate(membershipExpiry!)}
                  </div>
                </div>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
                  membership.expired
                    ? "bg-red-100 text-red-700"
                    : membership.expiringSoon
                      ? "bg-orange-100 text-orange-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {membership.expired ? (
                  <AlertTriangle size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                1-Year Membership
              </span>
            </div>
          </section>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {!error && (
          <>
            {/* ================= STATS ================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <PaymentStat
                icon={<Wallet size={25} />}
                label="Total Paid"
                value={money(totalPaid)}
                description="Total confirmed payments"
                color="green"
              />

              <PaymentStat
                icon={<Clock3 size={25} />}
                label="Pending Amount"
                value={money(totalPending)}
                description="Awaiting payment confirmation"
                color="orange"
              />

              <PaymentStat
                icon={<FileText size={25} />}
                label="Total Transactions"
                value={String(payments.length)}
                description="All fee payment transactions"
                color="blue"
              />
            </div>

            {/* ================= TRANSACTION SECTION ================= */}

            <section className="space-y-4">

              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                  Transaction History
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Review payments and download receipts for completed transactions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "All", count: payments.length },
                      { key: "Paid", count: paidCount },
                      { key: "Pending", count: pendingCount },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setFilter(item.key)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                        filter === item.key
                          ? "bg-red-600 text-white shadow-[0_5px_15px_rgba(220,38,38,0.15)]"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.key}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          filter === item.key
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                  {/* Search */}
                  <div className="relative w-full sm:w-[270px] xl:w-[310px]">
                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search receipt, fee type..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400"
                    />

                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  {/* Date filters */}
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                      <label
                        htmlFor="payment-start-date"
                        className="mb-1 block text-[10px] font-semibold text-slate-500"
                      >
                        From
                      </label>
                      <input
                        id="payment-start-date"
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(event) =>
                          setStartDate(event.target.value)
                        }
                        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-red-400"
                      />
                    </div>

                    <div className="relative min-w-0 flex-1">
                      <label
                        htmlFor="payment-end-date"
                        className="mb-1 block text-[10px] font-semibold text-slate-500"
                      >
                        To
                      </label>
                      <input
                        id="payment-end-date"
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(event) =>
                          setEndDate(event.target.value)
                        }
                        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-red-400"
                      />
                    </div>

                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                        }}
                        aria-label="Clear date filters"
                        className="mt-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Receipt error */}
              {receiptError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                  {receiptError}
                </div>
              )}

              {/* ================= TABLE ================= */}

              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">

                {filteredPayments.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <ReceiptText size={29} />
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900">
                      No Payment Records Found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      No transactions match your selected filters.
                    </p>

                    <button
                      onClick={() => {
                        setFilter("All");
                        setSearch("");
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="mt-5 text-xs font-bold text-red-600 hover:underline"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px] text-left">
                        <thead className="bg-[#f7f9fc]">
                          <tr>
                            {[
                              "Receipt #",
                              "Fee Type",
                              "Amount",
                              "Method",
                              "Date",
                              "Status",
                              "Action",
                            ].map((heading) => (
                              <th
                                key={heading}
                                className="px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {paginatedPayments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="transition-colors hover:bg-slate-50/80"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <ReceiptText size={16} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-800">
                                    {receiptNumber(payment.id)}
                                  </span>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-sm font-semibold text-slate-900">
                                  {payment.type}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-sm font-extrabold text-slate-900">
                                  {money(payment.amount)}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-xs font-medium text-slate-500">
                                  {payment.method || "—"}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-xs font-medium text-slate-500">
                                  {formatDate(payment.createdAt)}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <PaymentStatus status={payment.status} />
                              </td>

                              <td className="px-5 py-4">
                                {isPaid(payment.status) ? (
                                  <button
                                    onClick={() => handleReceipt(payment)}
                                    disabled={
                                      downloadingId === payment.id
                                    }
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#071426] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
                                  >
                                    {downloadingId === payment.id ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Download size={14} />
                                    )}
                                    {downloadingId === payment.id
                                      ? "Generating..."
                                      : "Download Receipt"}
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-100 px-4 py-2.5 text-[11px] font-semibold text-slate-400">
                                    <Download size={14} />
                                    Receipt Unavailable
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ================= PAGINATION ================= */}

                    <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-bold text-slate-700">
                          {(currentPage - 1) * PAGE_SIZE + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold text-slate-700">
                          {Math.min(
                            currentPage * PAGE_SIZE,
                            filteredPayments.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-700">
                          {filteredPayments.length}
                        </span>{" "}
                        transactions
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setPage((previous) =>
                              Math.max(1, previous - 1)
                            )
                          }
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft size={17} />
                        </button>

                        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-red-600 px-3 text-xs font-bold text-white">
                          {currentPage}
                        </span>

                        <button
                          onClick={() =>
                            setPage((previous) =>
                              Math.min(totalPages, previous + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          aria-label="Next page"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronRight size={17} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ================= FOOTER NOTE ================= */}

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-slate-500"
              />
              <p className="text-xs leading-6 text-slate-500">
                Receipts are available for successfully completed
                payments. Pending transactions will become eligible
                for receipt generation once their payment status
                is confirmed.
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* =====================================================
   PAYMENT STAT CARD
===================================================== */

function PaymentStat({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "green" | "orange" | "blue";
}) {
  const styles = {
    green: {
      border: "border-emerald-100",
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-600",
    },
    orange: {
      border: "border-orange-100",
      icon: "bg-orange-50 text-orange-600",
      value: "text-orange-600",
    },
    blue: {
      border: "border-blue-100",
      icon: "bg-blue-50 text-blue-600",
      value: "text-[#101828]",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`rounded-[20px] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${style.border}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-600">
            {label}
          </p>
          <p
            className={`mt-1.5 text-[28px] font-black leading-none tracking-tight ${style.value}`}
          >
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PAYMENT STATUS BADGE
===================================================== */

function PaymentStatus({ status }: { status: string }) {
  const paid = isPaid(status);
  const pending = isPending(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold ${
        paid
          ? "bg-emerald-50 text-emerald-700"
          : pending
            ? "bg-orange-50 text-orange-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          paid
            ? "bg-emerald-500"
            : pending
              ? "bg-orange-500"
              : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}
