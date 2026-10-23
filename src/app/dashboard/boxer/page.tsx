"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  Award,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Upload,
  FolderOpen,
  HeartPulse,
  IndianRupee,
  Plus,
  ShieldCheck,
  Trophy,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import jsPDF from "jspdf";
import QRCode from "qrcode";

import DashboardLayout from "@/Components/layout/DashboardLayout";

/* =========================================================
   TYPES
   ========================================================= */

type BoxerForm = {
  name: string;
  dob: string;
  weight: string;
  ageGroup: string;
};

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type TournamentHistory = {
  id: number;
  tournamentName: string;
  location: string | null;
  tournamentDate: string | null;
  tournamentType: string | null;
  weightCategory: string | null;
  result: string | null;
  medal: string | null;
  position: number | null;
  coachName: string | null;
  notes: string | null;
  documentPath: string | null;
  documentName: string | null;
  status: string;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

  medicalDocuments: Doc[];

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
  const [boxer, setBoxer] = useState<Boxer | null>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BoxerForm>({
    name: "",
    dob: "",
    weight: "",
    ageGroup: "",
  });

  const [downloadingCard, setDownloadingCard] = useState(false);

  const [tournamentHistory, setTournamentHistory] = useState<
    TournamentHistory[]
  >([]);

  const [historyLoading, setHistoryLoading] = useState(true);

  const [showHistoryForm, setShowHistoryForm] = useState(false);

  const [historyEditingId, setHistoryEditingId] = useState<number | null>(null);

  const [historyStep, setHistoryStep] = useState(0);

  const [latestPastTournamentDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  });

  const [historySubmitting, setHistorySubmitting] = useState(false);

  const [historyError, setHistoryError] = useState("");

  const [historySuccess, setHistorySuccess] = useState("");

  const [historyForm, setHistoryForm] = useState({
    tournamentName: "",
    location: "",
    tournamentDate: "",
    tournamentType: "",
    weightCategory: "",
    result: "",
    medal: "NONE",
    position: "",
    coachName: "",
    notes: "",
    documentPath: "",
    documentName: "",
  });

  const [historyDocument, setHistoryDocument] = useState<File | null>(null);

  const historyProofRequired =
    historyForm.medal !== "NONE" || historyForm.position.trim() !== "";

  function openNewHistoryForm() {
    setHistoryEditingId(null);
    setHistoryStep(0);
    setHistoryError("");
    setHistorySuccess("");
    setHistoryDocument(null);
    setHistoryForm({
      tournamentName: "",
      location: "",
      tournamentDate: "",
      tournamentType: "",
      weightCategory: "",
      result: "",
      medal: "NONE",
      position: "",
      coachName: "",
      notes: "",
      documentPath: "",
      documentName: "",
    });
    setShowHistoryForm(true);
  }

  function openEditHistoryForm(history: TournamentHistory) {
    setHistoryEditingId(history.id);
    setHistoryStep(0);
    setHistoryError("");
    setHistorySuccess("");
    setHistoryDocument(null);
    setHistoryForm({
      tournamentName: history.tournamentName,
      location: history.location || "",
      tournamentDate: history.tournamentDate
        ? new Date(history.tournamentDate).toISOString().slice(0, 10)
        : "",
      tournamentType: history.tournamentType || "",
      weightCategory: history.weightCategory || "",
      result: history.result || "",
      medal: history.medal || "NONE",
      position: history.position?.toString() || "",
      coachName: history.coachName || "",
      notes: history.notes || "",
      documentPath: history.documentPath || "",
      documentName: history.documentName || "",
    });
    setShowHistoryForm(true);
  }

  function advanceHistoryStep() {
    setHistoryError("");

    if (historyStep === 0) {
      if (!historyForm.tournamentName.trim() || !historyForm.tournamentDate) {
        setHistoryError("Enter the tournament name and date to continue.");
        return;
      }

      if (
        Number.isNaN(
          new Date(`${historyForm.tournamentDate}T00:00:00.000Z`).getTime(),
        ) ||
        historyForm.tournamentDate >= new Date().toISOString().slice(0, 10)
      ) {
        setHistoryError("Tournament date must be in the past.");
        return;
      }
    }

    if (historyStep === 1 && !historyForm.result.trim()) {
      setHistoryError("Add your result, such as Participation or Finalist.");
      return;
    }

    if (historyStep === 1) {
      const position = historyForm.position.trim()
        ? Number(historyForm.position)
        : null;
      const medalPosition: Record<string, number> = {
        GOLD: 1,
        SILVER: 2,
        BRONZE: 3,
      };
      if (position !== null && (!Number.isSafeInteger(position) || position <= 0)) {
        setHistoryError("Position must be a positive whole number.");
        return;
      }
      if (position !== null && position <= 3) {
        const expectedMedal = ["", "GOLD", "SILVER", "BRONZE"][position];
        if (historyForm.medal !== expectedMedal) {
          setHistoryError(
            `Position ${position} must match the ${expectedMedal.toLowerCase()} medal.`,
          );
          return;
        }
      }
      if (
        historyForm.medal !== "NONE" &&
        position !== null &&
        medalPosition[historyForm.medal] !== position
      ) {
        setHistoryError(
          `${historyForm.medal.toLowerCase()} medal must match position ${medalPosition[historyForm.medal]}.`,
        );
        return;
      }
      if (
        historyForm.medal !== "NONE" &&
        !["DISTRICT", "STATE", "NATIONAL", "INTERNATIONAL"].includes(
          historyForm.tournamentType,
        )
      ) {
        setHistoryError("Choose the tournament level for a medal claim.");
        return;
      }
    }

    if (
      historyStep === 2 &&
      historyProofRequired &&
      !historyDocument &&
      !historyForm.documentPath
    ) {
      setHistoryError(
        "Upload a certificate or official result proof for medal or placing claims.",
      );
      return;
    }

    setHistoryStep((current) => Math.min(current + 1, 3));
  }

  /* =======================================================
     LOAD PROFILE
     ======================================================= */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/boxer", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load profile.");
        }

        setBoxer(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =========================================================
     LOAD TOURNAMENT HISTORY
     ========================================================= */

  useEffect(() => {
    async function loadTournamentHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError("");

        const response = await fetch("/api/boxer/tournament-history", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load tournament history.",
          );
        }

        setTournamentHistory(Array.isArray(data?.history) ? data.history : []);
      } catch (err) {
        setHistoryError(
          err instanceof Error
            ? err.message
            : "Failed to load tournament history.",
        );
      } finally {
        setHistoryLoading(false);
      }
    }

    loadTournamentHistory();
  }, []);

  /* =========================================================
     DATE HELPERS
     ========================================================= */

  const formatDate = (value: string | null) => {
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

  const formatCardDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

    return `MBA-BXR-${new Date(boxer.user.createdAt).getFullYear()}-${String(
      boxer.id,
    ).padStart(4, "0")}`;
  }, [boxer]);

  /* =========================================================
     PASSPORT PHOTO
     ========================================================= */

  const passportPhoto = useMemo(() => {
    if (!boxer) return null;

    const documents = boxer.user.documents ?? [];

    const photo = documents.find((doc) => {
      const label = doc.label.toLowerCase();

      return label.includes("passport") && label.includes("photo");
    });

    return photo
      ? `/api/file?path=${encodeURIComponent(photo.filePath)}`
      : null;
  }, [boxer]);

  /* =========================================================
     SAVE PROFILE
     ========================================================= */

  async function handleSave() {
    if (!boxer) return;
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/boxer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob || null,
          weight: form.weight || null,
          ageGroup: form.ageGroup || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save profile.");
      }

      setBoxer((current) => (current ? { ...current, ...data } : current));
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DOWNLOAD ID CARD
     ========================================================= */

  const downloadIdCard = async () => {
    if (!boxer) return;

    if (!boxer.user.membershipId) {
      setError("Membership ID is not available yet.");

      return;
    }

    try {
      setDownloadingCard(true);
      setError("");

      const validFrom = boxer.user.membershipValidFrom
        ? new Date(boxer.user.membershipValidFrom)
        : null;

      const expiry = boxer.user.membershipExpiry
        ? new Date(boxer.user.membershipExpiry)
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

      const membershipId = boxer.user.membershipId;

      const verificationUrl = `${window.location.origin}/verify/boxer/${encodeURIComponent(
        membershipId,
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

      doc.text(boxer.name.charAt(0).toUpperCase(), 11, 27.2, {
        align: "center",
      });

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

      const nameLines = doc.splitTextToSize(boxer.name, 27);

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
         BOXER ID
         ===================================================== */

      doc.setTextColor(100, 116, 139);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(4);

      doc.text("BOXER ID", 21, 37);

      doc.setTextColor(15, 23, 42);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(5);

      doc.text(boxerId, 21, 40.5);

      /* =====================================================
         CATEGORY
         ===================================================== */

      doc.setTextColor(100, 116, 139);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(4);

      doc.text("CATEGORY", 50, 19);

      doc.setTextColor(15, 23, 42);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(5.5);

      doc.text("BOXER", 50, 22.5);

      /* =====================================================
         WEIGHT
         ===================================================== */

      doc.setTextColor(100, 116, 139);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(4);

      doc.text("WEIGHT CATEGORY", 50, 28);

      doc.setTextColor(15, 23, 42);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(5);

      doc.text(boxer.weight || "—", 50, 31.5);

      /* =====================================================
         VALID FROM
         ===================================================== */

      doc.setTextColor(100, 116, 139);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(4);

      doc.text("VALID FROM", 50, 37);

      doc.setTextColor(15, 23, 42);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(5);

      doc.text(formatCardDate(validFrom), 50, 40.5);

      /* =====================================================
         VALID UNTIL
         ===================================================== */

      doc.setTextColor(100, 116, 139);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(4);

      doc.text("VALID UNTIL", 50, 44);

      doc.setTextColor(22, 163, 74);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(5);

      doc.text(formatCardDate(expiry), 50, 47.5);

      /* =====================================================
         QR VERIFICATION CODE
         ===================================================== */

      doc.setFillColor(248, 250, 252);

      doc.roundedRect(64, 27, 17, 17, 2, 2, "F");

      doc.addImage(qrDataUrl, "PNG", 65, 28, 15, 15);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3.2);
      doc.text("SCAN TO VERIFY", 72.5, 46.5, { align: "center" });

      /* =====================================================
         ACTIVE BADGE
         ===================================================== */

      doc.setFillColor(220, 252, 231);

      doc.roundedRect(69, 19, 11, 5, 2, 2, "F");

      doc.setTextColor(22, 101, 52);

      doc.setFontSize(3.7);

      doc.text("ACTIVE", 74.5, 22.2, {
        align: "center",
      });

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
      console.error("ID card generation error:", err);

      setError("Unable to generate ID card.");
    } finally {
      setDownloadingCard(false);
    }
  };

  /* =========================================================
     SUBMIT TOURNAMENT HISTORY
     ========================================================= */

  async function submitTournamentHistory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (historyStep < 3) {
      advanceHistoryStep();
      return;
    }

    try {
      setHistorySubmitting(true);
      setHistoryError("");
      setHistorySuccess("");

      let documentPath: string | null =
        historyEditingId !== null ? historyForm.documentPath || null : null;
      let documentName: string | null =
        historyEditingId !== null ? historyForm.documentName || null : null;

      /* =====================================================
         SUPPORTING DOCUMENT UPLOAD
         ===================================================== */

      if (historyDocument) {
        const uploadForm = new FormData();
        uploadForm.append("file", historyDocument);

        const uploadResponse = await fetch(
          "/api/boxer/tournament-history/upload",
          {
            method: "POST",
            body: uploadForm,
          },
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(
            uploadData?.message || "Failed to upload supporting document.",
          );
        }

        documentPath = uploadData.filePath;
        documentName = uploadData.fileName;
        setHistoryForm((current) => ({
          ...current,
          documentPath: uploadData.filePath,
          documentName: uploadData.fileName,
        }));
        setHistoryDocument(null);
      }

      /* =====================================================
         CREATE TOURNAMENT HISTORY RECORD
         ===================================================== */

      const response = await fetch(
        historyEditingId === null
          ? "/api/boxer/tournament-history"
          : `/api/boxer/tournament-history/${historyEditingId}`,
        {
        method: historyEditingId === null ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentName: historyForm.tournamentName.trim(),
          location: historyForm.location.trim() || null,
          tournamentDate: historyForm.tournamentDate,
          tournamentType: historyForm.tournamentType.trim() || null,
          weightCategory: historyForm.weightCategory.trim() || null,
          result: historyForm.result.trim() || null,
          medal: historyForm.medal,
          position:
            historyForm.position.trim() === ""
              ? null
              : Number(historyForm.position),
          coachName: historyForm.coachName.trim() || null,
          notes: historyForm.notes.trim() || null,
          documentPath,
          documentName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to submit tournament history.",
        );
      }

      setTournamentHistory((current) =>
        historyEditingId === null
          ? [data.history, ...current]
          : current.map((record) =>
              record.id === historyEditingId ? data.history : record,
            ),
      );

      setHistoryForm({
        tournamentName: "",
        location: "",
        tournamentDate: "",
        tournamentType: "",
        weightCategory: "",
        result: "",
        medal: "NONE",
        position: "",
        coachName: "",
        notes: "",
        documentPath: "",
        documentName: "",
      });

      setHistoryDocument(null);
      setHistoryEditingId(null);
      setHistoryStep(0);

      setShowHistoryForm(false);
      setHistorySuccess(
        historyEditingId === null
          ? "Tournament record submitted successfully. It is now pending verification."
          : "Updated tournament record submitted for review.",
      );
    } catch (err) {
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Failed to submit tournament history.",
      );
    } finally {
      setHistorySubmitting(false);
    }
  }

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
              {greeting}, {boxer?.name?.split(" ")[0] || "Member"}
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
                        <UserRound size={58} strokeWidth={1.5} />
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
                        <CheckCircle2 size={15} strokeWidth={2} />
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
                      <Info label="Boxer ID" value={boxerId} />

                      <Info
                        label="Date of Birth"
                        value={formatDate(boxer.dob)}
                      />

                      <Info
                        label="Weight Category"
                        value={boxer.weight || "—"}
                      />

                      <Info label="Age Group" value={boxer.ageGroup || "—"} />

                      <Info
                        label="Academy"
                        value={boxer.academy?.name || "—"}
                      />

                      <Info label="Email" value={boxer.user.email} />
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
                        {boxer.user.membershipId || "—"}
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
                        {formatDate(boxer.user.membershipValidFrom)}
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
                        {formatDate(boxer.user.membershipExpiry)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadIdCard}
                    disabled={downloadingCard || !boxer.user.membershipId}
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

                    {downloadingCard ? "Generating..." : "Download ID Card"}
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
                title={boxer.user.membershipId ? "Paid" : "Pending"}
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
                    <FolderOpen size={21} strokeWidth={1.8} />
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
                  <ArrowRight size={17} strokeWidth={2} />
                </a>
              </div>

              {(boxer.user.documents ?? []).length === 0 ? (
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
                    <FileText size={32} strokeWidth={1.5} />
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
                  {(boxer.user.documents ?? []).map((doc) => {
                    const fileUrl = `/api/file?path=${encodeURIComponent(
                      doc.filePath,
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
                                <FileText size={34} strokeWidth={1.5} />
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
                            {doc.label.replace(/-/g, " ")}
                          </p>

                          {(() => {
                            const status = (
                              doc.status || "Pending"
                            ).toLowerCase();

                            const isApproved = status === "approved";

                            const isRejected = status === "rejected";

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

                                {isRejected && doc.rejectionReason && (
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
                            <ArrowRight size={16} strokeWidth={2} />
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =================================================
                TOURNAMENTS
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
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
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
                    <Trophy size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-[#0b1729]
                      "
                    >
                      Tournaments
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Upcoming registrations and your verified tournament
                      achievements
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openNewHistoryForm}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#ed1c24]
                    hover:bg-[#d71920]
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition-colors
                    shadow-sm
                    w-full
                    sm:w-auto
                  "
                >
                  <Plus size={18} strokeWidth={2.2} />
                  Add Previous Tournament
                </button>
              </div>

              {historySuccess && (
                <div
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-emerald-700
                  "
                >
                  {historySuccess}
                </div>
              )}

              {historyError && (
                <div
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-600
                  "
                >
                  {historyError}
                </div>
              )}

              {/* =================================================
                  UPCOMING TOURNAMENTS
                  ================================================= */}

              <div>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mb-4
                  "
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Upcoming Tournaments
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Tournaments you are registered for
                    </p>
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
                    <Trophy size={14} />
                    {boxer.tournamentEntries?.length ?? 0}
                  </span>
                </div>

                {(boxer.tournamentEntries ?? []).length === 0 ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-slate-200
                      bg-slate-50/50
                      p-8
                      text-center
                    "
                  >
                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-emerald-50
                        text-emerald-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Trophy size={28} strokeWidth={1.5} />
                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                      No upcoming tournament registrations
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Your tournament registrations will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                      <div className="overflow-hidden rounded-xl border border-slate-100">
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
                            {(boxer.tournamentEntries ?? []).map((entry) => {
                              const tournament = entry.tournament;

                              if (!tournament) {
                                return (
                                  <tr key={entry.id}>
                                    <td
                                      colSpan={5}
                                      className="px-5 py-5 text-sm text-slate-500"
                                    >
                                      Tournament details are unavailable for
                                      this entry.
                                    </td>
                                  </tr>
                                );
                              }

                              const status = (
                                tournament.status || "upcoming"
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

                              const startDate = formatDate(
                                tournament.startDate,
                              );

                              const endDate = formatDate(tournament.endDate);

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
                                        <Trophy size={18} strokeWidth={1.8} />
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
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-4">
                      {(boxer.tournamentEntries ?? []).map((entry) => {
                        const tournament = entry.tournament;

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
                                Tournament details are unavailable for this
                                entry.
                              </p>
                            </div>
                          );
                        }

                        const status = (
                          tournament.status || "upcoming"
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

                        const startDate = formatDate(tournament.startDate);

                        const endDate = formatDate(tournament.endDate);

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
                                  <Trophy size={18} strokeWidth={1.8} />
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
                                  <p className="text-xs text-slate-400">Date</p>

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
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-slate-100" />

              {/* =================================================
                  TOURNAMENTS PLAYED
                  ================================================= */}

              <div>
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                    mb-4
                  "
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Tournament History &amp; Achievements
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Approved records are verified achievements; pending records do not count yet.
                    </p>
                  </div>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-slate-100
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-slate-600
                      w-fit
                    "
                  >
                    <Award size={14} />
                    {tournamentHistory.length}{" "}
                    {tournamentHistory.length === 1 ? "Record" : "Records"}
                  </span>
                </div>

                {historyLoading ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-8
                      text-center
                    "
                  >
                    <div
                      className="
                        w-8
                        h-8
                        border-4
                        border-slate-200
                        border-t-red-600
                        rounded-full
                        animate-spin
                        mx-auto
                      "
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading tournament history...
                    </p>
                  </div>
                ) : tournamentHistory.length === 0 ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-slate-200
                      bg-slate-50/50
                      p-8
                      text-center
                    "
                  >
                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-violet-50
                        text-violet-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Award size={28} strokeWidth={1.5} />
                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                      No previous tournaments submitted
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Add tournaments you played in the past for Super Admin
                      verification.
                    </p>

                    <button
                      type="button"
                      onClick={openNewHistoryForm}
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-red-600
                        hover:bg-red-100
                        transition-colors
                      "
                    >
                      <Plus size={17} />
                      Add Previous Tournament
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tournamentHistory.map((history) => {
                      const status = (
                        history.status || "PENDING_REVIEW"
                      ).toUpperCase();

                      const statusConfig =
                        status === "APPROVED"
                          ? {
                              label: "Approved",
                              icon: CheckCircle2,
                              className:
                                "bg-emerald-50 text-emerald-700 border-emerald-100",
                            }
                          : status === "REJECTED"
                            ? {
                                label: "Rejected",
                                icon: XCircle,
                                className:
                                  "bg-red-50 text-red-700 border-red-100",
                              }
                            : {
                                label: "Pending Review",
                                icon: Clock3,
                                className:
                                  "bg-amber-50 text-amber-700 border-amber-100",
                              };

                      const StatusIcon = statusConfig.icon;

                      const medal = (history.medal || "NONE").toUpperCase();

                      const medalLabel =
                        medal === "GOLD"
                          ? "Gold"
                          : medal === "SILVER"
                            ? "Silver"
                            : medal === "BRONZE"
                              ? "Bronze"
                              : "No Medal";

                      return (
                        <div
                          key={history.id}
                          className="
                            rounded-xl
                            border
                            border-slate-100
                            bg-white
                            p-4
                            sm:p-5
                            shadow-sm
                          "
                        >
                          <div
                            className="
                              flex
                              flex-col
                              lg:flex-row
                              lg:items-start
                              lg:justify-between
                              gap-4
                            "
                          >
                            <div className="min-w-0">
                              <div className="flex items-start gap-3">
                                <div
                                  className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-violet-50
                                    text-violet-600
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                  "
                                >
                                  <Trophy size={20} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 break-words">
                                    {history.tournamentName}
                                  </h4>

                                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                    {history.tournamentDate && (
                                      <span className="inline-flex items-center gap-1">
                                        <CalendarDays size={13} />
                                        {formatDate(history.tournamentDate)}
                                      </span>
                                    )}

                                    {history.location && (
                                      <span>{history.location}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                w-fit
                                ${statusConfig.className}
                              `}
                            >
                              <StatusIcon size={14} />
                              {statusConfig.label}
                            </span>
                          </div>

                          {status === "PENDING_REVIEW" && (
                            <p className="mt-3 text-xs text-amber-700">
                              Submitted for review on{" "}
                              {formatDate(history.updatedAt || history.createdAt)}.
                              This record is not verified yet.
                            </p>
                          )}

                          <div
                            className="
                              mt-5
                              grid
                              grid-cols-2
                              sm:grid-cols-3
                              lg:grid-cols-5
                              gap-4
                              border-t
                              border-slate-100
                              pt-4
                            "
                          >
                            <div>
                              <p className="text-xs text-slate-400">
                                Tournament Type
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {history.tournamentType || "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Weight Category
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {history.weightCategory || "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">Result</p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {history.result || "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">Medal</p>
                              <p
                                className={`mt-1 text-sm font-bold ${
                                  medal === "GOLD"
                                    ? "text-amber-600"
                                    : medal === "SILVER"
                                      ? "text-slate-500"
                                      : medal === "BRONZE"
                                        ? "text-orange-600"
                                        : "text-slate-700"
                                }`}
                              >
                                {medalLabel}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">Position</p>
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {history.position
                                  ? `#${history.position}`
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          {(history.coachName || history.notes) && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {history.coachName && (
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Coach
                                  </p>
                                  <p className="mt-1 text-sm font-medium text-slate-700">
                                    {history.coachName}
                                  </p>
                                </div>
                              )}

                              {history.notes && (
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Notes
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600 leading-6">
                                    {history.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {status === "REJECTED" && (
                            <div
                              className="
                                  mt-4
                                  rounded-xl
                                  border
                                  border-red-100
                                  bg-red-50
                                  px-4
                                  py-3
                                "
                            >
                              <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                                Rejection Reason
                              </p>

                              <p className="mt-1 text-sm text-red-700 leading-6">
                                {history.rejectionReason ||
                                  "Please update your record and supporting details before resubmitting."}
                              </p>
                              <button
                                type="button"
                                onClick={() => openEditHistoryForm(history)}
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                              >
                                Edit and resubmit
                                <ArrowRight size={15} />
                              </button>
                            </div>
                          )}

                          {history.documentPath && (
                            <a
                              href={`/api/tournament-history/${history.id}/document`}
                              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
                            >
                              <FileText size={16} />
                              View supporting proof
                            </a>
                          )}

                          {status === "APPROVED" && history.reviewedAt && (
                            <p className="mt-4 text-xs text-slate-400">
                              Verified on {formatDate(history.reviewedAt)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                ADD PREVIOUS TOURNAMENT MODAL
                ================================================= */}

            {showHistoryForm && (
              <div
                className="
                  fixed
                  inset-0
                  z-[100]
                  bg-slate-900/50
                  backdrop-blur-sm
                  p-4
                  sm:p-6
                  flex
                  items-center
                  justify-center
                "
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowHistoryForm(false);
                  }
                }}
              >
                <div
                  className="
                    w-full
                    max-w-3xl
                    max-h-[92vh]
                    overflow-y-auto
                    rounded-2xl
                    bg-white
                    shadow-2xl
                  "
                >
                  <div
                    className="
                      sticky
                      top-0
                      z-10
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-slate-100
                      bg-white
                      px-5
                      py-4
                      sm:px-6
                    "
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {historyEditingId === null
                          ? "Add Previous Tournament"
                          : "Edit and Resubmit Tournament"}
                      </h3>
                      <p className="mt-0.5 text-sm text-slate-400">
                        {historyEditingId === null
                          ? "Follow the steps to submit your past result for verification."
                          : "Update the rejected record, then send it for review again."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowHistoryForm(false)}
                      className="
                        w-9
                        h-9
                        rounded-lg
                        bg-slate-100
                        text-slate-500
                        hover:bg-slate-200
                        flex
                        items-center
                        justify-center
                        transition-colors
                      "
                      aria-label="Close"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form
                    onSubmit={submitTournamentHistory}
                    className="p-5 sm:p-6"
                  >
                    <div
                      className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-blue-700
                      "
                    >
                      After submission, your record will remain{" "}
                      <strong>Pending Review</strong> until it has been verified
                      by the association. Medal and placing claims need official
                      proof; participation-only records do not earn ranking points.
                    </div>

                    <ol
                      aria-label="Tournament history submission steps"
                      className="mt-5 grid grid-cols-4 gap-2"
                    >
                      {["Event", "Result", "Proof", "Review"].map(
                        (stepName, index) => (
                          <li
                            key={stepName}
                            aria-current={historyStep === index ? "step" : undefined}
                            className={`rounded-lg px-2 py-2 text-center text-xs font-bold sm:text-sm ${
                              historyStep === index
                                ? "bg-red-600 text-white"
                                : historyStep > index
                                  ? "bg-red-50 text-red-700"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span className="mr-1">{index + 1}.</span>
                            {stepName}
                          </li>
                        ),
                      )}
                    </ol>

                    {historyError && (
                      <div
                        role="alert"
                        className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700"
                      >
                        {historyError}
                      </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <fieldset
                        disabled={historyStep !== 0}
                        className="contents"
                      >
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tournament Name *
                        </label>

                        <input
                          type="text"
                          required
                          value={historyForm.tournamentName}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              tournamentName: event.target.value,
                            }))
                          }
                          placeholder="e.g. Maharashtra State Boxing Championship"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tournament Date *
                        </label>

                        <input
                          type="date"
                          required
                          max={latestPastTournamentDate}
                          value={historyForm.tournamentDate}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              tournamentDate: event.target.value,
                            }))
                          }
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Location
                        </label>

                        <input
                          type="text"
                          value={historyForm.location}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              location: event.target.value,
                            }))
                          }
                          placeholder="e.g. Mumbai"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tournament Type
                        </label>

                        <select
                          value={historyForm.tournamentType}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              tournamentType: event.target.value,
                            }))
                          }
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        >
                          <option value="">Select level (optional)</option>
                          <option value="DISTRICT">District</option>
                          <option value="STATE">State</option>
                          <option value="NATIONAL">National</option>
                          <option value="INTERNATIONAL">International</option>
                        </select>
                      </div>
                      </fieldset>

                      <fieldset
                        disabled={historyStep !== 1}
                        className="contents"
                      >
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Weight Category
                        </label>

                        <input
                          type="text"
                          value={historyForm.weightCategory}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              weightCategory: event.target.value,
                            }))
                          }
                          placeholder="e.g. 60 KG"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Result *
                        </label>

                        <input
                          type="text"
                          required
                          value={historyForm.result}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              result: event.target.value,
                            }))
                          }
                          placeholder="e.g. Winner / Quarter Finalist"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Medal
                        </label>

                        <select
                          value={historyForm.medal}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              medal: event.target.value,
                            }))
                          }
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        >
                          <option value="NONE">No Medal</option>
                          <option value="GOLD">Gold</option>
                          <option value="SILVER">Silver</option>
                          <option value="BRONZE">Bronze</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Position
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={historyForm.position}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              position: event.target.value,
                            }))
                          }
                          placeholder="e.g. 1"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Coach Name
                        </label>

                        <input
                          type="text"
                          value={historyForm.coachName}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              coachName: event.target.value,
                            }))
                          }
                          placeholder="e.g. Rahul Sharma"
                          className="
                            w-full
                            h-12
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-sm
                            text-slate-900
                            outline-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>
                      </fieldset>

                      <fieldset
                        disabled={historyStep !== 2}
                        className="contents"
                      >
                      {/* Supporting document */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Supporting proof {historyProofRequired ? "*" : "(optional)"}
                        </label>

                        <label
                          htmlFor="tournament-supporting-document"
                          className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center transition hover:border-red-300 hover:bg-red-50/40"
                        >
                          <Upload size={24} className="text-red-500" />

                          <span className="mt-2 text-sm font-semibold text-slate-700">
                            {historyDocument
                              ? historyDocument.name
                              : "Upload tournament certificate or result proof"}
                          </span>

                          <span className="mt-1 text-xs text-slate-400">
                            PDF, JPG, JPEG or PNG · Maximum 5 MB · Private to you and association reviewers
                          </span>
                        </label>

                        <input
                          id="tournament-supporting-document"
                          type="file"
                          accept="application/pdf,image/jpeg,image/png"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;

                            if (!file) {
                              setHistoryDocument(null);
                              return;
                            }

                            const allowedTypes = [
                              "application/pdf",
                              "image/jpeg",
                              "image/png",
                            ];

                            if (!allowedTypes.includes(file.type)) {
                              setHistoryError(
                                "Only PDF, JPG, JPEG and PNG files are allowed.",
                              );
                              event.target.value = "";
                              setHistoryDocument(null);
                              return;
                            }

                            if (file.size > 5 * 1024 * 1024) {
                              setHistoryError(
                                "Supporting document must be 5 MB or smaller.",
                              );
                              event.target.value = "";
                              setHistoryDocument(null);
                              return;
                            }

                            setHistoryError("");
                            setHistoryDocument(file);
                          }}
                        />

                        {historyForm.documentPath && !historyDocument && (
                          <p className="mt-2 text-xs text-emerald-700">
                            Existing proof attached: {historyForm.documentName || "Supporting document"}
                          </p>
                        )}

                        {historyDocument && (
                          <button
                            type="button"
                            onClick={() => setHistoryDocument(null)}
                            className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
                          >
                            Remove selected document
                          </button>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Notes
                        </label>

                        <textarea
                          rows={4}
                          value={historyForm.notes}
                          onChange={(event) =>
                            setHistoryForm((current) => ({
                              ...current,
                              notes: event.target.value,
                            }))
                          }
                          placeholder="Add any additional tournament details..."
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            resize-none
                            focus:border-red-400
                            focus:ring-4
                            focus:ring-red-50
                          "
                        />
                      </div>
                      </fieldset>

                      {historyStep === 3 && (
                        <div className="sm:col-span-2 space-y-4">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="font-bold text-slate-900">
                              Review your submission
                            </h4>
                            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                              <div>
                                <dt className="text-slate-500">Tournament</dt>
                                <dd className="font-semibold text-slate-800">{historyForm.tournamentName || "—"}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Date and location</dt>
                                <dd className="font-semibold text-slate-800">
                                  {historyForm.tournamentDate || "—"}
                                  {historyForm.location ? ` · ${historyForm.location}` : ""}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Level and weight</dt>
                                <dd className="font-semibold text-slate-800">
                                  {historyForm.tournamentType || "Not specified"}
                                  {historyForm.weightCategory ? ` · ${historyForm.weightCategory}` : ""}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Result</dt>
                                <dd className="font-semibold text-slate-800">
                                  {historyForm.result || "—"}
                                  {historyForm.medal !== "NONE"
                                    ? ` · ${historyForm.medal.toLowerCase()} medal`
                                    : ""}
                                  {historyForm.position ? ` · Position ${historyForm.position}` : ""}
                                </dd>
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-slate-500">Supporting proof</dt>
                                <dd className="font-semibold text-slate-800">
                                  {historyDocument?.name ||
                                    historyForm.documentName ||
                                    "None (participation-only record; no points)"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <p className="text-xs leading-5 text-slate-500">
                            Submitting sends this record to the association for verification. Only approved results become verified achievements.
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      className="
                        mt-6
                        flex
                        flex-col-reverse
                        sm:flex-row
                        sm:justify-end
                        gap-3
                        border-t
                        border-slate-100
                        pt-5
                      "
                    >
                      <button
                        type="button"
                        onClick={() => setShowHistoryForm(false)}
                        disabled={historySubmitting}
                        className="
                          h-12
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-5
                          text-sm
                          font-bold
                          text-slate-600
                          hover:bg-slate-50
                          disabled:opacity-50
                          transition-colors
                        "
                      >
                        Cancel
                      </button>

                      {historyStep > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setHistoryError("");
                            setHistoryStep((current) => Math.max(0, current - 1));
                          }}
                          disabled={historySubmitting}
                          className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                        >
                          Back
                        </button>
                      )}

                      {historyStep < 3 ? (
                        <button
                          type="button"
                          onClick={advanceHistoryStep}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-6 text-sm font-bold text-white transition-colors hover:bg-[#d71920]"
                        >
                          Continue
                          <ArrowRight size={17} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={historySubmitting}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-6 text-sm font-bold text-white transition-colors hover:bg-[#d71920] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {historySubmitting ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={17} />
                              {historyEditingId === null
                                ? "Submit for Review"
                                : "Resubmit for Review"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

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
                    <Award size={21} strokeWidth={1.8} />
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
                    <Award size={32} strokeWidth={1.5} />
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
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Download
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {(boxer.certificates ?? []).map((certificate) => {
                          const qrStatus = (
                            certificate.qrStatus || "Pending"
                          ).toLowerCase();
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
                                    <Award size={18} strokeWidth={1.8} />
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
                                  <CheckCircle2 size={14} strokeWidth={2} />
                                  {isActive
                                    ? "Verified"
                                    : certificate.qrStatus || "Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <a
                                href={`/api/certificates/${certificate.id}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
                                >
                                <Download size={16} />
                                PDF
                                </a>
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
                      const qrStatus = (
                        certificate.qrStatus || "Pending"
                      ).toLowerCase();
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
                                <Award size={18} strokeWidth={1.8} />
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
                              <p className="text-xs text-slate-400">Event</p>
                              <p className="text-sm font-medium text-slate-700 mt-0.5 break-words">
                                {certificate.event || "—"}
                              </p>
                            </div>
                            <a
                              href={`/api/certificates/${certificate.id}`}
                              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
                            >
                              <Download size={16} />
                              Download PDF
                            </a>

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
                    <HeartPulse size={21} strokeWidth={1.8} />
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

              {!boxer.medical && boxer.medicalDocuments.length === 0 ? (
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
                    <HeartPulse size={32} strokeWidth={1.5} />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    No medical record available
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Your fitness and medical information will appear here once
                    it is added.
                  </p>
                </div>
              ) : boxer.medical ? (
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
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                  No structured fitness assessment is recorded yet. Your uploaded medical documents are listed below with their review status.
                </div>
              )}
              {boxer.medicalDocuments.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Submitted medical documents
                  </h3>
                  {boxer.medicalDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {document.label.replace(/-/g, " ")}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Submitted {formatDate(document.createdAt)}
                          {document.rejectionReason
                            ? ` · ${document.rejectionReason}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                          {document.status}
                        </span>
                        <a
                          href={`/api/file?path=${encodeURIComponent(document.filePath)}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
                        >
                          <Download size={16} />
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-black">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-500 hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Weight Category</label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 75kg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Age Group</label>
                <input
                  type="text"
                  value={form.ageGroup}
                  onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. U21"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* =========================================================
   INFO COMPONENT
   ========================================================= */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-slate-400 mb-1">{label}</p>

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
        <Icon size={27} strokeWidth={1.8} />
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
