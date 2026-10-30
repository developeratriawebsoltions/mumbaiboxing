
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import {
  AlertCircle, Check, CheckCircle2, ChevronRight, Clock3,
  FileText, MapPin, Medal, RefreshCw, Search, ShieldCheck,
  Trophy, UserRound, X, XCircle,
} from "lucide-react";

type Status = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

type TournamentHistory = {
  id: number;
  boxerId: number;
  tournamentName: string;
  location: string | null;
  tournamentDate: string | null;
  tournamentType: string | null;
  weightCategory: string | null;
  result: string | null;
  medal: string | null;
  position: number | null;
  coachName: string | null;
  notes: string | null;
  documentPath: string | null;
  documentName: string | null;
  status: string;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  boxer: {
    id: number;
    name: string;
    gender: string | null;
    weight: string | null;
    weightCategory: string | null;
    ageGroup: string | null;
    category: string | null;
    membershipExpiry: string | null;
    user: {
      id: number;
      email: string;
      membershipId: string | null;
      registrationStatus: string;
    };
    academy: { id: number; name: string } | null;
  };
};

const tabs: { id: Status; label: string; description: string }[] = [
  { id: "PENDING_REVIEW", label: "Pending Review", description: "Awaiting verification" },
  { id: "APPROVED", label: "Approved", description: "Verified records" },
  { id: "REJECTED", label: "Rejected", description: "Declined submissions" },
];

const date = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const medalLabels: Record<string, string> = {
  GOLD: "🥇 Gold",
  SILVER: "🥈 Silver",
  BRONZE: "🥉 Bronze",
  NONE: "No Medal",
};

const medalLabel = (value: string | null) =>
  medalLabels[value || ""] || value || "—";

