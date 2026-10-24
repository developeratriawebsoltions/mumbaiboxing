
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Medal,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type Boxer = {
  id: number;
  name: string;
  weight: string | null;
  rank: number | null;
  medical: {
    fitnessStatus: string;
  } | null;
};

type CoachResponse = {
  error?: string;
  academy?: {
    name?: string;
    boxers?: Boxer[];
  } | null;
};

type MedicalFilter = "all" | "valid" | "alerts";

const PAGE_SIZE = 10;

function getMedicalStatus(boxer: Boxer) {
  const status = boxer.medical?.fitnessStatus?.trim() || "";

  if (status.toLowerCase() === "valid") {
    return {
      label: "Valid",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      valid: true,
    };
  }

  if (status.toLowerCase() === "expired") {
    return {
      label: "Expired",
      className: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
      valid: false,
    };
  }

  if (!status) {
    return {
      label: "No Record",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
      valid: false,
    };
  }

  return {
    label: status,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    valid: false,
  };
}

function StatCard({
  label,
  value,
  detail,
  icon,
  color,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
  color: "red" | "blue" | "green" | "amber";
}) {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="group rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-slate-500">
          {label}
        </p>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-[34px] font-black leading-none tracking-tight text-[#07172c]">
        {value}
      </p>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function MedicalBadge({ boxer }: { boxer: Boxer }) {
  const status = getMedicalStatus(boxer);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${status.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
}

export default function CoachBoxersPage() {
  const [boxers, setBoxers] = useState<Boxer[]>([]);
  const [academyName, setAcademyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [medicalFilter, setMedicalFilter] =
    useState<MedicalFilter>("all");
  const [page, setPage] = useState(1);

  async function loadBoxers(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch("/api/coach", {
        cache: "no-store",
      });

      const data: CoachResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to load boxers.");
      }

      setBoxers(
        Array.isArray(data.academy?.boxers)
          ? data.academy.boxers
          : []
      );

      setAcademyName(data.academy?.name || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load boxers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBoxers();
  }, []);

  const stats = useMemo(() => {
    const ranked = boxers.filter(
      (boxer) => boxer.rank !== null
    ).length;

    const medicalValid = boxers.filter(
      (boxer) => getMedicalStatus(boxer).valid
    ).length;

    return {
      total: boxers.length,
      ranked,
      medicalValid,
      medicalAlerts: boxers.length - medicalValid,
    };
  }, [boxers]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return boxers.filter((boxer) => {
      const matchesSearch =
        boxer.name.toLowerCase().includes(query) ||
        String(boxer.id).includes(query);

      const valid = getMedicalStatus(boxer).valid;

      const matchesMedical =
        medicalFilter === "all" ||
        (medicalFilter === "valid" && valid) ||
        (medicalFilter === "alerts" && !valid);

      return matchesSearch && matchesMedical;
    });
  }, [boxers, search, medicalFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleBoxers = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const startIndex =
    filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const endIndex = Math.min(
    currentPage * PAGE_SIZE,
    filtered.length
  );

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeMedicalFilter(value: MedicalFilter) {
    setMedicalFilter(value);
    setPage(1);
  }

  return (
    <DashboardLayout role="coach">
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">

        {/* HERO HEADER */}
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,0.13)] sm:px-9 lg:px-11 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-red-600/20 blur-[90px]" />

          <div className="pointer-events-none absolute -top-16 right-[24%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />

          <div className="pointer-events-none absolute -top-16 right-[19%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <a
                href="/dashboard/coach"
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>

              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-300">
                  Mumbai Boxing Association
                </span>
              </div>

              <h1 className="text-[34px] font-black leading-tight tracking-tight sm:text-[44px]">
                My Boxers<span className="text-red-500">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Manage and monitor every boxer registered under
                your academy.
              </p>

              {academyName && (
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-red-400" />
                  {academyName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-300">
                  Total Athletes
                </p>
                <p className="mt-1 text-3xl font-black">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadBoxers(true)}
              disabled={refreshing}
              className="text-xs font-bold text-red-700 underline disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[20px] border border-slate-100 bg-slate-100"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded-[22px] bg-slate-100" />
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Total Boxers"
                value={stats.total}
                detail="Registered athletes"
                color="red"
              />

              <StatCard
                icon={<Medal className="h-5 w-5" />}
                label="Ranked Boxers"
                value={stats.ranked}
                detail="Athletes with rankings"
                color="blue"
              />

              <StatCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Medical Valid"
                value={stats.medicalValid}
                detail="Fitness records valid"
                color="green"
              />

              <StatCard
                icon={<Activity className="h-5 w-5" />}
                label="Medical Alerts"
                value={stats.medicalAlerts}
                detail="Need attention or review"
                color="amber"
              />
            </div>

            {/* MAIN LIST */}
            <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">

              {/* SECTION HEADER */}
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight">
                      Academy Boxer Roster
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Search and review your registered athletes
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loadBoxers(true)}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh List"}
                </button>
              </div>

              {/* SEARCH AND FILTER */}
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/40 px-5 py-5 lg:flex-row lg:items-center lg:justify-between sm:px-6">
                <div className="relative w-full lg:max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      changeSearch(event.target.value)
                    }
                    placeholder="Search boxer by name or ID..."
                    aria-label="Search boxers"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />

                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => changeSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </div>

                  <div className="relative">
                    <select
                      value={medicalFilter}
                      onChange={(event) =>
                        changeMedicalFilter(
                          event.target.value as MedicalFilter
                        )
                      }
                      aria-label="Filter by medical status"
                      className="h-12 w-full min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    >
                      <option value="all">All Medical Status</option>
                      <option value="valid">Medical Valid</option>
                      <option value="alerts">Medical Alerts</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* TABLE */}
              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <UserRound className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-base font-extrabold text-slate-800">
                    {search || medicalFilter !== "all"
                      ? "No matching boxers"
                      : "No boxers assigned yet"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {search || medicalFilter !== "all"
                      ? "Try changing your search or medical status filter."
                      : "Athletes linked to your academy will appear here."}
                  </p>

                  {(search || medicalFilter !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        changeSearch("");
                        changeMedicalFilter("all");
                      }}
                      className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[700px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70">
                          <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            #
                          </th>
                          <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            Boxer Details
                          </th>
                          <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            Weight Category
                          </th>
                          <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            Ranking
                          </th>
                          <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                            Medical Fitness
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {visibleBoxers.map((boxer, index) => (
                          <tr
                            key={boxer.id}
                            className="transition-colors hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5 text-xs font-semibold text-slate-400">
                              {(currentPage - 1) * PAGE_SIZE +
                                index +
                                1}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07172c] text-base font-extrabold text-white">
                                  {boxer.name
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase() || "B"}
                                </div>

                                <div className="min-w-0">
                                  <p className="break-words text-sm font-bold text-[#07172c]">
                                    {boxer.name}
                                  </p>

                                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                                    Boxer #{String(boxer.id).padStart(4, "0")}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                              {boxer.weight || "—"}
                            </td>

                            <td className="px-6 py-5">
                              {boxer.rank !== null ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600">
                                  <Trophy className="h-3.5 w-3.5" />
                                  #{boxer.rank}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  Unranked
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <MedicalBadge boxer={boxer} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE CARDS */}
                  <div className="divide-y divide-slate-100 md:hidden">
                    {visibleBoxers.map((boxer) => (
                      <div key={boxer.id} className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07172c] text-lg font-black text-white">
                            {boxer.name
                              .trim()
                              .charAt(0)
                              .toUpperCase() || "B"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-extrabold">
                              {boxer.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Boxer #{String(boxer.id).padStart(4, "0")}
                            </p>
                          </div>

                          {boxer.rank !== null && (
                            <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-600">
                              #{boxer.rank}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Weight
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-700">
                              {boxer.weight || "—"}
                            </p>
                          </div>

                          <MedicalBadge boxer={boxer} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  <div className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                    <p className="text-xs font-medium text-slate-500">
                      Showing{" "}
                      <span className="font-extrabold text-slate-800">
                        {startIndex}–{endIndex}
                      </span>{" "}
                      of{" "}
                      <span className="font-extrabold text-slate-800">
                        {filtered.length}
                      </span>{" "}
                      boxers
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.max(1, current - 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      <span className="text-xs font-bold text-slate-600">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPage((current) =>
                            Math.min(totalPages, current + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}
