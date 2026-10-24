"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { ArrowLeft, Award, CheckCircle2, ChevronLeft, ChevronRight, Crown, Medal, RefreshCw, Search, Shield, SlidersHorizontal, Trophy, Users, X } from "lucide-react";

type RankedBoxer = {
  rank: number;
  boxerId: number;
  name: string;
  membershipId?: string | null;
  gender?: string | null;
  category?: string | null;
  weight?: string | null;
  weightCategory?: string | null;
  ageGroup?: string | null;
  academy?: { id?: number; name: string } | null;
  points?: number;
  tournaments?: number;
  medals?: { gold: number; silver: number; bronze: number };
  latestTournamentDate?: string | null;
  isMe?: boolean;
};

type RankingsResponse = {
  success?: boolean;
  season?: number | string;
  rankingType?: string;
  count?: number;
  rankings?: RankedBoxer[];
  error?: string;
};

const PAGE_SIZE = 10;
const formatPoints = (points?: number) => (points ?? 0).toLocaleString("en-IN");
const rankColor = (rank: number) =>
  rank === 1 ? "bg-amber-100 text-amber-700 ring-amber-200" :
  rank === 2 ? "bg-slate-200 text-slate-700 ring-slate-300" :
  rank === 3 ? "bg-orange-100 text-orange-700 ring-orange-200" :
  "bg-slate-100 text-slate-600 ring-slate-200";

