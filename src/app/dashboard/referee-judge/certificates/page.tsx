"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type CertificateItem = {
  id: number;
  certificateNumber?: string | null;
  title?: string | null;
  certificateType?: string | null;
  issueDate?: string | null;
  issuedAt?: string | null;
  status?: string | null;
  filePath?: string | null;
  fileUrl?: string | null;
  createdAt?: string | null;
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

  certificates: CertificateItem[];
};

/* =========================================================
   PAGE
   ========================================================= */

export default function RefereeJudgeCertificatesPage() {
  const [data, setData] = useState<DashboardData | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    async function loadCertificates() {
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
              "Failed to load your certificates."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
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
     CERTIFICATES
     ======================================================= */

  const certificates = useMemo(
    () => data?.certificates ?? [],
    [data]
  );

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
              Loading your certificates...
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
            {error || "Unable to load certificates."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              Certificates
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              View your official Mumbai Boxing Association
              certificates
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
            <Award size={17} />
            Certificates
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
            lg:grid-cols-3
            gap-4
          "
        >
          <SummaryCard
            icon={<Award size={21} />}
            title={String(certificates.length)}
            label="Certificates"
            description="Issued to your account"
            iconClass="bg-violet-50 text-violet-600"
          />

          <SummaryCard
            icon={<BadgeCheck size={21} />}
            title={String(
              certificates.filter(
                (certificate) =>
                  (certificate.status || "ACTIVE")
                    .toLowerCase() === "active" ||
                  (certificate.status || "")
                    .toLowerCase() === "issued" ||
                  (certificate.status || "")
                    .toLowerCase() === "verified"
              ).length
            )}
            label="Verified / Active"
            description="Currently valid certificates"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            icon={<Trophy size={21} />}
            title="MBA"
            label="Issuing Association"
            description="Mumbai Boxing Association"
            iconClass="bg-red-50 text-red-600"
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
            <ShieldCheck size={19} />
          </div>

          <div>
            <p className="font-semibold text-blue-900">
              Official certificates
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Certificates shown here are those officially
              issued and linked to your Referee / Judge
              membership account.
            </p>
          </div>
        </div>

        {/* ==================================================
            CERTIFICATE LIST
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
              <Award size={21} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0b1729]
                "
              >
                My Certificates
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Official certificates associated with
                your account
              </p>
            </div>
          </div>

          {certificates.length === 0 ? (
            <EmptyCertificates />
          ) : (
            <div className="space-y-4">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            FOOTER
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
   CERTIFICATE CARD
   ========================================================= */

function CertificateCard({
  certificate,
  formatDate,
}: {
  certificate: CertificateItem;
  formatDate: (
    value: string | null | undefined
  ) => string;
}) {
  const title =
    certificate.title ||
    certificate.certificateType ||
    "MBA Certificate";

  const issueDate =
    certificate.issueDate ||
    certificate.issuedAt ||
    certificate.createdAt;

  const status =
    certificate.status || "Active";

  const normalizedStatus = status.toLowerCase();

  const isValid =
    normalizedStatus === "active" ||
    normalizedStatus === "issued" ||
    normalizedStatus === "verified";

  const fileUrl =
    certificate.fileUrl ||
    (certificate.filePath
      ? `/api/file?path=${encodeURIComponent(
          certificate.filePath
        )}`
      : null);

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-100
        bg-white
        p-5
        sm:p-6
        hover:shadow-md
        transition-all
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          gap-5
        "
      >
        {/* Icon */}

        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-red-50
            text-red-600
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <Award
            size={31}
            strokeWidth={1.7}
          />
        </div>

        {/* Main info */}

        <div className="flex-1 min-w-0">
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              gap-2
            "
          >
            <h3
              className="
                text-lg
                font-bold
                text-[#0b1729]
                break-words
              "
            >
              {title}
            </h3>

            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1
                text-xs
                font-bold
                w-fit
                ${
                  isValid
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }
              `}
            >
              <CheckCircle2 size={13} />
              {status}
            </span>
          </div>

          <div
            className="
              mt-4
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-x-8
              gap-y-3
            "
          >
            <InfoItem
              icon={<CalendarDays size={16} />}
              label="Issue Date"
              value={formatDate(issueDate)}
            />

            <InfoItem
              icon={<FileText size={16} />}
              label="Certificate Number"
              value={
                certificate.certificateNumber || "—"
              }
            />
          </div>
        </div>

        {/* Action */}

        {fileUrl && (
          <div className="shrink-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-700
                hover:border-red-200
                hover:text-red-600
                transition-colors
              "
            >
              <Download size={17} />
              View Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyCertificates() {
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-slate-200
        bg-slate-50/50
        px-6
        py-14
        text-center
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
          mx-auto
        "
      >
        <Award
          size={32}
          strokeWidth={1.5}
        />
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-bold
          text-slate-800
        "
      >
        No certificates yet
      </h3>

      <p
        className="
          mt-2
          max-w-md
          mx-auto
          text-sm
          leading-6
          text-slate-500
        "
      >
        You don't have any certificates issued to
        your Referee / Judge account yet. Official
        certificates will appear here when they are
        issued by the Mumbai Boxing Association.
      </p>
    </div>
  );
}

/* =========================================================
   INFO ITEM
   ========================================================= */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="
          mt-0.5
          text-slate-400
          shrink-0
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700 break-words">
          {value}
        </p>
      </div>
    </div>
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