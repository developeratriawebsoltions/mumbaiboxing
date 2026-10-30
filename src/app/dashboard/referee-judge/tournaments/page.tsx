"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, Trophy,
  ShieldCheck, UserRound, RefreshCw, Search, ClipboardList, AlertCircle,
  ChevronLeft, ChevronRight, FileText,
} from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Tournament = {
  id: number; name: string; location: string | null; startDate: string | null;
  endDate: string | null; weightClass: string | null; status: string | null;
  entryFee: number | null; isFeatured: boolean; createdAt: string;
};
type TournamentAssignment = {
  id: number; role: string; status: string; assignedAt: string;
  notes: string | null; tournament: Tournament;
};
type DashboardData = {
  success: boolean;
  user: { id: number; email: string; role: string; registrationStatus: string };
  tournamentAssignments: TournamentAssignment[];
  upcomingTournaments: TournamentAssignment[];
};

type Filter = "all" | "upcoming" | "past" | "pending";
const PAGE_SIZE = 6;

function dateText(value: string | null | undefined) {
  if (!value) return "To be announced";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "To be announced" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function dateRange(t: Tournament) {
  const first = dateText(t.startDate);
  return t.endDate && t.endDate !== t.startDate ? `${first} – ${dateText(t.endDate)}` : first;
}
function isUpcoming(a: TournamentAssignment) {
  if (!a.tournament.startDate) return false;
  const start = new Date(a.tournament.startDate).getTime();
  const end = a.tournament.endDate ? new Date(a.tournament.endDate).getTime() : start;
  return Number.isFinite(end) && end >= new Date().setHours(0, 0, 0, 0);
}
function statusClass(status: string) {
  const s = status.toLowerCase();
  if (["assigned", "confirmed", "accepted"].includes(s)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (["cancelled", "canceled", "rejected"].includes(s)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}
function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold capitalize ${statusClass(status || "pending")}`}>
    {status.toLowerCase() === "pending" ? <Clock3 size={13} /> : <CheckCircle2 size={13} />}{status || "Not specified"}
  </span>;
}
function Stat({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: number; note: string; tone: string }) {
  return <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-slate-500">{label}</p><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>{icon}</span></div>
    <p className="mt-3 text-4xl font-black tracking-tight text-[#07172c]">{value}</p><p className="mt-2 text-xs text-slate-500">{note}</p>
  </div>;
}
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-start gap-2.5"><span className="mt-0.5 shrink-0 text-slate-400">{icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</p></div></div>;
}
function AssignmentCard({ assignment }: { assignment: TournamentAssignment }) {
  const t = assignment.tournament;
  return <article className="group flex flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg">
    <div className="relative overflow-hidden bg-[#07172c] p-5 text-white">
      <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-10 rotate-[25deg] bg-red-600" />
      <div className="relative flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10"><Trophy size={22} className="text-red-400" /></span><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider">ASSIGNMENT #{assignment.id}</span></div>
      <p className="relative mt-6 text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-300">Official tournament assignment</p>
      <h3 className="relative mt-2 min-h-[56px] text-xl font-extrabold leading-7">{t.name}</h3>
      {t.isFeatured && <span className="relative mt-3 inline-flex rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold">FEATURED EVENT</span>}
    </div>
    <div className="flex flex-1 flex-col p-5"><div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge status={assignment.status} /><span className="text-xs font-semibold text-slate-400">Assigned {dateText(assignment.assignedAt)}</span></div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Detail icon={<CalendarDays size={17} />} label="Event dates" value={dateRange(t)} />
        <Detail icon={<MapPin size={17} />} label="Venue" value={t.location || "Venue to be announced"} />
        <Detail icon={<UserRound size={17} />} label="Your role" value={assignment.role || "Referee / Judge"} />
        <Detail icon={<ShieldCheck size={17} />} label="Event status" value={t.status || "Not specified"} />
        {t.weightClass && <Detail icon={<Trophy size={17} />} label="Weight class" value={t.weightClass} />}
      </div>
      {assignment.notes && <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-blue-800"><FileText size={15} /> Assignment notes</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-800">{assignment.notes}</p></div>}
      <div className="mt-auto border-t border-slate-100 pt-4 text-xs font-medium text-slate-400" style={{ marginTop: "1.25rem" }}>North Bombay District Amateur Boxing Association (NBDABA) · Referee / Judge</div>
    </div>
  </article>;
}

export default function RefereeJudgeTournamentsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/referee-judge", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || result?.error) throw new Error(result?.error || "Failed to load tournament assignments.");
      if (!Array.isArray(result?.tournamentAssignments)) throw new Error("Unexpected tournament data received.");
      setData(result);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load tournament assignments."); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const assignments = useMemo(() => data?.tournamentAssignments ?? [], [data]);
  const upcoming = useMemo(() => assignments.filter(isUpcoming), [assignments]);
  const confirmed = assignments.filter(a => ["assigned", "confirmed", "accepted"].includes(a.status.toLowerCase())).length;
  const pending = assignments.filter(a => a.status.toLowerCase() === "pending").length;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignments.filter(a => {
      const match = [a.tournament.name, a.tournament.location, a.role, a.status, a.tournament.weightClass, a.notes].some(v => (v || "").toLowerCase().includes(q));
      if (!match) return false;
      if (filter === "upcoming") return isUpcoming(a);
      if (filter === "past") return !!a.tournament.startDate && !isUpcoming(a);
      if (filter === "pending") return a.status.toLowerCase() === "pending";
      return true;
    }).sort((a, b) => {
      const ad = a.tournament.startDate ? new Date(a.tournament.startDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bd = b.tournament.startDate ? new Date(b.tournament.startDate).getTime() : Number.MAX_SAFE_INTEGER;
      return ad - bd;
    });
  }, [assignments, filter, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function selectFilter(value: Filter) { setFilter(value); setPage(1); }

  return <DashboardLayout role="referee_judge"><main className="mx-auto max-w-[1600px] space-y-6 pb-12 text-[#07172c]">
    <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,0.13)] sm:px-9 lg:px-11 lg:py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="pointer-events-none absolute -top-20 right-[19%] hidden h-[180%] w-12 rotate-[25deg] bg-[#ed1c24] lg:block" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center"><div>
        <Link href="/dashboard/referee-judge" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"><ArrowLeft size={16} /> Back to Dashboard</Link>
        <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-300"><span className="h-2 w-2 rounded-full bg-red-500" /> North Bombay District Amateur Boxing Association (NBDABA)</p>
        <h1 className="mt-4 text-[34px] font-black tracking-tight sm:text-[44px]">My Tournaments<span className="text-red-500">.</span></h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Manage your officiating assignments, review upcoming events and access your tournament history.</p>
      </div><div className="flex items-center gap-4 self-start rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600"><Trophy size={24} /></span><div><p className="text-xs text-slate-300">Total assignments</p><p className="text-3xl font-black">{assignments.length}</p></div></div></div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
    </section>
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span className="flex items-center gap-2"><AlertCircle size={18} />{error}</span><button type="button" onClick={() => void load(true)} className="font-bold underline">Retry</button></div>}
    {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map(i => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)}</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<ClipboardList size={21} />} label="Total Assignments" value={assignments.length} note="All tournament assignments" tone="bg-red-50 text-red-600" />
        <Stat icon={<CalendarDays size={21} />} label="Upcoming" value={upcoming.length} note="Scheduled or ongoing events" tone="bg-blue-50 text-blue-600" />
        <Stat icon={<CheckCircle2 size={21} />} label="Confirmed" value={confirmed} note="Assigned, confirmed or accepted" tone="bg-emerald-50 text-emerald-600" />
        <Stat icon={<Clock3 size={21} />} label="Pending" value={pending} note="Awaiting confirmation" tone="bg-amber-50 text-amber-600" />
      </div>
      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="text-xl font-extrabold">Tournament Assignments</h2><p className="mt-1 text-xs text-slate-500">Browse upcoming and previous officiating duties</p></div><button type="button" disabled={refreshing} onClick={() => void load(true)} className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing..." : "Refresh"}</button></div>
        <div className="space-y-4 border-b border-slate-100 bg-slate-50/40 p-5 sm:p-6"><div className="relative max-w-lg"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search tournaments, venues or roles..." aria-label="Search tournament assignments" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" /></div><div className="flex flex-wrap gap-2">{([{ key: "all", label: "All Assignments" }, { key: "upcoming", label: "Upcoming" }, { key: "past", label: "Previous" }, { key: "pending", label: "Pending" }] as const).map(item => <button key={item.key} type="button" onClick={() => selectFilter(item.key)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${filter === item.key ? "bg-[#07172c] text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>{item.label}</button>)}</div></div>
        {visible.length ? <div className="grid gap-5 p-5 lg:grid-cols-2 xl:grid-cols-3 sm:p-6">{visible.map(a => <AssignmentCard key={a.id} assignment={a} />)}</div> : <div className="px-6 py-16 text-center"><Trophy size={36} className="mx-auto text-slate-300" /><h3 className="mt-4 text-lg font-bold">{assignments.length ? "No matching assignments" : "No tournament assignments yet"}</h3><p className="mt-2 text-sm text-slate-500">{assignments.length ? "Try another search or filter." : "Your referee and judge assignments will appear here when scheduled."}</p></div>}
        {filtered.length > PAGE_SIZE && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</p><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage(p => p-1)} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft size={18}/></button><span className="text-xs font-bold">{page} / {pages}</span><button type="button" disabled={page === pages} onClick={() => setPage(p => p+1)} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight size={18}/></button></div></div>}
      </section>
    </>}
  </main></DashboardLayout>;
}