function StatusBadge({ status }: { status: string }) {
  const config =
    status === "APPROVED"
      ? { label: "Approved", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" }
      : status === "REJECTED"
      ? { label: "Rejected", icon: XCircle, color: "bg-red-50 text-red-700" }
      : { label: "Pending Review", icon: Clock3, color: "bg-amber-50 text-amber-700" };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.color}`}>
      <Icon size={13} /> {config.label}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="break-words text-sm font-semibold text-slate-800">{value || "—"}</div>
    </div>
  );
}

export default function TournamentHistoryReviewPage() {
  const [activeTab, setActiveTab] = useState<Status>("PENDING_REVIEW");
  const [history, setHistory] = useState<TournamentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TournamentHistory | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/admin/tournament-history?status=${activeTab}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Unable to load records");
      setHistory(data.history || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { void loadHistory(); }, [loadHistory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((r) =>
      !q || [
        r.tournamentName, r.boxer.name, r.boxer.user.email,
        r.boxer.user.membershipId, r.location,
        r.coachName, r.boxer.academy?.name
      ].some((v) => v?.toLowerCase().includes(q))
    );
  }, [history, search]);

  const closeModal = () => {
    setSelected(null);
    setRejecting(false);
    setRejectionReason("");
  };

  const handleApprove = async (record: TournamentHistory) => {
    if (!window.confirm(`Approve "${record.tournamentName}" for ${record.boxer.name}?`)) return;
    try {
      setProcessingId(record.id);
      setError("");
      setSuccess("");
      const res = await fetch(`/api/admin/tournament-history/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Approval failed");
      closeModal();
      await loadHistory();
      setSuccess("Tournament record approved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }
    try {
      setProcessingId(selected.id);
      setError("");
      setSuccess("");
      const res = await fetch(`/api/admin/tournament-history/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Rejection failed");
      closeModal();
      await loadHistory();
      setSuccess("Tournament record rejected successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout role="superadmin">
      <main className="min-h-screen bg-[#F6F7F9] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1500px] space-y-6">

          {/* HEADER */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                <ShieldCheck size={16} />
                Administration
                <ChevronRight size={13} />
                Tournament Records
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Tournament Review
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Verify achievements and manage boxer tournament submissions.
              </p>
            </div>
            <button onClick={() => void loadHistory()} disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Records
            </button>
          </header>

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.id === "PENDING_REVIEW" ? Clock3 :
                tab.id === "APPROVED" ? CheckCircle2 : XCircle;
              const iconColor = tab.id === "PENDING_REVIEW"
                ? "bg-amber-50 text-amber-600"
                : tab.id === "APPROVED"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600";
              return (
                <button key={tab.id} onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                  closeModal();
                  setError("");
                  setSuccess("");
                }} className={`flex items-center gap-4 rounded-2xl border bg-white p-4 text-left transition sm:p-5 ${
                  active ? "border-red-300 shadow-md ring-1 ring-red-100" :
                  "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                    <Icon size={23} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{tab.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{tab.description}</p>
                    {active && <p className="mt-1 text-sm font-bold text-red-600">
                      {loading ? "Loading..." : `${history.length} records`}
                    </p>}
                  </div>
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-red-600" />}
                </button>
              );
            })}
          </div>

          {/* ALERTS */}
          {error && (
            <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error"><X size={17}/></button>
            </div>
          )}
          {success && (
            <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="shrink-0" />
              <span className="flex-1">{success}</span>
              <button onClick={() => setSuccess("")} aria-label="Dismiss success"><X size={17}/></button>
            </div>
          )}

          {/* RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {tabs.find(t => t.id === activeTab)?.label} Records
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {loading ? "Loading records..." : `${filtered.length} matching submissions`}
                </p>
              </div>
              <div className="relative w-full sm:max-w-sm">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search boxer, tournament, ID..."
                  aria-label="Search tournament records"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100" />
              </div>
            </div>

            <div className="space-y-3 p-4 sm:p-6">
              {loading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-100" />
                ))
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Trophy size={28} />
                  </div>
                  <h3 className="font-bold text-slate-900">No records found</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {search ? "Try a different search term." : "No submissions in this category."}
                  </p>
                </div>
              ) : filtered.map(record => (
                <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-md sm:p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

                    <div className="flex min-w-0 gap-3 xl:w-[28%]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <UserRound size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-slate-900">{record.boxer.name}</h3>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {record.boxer.user.membershipId || "No Membership ID"}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-400">{record.boxer.user.email}</p>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 xl:border-l xl:border-slate-100 xl:pl-6">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={record.status} />
                        {record.medal && record.medal !== "NONE" && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {medalLabel(record.medal)}
                          </span>
                        )}
                      </div>
                      <h4 className="break-words text-base font-bold text-slate-900">
                        {record.tournamentName}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14}/>{date(record.tournamentDate)}
                        </span>
                        {record.location && <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14}/>{record.location}
                        </span>}
                        {record.weightCategory && <span className="inline-flex items-center gap-1.5">
                          <Medal size={14}/>{record.weightCategory}
                        </span>}
                        {record.position != null && <span>Position #{record.position}</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <button onClick={() => { setSelected(record); setRejecting(false); setRejectionReason(""); }}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <FileText size={16}/> View Details
                      </button>
                      {record.status === "PENDING_REVIEW" && (
                        <button disabled={processingId !== null} onClick={() => void handleApprove(record)}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                          <Check size={16}/> Approve
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* REVIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
          role="presentation" onMouseDown={e => { if (e.target === e.currentTarget && processingId === null) closeModal(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="review-title"
            className="flex max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-5 sm:px-6">
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
                  <Trophy size={15}/> Tournament Submission
                </p>
                <h2 id="review-title" className="break-words text-xl font-extrabold text-slate-900">
                  {selected.tournamentName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Submitted by <strong className="text-slate-700">{selected.boxer.name}</strong>
                </p>
              </div>
              <button onClick={closeModal} disabled={processingId !== null} aria-label="Close review"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50">
                <X size={20}/>
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">Submission Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {selected.boxer.academy?.name || "Academy not specified"}
                  </p>
                </div>
                <StatusBadge status={selected.status}/>
              </div>

              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-900">Boxer Information</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Detail label="Boxer Name" value={selected.boxer.name}/>
                  <Detail label="Membership ID" value={selected.boxer.user.membershipId}/>
                  <Detail label="Email Address" value={selected.boxer.user.email}/>
                  <Detail label="Academy" value={selected.boxer.academy?.name}/>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-900">Tournament Information</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Detail label="Tournament Date" value={date(selected.tournamentDate)}/>
                  <Detail label="Location" value={selected.location}/>
                  <Detail label="Tournament Type" value={selected.tournamentType}/>
                  <Detail label="Weight Category" value={selected.weightCategory}/>
                  <Detail label="Result" value={selected.result}/>
                  <Detail label="Medal" value={medalLabel(selected.medal)}/>
                  <Detail label="Position" value={selected.position != null ? `#${selected.position}` : "—"}/>
                  <Detail label="Coach" value={selected.coachName}/>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-900">Boxer Notes</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selected.notes || "No notes provided."}
                </p>
              </section>

              <section className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FileText size={20}/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500">Supporting Document</p>
                  {selected.documentPath ? (
                    <a href={`/api/tournament-history/${selected.id}/document`}
                      target="_blank" rel="noopener noreferrer"
                      className="mt-1 block break-all text-sm font-semibold text-red-600 hover:underline">
                      {selected.documentName || "View Supporting Document"}
                    </a>
                  ) : <p className="mt-1 text-sm text-slate-500">No document attached</p>}
                </div>
              </section>

              {selected.rejectionReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <h3 className="text-sm font-bold text-red-700">Rejection Reason</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-red-700">{selected.rejectionReason}</p>
                </div>
              )}

              {selected.reviewedAt && (
                <p className="text-xs text-slate-400">
                  Reviewed on {new Date(selected.reviewedAt).toLocaleString("en-IN")}
                </p>
              )}

              {rejecting && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <label htmlFor="rejection-reason" className="mb-2 block text-sm font-bold text-red-800">
                    Rejection Reason *
                  </label>
                  <textarea id="rejection-reason" rows={4} value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Explain why this tournament record is being rejected..."
                    className="w-full resize-none rounded-xl border border-red-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-red-200"/>
                  <p className="mt-2 text-xs text-red-600">
                    This reason will be visible to the boxer.
                  </p>
                  {error && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{error}</p>}
                </div>
              )}
            </div>

            {selected.status === "PENDING_REVIEW" && (
              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button disabled={processingId !== null}
                  onClick={() => { if (rejecting) { setRejecting(false); setRejectionReason(""); setError(""); } else closeModal(); }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                  Cancel
                </button>
                {rejecting ? (
                  <button disabled={processingId !== null} onClick={() => void handleReject()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                    <XCircle size={17}/>
                    {processingId === selected.id ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                ) : (
                  <>
                    <button disabled={processingId !== null} onClick={() => setRejecting(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                      <XCircle size={17}/> Reject
                    </button>
                    <button disabled={processingId !== null} onClick={() => void handleApprove(selected)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                      <Check size={17}/>
                      {processingId === selected.id ? "Approving..." : "Approve Record"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
