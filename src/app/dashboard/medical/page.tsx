"use client";

import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  HeartPulse,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

/* =========================================================
   TYPES
   ========================================================= */

type MedicalRecord = {
  id: number;
  fitnessStatus: string;
  expiryDate: string | null;
  injury: string | null;
  eligible: boolean;
  updatedAt: string;
  createdAt: string;
};

type MedicalDocument = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type MedicalResponse = {
  boxer: {
    id: number;
    name: string;
  };

  medical: MedicalRecord | null;

  documents: MedicalDocument[];
};

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function getFileUrl(
  filePath: string
) {
  return `/api/file?path=${encodeURIComponent(
    filePath
  )}`;
}

function isImage(
  fileType: string,
  filePath: string
) {
  const type =
    fileType?.toLowerCase() ?? "";

  const path =
    filePath?.toLowerCase() ?? "";

  return (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(
      path
    )
  );
}

function isPdf(
  fileType: string,
  filePath: string
) {
  const type =
    fileType?.toLowerCase() ?? "";

  const path =
    filePath?.toLowerCase() ?? "";

  return (
    type.includes("pdf") ||
    path.endsWith(".pdf")
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function MedicalPage() {
  const [data, setData] =
    useState<MedicalResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedDocument,
    setSelectedDocument,
  ] =
    useState<MedicalDocument | null>(
      null
    );

  /* =======================================================
     LOAD MEDICAL DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadMedical() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/medical",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Failed to load medical records."
          );
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load medical records."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMedical();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <DashboardLayout role="boxer">
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
              Loading medical records...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <DashboardLayout role="boxer">
      <div className="max-w-[1500px] mx-auto space-y-7">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div>
          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-red-50
                text-red-600
                flex
                items-center
                justify-center
              "
            >
              <HeartPulse size={25} />
            </div>

            <div>
              <h1
                className="
                  text-3xl
                  sm:text-[38px]
                  font-extrabold
                  tracking-tight
                  text-[#0b1729]
                "
              >
                Medical Records
              </h1>

              <p className="mt-1 text-[15px] text-slate-500">
                Your medical fitness and approved medical documents
              </p>
            </div>

          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-700
            "
          >
            {error}
          </div>
        )}

        {/* ==================================================
            MEDICAL FITNESS
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            overflow-hidden
          "
        >

          <div
            className="
              px-6
              py-5
              border-b
              border-slate-100
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
            "
          >

            <div>
              <div className="flex items-center gap-2">

                <ShieldCheck
                  size={21}
                  className="text-red-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  Medical Fitness
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Current medical eligibility information
              </p>
            </div>

            {data?.medical && (
              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  ${
                    data.medical.eligible
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }
                `}
              >
                <CheckCircle2 size={15} />

                {data.medical.eligible
                  ? "Eligible for Boxing"
                  : "Not Eligible"}
              </span>
            )}

          </div>

          {!data?.medical ? (

            <div className="p-10 text-center">

              <HeartPulse
                size={38}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-semibold text-slate-700">
                No medical record available
              </p>

              <p className="mt-1 text-sm text-slate-400">
                No structured medical fitness record has been created yet.
              </p>

            </div>

          ) : (

            <div className="p-6">

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  xl:grid-cols-4
                  gap-4
                "
              >

                {/* FITNESS */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Fitness Status
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <CheckCircle2
                      size={20}
                      className="text-emerald-600"
                    />

                    <p className="text-lg font-bold text-emerald-600">
                      {data.medical.fitnessStatus ||
                        "—"}
                    </p>

                  </div>

                </div>

                {/* EXPIRY */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Fitness Expiry
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <CalendarDays
                      size={20}
                      className="text-slate-400"
                    />

                    <p className="text-base font-bold text-slate-800">
                      {formatDate(
                        data.medical.expiryDate
                      )}
                    </p>

                  </div>

                </div>

                {/* INJURY */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Injury
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <HeartPulse
                      size={20}
                      className="text-emerald-600"
                    />

                    <p className="text-base font-bold text-slate-800">
                      {data.medical.injury ||
                        "None"}
                    </p>

                  </div>

                </div>

                {/* ELIGIBILITY */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Boxing Eligibility
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <ShieldCheck
                      size={20}
                      className={
                        data.medical.eligible
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
                    />

                    <p
                      className={`
                        text-base
                        font-bold
                        ${
                          data.medical.eligible
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      `}
                    >
                      {data.medical.eligible
                        ? "Eligible"
                        : "Not Eligible"}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          )}

        </section>

        {/* ==================================================
            APPROVED DOCUMENTS
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
              px-6
              py-5
              border-b
              border-slate-100
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
            "
          >

            <div>

              <div className="flex items-center gap-2">

                <FileCheck2
                  size={21}
                  className="text-red-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  Approved Medical Documents
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Documents verified and approved by Mumbai Boxing Association
              </p>

            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-emerald-700
              "
            >

              <CheckCircle2 size={15} />

              {data?.documents?.length ?? 0} Approved

            </div>

          </div>

          {/* DOCUMENTS */}

          {!data?.documents?.length ? (

            <div className="p-10 text-center">

              <div
                className="
                  w-14
                  h-14
                  mx-auto
                  rounded-2xl
                  bg-slate-50
                  flex
                  items-center
                  justify-center
                "
              >
                <FileText
                  size={28}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                No approved medical documents
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Your approved medical certificates and reports will appear here.
              </p>

            </div>

          ) : (

            <div className="p-6">

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-5
                "
              >

                {data.documents.map(
                  (document) => {

                    const fileUrl =
                      getFileUrl(
                        document.filePath
                      );

                    const image =
                      isImage(
                        document.fileType,
                        document.filePath
                      );

                    const pdf =
                      isPdf(
                        document.fileType,
                        document.filePath
                      );

                    return (
                      <article
                        key={document.id}
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          overflow-hidden
                          hover:border-red-200
                          hover:shadow-md
                          transition
                        "
                      >

                        {/* PREVIEW */}

                        <div
                          className="
                            relative
                            h-[300px]
                            bg-slate-50
                            border-b
                            border-slate-100
                            overflow-hidden
                          "
                        >

                          {image ? (

                            <img
                              src={fileUrl}
                              alt={document.label}
                              className="
                                w-full
                                h-full
                                object-contain
                                p-5
                              "
                            />

                          ) : pdf ? (

                            <iframe
                              src={fileUrl}
                              title={document.label}
                              className="
                                w-full
                                h-full
                                border-0
                              "
                            />

                          ) : (

                            <div
                              className="
                                h-full
                                flex
                                flex-col
                                items-center
                                justify-center
                              "
                            >

                              <FileText
                                size={52}
                                className="text-slate-300"
                              />

                              <p className="mt-3 text-sm font-semibold text-slate-600">
                                Document preview unavailable
                              </p>

                            </div>

                          )}

                          {/* APPROVED */}

                          <div
                            className="
                              absolute
                              top-4
                              right-4
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              bg-white
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-emerald-700
                              shadow-sm
                              border
                              border-emerald-100
                            "
                          >

                            <CheckCircle2 size={14} />

                            Approved

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="p-5">

                          <div className="flex items-start gap-3">

                            <div
                              className="
                                w-11
                                h-11
                                shrink-0
                                rounded-xl
                                bg-red-50
                                text-red-600
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <FileCheck2 size={21} />
                            </div>

                            <div className="min-w-0">

                              <h3
                                className="
                                  font-bold
                                  text-slate-900
                                  leading-5
                                "
                              >
                                {document.label}
                              </h3>

                              <p className="mt-1 text-xs text-slate-400">
                                Uploaded{" "}
                                {formatDate(
                                  document.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                          {/* ACTIONS */}

                          <div
                            className="
                              mt-5
                              flex
                              flex-col
                              sm:flex-row
                              gap-3
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedDocument(
                                  document
                                )
                              }
                              className="
                                flex-1
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-600
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-red-700
                                transition
                              "
                            >
                              <ExternalLink size={17} />

                              View Document
                            </button>

                            <a
                              href={fileUrl}
                              download
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
                                font-semibold
                                text-slate-700
                                hover:bg-slate-50
                              "
                            >
                              <Download size={17} />

                              Download
                            </a>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </section>

        {/* ==================================================
            INFO
        ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-blue-100
            bg-blue-50/50
            p-5
          "
        >

          <div className="flex items-start gap-3">

            <UserRound
              size={20}
              className="mt-0.5 text-blue-600 shrink-0"
            />

            <div>

              <h3 className="font-semibold text-slate-800">
                Medical document verification
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Only medical documents approved by
                Mumbai Boxing Association are displayed
                in this section.
              </p>

            </div>

          </div>

        </section>

      </div>

      {/* ====================================================
          DOCUMENT MODAL
      ==================================================== */}

      {selectedDocument && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-slate-950/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() =>
            setSelectedDocument(null)
          }
        >

          <div
            className="
              w-full
              max-w-5xl
              max-h-[92vh]
              rounded-2xl
              bg-white
              shadow-2xl
              overflow-hidden
              flex
              flex-col
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                px-5
                py-4
                border-b
                border-slate-100
              "
            >

              <div className="min-w-0">

                <h3
                  className="
                    font-bold
                    text-slate-900
                    truncate
                  "
                >
                  {selectedDocument.label}
                </h3>

                <div className="mt-1 flex items-center gap-2">

                  <CheckCircle2
                    size={14}
                    className="text-emerald-600"
                  />

                  <span className="text-xs font-semibold text-emerald-600">
                    Approved
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedDocument(null)
                }
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-slate-100
                  text-slate-600
                  flex
                  items-center
                  justify-center
                  hover:bg-slate-200
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* PREVIEW */}

            <div className="flex-1 min-h-0 bg-slate-100">

              {isImage(
                selectedDocument.fileType,
                selectedDocument.filePath
              ) ? (

                <div
                  className="
                    h-full
                    max-h-[75vh]
                    overflow-auto
                    flex
                    items-center
                    justify-center
                    p-6
                  "
                >

                  <img
                    src={getFileUrl(
                      selectedDocument.filePath
                    )}
                    alt={
                      selectedDocument.label
                    }
                    className="
                      max-w-full
                      max-h-[70vh]
                      object-contain
                      rounded-lg
                    "
                  />

                </div>

              ) : (

                <iframe
                  src={getFileUrl(
                    selectedDocument.filePath
                  )}
                  title={
                    selectedDocument.label
                  }
                  className="
                    w-full
                    h-[70vh]
                    border-0
                  "
                />

              )}

            </div>

            {/* FOOTER */}

            <div
              className="
                px-5
                py-4
                border-t
                border-slate-100
                flex
                flex-col
                sm:flex-row
                sm:justify-end
                gap-3
              "
            >

              <a
                href={getFileUrl(
                  selectedDocument.filePath
                )}
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
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                <ExternalLink size={16} />

                Open in New Tab
              </a>

              <a
                href={getFileUrl(
                  selectedDocument.filePath
                )}
                download
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-700
                "
              >
                <Download size={16} />

                Download Document
              </a>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  );
}