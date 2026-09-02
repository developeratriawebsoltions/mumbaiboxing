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
          "border-emerald-100 bg-emerald-50",
        text: "text-emerald-600",
        dot: "bg-emerald-500",
      };
    }

    if (status === "ongoing") {
      return {
        wrapper:
          "border-red-100 bg-red-50",
        text: "text-[#DC2626]",
        dot: "bg-[#DC2626]",
      };
    }

    return {
      wrapper:
        "border-slate-200 bg-slate-50",
      text: "text-slate-500",
      dot: "bg-slate-400",
    };
  };

  if (tournaments.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      className="overflow-hidden bg-[#f7f8fa]"
    >
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#DC2626]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#DC2626]">
                Events
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
              UPCOMING
              <br />
              <span className="text-[#DC2626]">
                TOURNAMENTS
              </span>
            </h2>
          </div>

          <Link
            href="/events"
            className="group flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:text-[#DC2626]"
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
            const styles = statusStyles(tournament.status);

            return (
              <div
                key={tournament.id}
                className="group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              >

                {/* =================================================
                    CARD TOP
                ================================================= */}
                <div className="relative overflow-hidden px-6 pb-5 pt-6">

                  {/* Decorative background */}
                  <div className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full bg-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
                      {statusLabel(tournament.status)}
                    </span>
                  </div>

                  {/* Tournament name */}
                  <h3 className="relative mt-5 min-h-[58px] text-lg font-black leading-6 tracking-tight text-slate-950">
                    {tournament.name}
                  </h3>

                </div>

                {/* =================================================
                    DETAILS
                ================================================= */}
                <div className="border-t border-slate-100 px-6 py-5">

                  <div className="space-y-3">

                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                        <CalendarDays
                          size={15}
                          strokeWidth={1.8}
                          className="text-[#DC2626]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Date
                        </p>

                        <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-700">
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
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                          <MapPin
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#DC2626]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Location
                          </p>

                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-700">
                            {tournament.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Weight */}
                    {tournament.weightClass && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                          <Users
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#DC2626]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Category
                          </p>

                          <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-700">
                            {tournament.weightClass}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Entry Fee */}
                    {tournament.entryFee != null && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                          <IndianRupee
                            size={15}
                            strokeWidth={1.8}
                            className="text-[#DC2626]"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Entry Fee
                          </p>

                          <p className="mt-0.5 text-xs font-bold text-slate-900">
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
                <div className="mt-auto border-t border-slate-100 px-6 py-5">

                  <Link
                    href={
                      open
                        ? "/register"
                        : "/events"
                    }
                    className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.13em] transition-all duration-200 ${
                      open
                        ? "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:shadow-lg hover:shadow-red-900/10"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#DC2626] transition-all duration-300 group-hover:w-full" />

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}