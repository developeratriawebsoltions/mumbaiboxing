
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import {
  Search,
  RefreshCw,
  FileText,
  X,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Users,
} from "lucide-react";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
};

type Boxer = {
  id: number;
  name: string;
  dob: string | null;
  weight: string | null;
  ageGroup: string | null;
  rank: number | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
    documents: Doc[];
  };
  academy: { name: string } | null;
  medical: {
    fitnessStatus: string;
    expiryDate: string | null;
    eligible: boolean;
  } | null;
};

type MedicalFilter =
  | "All"
  | "Valid"
  | "Expired"
  | "Expiring Soon"
  | "No Record";

const filters: MedicalFilter[] = [
  "All",
  "Valid",
  "Expired",
  "Expiring Soon",
  "No Record",
];

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function boxerId(boxer: Boxer) {
  const year = new Date(boxer.user.createdAt).getFullYear();

  return `MBA-BXR-${year}-${String(boxer.id).padStart(4, "0")}`;
}

function MedicalBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    Valid: "bg-green-50 text-green-700 border-green-200",
    Expired: "bg-red-50 text-red-700 border-red-200",
    "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  };

  const label = status || "No Record";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium ${
        colors[label] ||
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}

function EligibilityBadge({
  eligible,
}: {
  eligible: boolean | null;
}) {
  if (eligible === null) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <span
      className={`text-xs font-medium ${
        eligible ? "text-green-700" : "text-red-600"
      }`}
    >
      {eligible ? "Yes" : "No"}
    </span>
  );
}

function isImage(doc: Doc) {
  return (
    doc.fileType?.toLowerCase().startsWith("image") ||
    /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(doc.filePath)
  );
}

