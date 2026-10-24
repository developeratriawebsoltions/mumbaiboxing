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
import PageSpinner from "@/Components/ui/PageSpinner";

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
        <PageSpinner message="Loading coach dashboard..." />
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

  const approvedDocuments = documents.filter(
    (doc) => (doc.status || "").toUpperCase() === "APPROVED"
  ).length;
  const fitBoxers = boxers.filter(
    (boxer) => boxer.medical?.fitnessStatus?.toLowerCase() === "valid"
  ).length;
  const membershipValid = Boolean(
    isActive && validUntil && !Number.isNaN(validUntil.getTime()) &&
    validUntil.getTime() >= Date.now()
  );
  const statusTone = (status?: string | null) => {
    const normalized = (status || "PENDING").toUpperCase();
    if (["APPROVED", "ACTIVE", "VALID", "VERIFIED"].includes(normalized))
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (["REJECTED", "EXPIRED", "INACTIVE", "INVALID"].includes(normalized))
      return "bg-red-50 text-red-700 ring-red-100";
    return "bg-amber-50 text-amber-700 ring-amber-100";
  };

  return (
    <DashboardLayout role="coach">
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#0b1729]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,.13)] sm:px-9 lg:px-11 lg:py-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.09]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-600/20 blur-[90px]" />
          <div aria-hidden className="pointer-events-none absolute -top-20 right-[25%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
          <div aria-hidden className="pointer-events-none absolute -top-20 right-[20%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Mumbai Boxing Association
              </div>
              <p className="text-sm font-medium text-slate-300">Coach Dashboard</p>
              <h1 className="mt-1 break-words text-3xl font-black tracking-tight sm:text-[44px] lg:text-[50px]">
                Welcome, {coach.name.split(" ")[0]}<span className="text-red-500">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Lead with purpose. Train champions. Track your coaching journey.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-red-400" /> Registered Coach
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold">
                  <Award className="h-4 w-4 text-red-400" /> {coachId}
                </span>
              </div>
            </div>
            <div className="relative z-10 max-w-[270px] border-l-[3px] border-red-500 pl-5">
              <p className="text-lg font-semibold italic leading-7 text-slate-200">
                “Behind every champion is a coach who believed first.”
              </p>
              <div className="mt-4 h-[3px] w-12 rounded-full bg-red-500" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CoachMetric icon={<ShieldCheck className="h-5 w-5" />} label="Registration Status" value={registrationStatus} detail={isActive ? "Account approved" : "Check registration status"} accent="emerald" />
          <CoachMetric icon={<Users className="h-5 w-5" />} label="Assigned Boxers" value={String(boxers.length)} detail={`${fitBoxers} with valid medical status`} accent="red" />
          <CoachMetric icon={<CalendarDays className="h-5 w-5" />} label="Membership Validity" value={formatShortDate(validUntil)} detail={membershipValid ? "Currently active" : "Check membership validity"} accent="blue" />
          <CoachMetric icon={<Award className="h-5 w-5" />} label="Certificates" value={String(certificates.length)} detail="Issued credentials" accent="amber" />
        </div>

        {/* MAIN THREE-COLUMN ROW */}
        <div className="grid items-stretch gap-5 xl:grid-cols-3">
          <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <CoachSectionTitle icon={<UserRound className="h-5 w-5" />} title="Coach Profile" subtitle="Your registered information" />
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#07172c] text-2xl font-black text-white">
                {coach.name.trim().charAt(0).toUpperCase() || "C"}
              </div>
              <div className="min-w-0">
                <p className="break-words text-lg font-extrabold text-[#07172c]">{coach.name}</p>
                <p className="mt-1 text-xs text-slate-500">{coach.academy?.name || "Academy not assigned"}</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1 ${statusTone(registrationStatus)}`}>{registrationStatus}</span>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <CoachDetail label="Coach ID" value={coachId} />
              <CoachDetail label="Email" value={coach.user.email} />
              <CoachDetail label="Phone" value={coach.phone || "—"} />
              <CoachDetail label="Academy" value={coach.academy?.name || "Not assigned"} />
              <CoachDetail label="Membership ID" value={coach.user.membershipId || "Pending"} />
              <CoachDetail label="Registration" value={registrationStatus} />
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <CoachSectionTitle icon={<ShieldCheck className="h-5 w-5" />} title="Digital Coach ID" subtitle="Official membership credential" />
            <div className="relative mt-6 overflow-hidden rounded-[19px] bg-[#07172c] p-5 text-white shadow-[0_12px_24px_rgba(7,23,44,.16)]">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-16 rotate-[25deg] bg-[#ed1c24]" />
              <div aria-hidden className="pointer-events-none absolute right-12 top-0 h-40 w-4 rotate-[25deg] bg-red-500/30" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-red-300">Mumbai Boxing Association</p>
                  <p className="mt-1 text-base font-extrabold">OFFICIAL COACH ID</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white text-[11px] font-black text-red-600">MBA</div>
              </div>
              <div className="relative mt-9">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">Coach Name</p>
                <p className="mt-1 break-words text-xl font-extrabold">{coach.name}</p>
                <p className="mt-3 break-all text-xs font-bold text-red-300">{coach.user.membershipId || "Membership pending"}</p>
              </div>
              <div className="relative mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-4">
                <div><p className="text-[10px] text-slate-400">Valid From</p><p className="mt-1 text-xs font-bold">{formatShortDate(validFrom)}</p></div>
                <div><p className="text-[10px] text-slate-400">Valid Until</p><p className="mt-1 text-xs font-bold">{formatShortDate(validUntil)}</p></div>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <button type="button" onClick={downloadIdCard} disabled={downloadingId || !coach.user.membershipId} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#c9151e] disabled:cursor-not-allowed disabled:opacity-50">
                <Download className="h-4 w-4" />{downloadingId ? "Generating..." : "Download ID"}
              </button>
              <button type="button" onClick={downloadCertificate} disabled={downloadingCertificate || !coach.user.membershipId} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                <Award className="h-4 w-4" />{downloadingCertificate ? "Generating..." : "Certificate"}
              </button>
            </div>
          </section>

          <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <CoachSectionTitle icon={<CheckCircle2 className="h-5 w-5" />} title="Membership Status" subtitle="Registration and eligibility" />
            <div className={`mt-6 rounded-2xl p-5 ${membershipValid ? "bg-emerald-50" : "bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${membershipValid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}><ShieldCheck className="h-6 w-6" /></div>
                <div>
                  <p className={`font-extrabold ${membershipValid ? "text-emerald-800" : "text-amber-800"}`}>{membershipValid ? "Active Membership" : "Membership Needs Review"}</p>
                  <p className={`mt-1 text-xs ${membershipValid ? "text-emerald-700" : "text-amber-700"}`}>{membershipValid ? "Your membership is currently valid" : "Review your status and validity dates"}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <CoachStatusRow label="Registration" value={registrationStatus} tone={statusTone(registrationStatus)} />
              <CoachStatusRow label="Valid From" value={formatDate(coach.user.membershipValidFrom)} />
              <CoachStatusRow label="Valid Until" value={formatDate(coach.user.membershipExpiry)} />
              <CoachStatusRow label="Documents Approved" value={`${approvedDocuments} / ${documents.length}`} />
              <CoachStatusRow label="Academy" value={coach.academy?.name || "Not assigned"} />
            </div>
          </section>
        </div>

        {/* BOXER ROSTER */}
        <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <CoachSectionTitle icon={<Users className="h-5 w-5" />} title="Assigned Boxers" subtitle="Athletes linked to your academy" />
            <a href="/dashboard/coach/boxers" className="inline-flex items-center gap-2 self-start rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-600 transition hover:bg-red-100">
              View All Boxers <span aria-hidden>→</span>
            </a>
          </div>
          {boxers.length === 0 ? (
            <div className="px-6 py-14 text-center"><Users className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-bold text-slate-700">No boxers assigned yet</p><p className="mt-1 text-sm text-slate-500">Boxers linked to your academy will appear here.</p></div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Boxer</th><th className="px-6 py-4">Weight Category</th><th className="px-6 py-4">Medical Fitness</th><th className="px-6 py-4">Rank</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {boxers.map((boxer) => (
                      <tr key={boxer.id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 font-black text-red-600">{boxer.name.charAt(0).toUpperCase()}</div><div><p className="font-bold text-[#07172c]">{boxer.name}</p><p className="mt-0.5 text-xs text-slate-400">Boxer #{String(boxer.id).padStart(4, "0")}</p></div></div></td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{boxer.weight || "—"}</td>
                        <td className="px-6 py-4"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusTone(boxer.medical?.fitnessStatus || "NO RECORD")}`}>{boxer.medical?.fitnessStatus || "No Record"}</span></td>
                        <td className="px-6 py-4 text-sm font-extrabold text-red-600">{boxer.rank == null ? "—" : `#${boxer.rank}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-slate-100 md:hidden">
                {boxers.map((boxer) => (
                  <div key={boxer.id} className="flex items-center gap-3 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 font-black text-red-600">{boxer.name.charAt(0).toUpperCase()}</div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{boxer.name}</p><p className="mt-1 text-xs text-slate-500">{boxer.weight || "No weight"} · {boxer.medical?.fitnessStatus || "No medical record"}</p></div>
                    <span className="text-sm font-extrabold text-red-600">{boxer.rank == null ? "—" : `#${boxer.rank}`}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* CREDENTIALS & DOCUMENTS */}
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <CoachSectionTitle icon={<Award className="h-5 w-5" />} title="Coaching Credentials" subtitle={`${certificates.length} certificates issued`} />
            <div className="mt-5 space-y-3">
              {certificates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No certificates issued yet.</div>
              ) : certificates.map((certificate) => (
                <div key={certificate.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                  <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Award className="h-5 w-5" /></div><div className="min-w-0"><p className="break-words text-sm font-bold text-slate-800">{certificate.type}</p><p className="mt-1 text-xs text-slate-500">{certificate.event} · {formatDate(certificate.issuedAt)}</p></div></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusTone(certificate.qrStatus)}`}>{certificate.qrStatus || "Pending"}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3"><CoachSectionTitle icon={<FolderOpen className="h-5 w-5" />} title="Registration Documents" subtitle={`${documents.length} uploaded documents`} /><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{approvedDocuments} approved</span></div>
            <div className="mt-5 space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">No documents uploaded yet.</div>
              ) : documents.map((doc) => (
                <a key={doc.id} href={`/api/file?path=${encodeURIComponent(doc.filePath)}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-red-100 hover:bg-red-50/30">
                  <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><FileText className="h-5 w-5" /></div><div className="min-w-0"><p className="break-words text-sm font-bold capitalize text-slate-800">{doc.label.replace(/-/g, " ")}</p><p className="mt-1 text-xs text-slate-500">{formatDate(doc.createdAt)}</p>{doc.status?.toUpperCase() === "REJECTED" && doc.rejectionReason && <p className="mt-1 text-xs text-red-600">{doc.rejectionReason}</p>}</div></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusTone(doc.status)}`}>{doc.status || "Pending"}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}

function CoachSectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]">{icon}</div>
      <div className="min-w-0"><h2 className="text-base font-extrabold tracking-tight text-[#07172c] sm:text-lg">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div>
    </div>
  );
}

function CoachMetric({ icon, label, value, detail, accent }: { icon: React.ReactNode; label: string; value: string; detail: string; accent: "red" | "blue" | "emerald" | "amber" }) {
  const tones = { red: "bg-red-50 text-red-600", blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600" };
  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold text-slate-500">{label}</p><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[accent]}`}>{icon}</div></div>
      <p className="mt-2 break-words text-[23px] font-black tracking-tight text-[#07172c]">{value}</p>
      <p className="mt-2 text-xs font-medium text-slate-500">{detail}</p>
    </div>
  );
}

function CoachDetail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-bold text-slate-800">{value}</p></div>;
}

function CoachStatusRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {tone ? <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${tone}`}>{value}</span> : <span className="max-w-[65%] break-words text-right text-xs font-bold text-slate-800">{value}</span>}
    </div>
  );
}
