"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  ShieldAlert,
  Upload,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type DocumentItem = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type DashboardData = {
  success: boolean;

  user: {
    id: number;
    email: string;
    role: string;
    registrationStatus: string;
  };

  membership: {
    id: string | null;
    validFrom: string | null;
    expiry: string | null;
    activatedAt: string | null;
    active: boolean;
  };

  documents: DocumentItem[];
};

/* =========================================================
   REQUIRED DOCUMENTS
   ========================================================= */

const REQUIRED_DOCUMENTS = [
  {
    key: "referee-judge-passport-size-photo",
    title: "Passport Size Photo",
    fullTitle: "Referee / Judge Passport size Photo",
    description:
      "Your passport-size photograph submitted during registration.",
    icon: UserRound,
  },
  {
    key: "referee-judge-id-proof",
    title: "ID Proof",
    fullTitle: "Referee / Judge ID Proof",
    description:
      "Your identity document submitted during registration.",
    icon: FileCheck2,
  },
  {
    key: "referee-judge-certificate",
    title: "Referee / Judge Certificate",
    fullTitle: "Referee / Judge Certificate",
    description:
      "Your official Referee / Judge certification document.",
    icon: ShieldAlert,
  },
  {
    key: "referee-judge-experience-proof",
    title: "Experience Proof",
    fullTitle: "Referee / Judge Experience Proof",
    description:
      "Proof of your officiating experience.",
    icon: FileText,
  },
];

/* =========================================================
   PAGE
   ========================================================= */