function Metric({ label, value, description, icon, tone }: {
  label: string; value: string | number; description: string;
  icon: React.ReactNode; tone: "red" | "amber" | "blue" | "green";
}) {
  const tones = { red: "bg-red-50 text-red-600", amber: "bg-amber-50 text-amber-600", blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600" };
  return <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold text-slate-500">{label}</p><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div></div>
    <p className="mt-3 text-3xl font-black tracking-tight text-[#07172c]">{value}</p><p className="mt-2 text-xs text-slate-500">{description}</p>
  </div>;
}

function MedalCount({ label, count, tone, icon }: { label: string; count: number; tone: string; icon: React.ReactNode }) {
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</div>
    <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-[#07172c]">{count.toLocaleString("en-IN")}</p></div>
  </div>;
}

export default function RankingDashboard() {
  const role = useRole();
  const [rankings, setRankings] = useState<RankedBoxer[]>([]);
  const [season, setSeason] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const loadRankings = useCallback(async (refresh = false, signal?: AbortSignal) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/rankings", { method: "GET", cache: "no-store", signal });
      const data: RankingsResponse = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Failed to load rankings.");
      if (!Array.isArray(data.rankings)) throw new Error("Invalid rankings response.");
      if (signal?.aborted) return;
      setRankings(data.rankings);
      setSeason(data.season ?? null);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : "Failed to load rankings.");
    } finally {
      if (!signal?.aborted) { setLoading(false); setRefreshing(false); }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadRankings(false, controller.signal);
    return () => controller.abort();
  }, [loadRankings]);

  const me = rankings.find((r) => r.isMe);
  const categories = useMemo(() => Array.from(new Set(rankings.map(r => r.category || r.weightCategory || r.weight || "Unspecified"))).sort(), [rankings]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rankings.filter(r => {
      const matchesSearch = [r.name, r.membershipId, r.academy?.name, String(r.rank)].some(v => (v || "").toLowerCase().includes(q));
      const matchesCategory = category === "all" || (r.category || r.weightCategory || r.weight || "Unspecified") === category;
      return matchesSearch && matchesCategory;
    });
  }, [rankings, search, category]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const medals = rankings.reduce((a, r) => ({ gold: a.gold + (r.medals?.gold ?? 0), silver: a.silver + (r.medals?.silver ?? 0), bronze: a.bronze + (r.medals?.bronze ?? 0) }), { gold: 0, silver: 0, bronze: 0 });
  const topBoxer = [...rankings].sort((a, b) => a.rank - b.rank)[0];

  return <DashboardLayout role={role || undefined}>
    <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">
      <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,.13)] sm:px-9 lg:px-11 lg:py-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.08]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
        <div aria-hidden className="pointer-events-none absolute -top-20 right-[25%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
        <div aria-hidden className="pointer-events-none absolute -top-20 right-[20%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />
        <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <a href={role === "coach" ? "/dashboard/coach" : role === "boxer" ? "/dashboard/boxer" : "/dashboard"} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</a>
            <div className="mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-300">Mumbai Boxing Association</span></div>
            <h1 className="text-[34px] font-black tracking-tight sm:text-[44px]">Boxer Rankings<span className="text-red-500">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Explore the leaderboard, track points and celebrate championship performances.</p>
            {season !== null && <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold"><Shield className="h-4 w-4 text-red-400" /> Season {season}</span>}
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600"><Trophy className="h-6 w-6" /></div><div><p className="text-xs text-slate-300">Ranked Athletes</p><p className="text-3xl font-black">{rankings.length}</p></div></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
      </section>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4"><p className="text-sm font-semibold text-red-700">{error}</p><button type="button" onClick={() => void loadRankings(true)} className="text-xs font-bold text-red-700 underline">Retry</button></div>}

      {loading ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)}</div><div className="h-80 animate-pulse rounded-2xl bg-slate-100" /></div> : <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Ranked Boxers" value={rankings.length} description="Athletes on the leaderboard" icon={<Users className="h-5 w-5" />} tone="red" />
          <Metric label="Top Ranked" value={topBoxer ? `#${topBoxer.rank}` : "—"} description={topBoxer?.name || "No ranking yet"} icon={<Crown className="h-5 w-5" />} tone="amber" />
          <Metric label="Tournament Entries" value={rankings.reduce((sum, r) => sum + (r.tournaments ?? 0), 0)} description="Across ranked athletes" icon={<Trophy className="h-5 w-5" />} tone="blue" />
          <Metric label="Total Medals" value={medals.gold + medals.silver + medals.bronze} description="Gold, silver and bronze" icon={<Medal className="h-5 w-5" />} tone="green" />
        </div>

        {me && <section className="relative overflow-hidden rounded-[22px] border border-red-100 bg-gradient-to-r from-red-50 via-white to-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-4"><div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black ring-1 ${rankColor(me.rank)}`}>#{me.rank}</div>
            <div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold uppercase tracking-[.17em] text-red-600">Your Current Ranking</p><h2 className="mt-1 break-words text-xl font-black">{me.name}</h2><p className="mt-1 text-xs text-slate-500">{me.weight || me.weightCategory || "—"} · {me.ageGroup || "—"} · {me.academy?.name || "—"}</p></div>
            <div className="rounded-xl bg-white px-5 py-3 text-center shadow-sm"><p className="text-2xl font-black text-red-600">{formatPoints(me.points)}</p><p className="text-xs font-semibold text-slate-500">Ranking Points</p></div>
          </div>
        </section>}

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:px-6"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trophy className="h-5 w-5" /></div><div><h2 className="text-lg font-extrabold">Official Leaderboard</h2><p className="mt-1 text-xs text-slate-500">Rankings based on verified tournament results</p></div></div>
            <button type="button" disabled={refreshing} onClick={() => void loadRankings(true)} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh</button>
          </div>
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/40 px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search boxer, academy or membership ID..." aria-label="Search rankings" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />{search && <button type="button" onClick={() => { setSearch(""); setPage(1); }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="h-4 w-4" /></button>}</div>
            <div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select aria-label="Filter category" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="h-12 w-full min-w-[185px] rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-red-400"><option value="all">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          {rankings.length === 0 && !error ? <div className="px-6 py-16 text-center"><Trophy className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 font-extrabold">No rankings available yet</h3><p className="mt-2 text-sm text-slate-500">Rankings appear after verified tournament records are awarded points.</p></div> : filtered.length === 0 ? <div className="px-6 py-14 text-center"><Search className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-bold">No matching boxers</p><button type="button" className="mt-3 text-xs font-bold text-red-600 underline" onClick={() => { setSearch(""); setCategory("all"); setPage(1); }}>Clear filters</button></div> : <>
            <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[750px] text-left"><thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Rank</th><th className="px-6 py-4">Boxer</th><th className="px-6 py-4">Weight</th><th className="px-6 py-4">Age Group</th><th className="px-6 py-4">Academy</th><th className="px-6 py-4 text-right">Points</th><th className="px-6 py-4 text-right">Events</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map(r => <tr key={r.boxerId} className={r.isMe ? "bg-red-50/60" : "hover:bg-slate-50/70"}><td className="px-6 py-4"><span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black ring-1 ${rankColor(r.rank)}`}>#{r.rank}</span></td><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07172c] font-black text-white">{r.name.trim().charAt(0).toUpperCase() || "B"}</div><div className="min-w-0"><p className="break-words text-sm font-bold">{r.name}{r.isMe && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700">You</span>}</p><p className="mt-1 text-xs text-slate-400">{r.membershipId || `Boxer #${r.boxerId}`}</p></div></div></td><td className="px-6 py-4 text-sm text-slate-600">{r.weight || r.weightCategory || "—"}</td><td className="px-6 py-4 text-sm text-slate-600">{r.ageGroup || "—"}</td><td className="px-6 py-4 text-sm text-slate-600">{r.academy?.name || "—"}</td><td className="px-6 py-4 text-right text-sm font-black text-red-600">{formatPoints(r.points)}</td><td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">{r.tournaments ?? 0}</td></tr>)}</tbody></table></div>
            <div className="divide-y divide-slate-100 md:hidden">{visible.map(r => <div key={r.boxerId} className={`p-5 ${r.isMe ? "bg-red-50/60" : ""}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black ring-1 ${rankColor(r.rank)}`}>#{r.rank}</span><div className="min-w-0 flex-1"><p className="break-words text-sm font-extrabold">{r.name} {r.isMe && <span className="text-xs text-red-600">(You)</span>}</p><p className="mt-1 text-xs text-slate-500">{r.academy?.name || "—"}</p><p className="mt-1 text-xs text-slate-400">{r.weight || r.weightCategory || "—"} · {r.ageGroup || "—"}</p></div><div className="text-right"><p className="text-lg font-black text-red-600">{formatPoints(r.points)}</p><p className="text-[10px] text-slate-400">Points</p></div></div></div>)}</div>
            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6"><p className="text-xs text-slate-500">Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> boxers</p><div className="flex items-center gap-3"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="text-xs font-bold">Page {currentPage} of {pages}</span><button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div>
          </>}
        </section>
        <section><div className="mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-red-600" /><h2 className="text-lg font-extrabold">Medal Summary</h2></div><div className="grid gap-4 sm:grid-cols-3"><MedalCount label="Gold Medals" count={medals.gold} tone="bg-amber-50 text-amber-600" icon={<Medal className="h-6 w-6" />} /><MedalCount label="Silver Medals" count={medals.silver} tone="bg-slate-100 text-slate-600" icon={<Medal className="h-6 w-6" />} /><MedalCount label="Bronze Medals" count={medals.bronze} tone="bg-orange-50 text-orange-600" icon={<Medal className="h-6 w-6" />} /></div></section>
      </>}
    </main>
  </DashboardLayout>;
}
