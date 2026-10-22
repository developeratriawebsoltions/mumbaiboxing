"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string | null;
  entryFee: number | null;
  isFeatured: boolean;
  createdAt: string;
};

type TournamentAssignment = {
  id: number;
  role: string;
  status: string;
  assignedAt: string;
  notes: string | null;
  tournament: Tournament;
};

type DashboardData = {
  success: boolean;

  user: {
    id: number;
    email: string;
    role: string;
    registrationStatus: string;
  };

  tournamentAssignments: TournamentAssignment[];

  upcomingTournaments: TournamentAssignment[];
};

/* =========================================================
   PAGE
   ========================================================= */

export default function RefereeJudgeTournamentsPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD DATA
     ======================================================= */

  useEffect(() => {
    async function loadTournaments() {
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
              "Failed to load your tournaments."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tournaments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTournaments();
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
     DATE RANGE
     ======================================================= */

  const formatDateRange = (
    start: string | null,
    end: string | null
  ) => {
    if (!start && !end) {
      return "Date not announced";
    }

    if (!end || start === end) {
      return formatDate(start);
    }

    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  /* =======================================================
     ASSIGNMENTS
     ======================================================= */

  const assignments = useMemo(
    () => data?.tournamentAssignments ?? [],
    [data]
  );

  /* =======================================================
     UPCOMING
     ======================================================= */

  const upcoming = useMemo(() => {
    if (!data) return [];

    const now = new Date();

    return assignments
      .filter((assignment) => {
        if (!assignment.tournament.startDate) {
          return false;
        }

        const start = new Date(
          assignment.tournament.startDate
        );

        return start >= now;
      })
      .sort((a, b) => {
        const aDate = a.tournament.startDate
          ? new Date(
              a.tournament.startDate
            ).getTime()
          : Number.MAX_SAFE_INTEGER;

        const bDate = b.tournament.startDate
          ? new Date(
              b.tournament.startDate
            ).getTime()
          : Number.MAX_SAFE_INTEGER;

        return aDate - bDate;
      });
  }, [assignments, data]);

  /* =======================================================
     PAST / COMPLETED
     ======================================================= */

  const past = useMemo(() => {
    const now = new Date();

    return assignments
      .filter((assignment) => {
        if (!assignment.tournament.startDate) {
          return false;
        }

        const start = new Date(
          assignment.tournament.startDate
        );

        return start < now;
      })
      .sort((a, b) => {
        const aDate = a.tournament.startDate
          ? new Date(
              a.tournament.startDate
            ).getTime()
          : 0;

        const bDate = b.tournament.startDate
          ? new Date(
              b.tournament.startDate
            ).getTime()
          : 0;

        return bDate - aDate;
      });
  }, [assignments]);

  /* =======================================================
     STATUS COUNTS
     ======================================================= */

  const confirmedCount = assignments.filter(
    (assignment) => {
      const status =
        assignment.status.toLowerCase();

      return (
        status === "assigned" ||
        status === "confirmed" ||
        status === "accepted"
      );
    }
  ).length;

  const pendingCount = assignments.filter(
    (assignment) =>
      assignment.status.toLowerCase() ===
      "pending"
  ).length;

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
              Loading your tournaments...
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
            {error ||
              "Unable to load tournaments."}
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
              Tournaments
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              View tournaments where you are assigned as
              a Referee / Judge
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
            <Trophy size={17} />
            Tournament Activity
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
            icon={<Trophy size={21} />}
            title={String(assignments.length)}
            label="Total Assignments"
            description="Tournament assignments"
            iconClass="bg-red-50 text-red-600"
          />

          <SummaryCard
            icon={<CalendarDays size={21} />}
            title={String(upcoming.length)}
            label="Upcoming"
            description="Future assignments"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            title={String(confirmedCount)}
            label="Confirmed"
            description="Assigned / accepted"
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            title={String(pendingCount)}
            label="Pending"
            description="Awaiting confirmation"
            iconClass="bg-amber-50 text-amber-600"
          />
        </div>

        {/* ==================================================
            UPCOMING
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
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
              "
            >
              <CalendarDays size={21} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0b1729]
                "
              >
                Upcoming Tournaments
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Your upcoming officiating assignments
              </p>
            </div>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming tournaments"
              description="You currently have no future tournament assignments."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {upcoming.map((assignment) => (
                <TournamentCard
                  key={assignment.id}
                  assignment={assignment}
                  formatDateRange={formatDateRange}
                  upcoming
                />
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            PAST
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
                bg-slate-50
                text-slate-600
                flex
                items-center
                justify-center
              "
            >
              <Trophy size={21} />
            </div>

            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#0b1729]
                "
              >
                Previous Assignments
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Your previous officiating assignments
              </p>
            </div>
          </div>

          {past.length === 0 ? (
            <EmptyState
              title="No previous assignments"
              description="Your completed tournament assignments will appear here."
            />
          ) : (
            <div className="space-y-4">
              {past.map((assignment) => (
                <TournamentRow
                  key={assignment.id}
                  assignment={assignment}
                  formatDateRange={formatDateRange}
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
   TOURNAMENT CARD
   ========================================================= */

function TournamentCard({
  assignment,
  formatDateRange,
  upcoming,
}: {
  assignment: TournamentAssignment;
  formatDateRange: (
    start: string | null,
    end: string | null
  ) => string;
  upcoming?: boolean;
}) {
  const tournament = assignment.tournament;

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-100
        bg-white
        overflow-hidden
        hover:shadow-md
        transition-all
      "
    >
      {/* Top */}

      <div
        className="
          px-5
          py-4
          bg-slate-50/70
          border-b
          border-slate-100
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-red-50
              text-red-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Trophy size={21} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                font-bold
                text-[#0b1729]
                break-words
              "
            >
              {tournament.name}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Assigned{" "}
              {formatAssignedDate(
                assignment.assignedAt
              )}
            </p>
          </div>
        </div>

        <StatusBadge
          status={assignment.status}
        />
      </div>

      {/* Body */}

      <div className="p-5 space-y-4">
        <InfoLine
          icon={<CalendarDays size={17} />}
          label="Tournament Date"
          value={formatDateRange(
            tournament.startDate,
            tournament.endDate
          )}
        />

        <InfoLine
          icon={<MapPin size={17} />}
          label="Location"
          value={
            tournament.location ||
            "Location not announced"
          }
        />

        <InfoLine
          icon={<UserRound size={17} />}
          label="Assigned Role"
          value={assignment.role || "Referee"}
        />

        <InfoLine
          icon={<ShieldCheck size={17} />}
          label="Tournament Status"
          value={
            tournament.status || "Not specified"
          }
        />

        {tournament.weightClass && (
          <InfoLine
            icon={<Trophy size={17} />}
            label="Weight Class"
            value={tournament.weightClass}
          />
        )}

        {assignment.notes && (
          <div
            className="
              rounded-xl
              bg-blue-50
              border
              border-blue-100
              px-4
              py-3
            "
          >
            <p className="text-xs font-bold text-blue-800">
              Assignment Notes
            </p>

            <p className="mt-1 text-sm leading-5 text-blue-700">
              {assignment.notes}
            </p>
          </div>
        )}

        {upcoming && (
          <div
            className="
              pt-2
              border-t
              border-slate-100
            "
          >
            <p className="text-xs font-semibold text-slate-400">
              Your officiating assignment
            </p>

            <p className="mt-1 text-sm font-bold text-slate-700">
              {assignment.role || "Referee / Judge"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TOURNAMENT ROW
   ========================================================= */

function TournamentRow({
  assignment,
  formatDateRange,
}: {
  assignment: TournamentAssignment;
  formatDateRange: (
    start: string | null,
    end: string | null
  ) => string;
}) {
  const tournament = assignment.tournament;

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/50
        p-4
        sm:p-5
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          gap-4
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
            text-slate-500
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <Trophy size={20} />
        </div>

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
                font-bold
                text-slate-900
                break-words
              "
            >
              {tournament.name}
            </h3>

            <StatusBadge
              status={assignment.status}
            />
          </div>

          <div
            className="
              mt-3
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-3
            "
          >
            <InfoLine
              icon={<CalendarDays size={15} />}
              label="Date"
              value={formatDateRange(
                tournament.startDate,
                tournament.endDate
              )}
            />

            <InfoLine
              icon={<MapPin size={15} />}
              label="Location"
              value={
                tournament.location || "—"
              }
            />

            <InfoLine
              icon={<UserRound size={15} />}
              label="Role"
              value={assignment.role || "Referee"}
            />
          </div>
        </div>
      </div>

      {assignment.notes && (
        <div
          className="
            mt-4
            rounded-xl
            bg-white
            border
            border-slate-100
            px-4
            py-3
          "
        >
          <p className="text-xs font-bold text-slate-500">
            Assignment Notes
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {assignment.notes}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const isConfirmed =
    normalized === "assigned" ||
    normalized === "confirmed" ||
    normalized === "accepted";

  const isPending =
    normalized === "pending";

  const isCancelled =
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected";

  return (
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
        w-fit
        shrink-0
        ${
          isConfirmed
            ? "bg-emerald-50 text-emerald-700"
            : isPending
              ? "bg-amber-50 text-amber-700"
              : isCancelled
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-600"
        }
      `}
    >
      {isConfirmed ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock3 size={13} />
      )}

      {status || "ASSIGNED"}
    </span>
  );
}

/* =========================================================
   INFO LINE
   ========================================================= */

function InfoLine({
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
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
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

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
        <Trophy
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
        {title}
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
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatAssignedDate(
  value: string
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}