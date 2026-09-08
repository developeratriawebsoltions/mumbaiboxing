"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
};

export default function UpcomingTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setTournaments(
            d
              .filter((t) => t.status !== "completed")
              .slice(0, 3)
          );
        }
      })
      .catch(() => {});
  }, []);

  const formatDate = (
    start: string | null,
    end: string | null
  ) => {
    if (!start) return "Date TBD";

    const s = new Date(start).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    if (!end) return s;

    const e = new Date(end).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    return `${s} – ${e}`;
  };

  const isOpen = (status: string) =>
    status === "open";

  const statusLabel = (status: string) => {
    if (status === "open") return "Registration Open";
    if (status === "ongoing") return "Ongoing";
    return "Upcoming";
  };

  const statusStyles = (status: string) => {
    if (status === "open") {
      return {
        wrapper:
          "border-emerald-500/20 bg-emerald-500/[0.07]",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      };
    }

    if (status === "ongoing") {
      return {
        wrapper:
          "border-red-500/20 bg-red-500/[0.07]",
        text: "text-red-400",
        dot: "bg-red-500",
      };
    }

    return {
      wrapper:
        "border-white/10 bg-white/[0.03]",
      text: "text-slate-500",
      dot: "bg-slate-600",
    };
  };

  if (tournaments.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      className="relative w-full overflow-hidden bg-[#05070a]"
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Red ambient glow */}
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-red-600/[0.045] blur-[150px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-red-900/[0.06] blur-[150px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mb-14">

          <div>

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                Events
              </p>

            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">

              UPCOMING
              <br />

              <span className="text-red-500">
                TOURNAMENTS
              </span>

            </h2>

          </div>

          {/* View all */}

          <Link
            href="/events"
            className="
              group
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              px-5
              py-3
              text-[11px]
              font-bold
              uppercase
              tracking-[0.12em]
              !text-slate-400
              backdrop-blur-sm
              transition-all
              duration-200
              hover:border-red-500/30
              hover:bg-red-500/[0.06]
              hover:!text-red-400
            "
          >
            View All Events

            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

        </div>

        {/* =====================================================
            TOURNAMENT GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {tournaments.map((tournament) => {

            const open = isOpen(tournament.status);
            const styles = statusStyles(
              tournament.status
            );

            return (
              <div
                key={tournament.id}
                className="
                  group
                  relative
                  flex
                  flex-col
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-white/10
                  bg-[#090c11]
                  shadow-[0_20px_60px_rgba(0,0,0,0.28)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-red-500/20
                  hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]
                "
              >

                {/* =================================================
                    TOP RED ACCENT
                ================================================= */}

                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                {/* =================================================
                    CARD TOP
                ================================================= */}

                <div className="relative overflow-hidden px-6 pb-5 pt-6">

                  {/* Decorative glow */}

                  <div className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-red-600/[0.08] blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Status */}

                  <div
                    className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${styles.wrapper}`}
                  >

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${
                        open ? "animate-pulse" : ""
                      }`}
                    />

                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.12em] ${styles.text}`}
                    >
                      {statusLabel(
                        tournament.status
                      )}
                    </span>

                  </div>

                  {/* Tournament name */}

                  <h3 className="relative mt-5 min-h-[58px] text-lg font-black leading-6 tracking-tight text-white">
                    {tournament.name}
                  </h3>

                </div>

                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="border-t border-white/[0.06] px-6 py-5">

                  <div className="space-y-3">

                    {/* Date */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.06]">

                        <CalendarDays
                          size={15}
                          strokeWidth={1.8}
                          className="text-red-500"
                        />

                      </div>

                      <div className="min-w-0">

                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Date
                        </p>

                        <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-300">
                          {formatDate(
                            tournament.startDate,
                            tournament.endDate
                          )}
                        </p>

                      </div>

                    </div>

                    {/* Location */}

                    {tournament.location && (
                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.06]">

                          <MapPin
                            size={15}
                            strokeWidth={1.8}
                            className="text-red-500"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            Location
                          </p>

                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-300">
                            {tournament.location}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* Weight / Category */}

                    {tournament.weightClass && (
                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.06]">

                          <Users
                            size={15}
                            strokeWidth={1.8}
                            className="text-red-500"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            Category
                          </p>

                          <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-300">
                            {tournament.weightClass}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* Entry Fee */}

                    {tournament.entryFee != null && (
                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/[0.06]">

                          <IndianRupee
                            size={15}
                            strokeWidth={1.8}
                            className="text-red-500"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            Entry Fee
                          </p>

                          <p className="mt-0.5 text-xs font-bold text-white">
                            ₹{tournament.entryFee}
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* =================================================
                    CTA
                ================================================= */}

                <div className="mt-auto border-t border-white/[0.06] px-6 py-5">

                  <Link
                    href={
                      open
                        ? "/register"
                        : "/events"
                    }
                    className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.13em] transition-all duration-200 ${
                      open
                        ? "bg-red-600 !text-white shadow-[0_8px_25px_rgba(220,38,38,0.18)] hover:bg-red-500 hover:shadow-[0_10px_30px_rgba(220,38,38,0.28)]"
                        : "border border-white/10 bg-white/[0.04] !text-slate-400 hover:bg-white/[0.07] hover:!text-white"
                    }`}
                  >

                    {open
                      ? "Register Now"
                      : "View Details"}

                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-200 group-hover/btn:translate-x-1"
                    />

                  </Link>

                </div>

                {/* Bottom accent */}

                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />

              </div>
            );
          })}

        </div>

        {/* =====================================================
            BOTTOM DECORATION
        ===================================================== */}

        <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">

          <span className="h-px w-16 bg-white/[0.07]" />

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
            Fight · Compete · Rise
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="h-px w-16 bg-white/[0.07]" />

        </div>

      </div>
    </section>
  );
}