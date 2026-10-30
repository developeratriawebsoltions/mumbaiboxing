
"use client";

import Link from "next/link";
import { tournamentUrl } from "@/lib/tournament-url";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Trophy,
  LoaderCircle,
} from "lucide-react";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  isFeatured: boolean;
};

function dateText(value: string | null) {
  if (!value) return "To be announced";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "To be announced";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dateRange(tournament: Tournament) {
  const start = dateText(tournament.startDate);
  const end = tournament.endDate ? dateText(tournament.endDate) : "";

  return end && start !== end ? `${start} – ${end}` : start;
}

function tournamentLabel(tournament: Tournament) {
  if (tournament.isFeatured) return "Featured Tournament";
  if (tournament.status === "ongoing") return "Current Tournament";
  if (tournament.status === "open") return "Registration Open";

  const startDate = tournament.startDate
    ? new Date(tournament.startDate)
    : null;

  if (
    startDate &&
    !Number.isNaN(startDate.getTime()) &&
    startDate >= new Date()
  ) {
    return "Upcoming Tournament";
  }

  return "Tournament Information";
}

export default function Hero() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTournament = useCallback(async (): Promise<Tournament | null> => {
    const response = await fetch("/api/public/upcoming-tournament", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to load tournament");
    }

    const data: {
      success: boolean;
      tournament: Tournament | null;
    } = await response.json();

    if (!data.success) {
      throw new Error("Invalid response");
    }

    return data.tournament;
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchTournament()
      .then((data) => {
        if (!cancelled) {
          setTournament(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTournament(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchTournament]);

  async function retryTournamentLoad() {
    setLoading(true);
    setError(false);

    try {
      setTournament(await fetchTournament());
    } catch {
      setTournament(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mba-hero relative isolate w-full overflow-hidden">
      {/* Main background artwork */}
      <div
        aria-hidden="true"
        className="mba-hero-art absolute inset-0 -z-30"
      />

      {/* Contrast overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-r from-white/20 via-white/0 to-transparent"
      />

      <div
        aria-hidden="true"
        className="mba-hero-shade absolute inset-0 -z-10"
      />

      {/* Decorative diagonal red brush strokes */}
      <div
        aria-hidden="true"
        className="mba-red-streak mba-red-streak-one"
      />
      <div
        aria-hidden="true"
        className="mba-red-streak mba-red-streak-two"
      />

      <div className="mba-hero-inner relative mx-auto grid w-full max-w-[1900px] grid-cols-1 items-start gap-8 px-5 pb-12 pt-9 sm:px-8 md:min-h-[calc(100svh-80px)] md:px-8 md:pb-9 md:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 xl:px-10 xl:pt-12 2xl:px-10">
        {/* LEFT CONTENT */}
        <div className="mba-hero-copy relative z-10 w-full mt-12 max-w-[650px]">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#101820] sm:text-[13px]">
            <span className="mr-1 h-[3px] w-7 bg-[#f50919]" />
            North Bombay District Amateur Boxing Association (NBDABA)

            <span className="border-l border-slate-400 pl-2 text-slate-500">
              EST. 1985
            </span>
          </div>

          <h1 className="mba-heading text-[clamp(48px,7vw,76px)] font-black uppercase leading-[0.88] tracking-[-0.065em] text-[#071016]">
            WHERE
            <br />
            <span className="text-[#f50919]">CHAMPIONS</span>
            <br />
            ARE BUILT<span className="text-[#f50919]">.</span>
          </h1>

          <p className="mt-5 max-w-[520px] text-[14px] font-medium leading-[1.7] text-[#253140] sm:text-[15px] lg:text-[16px]">
            North Bombay District Amateur Boxing Association (NBDABA) is dedicated to developing boxers,
            promoting the sport, and building a stronger boxing community
            across Mumbai.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-full bg-[#f50919] px-6 py-3 text-[11px] font-extrabold text-white shadow-lg shadow-red-600/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#c90010] sm:text-[12px]"
            >
              JOIN THE ASSOCIATION
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/events"
              className="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-full border border-[#aeb9c6] bg-white/85 px-6 py-3 text-[11px] font-extrabold text-[#101820] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-500 sm:text-[12px]"
            >
              VIEW TOURNAMENTS
              <Trophy size={17} className="text-[#f50919]" />
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-[12px] font-extrabold uppercase tracking-[0.11em] text-slate-700 sm:text-[13px]">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#f50919]" />
              Official Boxing Body
            </span>

            <span className="hidden h-4 w-px bg-slate-400 sm:block" />

            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-[#f50919]" />
              Mumbai, India
            </span>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="mba-hero-right relative z-10 flex w-full flex-col items-end justify-center">
          <div className="mba-motivation mb-7 mr-3 hidden rotate-[-8deg] self-end font-serif text-[22px] italic leading-[1.05] text-white drop-shadow-lg lg:block">
            Discipline
            <br />
            Dedication
            <br />
            Determination

            <div className="mt-2 h-[2px] w-full bg-[#f50919]" />
          </div>

          {/* Tournament card */}
          <div className="mba-tournament-card mt-2 w-full max-w-[390px] rounded-[20px] border border-white/20 bg-[#080e14]/95 p-5 text-white shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-md sm:mt-10 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff1728] shadow-[0_0_12px_#ff1728]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {tournament
                    ? tournamentLabel(tournament)
                    : "Tournament Information"}
                </span>
              </div>

              <Trophy size={19} className="shrink-0 text-[#ff1728]" />
            </div>

            {loading ? (
              <div
                className="space-y-4 py-2"
                role="status"
                aria-label="Loading tournament"
              >
                <LoaderCircle
                  size={25}
                  className="animate-spin text-red-500"
                />
                <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-12 animate-pulse rounded-full bg-white/10" />
              </div>
            ) : tournament ? (
              <>
                <h2 className="text-[19px] font-black leading-tight tracking-tight text-white">
                  {tournament.name}
                </h2>

                <div className="mt-4 space-y-3 text-[13px] text-slate-200 sm:text-[14px]">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 shrink-0 text-[#ff1728]"
                    />
                    <span>{dateRange(tournament)}</span>
                  </div>

                  {tournament.location && (
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-[#ff1728]"
                      />
                      <span>{tournament.location}</span>
                    </div>
                  )}

                  {tournament.weightClass && (
                    <div className="flex items-start gap-3">
                      <Trophy
                        size={18}
                        className="mt-0.5 shrink-0 text-[#ff1728]"
                      />
                      <span>{tournament.weightClass}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={tournamentUrl(tournament)}
                  className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#f50919] px-5 py-3 text-[13px] font-extrabold text-white transition duration-200 hover:bg-red-700"
                >
                  REGISTER NOW
                  <ArrowRight size={18} />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">
                  {error
                    ? "Tournament information unavailable"
                    : "No upcoming tournament announced"}
                </h2>

                <p className="mt-3 text-xs leading-5 text-slate-300">
                  {error
                    ? "Please try loading the event again."
                    : "New tournament details will appear here when announced."}
                </p>

                {error ? (
                  <button
                    type="button"
                    onClick={retryTournamentLoad}
                    className="mt-5 w-full rounded-full bg-red-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    TRY AGAIN
                  </button>
                ) : (
                  <Link
                    href="/events"
                    className="mt-5 flex min-h-[48px] items-center justify-center rounded-full bg-red-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    VIEW ALL EVENTS
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
