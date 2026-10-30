
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileImage,
  FileText,
  FolderOpen,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
  UserRound,
  X,
} from "lucide-react";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
};

type Coach = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
    documents: Doc[];
  };
  academy: { name: string } | null;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const coachId = (coach: Coach) => {
  const year = new Date(coach.user.createdAt).getFullYear();
  return `MBA-CCH-${year}-${String(coach.id).padStart(4, "0")}`;
};

const isImage = (doc: Doc) =>
  doc.fileType?.toLowerCase().startsWith("image") ||
  /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(doc.filePath);

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-600">
      {initials || <UserRound size={20} />}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
  active,
  onClick,
}: {
  title: string;
  value: number;
  icon: typeof Users;
  iconClass: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:p-5 ${
        active
          ? "border-red-200 bg-red-50/50 ring-1 ring-red-100"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={21} />
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${active ? "text-red-600" : "text-slate-400"}`}>
          {active ? "Selected filter" : "Quick filter"}
        </span>
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-500">{title}</p>
    </button>
  );
}

function DocumentModal({
  data,
  onClose,
}: {
  data: { name: string; docs: Doc[] };
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<Doc | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (preview) setPreview(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [preview, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="documents-title"
        className="flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-4 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FolderOpen size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Coach Documents
              </p>
              <h2
                id="documents-title"
                className="mt-1 break-words text-lg font-bold text-slate-900 sm:text-xl"
              >
                {data.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {data.docs.length} uploaded document
                {data.docs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close documents"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {data.docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FolderOpen size={29} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No documents uploaded
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                This coach has not uploaded any supporting documents.
              </p>
            </div>
          ) : preview ? (
            <div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"
              >
                <ArrowLeft size={17} />
                Back to documents
              </button>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isImage(preview) ? (
                    <FileImage size={19} className="text-red-600" />
                  ) : (
                    <FileText size={19} className="text-red-600" />
                  )}
                  <h3 className="break-words text-sm font-bold capitalize text-slate-900">
                    {preview.label.replace(/-/g, " ")}
                  </h3>
                </div>
                <a
                  href={preview.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Open File <ExternalLink size={14} />
                </a>
              </div>

              <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {isImage(preview) ? (
                  <img
                    src={preview.filePath}
                    alt={preview.label}
                    className="max-h-[60vh] w-full object-contain"
                  />
                ) : (
                  <iframe
                    src={preview.filePath}
                    title={preview.label}
                    className="h-[55vh] min-h-[350px] w-full bg-white"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.docs.map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setPreview(doc)}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-red-200 hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden bg-slate-50">
                    {isImage(doc) ? (
                      <img
                        src={doc.filePath}
                        alt={doc.label}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <FileText size={30} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold capitalize text-slate-800">
                        {doc.label.replace(/-/g, " ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {isImage(doc) ? "Image" : "Document"}
                      </p>
                    </div>
                    <ChevronRight
                      size={17}
                      className="shrink-0 text-slate-400 group-hover:text-red-600"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCoachesPage() {
  const role = useRole();

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [academyFilter, setAcademyFilter] = useState("all");
  const [docsModal, setDocsModal] = useState<{
    name: string;
    docs: Doc[];
  } | null>(null);

  const loadCoaches = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const response = await fetch("/api/admin/coaches", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load coaches.");
      }
      if (!Array.isArray(data)) {
        throw new Error("Invalid coaches response.");
      }
      setCoaches(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load coaches."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCoaches();
  }, [loadCoaches]);

  const stats = useMemo(() => ({
    total: coaches.length,
    withAcademy: coaches.filter((c) => c.academy).length,
    withoutAcademy: coaches.filter((c) => !c.academy).length,
  }), [coaches]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coaches.filter((coach) => {
      const matchesSearch =
        !query ||
        [
          coach.name,
          coach.user.email,
          coach.phone,
          coach.academy?.name,
          coachId(coach),
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesAcademy =
        academyFilter === "all" ||
        (academyFilter === "with" && !!coach.academy) ||
        (academyFilter === "without" && !coach.academy);

      return matchesSearch && matchesAcademy;
    });
  }, [coaches, search, academyFilter]);

  const hasFilters = search.trim().length > 0 || academyFilter !== "all";
  const clearFilters = () => {
    setSearch("");
    setAcademyFilter("all");
  };

  const openDocuments = (coach: Coach) =>
    setDocsModal({
      name: coach.name,
      docs: coach.user.documents ?? [],
    });

  return (
    <DashboardLayout role={role || undefined}>
      <main className="min-h-screen bg-[#F6F7F9] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1500px] space-y-6">

          {/* Page Header */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                <GraduationCap size={16} />
                Administration
                <ChevronRight size={14} />
                Coaches
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                All Coaches
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                View registered coaches, academy affiliations and documents.
              </p>
            </div>

            <button
              type="button"
              disabled={refreshing || loading}
              onClick={() => void loadCoaches(true)}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh Coaches
            </button>
          </header>

          {error && (
            <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => void loadCoaches(true)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard
              title="Total Coaches"
              value={stats.total}
              icon={Users}
              iconClass="bg-slate-100 text-slate-800"
              active={academyFilter === "all"}
              onClick={() => setAcademyFilter("all")}
            />
            <StatCard
              title="With Academy"
              value={stats.withAcademy}
              icon={Building2}
              iconClass="bg-blue-50 text-blue-600"
              active={academyFilter === "with"}
              onClick={() => setAcademyFilter("with")}
            />
            <StatCard
              title="Without Academy"
              value={stats.withoutAcademy}
              icon={UserRound}
              iconClass="bg-amber-50 text-amber-600"
              active={academyFilter === "without"}
              onClick={() => setAcademyFilter("without")}
            />
          </div>

          {/* Main Directory */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Coaches Directory
                  </h2>
                  <p className="mt-1 text-xs text-slate-500" aria-live="polite">
                    {loading
                      ? "Loading coach records..."
                      : `Showing ${filtered.length} of ${coaches.length} coaches`}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                  <div className="relative w-full sm:min-w-[280px] lg:w-[340px]">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, coach ID..."
                      aria-label="Search coaches"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <select
                    value={academyFilter}
                    onChange={(e) => setAcademyFilter(e.target.value)}
                    aria-label="Filter coaches by academy"
                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  >
                    <option value="all">All Coaches</option>
                    <option value="with">With Academy</option>
                    <option value="without">Without Academy</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 p-4 sm:p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={28} />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  {coaches.length === 0 ? "No coaches registered yet" : "No coaches found"}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  {coaches.length === 0
                    ? "Registered coaches will appear here."
                    : "Try a different search or academy filter."}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Clear search and filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile / Tablet Cards */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">
                  {filtered.map((coach) => (
                    <article
                      key={coach.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <InitialAvatar name={coach.name} />
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {coach.name}
                          </h3>
                          <p className="mt-1 break-all text-[11px] font-medium text-slate-400">
                            {coachId(coach)}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 size={12} />
                          Active
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                        <div className="flex items-start gap-2 text-slate-600">
                          <Mail size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <a href={`mailto:${coach.user.email}`} className="min-w-0 break-all text-xs hover:text-red-600 hover:underline">
                            {coach.user.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={15} className="shrink-0 text-slate-400" />
                          {coach.phone ? (
                            <a href={`tel:${coach.phone}`} className="text-xs hover:text-red-600 hover:underline">
                              {coach.phone}
                            </a>
                          ) : (
                            <span className="text-xs">Not provided</span>
                          )}
                        </div>
                        <div className="flex items-start gap-2 text-slate-600">
                          <Building2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="text-xs">{coach.academy?.name || "No academy"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarDays size={15} className="shrink-0 text-slate-400" />
                          <span className="text-xs">Registered {formatDate(coach.createdAt)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDocuments(coach)}
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <FolderOpen size={16} />
                        View Documents
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-red-600">
                          {coach.user.documents?.length ?? 0}
                        </span>
                      </button>
                    </article>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        {[
                          "Coach",
                          "Contact Information",
                          "Academy",
                          "Status",
                          "Documents",
                          "Registered",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((coach) => (
                        <tr
                          key={coach.id}
                          className="transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4">
                            <div className="flex min-w-[190px] items-center gap-3">
                              <InitialAvatar name={coach.name} />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900">
                                  {coach.name}
                                </p>
                                <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-slate-400">
                                  {coachId(coach)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <a href={`mailto:${coach.user.email}`} className="block max-w-[220px] break-all text-xs font-medium text-slate-700 hover:text-red-600 hover:underline">
                              {coach.user.email}
                            </a>
                            {coach.phone ? (
                              <a href={`tel:${coach.phone}`} className="mt-1.5 inline-block text-xs text-slate-400 hover:text-red-600 hover:underline">
                                {coach.phone}
                              </a>
                            ) : (
                              <p className="mt-1.5 text-xs text-slate-400">No phone</p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {coach.academy ? (
                              <div className="flex max-w-[180px] items-start gap-2 text-xs font-medium text-slate-700">
                                <Building2 size={15} className="shrink-0 text-slate-400" />
                                <span>{coach.academy.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                Not Assigned
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 size={13} />
                              Active
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => openDocuments(coach)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <FolderOpen size={15} />
                              {coach.user.documents?.length ?? 0} Docs
                              <ChevronRight size={14} />
                            </button>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                            {formatDate(coach.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {!loading && filtered.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-4 text-xs text-slate-500 sm:px-6">
                <span>
                  Showing <strong className="text-slate-800">{filtered.length}</strong> of{" "}
                  <strong className="text-slate-800">{coaches.length}</strong> coaches
                </span>
                <span>Coaches Directory</span>
              </div>
            )}
          </section>
        </div>
      </main>

      {docsModal && (
        <DocumentModal
          data={docsModal}
          onClose={() => setDocsModal(null)}
        />
      )}
    </DashboardLayout>
  );
}
