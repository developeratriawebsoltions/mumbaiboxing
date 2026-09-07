"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Medal,
  Search,
  ShieldCheck,
  Trophy,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

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

    academy: {
      id: number;
      name: string;
    } | null;
  };
};

type TabType = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

const tabs: {
  id: TabType;
  label: string;
}[] = [
  {
    id: "PENDING_REVIEW",
    label: "Pending Review",
  },
  {
    id: "APPROVED",
    label: "Approved",
  },
  {
    id: "REJECTED",
    label: "Rejected",
  },
];

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMedalLabel(medal: string | null) {
  switch (medal) {
    case "GOLD":
      return "Gold";
    case "SILVER":
      return "Silver";
    case "BRONZE":
      return "Bronze";
    case "NONE":
      return "No Medal";
    default:
      return medal || "—";
  }
}

function MedalIcon({ medal }: { medal: string | null }) {
  if (medal === "GOLD") {
    return <span className="text-xl">🥇</span>;
  }

  if (medal === "SILVER") {
    return <span className="text-xl">🥈</span>;
  }

  if (medal === "BRONZE") {
    return <span className="text-xl">🥉</span>;
  }

  return <Medal size={18} />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={14} />
        Approved
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        <XCircle size={14} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <Clock3 size={14} />
      Pending Review
    </span>
  );
}

