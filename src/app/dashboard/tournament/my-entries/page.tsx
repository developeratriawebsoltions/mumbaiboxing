"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Medal,
  RefreshCw,
  Trophy,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

/* =========================================================
   TYPES
   ========================================================= */

type TournamentSnippet = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  categories: string | null;
  entryFee: number | null;
  status: string;
};

type Entry = {
  id: number;
  createdAt: string;
  answers: string | null;
  pending: boolean;
  amount?: number;
  tournament: TournamentSnippet | null;
};

type MyEntries = {
  confirmed: Entry[];
  cashPending: Entry[];
};

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(d: string | null) {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: string) {
  const key = status.toLowerCase();
  if (key === "open") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (key === "ongoing") return "bg-blue-50 text-blue-700 border-blue-200";
  if (key === "completed") return "bg-slate-100 text-slate-600 border-slate-200";
  if (key === "cancelled") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

/* =========================================================
   ANSWERS ACCORDION
   ========================================================= */

function AnswersAccordion({ raw }: { raw: string | null }) {
  const [open, setOpen] = useState(false);
  if (!raw) return null;

  let answers: string[] = [];
  try { answers = JSON.parse(raw) as string[]; } catch { return null; }
  if (!answers.length) return null;

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {open ? "Hide registration answers" : "View registration answers"}
      </button>
      {open && (
        <ol className="mt-3 space-y-2">
          {answers.map((answer, i) => (
            <li key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <span className="font-semibold text-slate-400">A{i + 1}: </span>
              {answer || <em className="text-slate-400">No answer provided</em>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* =========================================================
   ENTRY CARD
   ========================================================= */

function EntryCard({ entry }: { entry: Entry }) {
  const t = entry.tournament;
  if (!t) return null;

  const cats: string[] = (() => {
    try { return t.categories ? (JSON.parse(t.categories) as string[]) : []; }
    catch { return []; }
  })();

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Card header */}
      <div className="relative overflow-hidden bg-[#07172c] p-5 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-44 w-10 rotate-[25deg] bg-red-600" />
        <div aria-hidden="true" className="pointer-events-none absolute right-8 top-0 h-40 w-4 rotate-[25deg] bg-red-500/30" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <Trophy className="h-6 w-6 text-red-400" />
          </div>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${statusStyle(t.status)}`}>
            {t.status}
          </span>
        </div>

        <p className="relative mt-5 text-[10px] font-extrabold uppercase tracking-[.18em] text-red-300">
          MBA Boxing Event
        </p>
        <h3 className="relative mt-2 break-words text-xl font-extrabold leading-7">{t.name}</h3>

        {entry.pending ? (
          <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-500/20 px-3 py-1.5 text-[11px] font-bold text-amber-100">
            <Clock3 className="h-3.5 w-3.5" /> Cash Payment Pending
          </span>
        ) : (
          <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> Registered
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-3">
          <Detail icon={<CalendarDays className="h-4 w-4" />} label="Event Dates"
            value={`${formatDate(t.startDate)}${t.endDate ? ` – ${formatDate(t.endDate)}` : ""}`}
          />
          <Detail icon={<MapPin className="h-4 w-4" />} label="Venue" value={t.location || "Venue TBD"} />
          <Detail icon={<Medal className="h-4 w-4" />} label="Weight Class" value={t.weightClass || "Not specified"} />

          {cats.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-slate-400"><Trophy className="h-4 w-4" /></span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {cats.map((c) => (
                    <span key={c} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Entry fee + registered on */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entry Fee</p>
              {t.entryFee === 0
                ? <p className="mt-1 font-black text-emerald-700">Free</p>
                : <p className="mt-1 text-xl font-black text-[#07172c]">₹{(t.entryFee ?? 500).toLocaleString("en-IN")}</p>}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered On</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(entry.createdAt)}</p>
            </div>
          </div>

          {/* Status pill */}
          <div className={`mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold ${entry.pending ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
            {entry.pending
              ? <><Clock3 className="h-4 w-4" /> Awaiting cash payment approval</>
              : <><CheckCircle2 className="h-4 w-4" /> Registration Confirmed</>}
          </div>

          {/* Registration Q&A answers */}
          <AnswersAccordion raw={entry.answers} />
        </div>
      </div>
    </article>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function MyEntriesPage() {
  const role = useRole();
  const [data, setData] = useState<MyEntries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tournaments/my-entries", { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load entries.");
      setData(json as MyEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const allEntries = data ? [...(data.cashPending ?? []), ...(data.confirmed ?? [])] : [];
  const confirmedCount = data?.confirmed.length ?? 0;
  const pendingCount = data?.cashPending.length ?? 0;

  return (
    <DashboardLayout role={role || undefined}>
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">

        {/* =====================================================
            HERO
            ===================================================== */}
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,.13)] sm:px-9 lg:px-11 lg:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.08]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[24%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[19%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <Link
                href="/dashboard/tournament"
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Tournaments
              </Link>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-300">
                  North Bombay District Amateur Boxing Association (NBDABA)
                </span>
              </div>
              <h1 className="text-[34px] font-black tracking-tight sm:text-[44px]">
                My Entries<span className="text-red-500">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                All the tournaments you&apos;ve registered for — confirmed entries and pending cash payments.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-red-400" /> Boxer Tournament History
              </span>
            </div>

            {/* Summary badge */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-300">Total Entries</p>
                <p className="mt-1 text-3xl font-black">{loading ? "—" : allEntries.length}</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        {/* =====================================================
            ERROR
            ===================================================== */}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span>
            <button type="button" onClick={load} className="font-bold underline">Retry</button>
          </div>
        )}

        {/* =====================================================
            SKELETON
            ===================================================== */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-[20px] bg-slate-100" />
            ))}
          </div>
        )}

        {/* =====================================================
            CONTENT
            ===================================================== */}
        {!loading && !error && data && (
          <>
            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Trophy className="h-5 w-5" />}
                label="Total Entries"
                value={allEntries.length}
                detail="Tournaments you've joined"
                tone="red"
              />
              <StatCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Confirmed"
                value={confirmedCount}
                detail="Payment received"
                tone="green"
              />
              <StatCard
                icon={<Clock3 className="h-5 w-5" />}
                label="Cash Pending"
                value={pendingCount}
                detail="Awaiting admin approval"
                tone="amber"
              />
            </div>

            {/* Main card list */}
            <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold">Your Tournament Entries</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {allEntries.length === 0
                        ? "No entries yet"
                        : `${confirmedCount} confirmed · ${pendingCount} cash pending`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={load}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>

              {allEntries.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-slate-200" />
                  <h3 className="mt-4 font-extrabold text-slate-700">No tournament entries yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Browse open tournaments and register to compete.
                  </p>
                  <Link
                    href="/dashboard/tournament"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ed1c24] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#c9151e]"
                  >
                    <Trophy className="h-4 w-4" /> Browse Tournaments
                  </Link>
                </div>
              ) : (
                <>
                  {/* Cash-pending section */}
                  {pendingCount > 0 && (
                    <div className="border-b border-slate-100">
                      <div className="flex items-center gap-2 bg-amber-50 px-5 py-3 sm:px-6">
                        <Clock3 className="h-4 w-4 text-amber-600" />
                        <p className="text-xs font-bold text-amber-700">
                          Cash Payment Pending ({pendingCount}) — these will be confirmed once an admin approves your payment.
                        </p>
                      </div>
                      <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
                        {data.cashPending.map((entry) => (
                          <EntryCard key={`cash-${entry.id}`} entry={entry} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirmed section */}
                  {confirmedCount > 0 && (
                    <div>
                      <div className="flex items-center gap-2 bg-emerald-50 px-5 py-3 sm:px-6">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <p className="text-xs font-bold text-emerald-700">
                          Confirmed Registrations ({confirmedCount})
                        </p>
                      </div>
                      <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
                        {data.confirmed.map((entry) => (
                          <EntryCard key={`conf-${entry.id}`} entry={entry} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon, label, value, detail, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  tone: "red" | "green" | "amber";
}) {
  const colors = {
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-slate-500">{label}</p>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[tone]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-[34px] font-black tracking-tight text-[#07172c]">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
