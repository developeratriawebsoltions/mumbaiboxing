"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  FolderOpen,
  IndianRupee,
  ShieldCheck,
  Trophy,
  UserRound,
  BadgeCheck,
  Clock3,
  Bell,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

import DashboardLayout from "@/Components/layout/DashboardLayout";
import PageSpinner from "@/Components/ui/PageSpinner";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type Payment = {
  id: number;
  type: string;
  amount: number;
  method: string;
  status: string;
  membershipExpiry: string | null;
  createdAt: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  isDeveloperBypass: boolean;
  invoiceNumber: string | null;
};

type RefereeJudge = {
  id: number;
  userId: number;
  name: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;

  designation: string | null;
  officiatingLevel: string | null;
  qualification: string | null;
  officiatingExperience: string | null;
  federationAffiliation: string | null;

  aadhaarPan: string | null;
  tournamentsOfficiated: string | null;
  achievements: string | null;

  address: string | null;

  membershipExpiry: string | null;
  createdAt: string;
  updatedAt: string;
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

  profile: RefereeJudge;

  documents: Doc[];

  payments: Payment[];

  notifications: {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[];
};

export default function RefereeJudgeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingCard, setDownloadingCard] = useState(false);

  /* =========================================================
     LOAD DASHBOARD
     ========================================================= */

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/referee-judge", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error || "Failed to load Referee / Judge dashboard."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /* =========================================================
     DATE HELPERS
     ========================================================= */

  const formatDate = (value: string | null | undefined) => {
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

  const formatShortDate = (value: string | null | undefined) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     GREETING
     ========================================================= */

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";

    return "Good night";
  }, []);

  /* =========================================================
     PASSPORT PHOTO
     ========================================================= */

  const passportPhoto = useMemo(() => {
    if (!data) return null;

    const documents = data.documents ?? [];

    const photo = documents.find((doc) => {
      const label = doc.label.toLowerCase();

      return label.includes("passport") && label.includes("photo");
    });

    return photo
      ? `/api/file?path=${encodeURIComponent(photo.filePath)}`
      : null;
  }, [data]);

  /* =========================================================
     MEMBERSHIP STATUS
     ========================================================= */

  const membershipStatus = useMemo(() => {
    if (!data) {
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700",
      };
    }

    if (data.membership.active) {
      return {
        label: "ACTIVE",
        className: "bg-emerald-100 text-emerald-700",
      };
    }

    if (data.user.registrationStatus === "PAYMENT_PENDING") {
      return {
        label: "PAYMENT PENDING",
        className: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: data.user.registrationStatus || "Pending",
      className: "bg-slate-100 text-slate-600",
    };
  }, [data]);

  /* =========================================================
     MASK ID NUMBER
     ========================================================= */

  const maskedIdNumber = useMemo(() => {
    const value = data?.profile?.aadhaarPan;

    if (!value) return "—";

    const clean = value.trim();

    if (clean.length <= 4) {
      return "••••";
    }

    return `${"•".repeat(Math.max(0, clean.length - 4))}${clean.slice(-4)}`;
  }, [data]);

  /* =========================================================
     DOWNLOAD MEMBERSHIP CARD
     ========================================================= */

  const downloadMembershipCard = async () => {
    if (!data?.profile) return;

    const membershipId = data.membership.id;

    if (!membershipId) {
      setError("Membership ID is not available yet.");
      return;
    }

    const validFrom = data.membership.validFrom
      ? new Date(data.membership.validFrom)
      : null;

    const expiry = data.membership.expiry
      ? new Date(data.membership.expiry)
      : null;

    if (
      !validFrom ||
      Number.isNaN(validFrom.getTime()) ||
      !expiry ||
      Number.isNaN(expiry.getTime())
    ) {
      setError("Membership validity dates are not available.");
      return;
    }

    try {
      setDownloadingCard(true);
      setError("");

      const verificationUrl = `${window.location.origin}/verify/referee-judge/${encodeURIComponent(
        membershipId
      )}`;

      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 180,
      });

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [86, 54],
      });

      /* =====================================================
         CARD
         ===================================================== */

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(2, 2, 82, 50, 3, 3, "F");

      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.roundedRect(2, 2, 82, 50, 3, 3, "S");

      /* =====================================================
         HEADER
         ===================================================== */

      doc.setFillColor(220, 38, 38);
      doc.roundedRect(2, 2, 82, 13, 3, 3, "F");
      doc.rect(2, 9, 82, 6, "F");

      /* MBA badge */

      doc.setFillColor(255, 255, 255);
      doc.circle(9, 8, 4, "F");

      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);

      doc.text("MBA", 9, 9.5, {
        align: "center",
      });

      /* Header text */

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5);
      doc.text("MUMBAI BOXING ASSOCIATION", 16, 7.5);

      doc.setFontSize(3.8);
      doc.setFont("helvetica", "normal");

      doc.text("OFFICIAL MEMBERSHIP CARD", 16, 11);

      /* =====================================================
         MEMBER INITIAL
         ===================================================== */

      doc.setFillColor(254, 226, 226);
      doc.circle(11, 24, 6.5, "F");

      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text(
        data.profile.name.charAt(0).toUpperCase(),
        11,
        27.2,
        {
          align: "center",
        }
      );

      /* =====================================================
         NAME
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("MEMBER NAME", 21, 19);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);

      const nameLines = doc.splitTextToSize(data.profile.name, 27);

      doc.text(nameLines.slice(0, 2), 21, 22.5);

      /* =====================================================
         MEMBERSHIP ID
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("MEMBERSHIP ID", 21, 29);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.5);

      doc.text(membershipId, 21, 32.5);

      /* =====================================================
         ROLE
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("CATEGORY", 21, 37);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);

      doc.text("REFEREE / JUDGE", 21, 40.5);

      /* =====================================================
         OFFICIATING LEVEL
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("OFFICIATING LEVEL", 50, 19);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.2);

      doc.text(
        data.profile.officiatingLevel || "—",
        50,
        22.5
      );

      /* =====================================================
         VALID FROM
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("VALID FROM", 50, 28);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);

      doc.text(
        formatShortDate(data.membership.validFrom),
        50,
        31.5
      );

      /* =====================================================
         VALID UNTIL
         ===================================================== */

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(4);

      doc.text("VALID UNTIL", 50, 36.5);

      doc.setTextColor(22, 163, 74);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);

      doc.text(
        formatShortDate(data.membership.expiry),
        50,
        40
      );

      /* =====================================================
         QR VERIFICATION
         ===================================================== */

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(64, 27, 17, 17, 2, 2, "F");

      doc.addImage(qrDataUrl, "PNG", 65, 28, 15, 15);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.2);

      doc.text("SCAN TO VERIFY", 72.5, 46.5, {
        align: "center",
      });

      /* =====================================================
         ACTIVE BADGE
         ===================================================== */

      if (data.membership.active) {
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(69, 19, 11, 5, 2, 2, "F");

        doc.setTextColor(22, 101, 52);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(3.7);

        doc.text("ACTIVE", 74.5, 22.2, {
          align: "center",
        });
      }

      /* =====================================================
         FOOTER
         ===================================================== */

      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.2);

      doc.text("Mumbai Boxing Association", 43, 50, {
        align: "center",
      });

      doc.save(`${membershipId}-membership-card.pdf`);
    } catch (err) {
      console.error("Membership card generation error:", err);

      setError("Unable to generate membership card.");
    } finally {
      setDownloadingCard(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <DashboardLayout role="referee_judge">
        <PageSpinner message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  /* Redesigned dashboard — PDF generator and API logic above are unchanged. */
  return (
    <DashboardLayout role="referee_judge">
      <main className="mx-auto max-w-[1600px] space-y-6 pb-12 text-[#07172c]">
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_16px_45px_rgba(7,23,44,.15)] sm:px-9 lg:px-11 lg:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"38px 38px"}} />
          <div className="pointer-events-none absolute -top-20 right-[20%] hidden h-[180%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
          <div className="pointer-events-none absolute -top-20 right-[16%] hidden h-[180%] w-4 rotate-[24deg] bg-red-500/30 lg:block" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-red-300"><span className="h-2 w-2 rounded-full bg-red-500"/> Mumbai Boxing Association</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-[42px]">{greeting}, {data?.profile?.name?.split(" ")[0] || "Official"}<span className="text-red-500">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Your Referee / Judge membership, credentials, documents and payment overview.</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold"><ShieldCheck size={15} className="text-red-400"/> Official Referee / Judge Portal</div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600"><BadgeCheck size={24}/></div><div><p className="text-xs text-slate-300">Membership Status</p><p className="mt-1 text-xl font-extrabold">{membershipStatus.label}</p></div></div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent"/>
        </section>

        {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={19} className="shrink-0"/>{error}</div>}
        {!data?.profile && !error && <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">No referee or judge profile was returned.</div>}
        {data?.profile && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<FolderOpen size={21}/>} label="Documents" value={String(data.documents?.length ?? 0)} detail="Submitted documents" tone="blue"/>
            <Metric icon={<ShieldCheck size={21}/>} label="Officiating Level" value={data.profile.officiatingLevel || "—"} detail="Current appointment level" tone="green"/>
            <Metric icon={<CreditCard size={21}/>} label="Membership Fee" value={data.membership.active ? "Paid" : "Pending"} detail={data.membership.active ? "Membership active" : "Awaiting confirmation"} tone="amber"/>
            <Metric icon={<Award size={21}/>} label="Qualification" value={data.profile.qualification || "—"} detail="Professional credential" tone="red"/>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
            <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <SectionHeading icon={<UserRound size={20}/>} title="Official Profile" subtitle="Your registered personal information"/>
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">{passportPhoto ? <img src={passportPhoto} alt={data.profile.name} className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md"/> : <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#07172c] text-4xl font-black text-white">{data.profile.name.charAt(0).toUpperCase()}</div>}{data.membership.active && <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500"/>}</div>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="break-words text-2xl font-black sm:text-3xl">{data.profile.name}</h2><span className={`rounded-full px-3 py-1 text-[11px] font-bold ${membershipStatus.className}`}>{membershipStatus.label}</span></div><p className="mt-2 text-sm text-slate-500">{data.profile.designation || "Referee / Judge"}</p><p className="mt-2 break-all text-xs font-semibold text-red-600">{data.membership.id || "Membership ID pending"}</p></div>
              </div>
              <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Date of Birth" value={formatDate(data.profile.dob)}/><Field label="Gender" value={data.profile.gender || "—"}/><Field label="Phone" value={data.profile.phone || "—"}/><Field label="Email" value={data.user.email}/><Field label="ID Number" value={maskedIdNumber}/><Field label="Member Since" value={formatDate(data.profile.createdAt)}/>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5"><Field label="Address" value={data.profile.address || "—"}/></div>
            </section>
            <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
              <div className="relative overflow-hidden bg-[#07172c] p-6 text-white"><div className="pointer-events-none absolute -right-8 -top-16 h-60 w-12 rotate-[25deg] bg-[#ed1c24]"/><div className="relative flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-sm font-black">MBA</div><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-red-300">Digital Membership</p><h2 className="mt-1 text-lg font-extrabold">Referee / Judge ID</h2></div></div><p className="relative mt-7 break-all text-2xl font-black tracking-wide">{data.membership.id || "ID Pending"}</p><p className="relative mt-1 text-xs text-slate-300">{data.profile.name}</p></div>
              <div className="p-6"><div className="grid grid-cols-2 gap-5"><Field label="Valid From" value={formatShortDate(data.membership.validFrom)}/><Field label="Valid Until" value={formatShortDate(data.membership.expiry)}/></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">Current Membership</p><div className="mt-2 flex items-center gap-2 text-sm font-bold"><span className={`h-2.5 w-2.5 rounded-full ${data.membership.active ? "bg-emerald-500" : "bg-amber-500"}`}/>{membershipStatus.label}</div></div><button type="button" onClick={downloadMembershipCard} disabled={downloadingCard || !data.membership.id} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"><Download size={18}/>{downloadingCard ? "Generating PDF..." : "Download Membership Card"}</button><p className="mt-3 text-center text-[11px] text-slate-400">Includes QR code for official verification</p></div>
            </section>
          </div>

          <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><SectionHeading icon={<ShieldCheck size={20}/>} title="Officiating Credentials" subtitle="Your qualifications and professional record"/><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Detail icon={<BadgeCheck size={19}/>} label="Designation" value={data.profile.designation || "—"}/><Detail icon={<ShieldCheck size={19}/>} label="Officiating Level" value={data.profile.officiatingLevel || "—"}/><Detail icon={<Award size={19}/>} label="Qualification" value={data.profile.qualification || "—"}/><Detail icon={<Clock3 size={19}/>} label="Officiating Experience" value={data.profile.officiatingExperience ? `${data.profile.officiatingExperience} years` : "—"}/><Detail icon={<BadgeCheck size={19}/>} label="Federation Affiliation" value={data.profile.federationAffiliation || "—"}/><Detail icon={<Trophy size={19}/>} label="Tournaments Officiated" value={data.profile.tournamentsOfficiated || "—"}/></div><div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Achievements</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{data.profile.achievements || "No achievements added yet."}</p></div></section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><SectionHeading icon={<FolderOpen size={20}/>} title="My Documents" subtitle="Registration documents and review status"/><a href="/dashboard/referee-judge/documents" className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:underline">View All <ArrowRight size={16}/></a></div>{data.documents.length === 0 ? <Empty icon={<FileText size={29}/>} title="No documents uploaded" subtitle="Your uploaded documents will appear here."/> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{data.documents.map(doc => {const url=`/api/file?path=${encodeURIComponent(doc.filePath)}`;const status=(doc.status || "Pending").toLowerCase();return <a key={doc.id} href={url} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex h-36 items-center justify-center overflow-hidden bg-slate-50">{doc.fileType === "image" ? <img src={url} alt={doc.label} className="h-full w-full object-contain"/> : <FileText size={42} className="text-slate-300"/>}</div><div className="p-4"><p className="min-h-10 break-words text-sm font-bold capitalize">{doc.label.replace(/-/g," ")}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${status === "approved" ? "bg-emerald-50 text-emerald-700" : status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{doc.status || "Pending"}</span>{status === "rejected" && doc.rejectionReason && <p className="mt-2 text-xs text-red-600">{doc.rejectionReason}</p>}<p className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-red-600">View Document <ExternalLink size={13}/></p></div></a>})}</div>}</section>

          <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading icon={<CreditCard size={20}/>} title="Membership Payments" subtitle="Payment history and invoice details"/><span className={`rounded-full px-3 py-1 text-xs font-bold ${data.membership.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{data.membership.active ? "Membership Active" : "Pending"}</span></div>{data.payments.length === 0 ? <Empty icon={<CreditCard size={29}/>} title="No payment records" subtitle="Membership payments will appear here."/> : <div className="mt-6 space-y-3">{data.payments.map(payment=><div key={payment.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{payment.type || "Membership Payment"}</p><p className="mt-1 text-2xl font-black">₹{payment.amount.toLocaleString("en-IN")}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${["paid","success","completed","captured"].includes(payment.status.toLowerCase()) ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{payment.status}</span></div><div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Payment Method" value={payment.method || "—"}/><Field label="Invoice Number" value={payment.invoiceNumber || "—"}/><Field label="Payment Date" value={formatDate(payment.createdAt)}/><Field label="Valid Until" value={formatDate(payment.membershipExpiry)}/></div>{payment.razorpayPaymentId && <p className="mt-4 break-all text-xs text-slate-500">Payment ID: {payment.razorpayPaymentId}</p>}</div>)}</div>}</section>

          {data.notifications?.length > 0 && <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><SectionHeading icon={<Bell size={20}/>} title="Recent Notifications" subtitle="Latest updates on your account"/><div className="mt-5 divide-y divide-slate-100">{data.notifications.slice(0,5).map(n=><div key={n.id} className="flex items-start gap-3 py-4"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-slate-300" : "bg-red-500"}`}/><div><p className="text-sm font-bold">{n.title}</p><p className="mt-1 text-xs text-slate-500">{n.message}</p><p className="mt-2 text-[11px] text-slate-400">{formatShortDate(n.createdAt)}</p></div></div>)}</div></section>}

          <div className="grid gap-4 md:grid-cols-3"><Quick href="/dashboard/referee-judge/documents" icon={<FolderOpen size={21}/>} title="My Documents" subtitle="View submitted files"/><Quick href="/dashboard/referee-judge/certificates" icon={<Award size={21}/>} title="Certificates" subtitle="View your qualifications"/><Quick href="/dashboard/referee-judge/tournaments" icon={<Trophy size={21}/>} title="Tournaments" subtitle="Explore upcoming events"/></div>
        </>}
      </main>
    </DashboardLayout>
  );
}

