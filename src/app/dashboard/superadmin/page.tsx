"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserRound,
  Building2,
  Trophy,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

interface DashboardStats {
  totalBoxers: number;
  totalCoaches: number;
  totalAcademies: number;
  totalTournaments: number;
  activeMembers: number;
  expiredMembers: number;
  pendingDocuments: number;
}

interface RecentUser {
  id: number;
  email: string;
  role: string;
  registrationStatus: string;
  membershipId: string | null;
  createdAt: string;
}

interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
  upcomingTournaments: Tournament[];
}

const managementLinks = [
  {
    title: "All Boxers",
    description: "Manage registered boxers",
    href: "/dashboard/admin/boxers",
    icon: Users,
  },
  {
    title: "All Coaches",
    description: "Manage registered coaches",
    href: "/dashboard/admin/coaches",
    icon: UserRound,
  },
  {
    title: "All Academies",
    description: "Manage boxing academies",
    href: "/dashboard/admin/academies",
    icon: Building2,
  },
  {
    title: "Tournaments",
    description: "Manage tournaments",
    href: "/dashboard/admin/tournaments",
    icon: Trophy,
  },
  {
    title: "Documents",
    description: "Review submitted documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
];

export default function SuperAdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/superadmin/overview", {
          cache: "no-store",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load dashboard");
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3F3F1] p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 rounded bg-gray-200" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#F3F3F1] p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error || "Something went wrong."}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#ed1c24] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { stats, recentUsers, upcomingTournaments } = data;

  const statCards = [
    {
      label: "Total Boxers",
      value: stats.totalBoxers,
      icon: Users,
      href: "/dashboard/admin/boxers",
    },
    {
      label: "Total Coaches",
      value: stats.totalCoaches,
      icon: UserRound,
      href: "/dashboard/admin/coaches",
    },
    {
      label: "Total Academies",
      value: stats.totalAcademies,
      icon: Building2,
      href: "/dashboard/admin/academies",
    },
    {
      label: "Tournaments",
      value: stats.totalTournaments,
      icon: Trophy,
      href: "/dashboard/admin/tournaments",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F3F3F1] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#ed1c24]">
            Super Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Association Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage and monitor the Mumbai Boxing Association.
          </p>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-2xl border border-[#E5E5E2] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#171717]">
                      {card.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]">
                    <Icon size={21} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-[#ed1c24]">
                  View details
                  <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* MEMBERSHIP OVERVIEW */}
        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#E5E5E2] bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Memberships
                </p>

                <p className="mt-1 text-2xl font-bold text-[#171717]">
                  {stats.activeMembers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E5E2] bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle size={20} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Expired Memberships
                </p>

                <p className="mt-1 text-2xl font-bold text-[#171717]">
                  {stats.expiredMembers}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/documents"
            className="rounded-2xl border border-[#E5E5E2] bg-white p-6 transition hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={20} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Documents
                </p>

                <p className="mt-1 text-2xl font-bold text-[#171717]">
                  {stats.pendingDocuments}
                </p>
              </div>
            </div>
          </Link>
        </section>

        {/* LOWER CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* RECENT REGISTRATIONS */}
          <section className="rounded-2xl border border-[#E5E5E2] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E5E2] px-6 py-5">
              <div>
                <h2 className="font-bold text-[#171717]">
                  Recent Registrations
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest association members
                </p>
              </div>
            </div>

            <div className="divide-y divide-[#E5E5E2]">
              {recentUsers.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  No registrations yet.
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#171717]">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {user.role}
                        {user.membershipId
                          ? ` • ${user.membershipId}`
                          : ""}
                      </p>
                    </div>

                    <span
                      className={[
                        "ml-4 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        user.registrationStatus === "ACTIVE"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {user.registrationStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* UPCOMING TOURNAMENTS */}
          <section className="rounded-2xl border border-[#E5E5E2] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E5E2] px-6 py-5">
              <div>
                <h2 className="font-bold text-[#171717]">
                  Upcoming Tournaments
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Next scheduled events
                </p>
              </div>

              <Link
                href="/dashboard/admin/tournaments"
                className="text-xs font-semibold text-[#ed1c24]"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#E5E5E2]">
              {upcomingTournaments.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  No upcoming tournaments.
                </div>
              ) : (
                upcomingTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <CalendarDays size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#171717]">
                        {tournament.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          tournament.startDate
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}

                        {tournament.location
                          ? ` • ${tournament.location}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* MANAGEMENT */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#171717]">
              Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quick access to association management.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {managementLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-[#E5E5E2] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Icon
                    size={21}
                    className="text-slate-500 transition group-hover:text-[#ed1c24]"
                  />

                  <h3 className="mt-4 text-sm font-bold text-[#171717]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}