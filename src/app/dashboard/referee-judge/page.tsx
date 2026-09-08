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
} from "lucide-react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

import DashboardLayout from "@/Components/layout/DashboardLayout";

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
              Loading your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <DashboardLayout role="referee_judge">
      <div className="max-w-[1500px] mx-auto space-y-7 text-slate-900">
        {/* ==================================================
            GREETING
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
            <h1
              className="
                text-3xl
                sm:text-[38px]
                font-extrabold
                tracking-tight
                text-[#0b1729]
              "
            >
              {greeting},{" "}
              {data?.profile?.name?.split(" ")[0] || "Member"}
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              Here&apos;s your Referee / Judge membership overview
            </p>
          </div>

          {data?.profile && (
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
              <ShieldCheck size={17} />
              Referee / Judge
            </span>
          )}
        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {data?.profile && (
          <>
            {/* =================================================
                PROFILE + MEMBERSHIP
                ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-[1.35fr_0.9fr]
                gap-5
              "
            >
              {/* =================================================
                  PROFILE
                  ================================================= */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-slate-100
                  shadow-sm
                  p-6
                  sm:p-7
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-6
                  "
                >
                  {/* Avatar */}

                  <div className="relative shrink-0">
                    {passportPhoto ? (
                      <img
                        src={passportPhoto}
                        alt={data.profile.name}
                        className="
                          w-36
                          h-36
                          rounded-full
                          object-cover
                          border-4
                          border-white
                          shadow-md
                          ring-1
                          ring-slate-200
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-36
                          h-36
                          rounded-full
                          bg-red-50
                          flex
                          items-center
                          justify-center
                          text-red-600
                        "
                      >
                        <UserRound size={58} strokeWidth={1.5} />
                      </div>
                    )}

                    {data.membership.active && (
                      <span
                        className="
                          absolute
                          right-1
                          bottom-2
                          w-6
                          h-6
                          rounded-full
                          bg-emerald-500
                          border-4
                          border-white
                        "
                      />
                    )}
                  </div>

                  {/* Details */}

                  <div className="flex-1 min-w-0">
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >
                      <h2
                        className="
                          text-3xl
                          font-bold
                          text-[#0b1729]
                          break-words
                        "
                      >
                        {data.profile.name}
                      </h2>

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${membershipStatus.className}
                        `}
                      >
                        <CheckCircle2 size={15} strokeWidth={2} />

                        {membershipStatus.label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {data.profile.designation ||
                        "Referee / Judge"}
                    </p>

                    <div className="h-px bg-slate-100 my-5" />

                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-y-6
                        gap-x-5
                      "
                    >
                      <Info
                        label="Membership ID"
                        value={data.membership.id || "—"}
                      />

                      <Info
                        label="Date of Birth"
                        value={formatDate(data.profile.dob)}
                      />

                      <Info
                        label="Gender"
                        value={data.profile.gender || "—"}
                      />

                      <Info
                        label="Phone"
                        value={data.profile.phone || "—"}
                      />

                      <Info
                        label="Email"
                        value={data.user.email}
                      />

                      <Info
                        label="ID Number"
                        value={maskedIdNumber}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}

                <div className="mt-7 pt-6 border-t border-slate-100">
                  <Info
                    label="Address"
                    value={data.profile.address || "—"}
                  />
                </div>
              </div>

              {/* =================================================
                  MEMBERSHIP
                  ================================================= */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-slate-100
                  shadow-sm
                  overflow-hidden
                "
              >
                <div
                  className="
                    bg-gradient-to-br
                    from-[#ed1c24]
                    to-[#c90f17]
                    px-6
                    py-6
                    text-white
                    relative
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      absolute
                      -right-6
                      -top-8
                      w-36
                      h-36
                      rounded-full
                      bg-white/5
                    "
                  />

                  <div
                    className="
                      absolute
                      right-7
                      bottom-5
                      opacity-10
                    "
                  >
                    <ShieldCheck size={72} strokeWidth={1.2} />
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      relative
                    "
                  >
                    <div
                      className="
                        w-14
                        h-14
                        rounded-full
                        border-2
                        border-white/80
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-red-600
                        font-extrabold
                        text-sm
                      "
                    >
                      MBA
                    </div>

                    <div>
                      <p
                        className="
                          text-sm
                          font-medium
                          text-red-100
                        "
                      >
                        MBA MEMBERSHIP
                      </p>

                      <p
                        className="
                          text-[23px]
                          sm:text-[25px]
                          font-extrabold
                          tracking-tight
                          mt-1
                          break-all
                        "
                      >
                        {data.membership.id || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className="
                      grid
                      grid-cols-2
                      divide-x
                      divide-slate-200
                    "
                  >
                    <div className="pr-4">
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          strokeWidth={1.8}
                          className="text-slate-400"
                        />

                        Valid From
                      </p>

                      <p className="font-semibold text-slate-900 mt-2">
                        {formatDate(data.membership.validFrom)}
                      </p>
                    </div>

                    <div className="pl-5">
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          strokeWidth={1.8}
                          className="text-slate-400"
                        />

                        Valid Until
                      </p>

                      <p className="font-semibold text-emerald-600 mt-2">
                        {formatDate(data.membership.expiry)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadMembershipCard}
                    disabled={
                      downloadingCard || !data.membership.id
                    }
                    className="
                      mt-7
                      w-full
                      h-14
                      rounded-xl
                      bg-[#ed1c24]
                      hover:bg-[#d71920]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      text-white
                      font-bold
                      text-base
                      flex
                      items-center
                      justify-center
                      gap-3
                      transition-colors
                    "
                  >
                    <Download size={20} strokeWidth={2} />

                    {downloadingCard
                      ? "Generating..."
                      : "Download Membership Card"}
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================
                STATISTICS
                ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
              "
            >
              <StatCard
                icon={FolderOpen}
                iconClass="bg-blue-50 text-blue-600"
                title={`${data.documents?.length ?? 0}`}
                label="Documents"
                sub="Uploaded"
                subClass="text-blue-600"
              />

              <StatCard
                icon={ShieldCheck}
                iconClass="bg-emerald-50 text-emerald-600"
                title={
                  data.profile.officiatingLevel || "—"
                }
                label="Officiating Level"
                sub="Current level"
                subClass="text-emerald-600"
              />

              <StatCard
                icon={IndianRupee}
                iconClass="bg-amber-50 text-amber-600"
                title={
                  data.membership.active ? "Paid" : "Pending"
                }
                label="Membership Fee"
                sub={
                  data.membership.active
                    ? "Payment confirmed"
                    : "Payment pending"
                }
                subClass="text-amber-600"
              />

              <StatCard
                icon={BadgeCheck}
                iconClass="bg-violet-50 text-violet-600"
                title={
                  data.profile.qualification || "—"
                }
                label="Qualification"
                sub="Certification"
                subClass="text-violet-600"
              />
            </div>

            {/* =================================================
                OFFICIATING INFORMATION
                ================================================= */}

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
                  <ShieldCheck
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-[#0b1729]
                    "
                  >
                    Officiating Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-0.5">
                    Your official Referee / Judge information
                  </p>
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-5
                "
              >
                <DetailCard
                  icon={<BadgeCheck size={18} />}
                  label="Designation"
                  value={
                    data.profile.designation || "—"
                  }
                />

                <DetailCard
                  icon={<ShieldCheck size={18} />}
                  label="Officiating Level"
                  value={
                    data.profile.officiatingLevel || "—"
                  }
                />

                <DetailCard
                  icon={<Award size={18} />}
                  label="Qualification"
                  value={
                    data.profile.qualification || "—"
                  }
                />

                <DetailCard
                  icon={<Clock3 size={18} />}
                  label="Officiating Experience"
                  value={
                    data.profile.officiatingExperience
                      ? `${data.profile.officiatingExperience} years`
                      : "—"
                  }
                />

                <DetailCard
                  icon={<ShieldCheck size={18} />}
                  label="Federation Affiliation"
                  value={
                    data.profile.federationAffiliation ||
                    "—"
                  }
                />

                <DetailCard
                  icon={<Trophy size={18} />}
                  label="Tournaments Officiated"
                  value={
                    data.profile.tournamentsOfficiated ||
                    "—"
                  }
                />
              </div>

              {/* Achievements */}

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Achievements
                </p>

                <div
                  className="
                    mt-2
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    px-4
                    py-4
                    text-sm
                    leading-6
                    text-slate-700
                    whitespace-pre-wrap
                  "
                >
                  {data.profile.achievements ||
                    "No achievements added."}
                </div>
              </div>
            </section>

            {/* =================================================
                DOCUMENTS
                ================================================= */}

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
                  justify-between
                  gap-4
                  mb-5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <FolderOpen
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-[#0b1729]
                      "
                    >
                      My Documents
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Documents submitted during registration
                    </p>
                  </div>
                </div>

                <a
                  href="/dashboard/referee-judge/documents"
                  className="
                    text-sm
                    sm:text-base
                    font-semibold
                    text-blue-600
                    hover:text-blue-700
                    whitespace-nowrap
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  View All Documents

                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                  />
                </a>
              </div>

              {data.documents.length === 0 ? (
                <EmptyState
                  icon={<FileText size={32} strokeWidth={1.5} />}
                  title="No documents uploaded"
                  description="Your uploaded documents will appear here."
                />
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-4
                  "
                >
                  {data.documents.map((doc) => {
                    const fileUrl = `/api/file?path=${encodeURIComponent(
                      doc.filePath
                    )}`;

                    const status = (
                      doc.status || "Pending"
                    ).toLowerCase();

                    const isApproved =
                      status === "approved";

                    const isRejected =
                      status === "rejected";

                    return (
                      <a
                        key={doc.id}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          group
                          rounded-xl
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
                            h-40
                            bg-slate-50
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                          "
                        >
                          {doc.fileType === "image" ? (
                            <img
                              src={fileUrl}
                              alt={doc.label}
                              className="
                                w-full
                                h-full
                                object-contain
                                group-hover:scale-[1.02]
                                transition-transform
                              "
                            />
                          ) : (
                            <div
                              className="
                                text-center
                                flex
                                flex-col
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
                                  shadow-sm
                                  text-red-500
                                  flex
                                  items-center
                                  justify-center
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

                        <div className="p-4">
                          <p
                            className="
                              font-semibold
                              text-sm
                              text-slate-900
                              min-h-[40px]
                              break-words
                              capitalize
                            "
                          >
                            {doc.label.replace(
                              /-/g,
                              " "
                            )}
                          </p>

                          <div className="mt-3">
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
                                className={`text-xs font-semibold ${
                                  isApproved
                                    ? "text-emerald-600"
                                    : isRejected
                                      ? "text-red-600"
                                      : "text-amber-600"
                                }`}
                              >
                                {isApproved
                                  ? "Approved"
                                  : isRejected
                                    ? "Rejected"
                                    : "Pending"}
                              </span>
                            </div>

                            {isRejected &&
                              doc.rejectionReason && (
                                <p className="mt-2 text-xs leading-5 text-red-500">
                                  {doc.rejectionReason}
                                </p>
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

                            <ArrowRight
                              size={16}
                              strokeWidth={2}
                            />
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =================================================
                MEMBERSHIP PAYMENT
                ================================================= */}

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
                  justify-between
                  gap-4
                  mb-5
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-amber-50
                      text-amber-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <CreditCard
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-[#0b1729]
                      "
                    >
                      Membership Payment
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Membership fee and payment receipts
                    </p>
                  </div>
                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-emerald-50
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-emerald-700
                  "
                >
                  <CheckCircle2 size={14} />

                  {data.membership.active
                    ? "PAID"
                    : "PENDING"}
                </span>
              </div>

              {data.payments.length === 0 ? (
                <EmptyState
                  icon={
                    <CreditCard
                      size={32}
                      strokeWidth={1.5}
                    />
                  }
                  title="No payment records"
                  description="Your membership payment information will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {data.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50/50
                        p-5
                      "
                    >
                      <div
                        className="
                          grid
                          grid-cols-1
                          sm:grid-cols-2
                          lg:grid-cols-4
                          gap-5
                        "
                      >
                        <Info
                          label="Amount"
                          value={`₹${payment.amount.toLocaleString(
                            "en-IN"
                          )}`}
                        />

                        <Info
                          label="Payment Method"
                          value={payment.method || "—"}
                        />

                        <Info
                          label="Invoice Number"
                          value={
                            payment.invoiceNumber || "—"
                          }
                        />

                        <Info
                          label="Payment Date"
                          value={formatDate(
                            payment.createdAt
                          )}
                        />
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200">
                        <div
                          className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-5
                          "
                        >
                          <Info
                            label="Payment ID"
                            value={
                              payment.razorpayPaymentId ||
                              "—"
                            }
                          />

                          <Info
                            label="Membership Valid Until"
                            value={formatDate(
                              payment.membershipExpiry
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                QUICK LINKS
                ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-4
              "
            >
              <QuickLink
                href="/dashboard/referee-judge/documents"
                icon={<FolderOpen size={21} />}
                title="My Documents"
                description="View your submitted documents"
                iconClass="bg-blue-50 text-blue-600"
              />

              <QuickLink
                href="/dashboard/referee-judge/certificates"
                icon={<Award size={21} />}
                title="Certificates"
                description="View your certificates"
                iconClass="bg-violet-50 text-violet-600"
              />

              <QuickLink
                href="/dashboard/referee-judge/tournaments"
                icon={<Trophy size={21} />}
                title="Tournaments"
                description="View tournament information"
                iconClass="bg-emerald-50 text-emerald-600"
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   INFO
   ========================================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="font-semibold text-slate-800 mt-1.5 break-words">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL CARD
   ========================================================= */

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/50
        p-4
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
          border
          border-slate-100
          text-red-600
          flex
          items-center
          justify-center
          shadow-sm
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon: Icon,
  iconClass,
  title,
  label,
  sub,
  subClass,
}: {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  label: string;
  sub: string;
  subClass: string;
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
          <p className="text-2xl font-extrabold text-[#0b1729] break-words">
            {title}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            {label}
          </p>

          <p className={`mt-1 text-xs font-semibold ${subClass}`}>
            {sub}
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
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-dashed
        border-slate-200
        p-10
        sm:p-12
        text-center
      "
    >
      <div
        className="
          w-16
          h-16
          mx-auto
          rounded-2xl
          bg-slate-50
          text-slate-300
          flex
          items-center
          justify-center
        "
      >
        {icon}
      </div>

      <p className="mt-4 font-semibold text-slate-700">
        {title}
      </p>

      <p className="text-sm text-slate-400 mt-1">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK LINK
   ========================================================= */

function QuickLink({
  href,
  icon,
  title,
  description,
  iconClass,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  iconClass: string;
}) {
  return (
    <a
      href={href}
      className="
        bg-white
        rounded-2xl
        border
        border-slate-100
        shadow-sm
        p-5
        flex
        items-center
        gap-4
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all
      "
    >
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

      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-900">
          {title}
        </p>

        <p className="text-sm text-slate-500 mt-0.5">
          {description}
        </p>
      </div>

      <ArrowRight
        size={18}
        className="text-slate-400 shrink-0"
      />
    </a>
  );
}