export default function RefereeJudgeDocumentsPage() {
  const [data, setData] = useState<DashboardData | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/referee-judge",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Failed to load your documents."
          );
        }

        setData(result);
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

    loadDocuments();
  }, []);

  /* =======================================================
     DATE FORMAT
     ======================================================= */

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =======================================================
     DOCUMENT MAP
     ======================================================= */

  const documentMap = useMemo(() => {
    const map = new Map<string, DocumentItem>();

    for (const document of data?.documents ?? []) {
      map.set(document.label.toLowerCase(), document);
    }

    return map;
  }, [data]);

  /* =======================================================
     FIND DOCUMENT
     ======================================================= */

  const findDocument = (
    key: string
  ): DocumentItem | null => {
    const exact = documentMap.get(key.toLowerCase());

    if (exact) {
      return exact;
    }

    const documents = data?.documents ?? [];

    return (
      documents.find(
        (document) =>
          document.label.toLowerCase() ===
          key.toLowerCase()
      ) || null
    );
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div
              className="
                w-10
                h-10
                border-4
                border-slate-200
                border-t-red-600
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your documents...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error || !data) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-600
            "
          >
            {error || "Unable to load documents."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     COUNTS
     ======================================================= */

  const totalRequired = REQUIRED_DOCUMENTS.length;

  const uploadedCount = REQUIRED_DOCUMENTS.filter(
    (item) => findDocument(item.key)
  ).length;

  const approvedCount = REQUIRED_DOCUMENTS.filter(
    (item) => {
      const document = findDocument(item.key);

      return (
        document &&
        document.status.toLowerCase() === "approved"
      );
    }
  ).length;

  const pendingCount = REQUIRED_DOCUMENTS.filter(
    (item) => {
      const document = findDocument(item.key);

      return (
        document &&
        document.status.toLowerCase() !==
          "approved" &&
        document.status.toLowerCase() !==
          "rejected"
      );
    }
  ).length;

  /* =======================================================
     MAIN
     ======================================================= */

  return (
    <DashboardLayout role="referee_judge">
      <div className="max-w-[1500px] mx-auto space-y-7 text-slate-900">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            justify-between
            gap-4
          "
        >
          <div>
            <Link
              href="/dashboard/referee-judge"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-500
                hover:text-red-600
                transition-colors
                mb-4
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1
              className="
                text-3xl
                sm:text-[38px]
                font-extrabold
                tracking-tight
                text-[#0b1729]
              "
            >
              My Documents
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              View your Referee / Judge registration
              documents and verification status
            </p>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-red-50
              px-4
              py-2
              text-sm
              font-semibold
              text-red-600
              w-fit
            "
          >
            <FolderOpen size={17} />
            Documents
          </span>
        </div>

        {/* ==================================================
            SUMMARY
            ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >
          <SummaryCard
            icon={<FolderOpen size={21} />}
            title={String(uploadedCount)}
            label="Documents Uploaded"
            description={`of ${totalRequired} required`}
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            title={String(approvedCount)}
            label="Approved"
            description="Verified documents"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            title={String(pendingCount)}
            label="Pending Review"
            description="Awaiting verification"
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            icon={<FileText size={21} />}
            title={String(totalRequired)}
            label="Required Documents"
            description="Registration requirements"
            iconClass="bg-violet-50 text-violet-600"
          />
        </div>

        {/* ==================================================
            INFORMATION
            ================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-blue-100
            bg-blue-50/60
            px-5
            py-4
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              shrink-0
              rounded-xl
              bg-white
              text-blue-600
              border
              border-blue-100
              flex
              items-center
              justify-center
            "
          >
            <FileText size={19} />
          </div>

          <div>
            <p className="font-semibold text-blue-900">
              Document verification
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Documents submitted during registration are
              reviewed by the Mumbai Boxing Association.
              A rejected document will show the reason
              provided by the reviewer.
            </p>
          </div>
        </div>

        {/* ==================================================
            DOCUMENT GRID
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-red-50
                text-red-600
                flex
                items-center
                justify-center
              "
            >
              <FolderOpen size={21} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0b1729]
                "
              >
                Registration Documents
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Documents associated with your membership
                application
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-5
            "
          >
            {REQUIRED_DOCUMENTS.map((required) => {
              const document = findDocument(
                required.key
              );

              return (
                <DocumentCard
                  key={required.key}
                  required={required}
                  document={document}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        </section>

        {/* ==================================================
            ALL OTHER DOCUMENTS
            ================================================== */}

        {data.documents.filter(
          (document) =>
            !REQUIRED_DOCUMENTS.some(
              (required) =>
                required.key.toLowerCase() ===
                document.label.toLowerCase()
            )
        ).length > 0 && (
          <section
            className="
              bg-white
              rounded-2xl
              border
              border-slate-100
              shadow-sm
              p-5
              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-50
                  text-slate-600
                  flex
                  items-center
                  justify-center
                "
              >
                <FileText size={21} />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#0b1729]
                  "
                >
                  Other Documents
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  Additional documents associated with
                  your account
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {data.documents
                .filter(
                  (document) =>
                    !REQUIRED_DOCUMENTS.some(
                      (required) =>
                        required.key.toLowerCase() ===
                        document.label.toLowerCase()
                    )
                )
                .map((document) => (
                  <ExistingDocumentRow
                    key={document.id}
                    document={document}
                    formatDate={formatDate}
                  />
                ))}
            </div>
          </section>
        )}

        {/* ==================================================
            FOOTER LINK
            ================================================== */}

        <div className="flex justify-start">
          <Link
            href="/dashboard/referee-judge"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#ed1c24]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              hover:bg-[#d71920]
              transition-colors
            "
          >
            Back to Dashboard
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   DOCUMENT CARD
   ========================================================= */

function DocumentCard({
  required,
  document,
  formatDate,
}: {
  required: {
    key: string;
    title: string;
    fullTitle: string;
    description: string;
    icon: React.ElementType;
  };
  document: DocumentItem | null;
  formatDate: (
    value: string | null | undefined
  ) => string;
}) {
  const Icon = required.icon;

  if (!document) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-200
          bg-slate-50/50
          overflow-hidden
        "
      >
        {/* Preview */}

        <div
          className="
            h-44
            bg-slate-50
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              w-16
              h-16
              rounded-2xl
              bg-white
              border
              border-slate-100
              text-slate-300
              flex
              items-center
              justify-center
            "
          >
            <Upload size={30} />
          </div>
        </div>

        <div className="p-5">
          <p className="font-bold text-slate-900">
            {required.title}
          </p>

          <p className="mt-2 text-sm leading-5 text-slate-500">
            {required.description}
          </p>

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              text-amber-600
            "
          >
            <Clock3 size={15} />
            Not uploaded
          </div>
        </div>
      </div>
    );
  }

  const fileUrl = `/api/file?path=${encodeURIComponent(
    document.filePath
  )}`;

  const status = (
    document.status || "Pending"
  ).toLowerCase();

  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        rounded-2xl
        border
        border-slate-100
        bg-white
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all
      "
    >
      {/* Preview */}

      <div
        className="
          h-44
          bg-slate-50
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        {document.fileType === "image" ? (
          <img
            src={fileUrl}
            alt={required.fullTitle}
            className="
              w-full
              h-full
              object-contain
              group-hover:scale-[1.02]
              transition-transform
            "
          />
        ) : (
          <div className="text-center">
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-white
                shadow-sm
                text-red-500
                flex
                items-center
                justify-center
                mx-auto
              "
            >
              <FileText
                size={34}
                strokeWidth={1.5}
              />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Document
            </p>
          </div>
        )}
      </div>

      {/* Information */}

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="
              w-10
              h-10
              shrink-0
              rounded-xl
              bg-red-50
              text-red-600
              flex
              items-center
              justify-center
            "
          >
            <Icon size={19} />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900">
              {required.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Uploaded {formatDate(document.createdAt)}
            </p>
          </div>
        </div>

        {/* Status */}

        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2
              size={16}
              strokeWidth={2}
              className={
                isApproved
                  ? "text-emerald-600"
                  : isRejected
                    ? "text-red-600"
                    : "text-amber-500"
              }
            />

            <span
              className={`
                text-xs
                font-bold
                ${
                  isApproved
                    ? "text-emerald-600"
                    : isRejected
                      ? "text-red-600"
                      : "text-amber-600"
                }
              `}
            >
              {isApproved
                ? "Approved"
                : isRejected
                  ? "Rejected"
                  : "Pending Review"}
            </span>
          </div>

          {isRejected &&
            document.rejectionReason && (
              <div
                className="
                  mt-3
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-3
                  py-3
                "
              >
                <p className="text-xs font-semibold text-red-700">
                  Rejection reason
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {document.rejectionReason}
                </p>
              </div>
            )}
        </div>

        <p
          className="
            mt-4
            text-sm
            font-semibold
            text-blue-600
            group-hover:text-blue-700
            inline-flex
            items-center
            gap-1.5
          "
        >
          View Document
          <ArrowRight size={16} />
        </p>
      </div>
    </a>
  );
}

/* =========================================================
   EXISTING DOCUMENT ROW
   ========================================================= */

function ExistingDocumentRow({
  document,
  formatDate,
}: {
  document: DocumentItem;
  formatDate: (
    value: string | null | undefined
  ) => string;
}) {
  const fileUrl = `/api/file?path=${encodeURIComponent(
    document.filePath
  )}`;

  const status = (
    document.status || "Pending"
  ).toLowerCase();

  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        flex
        flex-col
        sm:flex-row
        sm:items-center
        gap-4
        rounded-xl
        border
        border-slate-100
        bg-slate-50/50
        p-4
        hover:bg-white
        hover:shadow-sm
        transition-all
      "
    >
      <div
        className="
          w-11
          h-11
          rounded-xl
          bg-white
          border
          border-slate-100
          text-red-600
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {document.fileType === "image" ? (
          <ImageIcon size={20} />
        ) : (
          <FileText size={20} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 break-words">
          {document.label.replace(/-/g, " ")}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Uploaded {formatDate(document.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-3
            py-1.5
            text-xs
            font-bold
            ${
              isApproved
                ? "bg-emerald-50 text-emerald-700"
                : isRejected
                  ? "bg-red-50 text-red-700"
                  : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {isApproved ? (
            <CheckCircle2 size={14} />
          ) : isRejected ? (
            <ShieldAlert size={14} />
          ) : (
            <Clock3 size={14} />
          )}

          {isApproved
            ? "Approved"
            : isRejected
              ? "Rejected"
              : "Pending"}
        </span>

        <ArrowRight
          size={18}
          className="
            text-slate-400
            group-hover:text-blue-600
            transition-colors
          "
        />
      </div>
    </a>
  );
}

/* =========================================================
   SUMMARY CARD
   ========================================================= */

function SummaryCard({
  icon,
  title,
  label,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  label: string;
  description: string;
  iconClass: string;
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-100
        shadow-sm
        p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-extrabold text-[#0b1729]">
            {title}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}