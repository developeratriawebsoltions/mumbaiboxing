"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Download, MapPin, Search, Users, Building2, Wallet, RefreshCw, Trophy, AlertCircle } from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { tournamentSlug } from "@/lib/tournament-url";

type Entry = {
  id: number;
  createdAt: string;
  boxer: { id: number; name: string; weight: string | null; ageGroup: string | null; academy: { name: string } | null };
};
type Tournament = {
  id: number; name: string; location: string | null; startDate: string | null; endDate: string | null;
  status: string; entryFee: number | null; _count: { entries: number };
};

const statusColors: Record<string, string> = {
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};
const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

export default function TournamentEntriesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [academy, setAcademy] = useState("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/tournaments", { credentials: "include" });
        const data: unknown = await response.json();
        if (!response.ok || !Array.isArray(data)) {
          throw new Error(typeof data === "object" && data !== null && "error" in data && typeof data.error === "string" ? data.error : "Failed to load tournaments.");
        }
        const legacyId = Number(id);
        const selected = (data as Tournament[]).find((item) => Number.isInteger(legacyId) && legacyId > 0 ? item.id === legacyId : tournamentSlug(item.name) === id);
        if (!selected) throw new Error("Tournament not found.");
        if (active) {
          setTournament(selected);
          const canonicalPath = `/dashboard/admin/tournaments/${encodeURIComponent(tournamentSlug(selected.name))}`;
          if (window.location.pathname !== canonicalPath) router.replace(canonicalPath);
        }
        const entriesResponse = await fetch(`/api/admin/tournaments?entries=${selected.id}`, { credentials: "include" });
        const entriesData: unknown = await entriesResponse.json();
        if (!entriesResponse.ok || !Array.isArray(entriesData)) {
          throw new Error(typeof entriesData === "object" && entriesData !== null && "error" in entriesData && typeof entriesData.error === "string" ? entriesData.error : "Failed to load tournament entries.");
        }
        if (active) setEntries(entriesData as Entry[]);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load tournament entries.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadEntries();
    return () => { active = false; };
  }, [id, router, reloadKey]);

  const academies = useMemo(() => Array.from(new Set(entries.map((entry) => entry.boxer.academy?.name).filter((name): name is string => Boolean(name)))).sort(), [entries]);
  const filtered = useMemo(() => entries.filter((entry) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = `${entry.boxer.name} ${entry.boxer.academy?.name ?? ""} ${entry.boxer.weight ?? ""} ${entry.boxer.ageGroup ?? ""}`.toLowerCase().includes(query);
    return matchesSearch && (academy === "all" || entry.boxer.academy?.name === academy);
  }), [entries, search, academy]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function exportCSV() {
    const rows = [["Boxer Name", "Weight", "Age Group", "Academy / Club", "Registered On"], ...filtered.map((entry) => [entry.boxer.name, entry.boxer.weight ?? "", entry.boxer.ageGroup ?? "", entry.boxer.academy?.name ?? "", formatDate(entry.createdAt)])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${tournament ? tournamentSlug(tournament.name) : "tournament"}-entries.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout role="superadmin">
      <main className="mx-auto w-full max-w-[1600px] space-y-6 pb-12 text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => router.push("/dashboard/admin/tournaments")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-red-600"><ArrowLeft size={17} /> Back to Tournaments</button>
          <button type="button" onClick={() => setReloadKey((n) => n + 1)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
        </div>

        {loading ? <div className="space-y-5 animate-pulse"><div className="h-56 rounded-3xl bg-slate-200" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-28 rounded-2xl bg-slate-100" />)}</div><div className="h-80 rounded-2xl bg-slate-100" /></div> : error ? <div role="alert" className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700"><AlertCircle size={20} /> {error}</div> : tournament && <>
          <section className="relative overflow-hidden rounded-[26px] bg-[#111827] px-6 py-8 text-white sm:px-9 lg:px-11 lg:py-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[55px] border-red-600/15" />
            <div aria-hidden="true" className="pointer-events-none absolute right-20 top-0 hidden h-full w-14 rotate-[24deg] bg-red-600/20 lg:block" />
            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-red-300"><Trophy size={15} /> Tournament Management</span><span className={`rounded-full border px-3 py-1 text-[11px] font-bold capitalize ${statusColors[tournament.status.toLowerCase()] ?? "bg-slate-100 text-slate-700"}`}>{tournament.status}</span></div>
                <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-[38px]">{tournament.name}</h1>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><CalendarDays size={17} className="text-red-400" />{formatDate(tournament.startDate)}{tournament.endDate ? ` – ${formatDate(tournament.endDate)}` : ""}</span><span className="inline-flex items-center gap-2"><MapPin size={17} className="text-red-400" />{tournament.location || "Venue TBD"}</span></div>
              </div>
              <div className="relative shrink-0 rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-sm"><p className="text-xs font-medium text-slate-300">Entry Fee</p><p className="mt-1 text-3xl font-black">{tournament.entryFee == null ? "TBD" : `₹${tournament.entryFee.toLocaleString("en-IN")}`}</p><p className="mt-1 text-xs text-slate-400">Per boxer</p></div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Registered Boxers", value: entries.length.toLocaleString("en-IN"), note: "Tournament entries", icon: Users, tone: "bg-red-50 text-red-600" },
              { label: "Academies / Clubs", value: academies.length.toLocaleString("en-IN"), note: "Represented academies", icon: Building2, tone: "bg-blue-50 text-blue-600" },
              { label: "Estimated Entry Value", value: tournament.entryFee == null ? "—" : `₹${(tournament.entryFee * entries.length).toLocaleString("en-IN")}`, note: "Not verified payment revenue", icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
            ].map((stat) => <article key={stat.label} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div><p className="text-xs font-semibold text-slate-500">{stat.label}</p><p className="mt-3 text-3xl font-black tracking-tight">{stat.value}</p><p className="mt-2 text-xs text-slate-400">{stat.note}</p></div><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}><stat.icon size={22} /></span></article>)}
          </section>

          <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7"><div><h2 className="text-xl font-extrabold">Registered Boxers</h2><p className="mt-1 text-sm text-slate-500">Browse and manage tournament participants</p></div><button type="button" onClick={exportCSV} disabled={filtered.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"><Download size={16} /> Export CSV</button></div>
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:px-7"><div className="relative flex-1"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search boxers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search boxer, academy, weight..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" /></div><select aria-label="Filter by academy" value={academy} onChange={(event) => { setAcademy(event.target.value); setPage(1); }} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-red-400 sm:w-60"><option value="all">All Academies</option>{academies.map((name) => <option key={name} value={name}>{name}</option>)}</select><span className="text-xs font-semibold text-slate-500 sm:ml-2">{filtered.length} results</span></div>
            {filtered.length === 0 ? <div className="px-5 py-16 text-center"><Users size={38} className="mx-auto text-slate-300" /><h3 className="mt-4 font-bold">{entries.length ? "No matching boxers" : "No boxers registered yet"}</h3><p className="mt-2 text-sm text-slate-500">{entries.length ? "Try another search or academy filter." : "Registrations will appear here when boxers join."}</p></div> : <>
              <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr>{["Boxer", "Weight", "Age Group", "Academy / Club", "Registered On"].map((heading) => <th key={heading} className="whitespace-nowrap px-6 py-4">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visible.map((entry) => <tr key={entry.id} className="transition hover:bg-red-50/30"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-extrabold text-red-600">{initials(entry.boxer.name)}</span><span className="font-bold text-slate-900">{entry.boxer.name}</span></div></td><td className="px-6 py-4 text-slate-600">{entry.boxer.weight ?? "—"}</td><td className="px-6 py-4 text-slate-600">{entry.boxer.ageGroup ?? "—"}</td><td className="px-6 py-4 text-slate-600">{entry.boxer.academy?.name ?? "—"}</td><td className="whitespace-nowrap px-6 py-4 text-slate-500">{formatDate(entry.createdAt)}</td></tr>)}</tbody></table></div>
              <div className="divide-y divide-slate-100 md:hidden">{visible.map((entry) => <article key={entry.id} className="p-5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-600">{initials(entry.boxer.name)}</span><div className="min-w-0"><p className="font-bold text-slate-900">{entry.boxer.name}</p><p className="mt-1 truncate text-xs text-slate-500">{entry.boxer.academy?.name ?? "No academy listed"}</p></div></div><div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs"><div><p className="text-slate-400">Weight</p><p className="mt-1 font-semibold">{entry.boxer.weight ?? "—"}</p></div><div><p className="text-slate-400">Age Group</p><p className="mt-1 font-semibold">{entry.boxer.ageGroup ?? "—"}</p></div><div><p className="text-slate-400">Registered</p><p className="mt-1 font-semibold">{formatDate(entry.createdAt)}</p></div></div></article>)}</div>
              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7"><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} boxers</span><div className="flex items-center gap-3"><button type="button" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:opacity-40">Previous</button><span className="font-semibold">{currentPage} / {pages}</span><button type="button" disabled={currentPage === pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
            </>}
          </section>
        </>}
      </main>
    </DashboardLayout>
  );
}
