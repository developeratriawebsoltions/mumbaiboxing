"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, RefreshCw, Search, ShieldCheck, Trophy, Users, X, AlertCircle, Medal, Share2 } from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { useSearchParams } from "next/navigation";
import { tournamentUrl } from "@/lib/tournament-url";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
  createdAt: string;
  registered?: boolean;
  registrationPending?: boolean;
  _count?: {
    entries: number;
  };
};

function TournamentDashboardContent() {
  const role = useRole();
  const searchParams = useSearchParams();
  const requestedTournamentId = Number(searchParams.get("tournamentId"));
  const selectedTournamentId =
    Number.isInteger(requestedTournamentId) && requestedTournamentId > 0
      ? requestedTournamentId
      : null;

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState<number | null>(null);
  const [cashPendingId, setCashPendingId] = useState<number | null>(null);
  const [paymentTournament, setPaymentTournament] = useState<Tournament | null>(null);
  const [shareFeedback, setShareFeedback] = useState<{
    tournamentId: number;
    message: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tournaments", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load tournaments.");
        return;
      }

      if (!Array.isArray(data)) {
        setError("Invalid tournament data received.");
        return;
      }

      setTournaments(data);
    } catch {
      setError("Failed to load tournaments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCashRegistration(tournament: Tournament) {
    setPaying(tournament.id);
    setError("");

    try {
      const response = await fetch("/api/tournaments/offline-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tournamentId: tournament.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not request cash payment.");
      }

      setPaymentTournament(null);
      setCashPendingId(tournament.id);
      await loadTournaments();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not request cash payment.",
      );
    } finally {
      setPaying(null);
    }
  }

  async function shareTournament(tournament: Tournament) {
    const url = `${window.location.origin}${tournamentUrl(tournament)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: tournament.name,
          text: `View ${tournament.name}`,
          url,
        });
        setShareFeedback({
          tournamentId: tournament.id,
          message: "Tournament link shared.",
          isError: false,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy command was not successful.");
      }

      setShareFeedback({
        tournamentId: tournament.id,
        message: "Tournament link copied.",
        isError: false,
      });
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") {
        return;
      }
      console.error("Could not share tournament link:", shareError);
      setShareFeedback({
        tournamentId: tournament.id,
        message: "Could not share or copy the tournament link.",
        isError: true,
      });
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "TBD";

    return new Date(d).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "registered" | "completed">("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const registeredCount = tournaments.filter(t => t.registered || t.registrationPending).length;
  const openCount = tournaments.filter(t => t.status.toLowerCase() === "open").length;
  const completedCount = tournaments.filter(t => t.status.toLowerCase() === "completed").length;
  const filtered = useMemo(() => tournaments.filter(t => {
    const matchesText = [t.name, t.location || "", t.weightClass || ""].some(v => v.toLowerCase().includes(search.trim().toLowerCase()));
    const matchesFilter = filter === "all" || (filter === "registered" ? Boolean(t.registered || t.registrationPending) : t.status.toLowerCase() === filter);
    return matchesText && matchesFilter;
  }), [tournaments, search, filter]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const statusStyle = (status: string) => {
    const key = status.toLowerCase();
    if (key === "open") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (key === "ongoing") return "bg-blue-50 text-blue-700 border-blue-200";
    if (key === "completed") return "bg-slate-100 text-slate-600 border-slate-200";
    if (key === "cancelled") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <DashboardLayout role={role || undefined}>
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,.13)] sm:px-9 lg:px-11 lg:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.08]" style={{backgroundImage:"linear-gradient(#fff 1px, transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"38px 38px"}} />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[24%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[19%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />
          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <a href={role === "coach" ? "/dashboard/coach" : role === "boxer" ? "/dashboard/boxer" : "/dashboard"} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</a>
              <div className="mb-4 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-red-300">North Bombay District Amateur Boxing Association (NBDABA)</span></div>
              <h1 className="text-[34px] font-black tracking-tight sm:text-[44px]">Tournaments<span className="text-red-500">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Explore boxing events, check entry details and manage your tournament registrations.</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-red-400" /> Official MBA Events</span>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600"><Trophy className="h-6 w-6" /></div><div><p className="text-[11px] text-slate-300">Total Tournaments</p><p className="mt-1 text-3xl font-black">{tournaments.length}</p></div></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span><button type="button" onClick={loadTournaments} className="font-bold underline">Retry</button></div>}
        {cashPendingId !== null && <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900"><span className="flex items-center gap-2"><Clock3 className="h-5 w-5" />Cash payment requested for {tournaments.find(tournament => tournament.id === cashPendingId)?.name ?? "this tournament"}. Your registration will be confirmed and the receipt emailed after an admin approves the cash.</span><button type="button" onClick={() => setCashPendingId(null)} aria-label="Dismiss cash request message"><X className="h-4 w-4" /></button></div>}

        {loading ? <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i => <div key={i} className="h-36 animate-pulse rounded-[20px] bg-slate-100" />)}</div><div className="h-80 animate-pulse rounded-[22px] bg-slate-100" /></div> : !error && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TournamentStat icon={<Trophy className="h-5 w-5" />} label="Total Events" value={tournaments.length} detail="Listed tournaments" tone="red" />
            <TournamentStat icon={<CheckCircle2 className="h-5 w-5" />} label="My Registrations" value={registeredCount} detail="Events you've joined" tone="green" />
            <TournamentStat icon={<CalendarDays className="h-5 w-5" />} label="Open for Entry" value={openCount} detail="Accepting registrations" tone="blue" />
            <TournamentStat icon={<Medal className="h-5 w-5" />} label="Completed" value={completedCount} detail="Concluded events" tone="amber" />
          </div>

          <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
              <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trophy className="h-5 w-5" /></div><div><h2 className="text-lg font-extrabold">Tournament Directory</h2><p className="mt-1 text-xs text-slate-500">Find an event and view its registration status</p></div></div>
              <button type="button" onClick={loadTournaments} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh Events</button>
            </div>
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => {setSearch(e.target.value);setPage(1);}} placeholder="Search tournament, venue or weight..." aria-label="Search tournaments" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" /></div>
              <div className="flex flex-wrap gap-2">{([ ["all","All Events"],["open","Open"],["registered","My Entries"],["completed","Completed"] ] as const).map(([key,label]) => <button type="button" key={key} onClick={() => {setFilter(key);setPage(1);}} className={`rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${filter === key ? "bg-[#07172c] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"}`}>{label}</button>)}</div>
            </div>
            {filtered.length === 0 ? <div className="px-6 py-16 text-center"><Trophy className="mx-auto h-12 w-12 text-slate-300" /><h3 className="mt-4 font-extrabold">{tournaments.length === 0 ? "No tournaments available yet" : "No matching tournaments"}</h3><p className="mt-2 text-sm text-slate-500">{tournaments.length === 0 ? "New events will appear here once published." : "Try a different search or filter."}</p></div> : <>
              <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
                {visible.map(tournament => <article key={tournament.id} className={`flex min-w-0 flex-col overflow-hidden rounded-[20px] border bg-white transition hover:-translate-y-0.5 hover:shadow-lg ${tournament.id === selectedTournamentId ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 hover:border-red-200"}`}>
                  <div className="relative overflow-hidden bg-[#07172c] p-5 text-white"><div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-44 w-10 rotate-[25deg] bg-red-600" /><div aria-hidden="true" className="pointer-events-none absolute right-8 top-0 h-40 w-4 rotate-[25deg] bg-red-500/30" /><div className="relative flex items-center justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10"><Trophy className="h-6 w-6 text-red-400" /></div><span className={`rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${statusStyle(tournament.status)}`}>{tournament.status}</span></div><p className="relative mt-6 text-[10px] font-extrabold uppercase tracking-[.18em] text-red-300">MBA Boxing Event</p><h3 className="relative mt-2 min-h-[58px] break-words text-xl font-extrabold leading-7">{tournament.name}</h3>{tournament.registered && <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold text-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Registered</span>}{tournament.registrationPending && <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-500/20 px-3 py-1.5 text-[11px] font-bold text-amber-100"><Clock3 className="h-3.5 w-3.5" /> Cash payment pending</span>}{tournament.id === selectedTournamentId && <span className="relative mt-3 ml-2 inline-flex rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-bold">Selected Event</span>}</div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="space-y-4">
                      <TournamentDetail icon={<CalendarDays className="h-4 w-4" />} label="Event Dates" value={`${formatDate(tournament.startDate)}${tournament.endDate ? ` – ${formatDate(tournament.endDate)}` : ""}`} />
                      <TournamentDetail icon={<MapPin className="h-4 w-4" />} label="Venue" value={tournament.location || "Venue TBD"} />
                      <TournamentDetail icon={<Medal className="h-4 w-4" />} label="Weight Class" value={tournament.weightClass || "Not specified"} />
                      {tournament._count && <TournamentDetail icon={<Users className="h-4 w-4" />} label="Registered Boxers" value={String(tournament._count.entries)} />}
                    </div>
                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs font-semibold text-slate-500">Entry Fee</span>
                        <span className="text-xl font-black text-[#07172c]">₹{(tournament.entryFee ?? 500).toLocaleString("en-IN")}</span>
                      </div>
                      {role === "boxer" && !tournament.registered && !tournament.registrationPending && tournament.status.toLowerCase() === "open" ? (
                        <button type="button" onClick={() => setPaymentTournament(tournament)} disabled={paying !== null} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#c9151e] disabled:cursor-not-allowed disabled:opacity-50">
                          <Users className="h-4 w-4" />Register for this event
                        </button>
                      ) : (
                        <div className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold ${tournament.registered ? "bg-emerald-50 text-emerald-700" : tournament.registrationPending ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
                          {tournament.registered ? <><CheckCircle2 className="h-4 w-4" /> Registration Confirmed</> : tournament.registrationPending ? <><Clock3 className="h-4 w-4" /> Awaiting cash approval</> : <><Clock3 className="h-4 w-4" />{role !== "boxer" ? "View Only" : "Registration Unavailable"}</>}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => void shareTournament(tournament)}
                        className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Share2 className="h-4 w-4" />
                        Share tournament link
                      </button>
                      {shareFeedback?.tournamentId === tournament.id && (
                        <p
                          role={shareFeedback.isError ? "alert" : "status"}
                          className={`mt-2 text-center text-xs ${shareFeedback.isError ? "text-red-600" : "text-emerald-700"}`}
                        >
                          {shareFeedback.message}
                        </p>
                      )}
                    </div>
                  </div>
                </article>)}
              </div>
              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6"><p className="text-xs text-slate-500">Showing <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong className="text-slate-800">{filtered.length}</strong> tournaments</p><div className="flex items-center gap-3"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1,p-1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ArrowLeft className="h-4 w-4" /></button><span className="text-xs font-bold">Page {currentPage} of {pages}</span><button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(p => Math.min(pages,p+1))} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ArrowRight className="h-4 w-4" /></button></div></div>
            </>}
          </section>
        </>}
      </main>
      {paymentTournament && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && paying === null) {
              setPaymentTournament(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="tournament-payment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="tournament-payment-title" className="text-lg font-bold">
                  Register for {paymentTournament.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Entry fee: ₹{(paymentTournament.entryFee ?? 500).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentTournament(null)}
                disabled={paying !== null}
                aria-label="Close payment options"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => void handleCashRegistration(paymentTournament)}
                disabled={paying !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
              >
                <Users className="h-4 w-4" />
                {paying === paymentTournament.id ? "Submitting..." : "Pay cash to the association"}
              </button>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Cash registration is confirmed after an admin receives and approves your payment. A receipt will be emailed after approval.
            </p>
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}


function TournamentStat({icon,label,value,detail,tone}:{icon:React.ReactNode;label:string;value:number;detail:string;tone:"red"|"green"|"blue"|"amber"}) {
  const colors={red:"bg-red-50 text-red-600",green:"bg-emerald-50 text-emerald-600",blue:"bg-blue-50 text-blue-600",amber:"bg-amber-50 text-amber-600"};
  return <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-3"><p className="text-[13px] font-semibold text-slate-500">{label}</p><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[tone]}`}>{icon}</div></div><p className="mt-3 text-[34px] font-black tracking-tight text-[#07172c]">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div>;
}
function TournamentDetail({icon,label,value}:{icon:React.ReactNode;label:string;value:string}) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 shrink-0 text-slate-400">{icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div></div>;
}

export default function TournamentDashboard() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading tournaments...</div>}>
      <TournamentDashboardContent />
    </Suspense>
  );
}