export default function TournamentHistoryReviewPage() {
  const [activeTab, setActiveTab] = useState<TabType>("PENDING_REVIEW");

  const [history, setHistory] = useState<TournamentHistory[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedRecord, setSelectedRecord] =
    useState<TournamentHistory | null>(null);

  const [search, setSearch] = useState("");

  const [processingId, setProcessingId] = useState<number | null>(null);

  const [rejecting, setRejecting] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/tournament-history?status=${activeTab}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load tournament records");
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tournament records",
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter((record) => {
      return (
        record.tournamentName?.toLowerCase().includes(query) ||
        record.boxer?.name?.toLowerCase().includes(query) ||
        record.boxer?.user?.email?.toLowerCase().includes(query) ||
        record.boxer?.user?.membershipId?.toLowerCase().includes(query) ||
        record.location?.toLowerCase().includes(query) ||
        record.coachName?.toLowerCase().includes(query)
      );
    });
  }, [history, search]);

  async function handleApprove(record: TournamentHistory) {
    const confirmed = window.confirm(
      `Approve "${record.tournamentName}" for ${record.boxer.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(record.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/tournament-history/${record.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "APPROVE",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to approve record");
      }

      setSuccess("Tournament record approved successfully.");

      setSelectedRecord(null);

      await loadHistory();
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Failed to approve record");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject() {
    if (!selectedRecord) {
      return;
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setProcessingId(selectedRecord.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/tournament-history/${selectedRecord.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            rejectionReason: reason,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to reject record");
      }

      setSuccess("Tournament record rejected successfully.");

      setSelectedRecord(null);
      setRejecting(false);
      setRejectionReason("");

      await loadHistory();
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Failed to reject record");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <DashboardLayout role="superadmin">
      <div className="min-h-screen bg-[#F7F7F5]">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
                <ShieldCheck size={17} />
                Super Admin
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tournament Review
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Review tournament history submitted by registered boxers.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Trophy size={18} className="text-red-600" />

              <div>
                <p className="text-xs text-slate-500">Current Queue</p>

                <p className="text-sm font-semibold text-slate-900">
                  {history.length} record
                  {history.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <div className="flex-1">{error}</div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

              <div className="flex-1">{success}</div>

              <button
                type="button"
                onClick={() => setSuccess("")}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSearch("");
                        setSelectedRecord(null);
                        setError("");
                        setSuccess("");
                      }}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative my-5 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search boxer, tournament, membership..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-44 animate-pulse rounded-2xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                    {activeTab === "PENDING_REVIEW" ? (
                      <Clock3 size={25} />
                    ) : activeTab === "APPROVED" ? (
                      <CheckCircle2 size={25} />
                    ) : (
                      <XCircle size={25} />
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    No tournament records found
                  </h3>

                  <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                    {activeTab === "PENDING_REVIEW"
                      ? "There are currently no tournament records waiting for review."
                      : activeTab === "APPROVED"
                        ? "No tournament records have been approved yet."
                        : "No tournament records have been rejected."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        {/* Boxer */}
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <UserRound size={22} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-bold text-slate-900">
                                {record.boxer.name}
                              </h3>

                              <StatusBadge status={record.status} />
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {record.boxer.user.membershipId ||
                                "No Membership ID"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {record.boxer.user.email}
                            </p>
                          </div>
                        </div>

                        {/* Tournament */}
                        <div className="min-w-0 flex-1 lg:px-6">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-red-600">
                              <Trophy size={20} />
                            </div>

                            <div className="min-w-0">
                              <h4 className="truncate text-base font-semibold text-slate-900">
                                {record.tournamentName}
                              </h4>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                <span>{formatDate(record.tournamentDate)}</span>

                                {record.location && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin size={14} />
                                    {record.location}
                                  </span>
                                )}

                                {record.tournamentType && (
                                  <span>{record.tournamentType}</span>
                                )}
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                                  <MedalIcon medal={record.medal} />
                                  {getMedalLabel(record.medal)}
                                </span>

                                {record.position && (
                                  <span className="text-slate-500">
                                    Position #{record.position}
                                  </span>
                                )}

                                {record.weightCategory && (
                                  <span className="text-slate-500">
                                    {record.weightCategory}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <FileText size={16} />
                            View & Review
                          </button>

                          {activeTab === "PENDING_REVIEW" && (
                            <button
                              type="button"
                              disabled={processingId === record.id}
                              onClick={() => handleApprove(record)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Check size={16} />
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-red-600">
                  <Trophy size={16} />
                  Tournament Submission
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {selectedRecord.tournamentName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Submitted by{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedRecord.boxer.name}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedRecord(null);
                  setRejecting(false);
                  setRejectionReason("");
                }}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard label="Boxer" value={selectedRecord.boxer.name} />

                <InfoCard
                  label="Membership ID"
                  value={selectedRecord.boxer.user.membershipId || "—"}
                />

                <InfoCard
                  label="Email"
                  value={selectedRecord.boxer.user.email}
                />

                <InfoCard
                  label="Academy"
                  value={selectedRecord.boxer.academy?.name || "—"}
                />

                <InfoCard
                  label="Tournament Date"
                  value={formatDate(selectedRecord.tournamentDate)}
                />

                <InfoCard
                  label="Location"
                  value={selectedRecord.location || "—"}
                />

                <InfoCard
                  label="Tournament Type"
                  value={selectedRecord.tournamentType || "—"}
                />

                <InfoCard
                  label="Weight Category"
                  value={selectedRecord.weightCategory || "—"}
                />

                <InfoCard label="Result" value={selectedRecord.result || "—"} />

                <InfoCard
                  label="Medal"
                  value={getMedalLabel(selectedRecord.medal)}
                  icon={<MedalIcon medal={selectedRecord.medal} />}
                />

                <InfoCard
                  label="Position"
                  value={
                    selectedRecord.position
                      ? `#${selectedRecord.position}`
                      : "—"
                  }
                />

                <InfoCard
                  label="Coach"
                  value={selectedRecord.coachName || "—"}
                />
              </div>

              {/* Notes */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Boxer Notes
                </p>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {selectedRecord.notes || "No notes provided."}
                </p>
              </div>

              {/* Supporting Document */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Supporting Document
                    </p>

                    {selectedRecord.documentPath ? (
                      <a
                        href={selectedRecord.documentPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
                      >
                        <span className="truncate">
                          {selectedRecord.documentName ||
                            "View supporting document"}
                        </span>

                        <span className="shrink-0 text-xs">View</span>
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium text-slate-500">
                        No document attached
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Existing rejection reason */}
              {selectedRecord.rejectionReason && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                    Rejection Reason
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {selectedRecord.rejectionReason}
                  </p>
                </div>
              )}

              {/* Review info */}
              {selectedRecord.reviewedAt && (
                <div className="mt-4 text-xs text-slate-400">
                  Reviewed on {formatDateTime(selectedRecord.reviewedAt)}
                </div>
              )}

              {/* Rejection form */}
              {rejecting && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-red-800">
                    Rejection Reason *
                  </label>

                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    rows={4}
                    placeholder="Explain why this tournament record is being rejected..."
                    className="w-full resize-none rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />

                  <p className="mt-2 text-xs text-red-500">
                    This reason will be visible to the boxer.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedRecord.status === "PENDING_REVIEW" && (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                {!rejecting ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(null)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={processingId === selectedRecord.id}
                      onClick={() => setRejecting(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      type="button"
                      disabled={processingId === selectedRecord.id}
                      onClick={() => handleApprove(selectedRecord)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={17} />
                      Approve Record
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRejecting(false);
                        setRejectionReason("");
                        setError("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={processingId === selectedRecord.id}
                      onClick={handleReject}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={17} />
                      {processingId === selectedRecord.id
                        ? "Rejecting..."
                        : "Reject Record"}
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

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
