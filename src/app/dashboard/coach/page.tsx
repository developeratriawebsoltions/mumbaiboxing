"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  FolderOpen,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status?: string;
  rejectionReason?: string | null;
  createdAt: string;
};

type Boxer = {
  id: number;
  name: string;
  weight: string | null;
  rank: number | null;
  medical: {
    fitnessStatus: string;
  } | null;
};

type Certificate = {
  id: number;
  type: string;
  event: string;
  issuedAt: string;
  qrStatus: string;
};

type Coach = {
  id: number;
  name: string;
  phone: string | null;

  user: {
    email: string;
    createdAt: string;
    registrationStatus: string;
    membershipId: string | null;
    membershipValidFrom: string | null;
    membershipExpiry: string | null;
    membershipActivatedAt: string | null;
    documents: Doc[];
  };

  academy: {
    name: string;
    boxers: Boxer[];
  } | null;

  certificate?: Certificate[];
};

export default function CoachDashboard() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [downloadingId, setDownloadingId] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] =
    useState(false);

  useEffect(() => {
    async function loadCoach() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/coach", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load coach profile."
          );
        }

        setCoach(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load coach profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCoach();
  }, []);

  const boxers = coach?.academy?.boxers ?? [];

  const coachId = useMemo(() => {
    if (!coach) return "—";

    return `MBA-CCH-${new Date(
      coach.user.createdAt
    ).getFullYear()}-${String(coach.id).padStart(4, "0")}`;
  }, [coach]);

  const registrationStatus =
    coach?.user.registrationStatus ?? "PENDING";

  const isActive =
    registrationStatus.toUpperCase() === "ACTIVE";

  const documents = coach?.user.documents ?? [];

  const certificates = coach?.certificate ?? [];

  const validFrom = coach?.user.membershipValidFrom
    ? new Date(coach.user.membershipValidFrom)
    : null;

  const validUntil = coach?.user.membershipExpiry
    ? new Date(coach.user.membershipExpiry)
    : null;

  const formatDate = (value: string | Date | null) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (value: Date | null) => {
    if (!value) return "—";

    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * ============================================================
   * COACH VERIFICATION URL
   * ============================================================
   *
   * We use the coach membership ID.
   *
   * Example:
   * /verify/coach/MBA-2026-000009
   *
   * NOTE:
   * The public coach verification route/page needs to exist.
   */
  const getVerificationUrl = () => {
    if (!coach?.user.membershipId) {
      return null;
    }

    return `${window.location.origin}/verify/coach/${encodeURIComponent(
      coach.user.membershipId
    )}`;
  };

  /*
   * ============================================================
   * DOWNLOAD DIGITAL COACH ID
   * ============================================================
   */

  const downloadIdCard = async () => {
    if (!coach) return;

    if (!coach.user.membershipId) {
      setError(
        "Coach membership ID is not available yet."
      );
      return;
    }

    if (!validFrom || !validUntil) {
      setError(
        "Membership validity dates are not available."
      );
      return;
    }

    try {
      setDownloadingId(true);
      setError("");

      const membershipId =
        coach.user.membershipId;

      const verificationUrl =
        getVerificationUrl();

      if (!verificationUrl) {
        throw new Error(
          "Verification URL could not be generated."
        );
      }

      const qrDataUrl =
        await QRCode.toDataURL(
          verificationUrl,
          {
            errorCorrectionLevel: "M",
            margin: 1,
            width: 180,
          }
        );

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [86, 54],
      });

      /*
       * --------------------------------------------------------
       * CARD
       * --------------------------------------------------------
       */

      doc.setFillColor(255, 255, 255);

      doc.roundedRect(
        2,
        2,
        82,
        50,
        3,
        3,
        "F"
      );

      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);

      doc.roundedRect(
        2,
        2,
        82,
        50,
        3,
        3,
        "S"
      );

      /*
       * --------------------------------------------------------
       * RED HEADER
       * --------------------------------------------------------
       */

      doc.setFillColor(220, 38, 38);

      doc.roundedRect(
        2,
        2,
        82,
        15,
        3,
        3,
        "F"
      );

      doc.rect(
        2,
        10,
        82,
        7,
        "F"
      );

      /*
       * MBA badge
       */

      doc.setFillColor(
        255,
        255,
        255
      );

      doc.circle(
        10,
        9,
        4,
        "F"
      );

      doc.setTextColor(
        220,
        38,
        38
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        "MBA",
        10,
        10.5,
        {
          align: "center",
        }
      );

      /*
       * Header title
       */

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(5);

      doc.text(
        "MUMBAI BOXING ASSOCIATION",
        17,
        7,
        {
          align: "left",
        }
      );

      doc.setFontSize(7);

      doc.text(
        "OFFICIAL COACH ID",
        17,
        12,
        {
          align: "left",
        }
      );

      /*
       * --------------------------------------------------------
       * COACH INFORMATION
       * --------------------------------------------------------
       */

      doc.setTextColor(
        30,
        41,
        59
      );

      doc.setFontSize(4);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "COACH NAME",
        6,
        22
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(7);

      doc.text(
        coach.name.substring(0, 30),
        6,
        26
      );

      /*
       * Coach ID
       */

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "COACH ID",
        6,
        32
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(6);

      doc.text(
        coachId,
        6,
        36
      );

      /*
       * Membership ID
       */

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "MEMBERSHIP ID",
        6,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5.5);

      doc.text(
        membershipId,
        6,
        46
      );

      /*
       * --------------------------------------------------------
       * VALIDITY
       * --------------------------------------------------------
       */

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "VALID FROM",
        43,
        22
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        formatShortDate(validFrom),
        43,
        26
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "VALID UNTIL",
        43,
        32
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        22,
        163,
        74
      );

      doc.setFontSize(5);

      doc.text(
        formatShortDate(validUntil),
        43,
        36
      );

      /*
       * Status
       */

      doc.setTextColor(
        30,
        41,
        59
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "STATUS",
        43,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.setTextColor(
        isActive ? 22 : 220,
        isActive ? 163 : 38,
        isActive ? 74 : 38
      );

      doc.text(
        isActive ? "ACTIVE" : "INACTIVE",
        43,
        46
      );

      /*
       * --------------------------------------------------------
       * QR CODE
       * --------------------------------------------------------
       */

      doc.addImage(
        qrDataUrl,
        "PNG",
        67,
        19,
        14,
        14
      );

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(3.2);

      doc.text(
        "SCAN TO VERIFY",
        74,
        36,
        {
          align: "center",
        }
      );

      /*
       * --------------------------------------------------------
       * FOOTER
       * --------------------------------------------------------
       */

      doc.setFontSize(3.5);

      doc.setTextColor(
        148,
        163,
        184
      );

      doc.text(
        "Official Mumbai Boxing Association Membership",
        43,
        50,
        {
          align: "center",
        }
      );

      doc.save(
        `${coach.name.replace(
          /\s+/g,
          "-"
        )}-Coach-ID.pdf`
      );
    } catch (err) {
      console.error(
        "Coach ID download failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate Coach ID."
      );
    } finally {
      setDownloadingId(false);
    }
  };

  /*
   * ============================================================
   * DOWNLOAD COACH CERTIFICATE
   * ============================================================
   *
   * If an actual certificate record exists, use its information.
   * Otherwise generate the official membership/certification
   * certificate from the coach's active membership.
   */

  const downloadCertificate = async () => {
    if (!coach) return;

    if (!coach.user.membershipId) {
      setError(
        "Coach membership ID is not available yet."
      );
      return;
    }

    try {
      setDownloadingCertificate(true);
      setError("");

      const membershipId =
        coach.user.membershipId;

      const certificate =
        certificates[0] ?? null;

      const certificateType =
        certificate?.type ||
        "Official Coach Certification";

      const event =
        certificate?.event ||
        "Mumbai Boxing Association";

      const issuedAt =
        certificate?.issuedAt
          ? new Date(certificate.issuedAt)
          : validFrom;

      const verificationUrl =
        getVerificationUrl();

      let qrDataUrl: string | null = null;

      if (verificationUrl) {
        qrDataUrl =
          await QRCode.toDataURL(
            verificationUrl,
            {
              errorCorrectionLevel: "M",
              margin: 1,
              width: 220,
            }
          );
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      /*
       * Background
       */

      doc.setFillColor(
        250,
        250,
        248
      );

      doc.rect(
        0,
        0,
        297,
        210,
        "F"
      );

      /*
       * Outer border
       */

      doc.setDrawColor(
        220,
        38,
        38
      );

      doc.setLineWidth(1);

      doc.rect(
        12,
        12,
        273,
        186
      );

      doc.setLineWidth(0.3);

      doc.rect(
        17,
        17,
        263,
        176
      );

      /*
       * Header
       */

      doc.setTextColor(
        220,
        38,
        38
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(16);

      doc.text(
        "MUMBAI BOXING ASSOCIATION",
        148.5,
        35,
        {
          align: "center",
        }
      );

      doc.setTextColor(
        30,
        41,
        59
      );

      doc.setFontSize(10);

      doc.text(
        "OFFICIAL COACH CERTIFICATE",
        148.5,
        44,
        {
          align: "center",
        }
      );

      /*
       * Divider
       */

      doc.setDrawColor(
        220,
        38,
        38
      );

      doc.line(
        70,
        50,
        227,
        50
      );

      /*
       * Main certificate text
       */

      doc.setTextColor(
        71,
        85,
        105
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      doc.text(
        "This is to certify that",
        148.5,
        68,
        {
          align: "center",
        }
      );

      /*
       * Coach name
       */

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(24);

      doc.text(
        coach.name,
        148.5,
        82,
        {
          align: "center",
        }
      );

      /*
       * Description
       */

      doc.setTextColor(
        71,
        85,
        105
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      doc.text(
        "is officially registered as a Coach with the",
        148.5,
        96,
        {
          align: "center",
        }
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(
        220,
        38,
        38
      );

      doc.text(
        "Mumbai Boxing Association",
        148.5,
        106,
        {
          align: "center",
        }
      );

      /*
       * Credential information
       */

      doc.setTextColor(
        30,
        41,
        59
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.text(
        `Coach ID: ${coachId}`,
        60,
        125
      );

      doc.text(
        `Membership ID: ${membershipId}`,
        60,
        135
      );

      doc.text(
        `Certification: ${certificateType}`,
        60,
        145
      );

      doc.text(
        `Issued By: ${event}`,
        60,
        155
      );

      doc.text(
        `Issued On: ${formatDate(issuedAt)}`,
        60,
        165
      );

      doc.text(
        `Valid Until: ${formatDate(validUntil)}`,
        60,
        175
      );

      /*
       * QR
       */

      if (qrDataUrl) {
        doc.addImage(
          qrDataUrl,
          "PNG",
          220,
          135,
          32,
          32
        );

        doc.setFontSize(7);

        doc.setTextColor(
          100,
          116,
          139
        );

        doc.text(
          "SCAN TO VERIFY",
          236,
          172,
          {
            align: "center",
          }
        );
      }

      /*
       * Footer
       */

      doc.setTextColor(
        148,
        163,
        184
      );

      doc.setFontSize(7);

      doc.text(
        "This certificate is digitally generated by the Mumbai Boxing Association.",
        148.5,
        187,
        {
          align: "center",
        }
      );

      doc.save(
        `${coach.name.replace(
          /\s+/g,
          "-"
        )}-Coach-Certificate.pdf`
      );
    } catch (err) {
      console.error(
        "Coach certificate download failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate certificate."
      );
    } finally {
      setDownloadingCertificate(false);
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <DashboardLayout role="coach">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-400">
            Loading coach dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (!coach) {
    return (
      <DashboardLayout role="coach">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            Unable to load Coach Dashboard
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error || "Coach profile not found."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * ============================================================
   * DASHBOARD
   * ============================================================
   */

  return (
    <DashboardLayout role="coach">
      <div className="space-y-6">

        {/* ---------------------------------------------------- */}
        {/* PAGE HEADER */}
        {/* ---------------------------------------------------- */}

        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Coach Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your coaching profile, credentials and assigned boxers
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* ERROR */}
        {/* ---------------------------------------------------- */}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PROFILE + DIGITAL ID */}
        {/* ---------------------------------------------------- */}

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

          {/* Profile */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-6 sm:flex-row">

              {/* Photo */}

              <div className="shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-red-100 bg-red-50">

                  <UserRound
                    className="h-10 w-10 text-red-500"
                  />

                </div>

                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Coach Photo
                </p>
              </div>

              {/* Information */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="text-xl font-bold text-slate-950">
                    {coach.name}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {registrationStatus}
                  </span>

                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  <Info
                    label="Coach ID"
                    value={coachId}
                  />

                  <Info
                    label="Email"
                    value={coach.user.email}
                  />

                  <Info
                    label="Phone"
                    value={coach.phone || "—"}
                  />

                  <Info
                    label="Academy"
                    value={coach.academy?.name || "Not assigned"}
                  />

                  <Info
                    label="Membership ID"
                    value={coach.user.membershipId || "—"}
                  />

                  <Info
                    label="Registration"
                    value={registrationStatus}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Digital ID */}

          <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">

            <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-100">
                    MBA Membership
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    Digital Coach ID
                  </p>
                </div>

                <ShieldCheck className="h-8 w-8 text-white/90" />

              </div>

              <p className="mt-5 text-xl font-extrabold tracking-wide">
                {coach.user.membershipId || "Pending"}
              </p>

            </div>

            <div className="p-5">

              <div className="grid grid-cols-2 gap-4">

                <Info
                  label="Valid From"
                  value={formatDate(
                    coach.user.membershipValidFrom
                  )}
                />

                <Info
                  label="Valid Until"
                  value={formatDate(
                    coach.user.membershipExpiry
                  )}
                />

              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={downloadIdCard}
                  disabled={
                    downloadingId ||
                    !coach.user.membershipId
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />

                  {downloadingId
                    ? "Generating..."
                    : "Download Coach ID"}
                </button>

                <button
                  type="button"
                  onClick={downloadCertificate}
                  disabled={
                    downloadingCertificate ||
                    !coach.user.membershipId
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Award className="h-4 w-4" />

                  {downloadingCertificate
                    ? "Generating..."
                    : "Download Certificate"}
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* SUMMARY */}
        {/* ---------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Assigned Boxers"
            value={boxers.length}
          />

          <StatCard
            icon={<FolderOpen className="h-5 w-5" />}
            label="Documents"
            value={documents.length}
          />

          <StatCard
            icon={<Award className="h-5 w-5" />}
            label="Credentials"
            value={certificates.length}
          />

        </div>

        {/* ---------------------------------------------------- */}
        {/* ASSIGNED BOXERS */}
        {/* ---------------------------------------------------- */}

        <section>

          <div className="mb-3 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Assigned Boxers
              </h3>

              <p className="text-sm text-slate-500">
                Boxers currently linked to your academy
              </p>
            </div>

            <a
              href="/dashboard/coach/boxers"
              className="text-sm font-semibold text-red-600 hover:underline"
            >
              View Boxer List →
            </a>

          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {boxers.length === 0 ? (
              <div className="px-6 py-12 text-center">

                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 font-medium text-slate-700">
                  No boxers assigned yet
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Boxers linked to your academy will appear here.
                </p>

              </div>
            ) : (
              <>
                {/* Desktop */}

                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">

                      <tr>
                        <th className="px-5 py-4">
                          Boxer
                        </th>

                        <th className="px-5 py-4">
                          Weight
                        </th>

                        <th className="px-5 py-4">
                          Medical
                        </th>

                        <th className="px-5 py-4">
                          Rank
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {boxers.map((boxer) => (
                        <tr
                          key={boxer.id}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <p className="font-semibold text-slate-900">
                              {boxer.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              MBA-BXR-
                              {String(boxer.id).padStart(
                                4,
                                "0"
                              )}
                            </p>

                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {boxer.weight || "—"}
                          </td>

                          <td className="px-5 py-4">

                            {boxer.medical ? (
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  boxer.medical
                                    .fitnessStatus ===
                                  "Valid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {
                                  boxer.medical
                                    .fitnessStatus
                                }
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                No Record
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4 font-semibold text-red-600">
                            {boxer.rank
                              ? `#${boxer.rank}`
                              : "—"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

                {/* Mobile */}

                <div className="divide-y divide-slate-100 md:hidden">

                  {boxers.map((boxer) => (
                    <div
                      key={boxer.id}
                      className="p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="font-semibold text-slate-900">
                            {boxer.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Weight:{" "}
                            {boxer.weight || "—"}
                          </p>

                        </div>

                        <p className="font-bold text-red-600">
                          {boxer.rank
                            ? `#${boxer.rank}`
                            : "—"}
                        </p>

                      </div>

                      <div className="mt-3">

                        {boxer.medical ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Medical:{" "}
                            {
                              boxer.medical
                                .fitnessStatus
                            }
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            Medical: No Record
                          </span>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              </>
            )}

          </div>

        </section>

        {/* ---------------------------------------------------- */}
        {/* CREDENTIALS / DOCUMENTS */}
        {/* ---------------------------------------------------- */}

        <section>

          <div className="mb-3">

            <h3 className="text-lg font-semibold text-slate-950">
              Credentials & Documents
            </h3>

            <p className="text-sm text-slate-500">
              Your uploaded coaching credentials and registration documents
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Credentials */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Award className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Coaching Credentials
                  </p>

                  <p className="text-xs text-slate-400">
                    Official certificates
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {certificates.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                    No certificates issued yet.
                  </div>
                ) : (
                  certificates.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {certificate.type}
                          </p>

                          <p className="text-xs text-slate-400">
                            {certificate.event}
                          </p>

                        </div>

                      </div>

                      <span className="text-xs font-semibold text-green-600">
                        {certificate.qrStatus ||
                          "Verified"}
                      </span>

                    </div>
                  ))
                )}

              </div>

            </div>

            {/* Documents */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Registration Documents
                  </p>

                  <p className="text-xs text-slate-400">
                    Uploaded credentials and documents
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {documents.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                    No documents uploaded.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={`/api/file?path=${encodeURIComponent(
                        doc.filePath
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <FileText className="h-5 w-5 shrink-0 text-slate-400" />

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {doc.label.replace(
                              /-/g,
                              " "
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            {formatDate(
                              doc.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 text-xs font-semibold text-red-600">
                        View →
                      </span>

                    </a>
                  ))
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ---------------------------------------------------- */}
        {/* MEMBERSHIP STATUS */}
        {/* ---------------------------------------------------- */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>

              <h3 className="font-semibold text-slate-900">
                Registration & Membership Status
              </h3>

              <p className="text-xs text-slate-400">
                Current official MBA registration status
              </p>

            </div>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            <StatusItem
              label="Registration"
              value={registrationStatus}
              active={isActive}
            />

            <StatusItem
              label="Valid From"
              value={formatDate(
                coach.user.membershipValidFrom
              )}
              active
            />

            <StatusItem
              label="Valid Until"
              value={formatDate(
                coach.user.membershipExpiry
              )}
              active
            />

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

/*
 * ==============================================================
 * SMALL UI COMPONENTS
 * ==============================================================
 */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold text-slate-950">
            {value}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>
        </div>

      </div>

    </div>
  );
}

function StatusItem({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <p className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">

        {active && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}

        <p
          className={`text-sm font-semibold ${
            active
              ? "text-green-700"
              : "text-slate-700"
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  );
}