export default function AdminBoxersPage() {
  const role = useRole();

  const [boxers, setBoxers] = useState<Boxer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterMedical, setFilterMedical] =
    useState<MedicalFilter>("All");

  const [docsModal, setDocsModal] = useState<{
    name: string;
    docs: Doc[];
  } | null>(null);

  const [preview, setPreview] = useState<Doc | null>(null);

  const loadBoxers = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch("/api/admin/boxers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load boxers.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server.");
      }

      setBoxers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load boxers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadBoxers();
  }, [loadBoxers]);

  useEffect(() => {
    if (!docsModal) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (preview) {
          setPreview(null);
        } else {
          setDocsModal(null);
        }
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [docsModal, preview]);

  const stats = useMemo(
    () => ({
      total: boxers.length,
      valid: boxers.filter(
        (b) => b.medical?.fitnessStatus === "Valid"
      ).length,
      expired: boxers.filter(
        (b) => b.medical?.fitnessStatus === "Expired"
      ).length,
      noRecord: boxers.filter((b) => !b.medical).length,
    }),
    [boxers]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return boxers.filter((boxer) => {
      const matchesSearch =
        !query ||
        [
          boxer.name,
          boxer.user.email,
          boxer.academy?.name,
          boxerId(boxer),
        ].some((value) => value?.toLowerCase().includes(query));

      const matchesMedical =
        filterMedical === "All" ||
        (filterMedical === "No Record"
          ? !boxer.medical
          : boxer.medical?.fitnessStatus === filterMedical);

      return matchesSearch && matchesMedical;
    });
  }, [boxers, search, filterMedical]);

  const openDocuments = (boxer: Boxer) => {
    setPreview(null);
    setDocsModal({
      name: boxer.name,
      docs: boxer.user.documents ?? [],
    });
  };

  const closeDocuments = () => {
    setDocsModal(null);
    setPreview(null);
  };

  return (
    <DashboardLayout role={role || undefined}>
      <main className="min-h-screen bg-[#f8f9fb] p-4 sm:p-6">
        <div className="mx-auto max-w-[1600px] space-y-5">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                All Boxers
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and review registered boxers
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadBoxers(true)}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={18} />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => void loadBoxers(true)}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {
                label: "Total Boxers",
                value: stats.total,
                color: "text-gray-900",
              },
              {
                label: "Medical Valid",
                value: stats.valid,
                color: "text-green-700",
              },
              {
                label: "Medical Expired",
                value: stats.expired,
                color: "text-red-600",
              },
              {
                label: "No Medical Record",
                value: stats.noRecord,
                color: "text-amber-700",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5"
              >
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {item.label}
                </p>
                <p
                  className={`mt-2 text-2xl font-bold sm:text-3xl ${item.color}`}
                >
                  {loading ? "—" : item.value}
                </p>
              </div>
            ))}
          </div>

          {/* MAIN TABLE SECTION */}
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">

            {/* TABLE HEADER AND SEARCH */}
            <div className="border-b border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Boxer Directory
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {loading
                      ? "Loading records..."
                      : `${filtered.length} of ${boxers.length} boxers`}
                  </p>
                </div>

                <div className="relative w-full lg:max-w-sm">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, ID or academy"
                    aria-label="Search boxers"
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* FILTERS */}
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setFilterMedical(filter)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                      filterMedical === filter
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded bg-gray-100"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <Users
                  size={30}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p className="font-medium text-gray-800">
                  No boxers found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try another search or medical status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilterMedical("All");
                  }}
                  className="mt-3 text-sm font-medium text-red-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1150px] text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        {[
                          "Boxer",
                          "DOB",
                          "Weight",
                          "Age Group",
                          "Rank",
                          "Academy",
                          "Medical",
                          "Eligible",
                          "Documents",
                          "Registered",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-600"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((boxer) => (
                        <tr
                          key={boxer.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="min-w-[175px]">
                              <p className="font-semibold text-gray-900">
                                {boxer.name}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {boxerId(boxer)}
                              </p>
                              <p className="mt-0.5 break-all text-xs text-gray-400">
                                {boxer.user.email}
                              </p>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                            {formatDate(boxer.dob)}
                          </td>

                          <td className="px-4 py-3 text-gray-600">
                            {boxer.weight ?? "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                            {boxer.ageGroup ?? "—"}
                          </td>

                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {boxer.rank != null
                              ? `#${boxer.rank}`
                              : "—"}
                          </td>

                          <td className="px-4 py-3 text-gray-600">
                            <span className="block min-w-[100px]">
                              {boxer.academy?.name ?? "—"}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <MedicalBadge
                                status={boxer.medical?.fitnessStatus}
                              />
                              {boxer.medical?.expiryDate && (
                                <p className="whitespace-nowrap text-[11px] text-gray-400">
                                  Exp: {formatDate(boxer.medical.expiryDate)}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <EligibilityBadge
                              eligible={
                                boxer.medical
                                  ? boxer.medical.eligible
                                  : null
                              }
                            />
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openDocuments(boxer)}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            >
                              <FileText size={14} />
                              {boxer.user.documents?.length ?? 0} Docs
                            </button>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                            {formatDate(boxer.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE AND TABLET LIST */}
                <div className="divide-y divide-gray-100 lg:hidden">
                  {filtered.map((boxer) => (
                    <div key={boxer.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {boxer.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {boxerId(boxer)}
                          </p>
                          <p className="mt-1 break-all text-xs text-gray-400">
                            {boxer.user.email}
                          </p>
                        </div>

                        <MedicalBadge
                          status={boxer.medical?.fitnessStatus}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        {[
                          ["DOB", formatDate(boxer.dob)],
                          ["Weight", boxer.weight ?? "—"],
                          ["Age Group", boxer.ageGroup ?? "—"],
                          [
                            "Rank",
                            boxer.rank != null
                              ? `#${boxer.rank}`
                              : "—",
                          ],
                          [
                            "Academy",
                            boxer.academy?.name ?? "—",
                          ],
                          [
                            "Eligible",
                            boxer.medical
                              ? boxer.medical.eligible
                                ? "Yes"
                                : "No"
                              : "—",
                          ],
                          [
                            "Medical Expiry",
                            formatDate(
                              boxer.medical?.expiryDate ?? null
                            ),
                          ],
                          [
                            "Registered",
                            formatDate(boxer.createdAt),
                          ],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-xs text-gray-400">
                              {label}
                            </p>
                            <p className="mt-0.5 break-words font-medium text-gray-700">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => openDocuments(boxer)}
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <FileText size={15} />
                        View Documents (
                        {boxer.user.documents?.length ?? 0})
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!loading && filtered.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
                Showing {filtered.length} of {boxers.length} boxers
              </div>
            )}
          </section>
        </div>
      </main>

      {/* DOCUMENTS MODAL */}
      {docsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              closeDocuments();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-title"
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-5">
              <div>
                <h2
                  id="docs-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {docsModal.name}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {docsModal.docs.length} uploaded documents
                </p>
              </div>

              <button
                type="button"
                onClick={closeDocuments}
                aria-label="Close documents"
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {docsModal.docs.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText
                    size={30}
                    className="mx-auto mb-3 text-gray-300"
                  />
                  <p className="text-sm text-gray-500">
                    No documents uploaded.
                  </p>
                </div>
              ) : preview ? (
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600"
                    >
                      <ArrowLeft size={16} />
                      Back to documents
                    </button>

                    <a
                      href={preview.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"
                    >
                      Open in new tab
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <p className="mb-3 text-sm font-semibold capitalize text-gray-900">
                    {preview.label.replace(/-/g, " ")}
                  </p>

                  {isImage(preview) ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <img
                        src={preview.filePath}
                        alt={preview.label}
                        className="mx-auto max-h-[55vh] w-full object-contain"
                      />
                    </div>
                  ) : (
                    <iframe
                      src={preview.filePath}
                      title={preview.label}
                      className="h-[55vh] min-h-[300px] w-full rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                  {docsModal.docs.map((doc) => (
                    <button
                      type="button"
                      key={doc.id}
                      onClick={() => setPreview(doc)}
                      className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50"
                    >
                      {isImage(doc) ? (
                        <img
                          src={doc.filePath}
                          alt={doc.label}
                          className="h-12 w-12 shrink-0 rounded-md border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                          <FileText size={21} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium capitalize text-gray-800">
                          {doc.label.replace(/-/g, " ")}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {isImage(doc) ? "Image" : "Document"}
                        </p>
                      </div>

                      <span className="text-xs font-medium text-red-600">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
