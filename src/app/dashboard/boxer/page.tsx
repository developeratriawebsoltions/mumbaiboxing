"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Award,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  FolderOpen,
  HeartPulse,
  IndianRupee,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";

import jsPDF from "jspdf";
import QRCode from "qrcode";

import DashboardLayout from "@/Components/layout/DashboardLayout";

/* =========================================================
   TYPES
   ========================================================= */

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type Boxer = {
  id: number;
  name: string;
  dob: string | null;
  weight: string | null;
  ageGroup: string | null;
  rank: number | null;

  academy: {
    name: string;
  } | null;

  medical: {
    id: number;
    fitnessStatus: string;
    expiryDate: string | null;
    injury: string | null;
    eligible: boolean;
    updatedAt: string;
    createdAt: string;
  } | null;

  certificates: {
    id: number;
    type: string;
    event: string;
    issuedAt: string;
    qrStatus: string;
  }[];

  tournamentEntries: {
    id: number;
    createdAt: string;
    tournament: {
      id: number;
      name: string;
      location: string | null;
      startDate: string;
      endDate: string;
      weightClass: string | null;
      status: string;
    } | null;
  }[];

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
};

/* =========================================================
   DASHBOARD
   ========================================================= */

export default function BoxerDashboard() {
  const [boxer, setBoxer] =
    useState<Boxer | null>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [downloadingCard, setDownloadingCard] =
    useState(false);

  /* =======================================================
     LOAD PROFILE
     ======================================================= */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch("/api/boxer", {
            cache: "no-store",
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load profile."
          );
        }

        setBoxer(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =========================================================
     DATE HELPERS
     ========================================================= */

  const formatDate = (
    value: string | null
  ) => {
    if (!value) return "—";

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
  };

  const formatCardDate = (
  date: Date
) => {
  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const greeting = useMemo(() => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}, []);

  /* =========================================================
     BOXER ID
     ========================================================= */

  const boxerId = useMemo(() => {
    if (!boxer) return "—";

    return `MBA-BXR-${new Date(
      boxer.user.createdAt
    ).getFullYear()}-${String(
      boxer.id
    ).padStart(4, "0")}`;
  }, [boxer]);

  /* =========================================================
     PASSPORT PHOTO
     ========================================================= */

  const passportPhoto = useMemo(() => {
    if (!boxer) return null;

    const documents =
      boxer.user.documents ?? [];

    const photo =
      documents.find((doc) => {
        const label =
          doc.label.toLowerCase();

        return (
          label.includes("passport") &&
          label.includes("photo")
        );
      });

    return photo
      ? `/api/file?path=${encodeURIComponent(
          photo.filePath
        )}`
      : null;
  }, [boxer]);

  /* =========================================================
     DOWNLOAD ID CARD
     ========================================================= */

  const downloadIdCard = async () => {
    if (!boxer) return;

    if (!boxer.user.membershipId) {
      setError(
        "Membership ID is not available yet."
      );

      return;
    }

    try {
      setDownloadingCard(true);
      setError("");

      const validFrom =
        boxer.user.membershipValidFrom
          ? new Date(
              boxer.user.membershipValidFrom
            )
          : null;

      const expiry =
        boxer.user.membershipExpiry
          ? new Date(
              boxer.user.membershipExpiry
            )
          : null;

      if (
        !validFrom ||
        Number.isNaN(
          validFrom.getTime()
        ) ||
        !expiry ||
        Number.isNaN(
          expiry.getTime()
        )
      ) {
        setError(
          "Membership validity dates are not available."
        );

        return;
      }

      const membershipId =
        boxer.user.membershipId;

      const verificationUrl = `${window.location.origin}/verify/boxer/${encodeURIComponent(
        membershipId
      )}`;

      const qrDataUrl = await QRCode.toDataURL(
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

      /* =====================================================
         CARD
         ===================================================== */

      doc.setFillColor(
        255,
        255,
        255
      );

      doc.roundedRect(
        2,
        2,
        82,
        50,
        3,
        3,
        "F"
      );

      doc.setDrawColor(
        220,
        38,
        38
      );

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

      /* =====================================================
         HEADER
         ===================================================== */

      doc.setFillColor(
        220,
        38,
        38
      );

      doc.roundedRect(
        2,
        2,
        82,
        13,
        3,
        3,
        "F"
      );

      doc.rect(
        2,
        9,
        82,
        6,
        "F"
      );

      /* MBA badge */

      doc.setFillColor(
        255,
        255,
        255
      );

      doc.circle(
        9,
        8,
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

      doc.setFontSize(4.5);

      doc.text(
        "MBA",
        9,
        9.5,
        {
          align: "center",
        }
      );

      /* Header text */

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(5);

      doc.text(
        "MUMBAI BOXING ASSOCIATION",
        16,
        7.5
      );

      doc.setFontSize(3.8);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "OFFICIAL MEMBERSHIP CARD",
        16,
        11
      );

      /* =====================================================
         MEMBER INITIAL
         ===================================================== */

      doc.setFillColor(
        254,
        226,
        226
      );

      doc.circle(
        11,
        24,
        6.5,
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

      doc.setFontSize(10);

      doc.text(
        boxer.name
          .charAt(0)
          .toUpperCase(),
        11,
        27.2,
        {
          align: "center",
        }
      );

      /* =====================================================
         NAME
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "MEMBER NAME",
        21,
        19
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(6.5);

      const nameLines =
        doc.splitTextToSize(
          boxer.name,
          27
        );

      doc.text(
        nameLines.slice(0, 2),
        21,
        22.5
      );

      /* =====================================================
         MEMBERSHIP ID
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "MEMBERSHIP ID",
        21,
        29
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5.5);

      doc.text(
        membershipId,
        21,
        32.5
      );

      /* =====================================================
         BOXER ID
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "BOXER ID",
        21,
        37
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        boxerId,
        21,
        40.5
      );

      /* =====================================================
         CATEGORY
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "CATEGORY",
        50,
        19
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5.5);

      doc.text(
        "BOXER",
        50,
        22.5
      );

      /* =====================================================
         WEIGHT
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "WEIGHT CATEGORY",
        50,
        28
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        boxer.weight || "—",
        50,
        31.5
      );

      /* =====================================================
         VALID FROM
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "VALID FROM",
        50,
        37
      );

      doc.setTextColor(
        15,
        23,
        42
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        formatCardDate(validFrom),
        50,
        40.5
      );

      /* =====================================================
         VALID UNTIL
         ===================================================== */

      doc.setTextColor(
        100,
        116,
        139
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(4);

      doc.text(
        "VALID UNTIL",
        50,
        44
      );

      doc.setTextColor(
        22,
        163,
        74
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(5);

      doc.text(
        formatCardDate(expiry),
        50,
        47.5
      );

      /* =====================================================
         QR VERIFICATION CODE
         ===================================================== */

      doc.setFillColor(248, 250, 252);

      doc.roundedRect(
        64,
        27,
        17,
        17,
        2,
        2,
        "F"
      );

      doc.addImage(
        qrDataUrl,
        "PNG",
        65,
        28,
        15,
        15
      );

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.2);
      doc.text(
        "SCAN TO VERIFY",
        72.5,
        46.5,
        { align: "center" }
      );

      /* =====================================================
         ACTIVE BADGE
         ===================================================== */

      doc.setFillColor(
        220,
        252,
        231
      );

      doc.roundedRect(
        69,
        19,
        11,
        5,
        2,
        2,
        "F"
      );

      doc.setTextColor(
        22,
        101,
        52
      );

      doc.setFontSize(3.7);

      doc.text(
        "ACTIVE",
        74.5,
        22.2,
        {
          align: "center",
        }
      );

      /* =====================================================
         FOOTER
         ===================================================== */

      doc.setTextColor(
        148,
        163,
        184
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(3.2);

      doc.text(
        "Mumbai Boxing Association",
        43,
        50,
        {
          align: "center",
        }
      );

      doc.save(
        `${membershipId}-membership-card.pdf`
      );
    } catch (err) {
      console.error(
        "ID card generation error:",
        err
      );

      setError(
        "Unable to generate ID card."
      );
    } finally {
      setDownloadingCard(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

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
    <DashboardLayout role="boxer">

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
  {boxer?.name?.split(" ")[0] || "Member"}
</h1>

            <p className="mt-1 text-[16px] text-slate-500">
              Here&apos;s your membership overview
            </p>

          </div>
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

        {boxer && (
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
                        alt={boxer.name}
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
                        <UserRound
                          size={58}
                          strokeWidth={1.5}
                        />
                      </div>
                    )}

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
                        {boxer.name}
                      </h2>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-1
                          rounded-full
                          bg-emerald-100
                          text-emerald-700
                          text-sm
                          font-semibold
                        "
                      >
                        <CheckCircle2
                          size={15}
                          strokeWidth={2}
                        />

                        ACTIVE
                      </span>

                    </div>

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
                        label="Boxer ID"
                        value={boxerId}
                      />

                      <Info
                        label="Date of Birth"
                        value={formatDate(
                          boxer.dob
                        )}
                      />

                      <Info
                        label="Weight Category"
                        value={
                          boxer.weight ||
                          "—"
                        }
                      />

                      <Info
                        label="Age Group"
                        value={
                          boxer.ageGroup ||
                          "—"
                        }
                      />

                      <Info
                        label="Academy"
                        value={
                          boxer.academy?.name ||
                          "—"
                        }
                      />

                      <Info
                        label="Email"
                        value={
                          boxer.user.email
                        }
                      />

                    </div>

                  </div>

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
                    <ShieldCheck
                      size={72}
                      strokeWidth={1.2}
                    />
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
                        {boxer.user.membershipId ||
                          "—"}
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
                        {formatDate(
                          boxer.user
                            .membershipValidFrom
                        )}
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
                        {formatDate(
                          boxer.user
                            .membershipExpiry
                        )}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      downloadIdCard
                    }
                    disabled={
                      downloadingCard ||
                      !boxer.user.membershipId
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

                    <Download
                      size={20}
                      strokeWidth={2}
                    />

                    {downloadingCard
                      ? "Generating..."
                      : "Download ID Card"}

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
                title={`${boxer.user.documents?.length ?? 0}`}
                label="Documents"
                sub="Uploaded"
                subClass="text-blue-600"
              />

              <StatCard
                icon={Trophy}
                iconClass="bg-emerald-50 text-emerald-600"
                title={`${boxer.tournamentEntries?.length ?? 0}`}
                label="Tournament Entries"
                sub="View activity"
                subClass="text-emerald-600"
              />

              <StatCard
                icon={IndianRupee}
                iconClass="bg-amber-50 text-amber-600"
                title={
                  boxer.user.membershipId
                    ? "Paid"
                    : "Pending"
                }
                label="Membership Fee"
                sub={
                  boxer.user.membershipId
                    ? "Payment confirmed"
                    : "Payment pending"
                }
                subClass="text-amber-600"
              />

              <StatCard
                icon={Award}
                iconClass="bg-violet-50 text-violet-600"
                title={`${boxer.certificates?.length ?? 0}`}
                label="Certificates"
                sub="View certificates"
                subClass="text-violet-600"
              />

            </div>

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

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-[#0b1729]
                    "
                  >
                    My Documents
                  </h2>

                </div>

                <a
                  href="/dashboard/documents"
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

              {(boxer.user.documents ?? [])
                .length === 0 ? (

                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    p-12
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
                    <FileText
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    No documents uploaded
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your uploaded documents will appear here.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-5
                    gap-4
                  "
                >

                  {(boxer.user.documents ?? [])
                    .map((doc) => {

                      const fileUrl =
                        `/api/file?path=${encodeURIComponent(
                          doc.filePath
                        )}`;

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

                            {doc.fileType ===
                            "image" ? (

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

                            {(() => {
  const status = (doc.status || "Pending").toLowerCase();

  const isApproved =
    status === "approved";

  const isRejected =
    status === "rejected";

  return (
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
  );
})()}

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
                TOURNAMENT HISTORY
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
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-4
                  mb-6
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-emerald-50
                      text-emerald-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Trophy
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
                      Tournament History
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Your tournament participation and registrations
                    </p>
                  </div>
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                >
                  <Trophy
                    size={16}
                    className="text-emerald-600"
                    strokeWidth={1.8}
                  />
                  {boxer.tournamentEntries?.length ?? 0}{" "}
                  {(
                    boxer.tournamentEntries?.length ?? 0
                  ) === 1
                    ? "Entry"
                    : "Entries"}
                </div>
              </div>

              {(boxer.tournamentEntries ?? []).length === 0 ? (
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
                      bg-emerald-50
                      text-emerald-500
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Trophy
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    No tournament entries yet
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your tournament registrations will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop / tablet table */}
                  <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[760px] overflow-hidden rounded-xl border border-slate-100">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                              Tournament
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                              Date
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                              Location
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                              Weight Class
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {(boxer.tournamentEntries ?? []).map(
                            (entry) => {
                              const tournament =
                                entry.tournament;

                              if (!tournament) {
                                return (
                                  <tr key={entry.id}>
                                    <td
                                      colSpan={5}
                                      className="px-5 py-5 text-sm text-slate-500"
                                    >
                                      Tournament details are unavailable
                                      for this entry.
                                    </td>
                                  </tr>
                                );
                              }

                              const status =
                                (
                                  tournament.status ||
                                  "upcoming"
                                ).toLowerCase();

                              const statusConfig =
                                status === "completed"
                                  ? {
                                      label: "Completed",
                                      className:
                                        "bg-emerald-50 text-emerald-700 border-emerald-100",
                                    }
                                  : status === "ongoing"
                                  ? {
                                      label: "Ongoing",
                                      className:
                                        "bg-red-50 text-red-700 border-red-100",
                                    }
                                  : status === "open"
                                  ? {
                                      label: "Open",
                                      className:
                                        "bg-blue-50 text-blue-700 border-blue-100",
                                    }
                                  : status === "cancelled"
                                  ? {
                                      label: "Cancelled",
                                      className:
                                        "bg-slate-100 text-slate-600 border-slate-200",
                                    }
                                  : {
                                      label: "Upcoming",
                                      className:
                                        "bg-amber-50 text-amber-700 border-amber-100",
                                    };

                              const startDate =
                                formatDate(
                                  tournament.startDate
                                );

                              const endDate =
                                formatDate(
                                  tournament.endDate
                                );

                              const dateLabel =
                                startDate !== endDate
                                  ? `${startDate} – ${endDate}`
                                  : startDate;

                              return (
                                <tr
                                  key={entry.id}
                                  className="hover:bg-slate-50/70 transition-colors"
                                >
                                  <td className="px-5 py-5">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="
                                          w-10
                                          h-10
                                          rounded-xl
                                          bg-emerald-50
                                          text-emerald-600
                                          flex
                                          items-center
                                          justify-center
                                          shrink-0
                                        "
                                      >
                                        <Trophy
                                          size={18}
                                          strokeWidth={1.8}
                                        />
                                      </div>

                                      <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 break-words">
                                          {tournament.name}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                          Entry #{entry.id}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-5 py-5">
                                    <div className="flex items-start gap-2">
                                      <CalendarDays
                                        size={16}
                                        className="mt-0.5 text-slate-400 shrink-0"
                                        strokeWidth={1.8}
                                      />

                                      <span className="text-sm text-slate-700 whitespace-nowrap">
                                        {dateLabel}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="px-5 py-5">
                                    <span className="text-sm text-slate-700">
                                      {tournament.location || "—"}
                                    </span>
                                  </td>

                                  <td className="px-5 py-5">
                                    <span className="text-sm font-medium text-slate-700">
                                      {tournament.weightClass || "—"}
                                    </span>
                                  </td>

                                  <td className="px-5 py-5">
                                    <span
                                      className={`
                                        inline-flex
                                        items-center
                                        rounded-full
                                        border
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        ${statusConfig.className}
                                      `}
                                    >
                                      {statusConfig.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-4">
                    {(boxer.tournamentEntries ?? []).map(
                      (entry) => {
                        const tournament =
                          entry.tournament;

                        if (!tournament) {
                          return (
                            <div
                              key={entry.id}
                              className="
                                rounded-xl
                                border
                                border-slate-100
                                bg-slate-50
                                p-4
                              "
                            >
                              <p className="text-sm text-slate-500">
                                Tournament details are unavailable for
                                this entry.
                              </p>
                            </div>
                          );
                        }

                        const status =
                          (
                            tournament.status ||
                            "upcoming"
                          ).toLowerCase();

                        const statusConfig =
                          status === "completed"
                            ? {
                                label: "Completed",
                                className:
                                  "bg-emerald-50 text-emerald-700 border-emerald-100",
                              }
                            : status === "ongoing"
                            ? {
                                label: "Ongoing",
                                className:
                                  "bg-red-50 text-red-700 border-red-100",
                              }
                            : status === "open"
                            ? {
                                label: "Open",
                                className:
                                  "bg-blue-50 text-blue-700 border-blue-100",
                              }
                            : status === "cancelled"
                            ? {
                                label: "Cancelled",
                                className:
                                  "bg-slate-100 text-slate-600 border-slate-200",
                              }
                            : {
                                label: "Upcoming",
                                className:
                                  "bg-amber-50 text-amber-700 border-amber-100",
                              };

                        const startDate =
                          formatDate(
                            tournament.startDate
                          );

                        const endDate =
                          formatDate(
                            tournament.endDate
                          );

                        const dateLabel =
                          startDate !== endDate
                            ? `${startDate} – ${endDate}`
                            : startDate;

                        return (
                          <div
                            key={entry.id}
                            className="
                              rounded-xl
                              border
                              border-slate-100
                              bg-white
                              p-4
                              shadow-sm
                            "
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                  "
                                >
                                  <Trophy
                                    size={18}
                                    strokeWidth={1.8}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <h3 className="font-semibold text-slate-900 break-words">
                                    {tournament.name}
                                  </h3>

                                  <p className="text-xs text-slate-400 mt-1">
                                    Entry #{entry.id}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`
                                  inline-flex
                                  shrink-0
                                  items-center
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1
                                  text-[11px]
                                  font-semibold
                                  ${statusConfig.className}
                                `}
                              >
                                {statusConfig.label}
                              </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3">
                              <div className="flex items-start gap-2">
                                <CalendarDays
                                  size={16}
                                  className="mt-0.5 text-slate-400 shrink-0"
                                  strokeWidth={1.8}
                                />

                                <div>
                                  <p className="text-xs text-slate-400">
                                    Date
                                  </p>

                                  <p className="text-sm font-medium text-slate-700 mt-0.5">
                                    {dateLabel}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Location
                                </p>

                                <p className="text-sm font-medium text-slate-700 mt-0.5 break-words">
                                  {tournament.location || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400">
                                  Weight Class
                                </p>

                                <p className="text-sm font-medium text-slate-700 mt-0.5">
                                  {tournament.weightClass || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </section>

            {/* =================================================
                CERTIFICATES HISTORY
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
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                      bg-violet-50
                      text-violet-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Award
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
                      Certificates History
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      Certificates issued for your boxing achievements
                    </p>
                  </div>
                </div>

                <span
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-violet-50
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-violet-600
                    w-fit
                  "
                >
                  {boxer.certificates?.length ?? 0} Certificate
                  {(boxer.certificates?.length ?? 0) === 1 ? "" : "s"}
                </span>

              </div>

              {(boxer.certificates ?? []).length === 0 ? (
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
                      bg-violet-50
                      text-violet-300
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Award
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    No certificates issued yet
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your certificates will appear here once they are issued.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Certificate
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Event
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Issued On
                          </th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            QR Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {(boxer.certificates ?? []).map((certificate) => {
                          const qrStatus = (certificate.qrStatus || "Pending").toLowerCase();
                          const isActive =
                            qrStatus === "active" ||
                            qrStatus === "verified" ||
                            qrStatus === "valid";

                          return (
                            <tr
                              key={certificate.id}
                              className="border-b border-slate-50 last:border-b-0"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="
                                      w-10
                                      h-10
                                      rounded-xl
                                      bg-violet-50
                                      text-violet-600
                                      flex
                                      items-center
                                      justify-center
                                      shrink-0
                                    "
                                  >
                                    <Award
                                      size={18}
                                      strokeWidth={1.8}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 break-words">
                                      {certificate.type || "Certificate"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                      Certificate #{certificate.id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <p className="text-sm font-medium text-slate-700">
                                  {certificate.event || "—"}
                                </p>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                  <CalendarDays
                                    size={16}
                                    className="text-slate-400 shrink-0"
                                    strokeWidth={1.8}
                                  />
                                  {formatDate(certificate.issuedAt)}
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-full
                                    border
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${
                                      isActive
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                        : "border-amber-200 bg-amber-50 text-amber-600"
                                    }
                                  `}
                                >
                                  <CheckCircle2
                                    size={14}
                                    strokeWidth={2}
                                  />
                                  {isActive
                                    ? "Verified"
                                    : certificate.qrStatus || "Pending"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden space-y-3">
                    {(boxer.certificates ?? []).map((certificate) => {
                      const qrStatus = (certificate.qrStatus || "Pending").toLowerCase();
                      const isActive =
                        qrStatus === "active" ||
                        qrStatus === "verified" ||
                        qrStatus === "valid";

                      return (
                        <div
                          key={certificate.id}
                          className="
                            rounded-xl
                            border
                            border-slate-100
                            bg-white
                            p-4
                          "
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className="
                                  w-10
                                  h-10
                                  rounded-xl
                                  bg-violet-50
                                  text-violet-600
                                  flex
                                  items-center
                                  justify-center
                                  shrink-0
                                "
                              >
                                <Award
                                  size={18}
                                  strokeWidth={1.8}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 break-words">
                                  {certificate.type || "Certificate"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  Certificate #{certificate.id}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`
                                inline-flex
                                shrink-0
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[11px]
                                font-semibold
                                ${
                                  isActive
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                    : "border-amber-200 bg-amber-50 text-amber-600"
                                }
                              `}
                            >
                              {isActive
                                ? "Verified"
                                : certificate.qrStatus || "Pending"}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3">
                            <div>
                              <p className="text-xs text-slate-400">
                                Event
                              </p>
                              <p className="text-sm font-medium text-slate-700 mt-0.5 break-words">
                                {certificate.event || "—"}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="text-slate-400 shrink-0"
                                strokeWidth={1.8}
                              />
                              <div>
                                <p className="text-xs text-slate-400">
                                  Issued On
                                </p>
                                <p className="text-sm font-medium text-slate-700 mt-0.5">
                                  {formatDate(certificate.issuedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </section>

            {/* =================================================
                MEDICAL RECORDS
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
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                      bg-rose-50
                      text-rose-600
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <HeartPulse
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
                      Medical Records
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      Your fitness and medical eligibility information
                    </p>
                  </div>
                </div>

                {boxer.medical && (
                  <span
                    className={`
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      w-fit
                      ${
                        boxer.medical.eligible
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }
                    `}
                  >
                    {boxer.medical.eligible
                      ? "Eligible for Boxing"
                      : "Not Eligible"}
                  </span>
                )}
              </div>

              {!boxer.medical ? (
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
                      bg-rose-50
                      text-rose-300
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <HeartPulse
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    No medical record available
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your fitness and medical information will appear here once it is added.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50/60
                      p-5
                    "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fitness Status
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <CheckCircle2
                        size={19}
                        strokeWidth={2}
                        className={
                          boxer.medical.fitnessStatus
                            .toLowerCase()
                            .includes("valid")
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      />

                      <p
                        className={`
                          text-lg
                          font-bold
                          ${
                            boxer.medical.fitnessStatus
                              .toLowerCase()
                              .includes("valid")
                              ? "text-emerald-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        {boxer.medical.fitnessStatus || "—"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50/60
                      p-5
                    "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fitness Expiry
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <CalendarDays
                        size={19}
                        strokeWidth={1.8}
                        className="text-slate-400 shrink-0"
                      />

                      <p className="text-base font-bold text-slate-800">
                        {formatDate(boxer.medical.expiryDate)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50/60
                      p-5
                    "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Injury
                    </p>

                    <div className="mt-3 flex items-start gap-2">
                      <HeartPulse
                        size={19}
                        strokeWidth={1.8}
                        className={
                          boxer.medical.injury &&
                          boxer.medical.injury.toLowerCase() !== "none"
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }
                      />

                      <p className="text-base font-bold text-slate-800 break-words">
                        {boxer.medical.injury || "None"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50/60
                      p-5
                    "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Last Updated
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <CalendarDays
                        size={19}
                        strokeWidth={1.8}
                        className="text-slate-400 shrink-0"
                      />

                      <p className="text-base font-bold text-slate-800">
                        {formatDate(boxer.medical.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

          </>
        )}

      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   INFO COMPONENT
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

      <p className="text-sm text-slate-400 mb-1">
        {label}
      </p>

      <p
        className="
          text-sm
          font-semibold
          text-slate-900
          break-words
        "
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   STATISTIC CARD
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
        flex
        items-center
        gap-5
      "
    >

      <div
        className={`
          w-16
          h-16
          shrink-0
          rounded-full
          flex
          items-center
          justify-center
          ${iconClass}
        `}
      >
        <Icon
          size={27}
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0">

        <p
          className="
            text-2xl
            font-extrabold
            text-slate-900
          "
        >
          {title}
        </p>

        <p
          className="
            text-sm
            font-medium
            text-slate-700
            mt-0.5
          "
        >
          {label}
        </p>

        <p
          className={`
            text-sm
            font-medium
            mt-1
            ${subClass}
          `}
        >
          {sub}
        </p>

      </div>

    </div>
  );
}