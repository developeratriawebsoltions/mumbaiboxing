
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
  Building2,
  Users,
  GraduationCap,
} from "lucide-react";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
};

type Academy = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
    documents: Doc[];
  };
  boxers: { id: number }[];
  coaches: { id: number }[];
};

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

function academyId(academy: Academy) {
  const year = new Date(academy.user.createdAt).getFullYear();
  return `MBA-ACD-${year}-${String(academy.id).padStart(4, "0")}`;
}

function isImage(doc: Doc) {
  return (
    doc.fileType?.toLowerCase().startsWith("image") ||
    /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(doc.filePath)
  );
}

export default function AdminAcademiesPage() {
  const role = useRole();

  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [docsModal, setDocsModal] = useState<{
    name: string;
    docs: Doc[];
  } | null>(null);

  const [preview, setPreview] = useState<Doc | null>(null);

  const loadAcademies = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch("/api/admin/academies", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load academies.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response from server.");
      }

      setAcademies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load academies."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAcademies();
  }, [loadAcademies]);

  useEffect(() => {
    if (!docsModal) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (preview) setPreview(null);
        else setDocsModal(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [docsModal, preview]);

  const stats = useMemo(
    () => ({
      academies: academies.length,
      boxers: academies.reduce(
        (total, academy) => total + (academy.boxers?.length ?? 0),
        0
      ),
      coaches: academies.reduce(
        (total, academy) => total + (academy.coaches?.length ?? 0),
        0
      ),
    }),
    [academies]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return academies.filter((academy) => {
      if (!query) return true;

      return [
        academy.name,
        academy.user.email,
        academy.address,
        academy.phone,
        academyId(academy),
      ].some((value) => value?.toLowerCase().includes(query));
    });
  }, [academies, search]);

  const openDocuments = (academy: Academy) => {
    setPreview(null);
    setDocsModal({
      name: academy.name,
      docs: academy.user.documents ?? [],
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
                All Academies
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View registered academies, boxers, coaches and documents
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadAcademies(true)}
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

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => void loadAcademies(true)}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              {
                label: "Total Academies",
                value: stats.academies,
                color: "text-gray-900",
                icon: Building2,
              },
              {
                label: "Total Boxers",
                value: stats.boxers,
                color: "text-red-600",
                icon: Users,
              },
              {
                label: "Total Coaches",
                value: stats.coaches,
                color: "text-blue-600",
                icon: GraduationCap,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-gray-500 sm:text-sm">
                      {item.label}
                    </p>
                    <Icon size={18} className="text-gray-400" />
                  </div>
                  <p
                    className={`mt-3 text-2xl font-bold sm:text-3xl ${item.color}`}
                  >
                    {loading ? "—" : item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ACADEMY DIRECTORY */}
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">

            {/* SEARCH BAR */}
            <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Academy Directory
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {loading
                    ? "Loading academies..."
                    : `${filtered.length} of ${academies.length} academies`}
                </p>
              </div>

              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, address or ID"
                  aria-label="Search academies"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* CONTENT */}
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-12 animate-pulse rounded bg-gray-100"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <Building2
                  size={30}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p className="font-medium text-gray-800">
                  No academies found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try searching by another name, address or email.
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-3 text-sm font-medium text-red-600 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1050px] text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        {[
                          "Academy",
                          "Contact",
                          "Address",
                          "Boxers",
                          "Coaches",
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
                      {filtered.map((academy) => (
                        <tr
                          key={academy.id}
                          className="hover:bg-gray-50"
                        >
                          {/* ACADEMY NAME */}
                          <td className="px-4 py-4">
                            <div className="min-w-[190px]">
                              <p className="font-semibold text-gray-900">
                                {academy.name}
                              </p>
                              <p className="mt-1 whitespace-nowrap text-xs text-gray-400">
                                {academyId(academy)}
                              </p>
                            </div>
                          </td>

                          {/* CONTACT */}
                          <td className="px-4 py-4">
                            <div className="min-w-[180px]">
                              <p className="break-all text-xs text-gray-700">
                                {academy.user.email}
                              </p>
                              <p className="mt-1.5 text-xs text-gray-500">
                                {academy.phone || "No phone"}
                              </p>
                            </div>
                          </td>

                          {/* ADDRESS */}
                          <td className="px-4 py-4">
                            <p className="max-w-[240px] text-xs leading-5 text-gray-600">
                              {academy.address || "—"}
                            </p>
                          </td>

                          {/* BOXERS */}
                          <td className="px-4 py-4">
                            <span className="font-semibold text-gray-800">
                              {academy.boxers?.length ?? 0}
                            </span>
                          </td>

                          {/* COACHES */}
                          <td className="px-4 py-4">
                            <span className="font-semibold text-gray-800">
                              {academy.coaches?.length ?? 0}
                            </span>
                          </td>

                          {/* DOCUMENTS */}
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => openDocuments(academy)}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            >
                              <FileText size={14} />
                              {academy.user.documents?.length ?? 0} Docs
                            </button>
                          </td>

                          {/* REGISTERED DATE */}
                          <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500">
                            {formatDate(academy.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE / TABLET LIST */}
                <div className="divide-y divide-gray-100 lg:hidden">
                  {filtered.map((academy) => (
                    <article key={academy.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                          <Building2 size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {academy.name}
                          </h3>
                          <p className="mt-1 break-all text-xs text-gray-400">
                            {academyId(academy)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">
                            Email
                          </p>
                          <p className="mt-0.5 break-all text-gray-700">
                            {academy.user.email}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-400">
                              Phone
                            </p>
                            <p className="mt-0.5 text-gray-700">
                              {academy.phone || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              Registered
                            </p>
                            <p className="mt-0.5 text-gray-700">
                              {formatDate(academy.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Address
                          </p>
                          <p className="mt-0.5 leading-5 text-gray-700">
                            {academy.address || "—"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded-md bg-gray-50 p-3">
                          <div>
                            <p className="text-xs text-gray-500">
                              Boxers
                            </p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {academy.boxers?.length ?? 0}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Coaches
                            </p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              {academy.coaches?.length ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDocuments(academy)}
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <FileText size={15} />
                        View Documents (
                        {academy.user.documents?.length ?? 0})
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}

            {!loading && filtered.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
                Showing {filtered.length} of {academies.length} academies
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
            if (event.target === event.currentTarget) {
              closeDocuments();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="academy-docs-title"
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-5">
              <div>
                <h2
                  id="academy-docs-title"
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
