"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserRound,
  Building2,
  Trophy,
  FileText,
  CreditCard,
  Award,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Clock3,
  AlertCircle,
  IndianRupee,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalBoxers: number;
    totalCoaches: number;
    totalAcademies: number;
    totalTournaments: number;
    totalDocuments: number;
    totalCertificates: number;
    totalTournamentEntries: number;
  };

  memberships: {
    active: number;
    expired: number;
    paymentPending: number;
  };

  payments: {
    paid: number;
    pending: number;
    failed: number;
    revenue: number;
  };

  pendingDocuments: number;

  recentUsers: {
    id: number;
    email: string;
    role: string;
    registrationStatus: string;
    membershipId: string | null;
    membershipExpiry: string | null;
    createdAt: string;
  }[];

  upcomingTournaments: {
    id: number;
    name: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    weightClass: string | null;
    status: string;
    entryFee: number | null;
  }[];

  recentPayments: {
    id: number;
    type: string;
    amount: number;
    method: string | null;
    status: string;
    invoiceNumber: string | null;
    createdAt: string;
    boxer: { name: string } | null;
    coach: { name: string } | null;
    academy: { name: string } | null;
  }[];
};

const statCards = [
  {
    key: "totalBoxers",
    title: "Total Boxers",
    icon: Users,
    href: "/dashboard/admin/boxers",
  },
  {
    key: "totalCoaches",
    title: "Total Coaches",
    icon: UserRound,
    href: "/dashboard/admin/coaches",
  },
  {
    key: "totalAcademies",
    title: "Total Academies",
    icon: Building2,
    href: "/dashboard/admin/academies",
  },
  {
    key: "totalTournaments",
    title: "Tournaments",
    icon: Trophy,
    href: "/dashboard/admin/tournaments",
  },
] as const;

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function roleLabel(role: string) {
  switch (role) {
    case "boxer":
      return "Boxer";
    case "coach":
      return "Coach";
    case "academy":
      return "Academy";
    default:
      return role;
  }
}

function statusClasses(status: string) {
  const value = status.toLowerCase();

  if (value === "active" || value === "paid" || value === "captured") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    value === "pending" ||
    value === "payment_pending" ||
    value === "upcoming"
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (value === "failed" || value === "expired") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/overview", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load dashboard");
      }

      setData(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />

            <div>
              <h2 className="font-bold text-red-800">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "Something went wrong."}
              </p>

              <button
                onClick={loadDashboard}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-7 text-slate-900">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
              Admin Portal
            </span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-[38px] font-extrabold tracking-tight text-[#0b1729]">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Mumbai Boxing Association management overview
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>

                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-red-600 transition" />
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {data.stats[item.key]}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Membership + Payments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Membership */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Membership Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current member registration status
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <div className="p-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Active
                </span>
              </div>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {data.memberships.active}
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Expired
                </span>
              </div>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {data.memberships.expired}
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock3 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Pending
                </span>
              </div>

              <p className="mt-3 text-3xl font-extrabold text-slate-900">
                {data.memberships.paymentPending}
              </p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Payment Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Payment activity across the association
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Revenue
                </p>

                <p className="text-2xl font-extrabold text-slate-900">
                  {formatCurrency(data.payments.revenue)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700 font-semibold">
                  Paid
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-800">
                  {data.payments.paid}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs text-amber-700 font-semibold">
                  Pending
                </p>

                <p className="mt-1 text-xl font-bold text-amber-800">
                  {data.payments.pending}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs text-red-700 font-semibold">
                  Failed
                </p>

                <p className="mt-1 text-xl font-bold text-red-800">
                  {data.payments.failed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Management */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Management
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Quickly access association records
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

          <ManagementLink
            href="/dashboard/admin/boxers"
            icon={Users}
            label="Boxers"
            count={data.stats.totalBoxers}
          />

          <ManagementLink
            href="/dashboard/admin/coaches"
            icon={UserRound}
            label="Coaches"
            count={data.stats.totalCoaches}
          />

          <ManagementLink
            href="/dashboard/admin/academies"
            icon={Building2}
            label="Academies"
            count={data.stats.totalAcademies}
          />

          <ManagementLink
            href="/dashboard/admin/tournaments"
            icon={Trophy}
            label="Tournaments"
            count={data.stats.totalTournaments}
          />

          <ManagementLink
            href="/dashboard/documents"
            icon={FileText}
            label="Documents"
            count={data.pendingDocuments}
            subtitle="pending"
          />

          <ManagementLink
            href="/dashboard/admin/tournaments"
            icon={CreditCard}
            label="Payments"
            count={data.payments.paid}
            subtitle="paid"
          />

        </div>
      </div>

      {/* Recent Registrations */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Registrations
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest boxer, coach and academy accounts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-500">
                  Account
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-500">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-500">
                  Status
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-500">
                  Membership
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-500">
                  Registered
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {user.email}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      User #{user.id}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">
                      {roleLabel(user.role)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        user.registrationStatus
                      )}`}
                    >
                      {user.registrationStatus.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">
                      {user.membershipId || "—"}
                    </p>

                    {user.membershipExpiry && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Exp: {formatDate(user.membershipExpiry)}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}

              {data.recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Tournaments */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Tournaments
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Next scheduled boxing events
              </p>
            </div>

            <Link
              href="/dashboard/admin/tournaments"
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data.upcomingTournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/dashboard/admin/tournaments/${tournament.id}`}
                className="block p-5 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {tournament.name}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(tournament.startDate)}
                      </span>

                      {tournament.location && (
                        <span>{tournament.location}</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </div>
              </Link>
            ))}

            {data.upcomingTournaments.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                No upcoming tournaments.
              </div>
            )}
          </div>
        </div>

        {/* Payments */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Payments
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest payment activity
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {data.recentPayments.map((payment) => {

              const person =
                payment.boxer?.name ||
                payment.coach?.name ||
                payment.academy?.name ||
                "Unknown member";

              return (
                <div
                  key={payment.id}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {person}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {payment.type} •{" "}
                      {payment.invoiceNumber || "No invoice"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </p>

                    <span
                      className={`inline-flex mt-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClasses(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {data.recentPayments.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                No payments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <SummaryCard
          icon={FileText}
          label="Documents"
          value={data.stats.totalDocuments}
        />

        <SummaryCard
          icon={Award}
          label="Certificates"
          value={data.stats.totalCertificates}
        />

        <SummaryCard
          icon={ClipboardList}
          label="Tournament Entries"
          value={data.stats.totalTournamentEntries}
        />

        <SummaryCard
          icon={Clock3}
          label="Pending Documents"
          value={data.pendingDocuments}
        />

      </div>

    </div>
  );
}

function ManagementLink({
  href,
  icon: Icon,
  label,
  count,
  subtitle,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  count: number;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-red-200 hover:shadow-md transition"
    >
      <Icon className="w-5 h-5 text-red-600" />

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-slate-900">
        {count}
      </p>

      {subtitle && (
        <p className="text-[11px] text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </Link>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="w-5 h-5 text-slate-400" />

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}