function SectionHeading({icon,title,subtitle}:{icon:React.ReactNode;title:string;subtitle:string}){return <div className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div><div><h2 className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div></div>}
function Metric({icon,label,value,detail,tone}:{icon:React.ReactNode;label:string;value:string;detail:string;tone:"red"|"green"|"blue"|"amber"}){const tones={red:"bg-red-50 text-red-600",green:"bg-emerald-50 text-emerald-600",blue:"bg-blue-50 text-blue-600",amber:"bg-amber-50 text-amber-600"};return <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold text-slate-500">{label}</p><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span></div><p className="mt-3 break-words text-2xl font-black">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div>}
function Field({label,value}:{label:string;value:string}){return <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1.5 break-words text-sm font-semibold text-slate-800">{value}</p></div>}
function Detail({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">{icon}</span><Field label={label} value={value}/></div>}
function Empty({icon,title,subtitle}:{icon:React.ReactNode;title:string;subtitle:string}){return <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-400">{icon}</div><p className="mt-4 text-sm font-bold">{title}</p><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>}
function Quick({href,icon,title,subtitle}:{href:string;icon:React.ReactNode;title:string;subtitle:string}){return <a href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div><div className="min-w-0 flex-1"><p className="text-sm font-extrabold">{title}</p><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div><ArrowRight size={17} className="text-slate-400 group-hover:text-red-600"/></a>}
