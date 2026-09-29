"use client";

import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TYPES
   ========================================================= */

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  createdAt: string;

  status?: string;
  rejectionReason?: string | null;

  userRole?: string;
  userName?: string;
};

/* =========================================================
   HELPERS
   ========================================================= */

const fileUrl = (path: string) =>
  `/api/file?path=${encodeURIComponent(path)}`;

/* =========================================================
   STATUS HELPERS
   ========================================================= */

function normalizeStatus(status?: string) {
  return (status || "pending").trim().toLowerCase();
}

function isPendingDocument(document: Doc) {
  const status = normalizeStatus(document.status);

  return (
    status === "pending" ||
    status === "under_review" ||
    status === "uploaded" ||
    status === ""
  );
}

function getDocumentStatus(status?: string) {
  const normalized = normalizeStatus(status);

  if (
    normalized === "approved" ||
    normalized === "verified" ||
    normalized === "valid"
  ) {
    return {
      label: "Approved",
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  }

  if (
    normalized === "rejected" ||
    normalized === "invalid"
  ) {
    return {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
      icon: <XCircle className="h-3.5 w-3.5" />,
    };
  }

  return {
    label: "Pending",
    className: "bg-orange-100 text-orange-700",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  };
}

/* =========================================================
   PAGE
   ========================================================= */

export default function DocumentsDashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);

  const [filter, setFilter] = useState("All");

  const [preview, setPreview] = useState<Doc | null>(null);

  const [rejectDocument, setRejectDocument] =
    useState<Doc | null>(null);

  const [rejectReason, setRejectReason] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const role = useRole();

  const isAdmin = role === "superadmin";

  /* =======================================================
     LOAD DOCUMENTS
     ======================================================= */

  async function loadDocuments() {
    if (!role) return;

    try {
      setLoading(true);
      setError("");

      const url =
        role === "superadmin"
          ? "/api/admin/documents"
          : `/api/${role}`;

      const response = await fetch(url, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load documents."
        );
      }

      if (role === "superadmin") {
        setDocs(
          Array.isArray(data)
            ? data
            : []
        );
      } else {
        /*
         * Boxer / Coach documents
         */
        setDocs(
          Array.isArray(data?.user?.documents)
            ? data.user.documents
            : []
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {
    if (!role) return;

    loadDocuments();
  }, [role]);

  /* =======================================================
     ADMIN REVIEW QUEUE
     =======================================================

     IMPORTANT:

     Super Admin should only see documents that still
     require review.

     Approved / Rejected documents remain in the database
     but are removed from this dashboard.
     ======================================================= */

  const pendingDocs = useMemo(() => {
    if (!isAdmin) {
      return docs;
    }

    return docs.filter(isPendingDocument);
  }, [docs, isAdmin]);

  /* =======================================================
     FILTERED DOCUMENTS
     ======================================================= */

  const filtered = useMemo(() => {
    const source = isAdmin
      ? pendingDocs
      : docs;

    if (!isAdmin || filter === "All") {
      return source;
    }

    return source.filter(
      (doc) =>
        doc.userRole?.toLowerCase() ===
        filter.toLowerCase()
    );
  }, [
    docs,
    pendingDocs,
    filter,
    isAdmin,
  ]);

  /* =======================================================
     PENDING COUNTS
     ======================================================= */

  const totalPending = pendingDocs.length;

  const pendingBoxerDocs =
    pendingDocs.filter(
      (doc) =>
        doc.userRole?.toLowerCase() ===
        "boxer"
    ).length;

  const pendingCoachDocs =
    pendingDocs.filter(
      (doc) =>
        doc.userRole?.toLowerCase() ===
        "coach"
    ).length;

  /* =======================================================
     APPROVE / REJECT DOCUMENT
     ======================================================= */

  async function handleDocumentAction(
    documentId: number,
    action: "approve" | "reject",
    reason?: string
  ) {
    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `/api/documents/${documentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            rejectionReason:
              action === "reject"
                ? reason
                : undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to update document."
        );
      }

      /*
       * ===================================================
       * IMPORTANT
       *
       * Remove the reviewed document from the local
       * admin queue immediately.
       *
       * This makes:
       *
       * Total Documents       ↓
       * Boxer Docs            ↓
       * Coach Docs            ↓
       *
       * immediately after approve/reject.
       * ===================================================
       */

      if (isAdmin) {
        setDocs((currentDocs) =>
          currentDocs.filter(
            (doc) =>
              doc.id !== documentId
          )
        );
      } else {
        /*
         * Boxer / Coach can still see their document,
         * but its status is updated.
         */
        setDocs((currentDocs) =>
          currentDocs.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  status:
                    action === "approve"
                      ? "approved"
                      : "rejected",
                  rejectionReason:
                    action === "approve"
                      ? null
                      : reason || null,
                }
              : doc
          )
        );
      }

      /*
       * Close preview after review.
       */
      setPreview(null);

      /*
       * Close reject modal.
       */
      setRejectDocument(null);
      setRejectReason("");

      /*
       * Refresh database state.
       *
       * The frontend still filters the result to pending
       * documents, so approved/rejected documents will
       * remain hidden from Super Admin.
       */
      await loadDocuments();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update document."
      );
    } finally {
      setActionLoading(false);
    }
  }

  /* =======================================================
     APPROVE
     ======================================================= */

  function handleApprove(document: Doc) {
    if (!isPendingDocument(document)) {
      return;
    }

    const confirmed = window.confirm(
      `Approve "${document.label}"?`
    );

    if (!confirmed) {
      return;
    }

    handleDocumentAction(
      document.id,
      "approve"
    );
  }

  /* =======================================================
     OPEN REJECT MODAL
     ======================================================= */

  function openRejectModal(document: Doc) {
    if (!isPendingDocument(document)) {
      return;
    }

    setRejectDocument(document);

    setRejectReason(
      document.rejectionReason || ""
    );
  }

  /* =======================================================
     CLOSE PREVIEW
     ======================================================= */

  function closePreview() {
    if (actionLoading) return;

    setPreview(null);
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">

        {/* =================================================
            HEADER
           ================================================= */}

        <div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <Clock3 className="h-6 w-6 text-orange-600" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isAdmin
                  ? "Document Review"
                  : "My Documents"}
              </h2>

              <p className="text-sm text-gray-500">
                {isAdmin
                  ? "Review pending documents uploaded by boxers & coaches"
                  : "Your uploaded documents"}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
           ================================================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-700">
                Unable to load documents
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ADMIN STATS
           ================================================= */}

        {isAdmin ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">

            {/* TOTAL PENDING */}

            <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-orange-600">
                {totalPending}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Pending Documents
              </p>
            </div>

            {/* BOXER */}

            <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-red-600">
                {pendingBoxerDocs}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Pending Boxer Docs
              </p>
            </div>

            {/* COACH */}

            <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-blue-600">
                {pendingCoachDocs}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Pending Coach Docs
              </p>
            </div>
          </div>
        ) : (
          /* =================================================
             USER STATS
             ================================================= */

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-gray-700">
                {docs.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total Uploaded
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-600">
                {
                  docs.filter(
                    (doc) =>
                      doc.fileType ===
                      "image"
                  ).length
                }
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Images
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            ADMIN FILTER
           ================================================= */}

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Boxer",
              "Coach",
            ].map((filterValue) => (
              <button
                key={filterValue}
                onClick={() =>
                  setFilter(filterValue)
                }
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === filterValue
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterValue}
              </button>
            ))}
          </div>
        )}

        {/* =================================================
            REVIEW QUEUE INFORMATION
           ================================================= */}

        {isAdmin && (
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

              <div>
                <p className="text-sm font-semibold text-orange-900">
                  Pending Review Queue
                </p>

                <p className="mt-1 text-sm text-orange-700">
                  Only documents that still require
                  approval or rejection are shown here.
                  Once reviewed, they are removed from
                  this dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            DOCUMENT GRID
           ================================================= */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Clock3 className="h-5 w-5 animate-pulse" />

              Loading documents...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              {isAdmin
                ? "No pending documents"
                : "No documents found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {isAdmin
                ? "All submitted documents have been reviewed. New documents will appear here when they are uploaded."
                : "There are currently no documents associated with your account."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {filtered.map((doc) => {
              const status =
                getDocumentStatus(
                  doc.status
                );

              return (
                <div
                  key={doc.id}
                  onClick={() =>
                    setPreview(doc)
                  }
                  className="cursor-pointer overflow-hidden rounded-xl border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* IMAGE / FILE */}

                  {doc.fileType ===
                  "image" ? (
                    <img
                      src={fileUrl(
                        doc.filePath
                      )}
                      alt={doc.label}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center rounded-lg bg-red-50">
                      <FileText className="h-10 w-10 text-red-500" />
                    </div>
                  )}

                  {/* NAME */}

                  <p className="mt-2 line-clamp-2 text-xs font-semibold capitalize text-gray-700">
                    {doc.label.replace(
                      /-/g,
                      " "
                    )}
                  </p>

                  {/* STATUS */}

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${status.className}`}
                    >
                      {status.icon}

                      {status.label}
                    </span>
                  </div>

                  {/* ADMIN USER */}

                  {isAdmin && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-xs text-gray-500">
                        {doc.userName}
                      </span>

                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                          doc.userRole ===
                          "boxer"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {doc.userRole}
                      </span>
                    </div>
                  )}

                  {/* CREATED DATE */}

                  <p className="mt-2 text-[10px] text-gray-400">
                    {new Date(
                      doc.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          DOCUMENT PREVIEW MODAL
         ===================================================== */}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closePreview}
        >
          <div
            className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold capitalize text-slate-900">
                  {preview.label.replace(
                    /-/g,
                    " "
                  )}
                </p>

                {isAdmin && (
                  <p className="mt-1 text-xs text-gray-500">
                    {preview.userName} ·{" "}
                    {preview.userRole}
                  </p>
                )}
              </div>

              <button
                onClick={closePreview}
                disabled={
                  actionLoading
                }
                className="shrink-0 text-xl text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* STATUS */}

            <div className="mb-4 flex items-center justify-between rounded-xl border bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-600">
                Document Status
              </span>

              {(() => {
                const status =
                  getDocumentStatus(
                    preview.status
                  );

                return (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                  >
                    {status.icon}

                    {status.label}
                  </span>
                );
              })()}
            </div>

            {/* FILE PREVIEW */}

            <div className="overflow-hidden rounded-xl border bg-gray-50">
              {preview.fileType ===
              "image" ? (
                <img
                  src={fileUrl(
                    preview.filePath
                  )}
                  alt={preview.label}
                  className="max-h-[450px] w-full object-contain"
                />
              ) : (
                <iframe
                  src={fileUrl(
                    preview.filePath
                  )}
                  className="h-[450px] w-full"
                  title={preview.label}
                />
              )}
            </div>

            {/* REJECTION REASON */}

            {preview.rejectionReason && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Rejection Reason
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {
                        preview.rejectionReason
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* OPEN / DOWNLOAD */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={fileUrl(
                  preview.filePath
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <Eye className="h-4 w-4" />

                Open in new tab
              </a>

              <a
                href={fileUrl(
                  preview.filePath
                )}
                download
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />

                Download
              </a>
            </div>

            {/* ADMIN REVIEW */}

            {isAdmin &&
              isPendingDocument(
                preview
              ) && (
                <div className="mt-4 border-t pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Document Review
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {/* APPROVE */}

                    <button
                      onClick={() =>
                        handleApprove(
                          preview
                        )
                      }
                      disabled={
                        actionLoading
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />

                      {actionLoading
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    {/* REJECT */}

                    <button
                      onClick={() =>
                        openRejectModal(
                          preview
                        )
                      }
                      disabled={
                        actionLoading
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />

                      Reject
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* =====================================================
          REJECT MODAL
         ===================================================== */}

      {rejectDocument && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() => {
            if (
              !actionLoading
            ) {
              setRejectDocument(
                null
              );

              setRejectReason("");
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Reject Document
                  </h3>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Please provide a reason for
                  rejecting this document.
                </p>
              </div>

              <button
                onClick={() => {
                  if (
                    actionLoading
                  ) {
                    return;
                  }

                  setRejectDocument(
                    null
                  );

                  setRejectReason("");
                }}
                disabled={
                  actionLoading
                }
                className="text-xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* DOCUMENT */}

            <div className="mt-5 rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Document
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {rejectDocument.label.replace(
                  /-/g,
                  " "
                )}
              </p>

              {rejectDocument.userName && (
                <p className="mt-1 text-xs text-gray-500">
                  {
                    rejectDocument.userName
                  }

                  {rejectDocument.userRole
                    ? ` · ${rejectDocument.userRole}`
                    : ""}
                </p>
              )}
            </div>

            {/* REASON */}

            <div className="mt-5">
              <label
                htmlFor="rejection-reason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Rejection Reason
              </label>

              <textarea
                id="rejection-reason"
                value={
                  rejectReason
                }
                onChange={(
                  event
                ) =>
                  setRejectReason(
                    event.target.value
                  )
                }
                placeholder="Example: The medical certificate is unclear or expired."
                rows={5}
                maxLength={1000}
                disabled={
                  actionLoading
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-gray-100"
              />

              <div className="mt-1 flex justify-between">
                <p className="text-xs text-gray-400">
                  A rejection reason is required.
                </p>

                <p className="text-xs text-gray-400">
                  {
                    rejectReason.length
                  }
                  /1000
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (
                    actionLoading
                  ) {
                    return;
                  }

                  setRejectDocument(
                    null
                  );

                  setRejectReason("");
                }}
                disabled={
                  actionLoading
                }
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleDocumentAction(
                    rejectDocument.id,
                    "reject",
                    rejectReason.trim()
                  )
                }
                disabled={
                  actionLoading ||
                  !rejectReason.trim()
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />

                {actionLoading
                  ? "Rejecting..."
                  : "Reject Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}