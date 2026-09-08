"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Trophy,
} from "lucide-react";

type FeaturedTournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
};

type TournamentResponse = {
  success: boolean;
  tournament: FeaturedTournament | null;
};

type Countdown = {
  d: number;
  h: number;
  m: number;
  s: number;
};

const EMPTY_COUNTDOWN: Countdown = {
  d: 0,
  h: 0,
  m: 0,
  s: 0,
};

export default function Hero() {
  const [tournament, setTournament] =
    useState<FeaturedTournament | null>(null);

  const [loadingTournament, setLoadingTournament] =
    useState(true);

  const [countdown, setCountdown] =
    useState<Countdown>(EMPTY_COUNTDOWN);

  const [hasStarted, setHasStarted] = useState(false);

  /*
   * ============================================================
   * LOAD FEATURED HOMEPAGE TOURNAMENT
   * ============================================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedTournament() {
      try {
        const res = await fetch(
          "/api/public/upcoming-tournament",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load featured tournament"
          );
        }

        const data: TournamentResponse =
          await res.json();

        if (!cancelled) {
          setTournament(data.tournament ?? null);
        }
      } catch (error) {
        console.error(
          "Hero tournament loading error:",
          error
        );

        if (!cancelled) {
          setTournament(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingTournament(false);
        }
      }
    }

    loadFeaturedTournament();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * LIVE COUNTDOWN
   * ============================================================
   */
  useEffect(() => {
    if (!tournament?.startDate) {
      setCountdown(EMPTY_COUNTDOWN);
      setHasStarted(false);
      return;
    }

    const targetTime = new Date(
      tournament.startDate
    ).getTime();

    if (Number.isNaN(targetTime)) {
      setCountdown(EMPTY_COUNTDOWN);
      setHasStarted(false);
      return;
    }

    function updateCountdown() {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdown(EMPTY_COUNTDOWN);
        setHasStarted(true);
        return;
      }

      setHasStarted(false);

      const totalSeconds = Math.floor(
        difference / 1000
      );

      const days = Math.floor(
        totalSeconds / (24 * 60 * 60)
      );

      const hours = Math.floor(
        (totalSeconds % (24 * 60 * 60)) /
          (60 * 60)
      );

      const minutes = Math.floor(
        (totalSeconds % (60 * 60)) / 60
      );

      const seconds = totalSeconds % 60;

      setCountdown({
        d: days,
        h: hours,
        m: minutes,
        s: seconds,
      });
    }

    updateCountdown();

    const timer = setInterval(
      updateCountdown,
      1000
    );

    return () => clearInterval(timer);
  }, [tournament]);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */
  const pad = (number: number) =>
    String(number).padStart(2, "0");

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Date to be announced";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date to be announced";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatStatus = (
    status: string | undefined
  ) => {
    if (!status) return "Upcoming";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const countdownItems = [
    {
      value: pad(countdown.d),
      label: "DAYS",
    },
    {
      value: pad(countdown.h),
      label: "HRS",
    },
    {
      value: pad(countdown.m),
      label: "MIN",
    },
    {
      value: pad(countdown.s),
      label: "SEC",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#05070a] px-3 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-5 lg:px-6 lg:pb-10 lg:pt-6 xl:px-8">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-red-900/10 blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px]">

        {/* =====================================================
            MAIN HERO
        ===================================================== */}
        <div className="relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#080b10] shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:rounded-[28px]">

          {/* Subtle red top glow */}
          <div className="pointer-events-none absolute left-1/4 top-0 z-30 h-px w-1/2 bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

          <div
            className="
              grid
              min-h-[680px]
              lg:min-h-[calc(100svh-155px)]
              lg:max-h-[820px]
              grid-cols-1
              lg:grid-cols-[0.92fr_1.08fr]
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}
            <div className="relative z-10 flex items-center px-6 py-12 sm:px-9 sm:py-14 md:px-10 lg:px-10 xl:px-14 2xl:px-16">

              {/* Dark gradient behind text */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#080b10] via-[#080b10]/95 to-transparent" />

              <div className="relative w-full max-w-[700px]">

                {/* Association label */}
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2 shadow-[0_0_30px_rgba(239,68,68,0.05)] sm:mb-7 sm:px-4">

                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-400 sm:text-[10px] sm:tracking-[0.2em]">
                    Mumbai Boxing Association
                  </span>

                  <span className="hidden h-4 w-px bg-red-500/20 sm:block" />

                  <span className="hidden text-[9px] font-semibold tracking-widest text-slate-500 sm:block">
                    EST. 1985
                  </span>
                </div>

                {/* Main heading */}
                <h1
                  className="
                    font-black
                    leading-[0.86]
                    tracking-[-0.06em]
                    text-white
                    text-[clamp(3.2rem,5.3vw,6rem)]
                  "
                >
                  WHERE
                  <br />

                  <span className="text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.18)]">
                    CHAMPIONS
                  </span>

                  <br />

                  ARE BUILT
                  <span className="text-red-500">.</span>
                </h1>

                {/* Description */}
                <p className="mt-7 max-w-[580px] text-sm leading-6 text-slate-400 sm:mt-8 sm:text-base sm:leading-7">
                  Mumbai Boxing Association is dedicated
                  to developing boxers, promoting the sport,
                  and building a stronger boxing community.
                </p>

                {/* Buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">

                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold !text-white shadow-[0_10px_35px_rgba(220,38,38,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_15px_45px_rgba(220,38,38,0.35)] sm:px-7"
                  >
                    JOIN THE ASSOCIATION

                    <ArrowRight
                      size={17}
                      strokeWidth={2.5}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/events"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-bold !text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] sm:px-7"
                  >
                    VIEW TOURNAMENTS

                    <Trophy
                      size={17}
                      strokeWidth={2}
                      className="text-red-500 transition-transform duration-200 group-hover:scale-110"
                    />
                  </Link>
                </div>

                {/* Bottom information */}
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500 sm:mt-11 sm:gap-x-7">

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={15}
                      className="shrink-0 text-red-500"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px] sm:tracking-[0.16em]">
                      Official Boxing Body
                    </span>
                  </div>

                  <div className="hidden h-4 w-px bg-white/10 sm:block" />

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={15}
                      className="shrink-0 text-red-500"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[10px] sm:tracking-[0.16em]">
                      Mumbai, India
                    </span>
                  </div>

                </div>

                {/* Hero statistics */}
                <div className="mt-9 grid max-w-[570px] grid-cols-3 border-t border-white/10 pt-6 sm:mt-11">

                  <div className="pr-4">
                    <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      500<span className="text-red-500">+</span>
                    </p>

                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                      Registered Boxers
                    </p>
                  </div>

                  <div className="border-l border-white/10 px-4">
                    <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      50<span className="text-red-500">+</span>
                    </p>

                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                      Affiliated Academies
                    </p>
                  </div>

                  <div className="border-l border-white/10 pl-4">
                    <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      25<span className="text-red-500">+</span>
                    </p>

                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:text-[9px]">
                      Years of Excellence
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT IMAGE
            ================================================= */}
            <div className="relative min-h-[500px] overflow-hidden bg-black lg:min-h-0">

              {/* Background Image */}
              <div
                className="absolute inset-0 scale-[1.02] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/hero.png')",
                }}
              />

              {/* Dark cinematic overlay */}
              <div className="absolute inset-0 bg-black/25" />

              {/* Left fade into dark content */}
              <div className="absolute inset-y-0 left-0 z-10 w-2/5 bg-gradient-to-r from-[#080b10] via-[#080b10]/80 to-transparent" />

              {/* Top dark fade */}
              <div className="absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/65 to-transparent" />

              {/* Bottom dark fade */}
              <div className="absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/75 to-transparent" />

              {/* Red atmospheric glow */}
              <div className="pointer-events-none absolute left-[20%] top-[15%] z-10 h-48 w-48 rounded-full bg-red-600/15 blur-[100px]" />

              {/* Right atmospheric glow */}
              <div className="pointer-events-none absolute bottom-[10%] right-[5%] z-10 h-64 w-64 rounded-full bg-red-600/10 blur-[120px]" />

              {/* Image label */}
              <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-2 shadow-lg backdrop-blur-xl sm:left-6 sm:top-6 sm:px-4">

                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white sm:text-[9px] sm:tracking-[0.18em]">
                  Mumbai Boxing
                </span>
              </div>

              {/* Top right slogan */}
              <div className="absolute right-6 top-6 z-20 hidden text-right lg:block">
                <p className="text-[8px] font-semibold uppercase tracking-[0.35em] text-white/50">
                  Train
                </p>

                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.35em] text-white/50">
                  Compete
                </p>

                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.35em] text-white/50">
                  Belong
                </p>

                <div className="ml-auto mt-2 h-10 w-px bg-red-500" />
              </div>

              {/* =================================================
                  TOURNAMENT CARD
              ================================================= */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-30
                  w-[min(88%,350px)]
                  -translate-x-1/2
                  -translate-y-1/2
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/15
                  bg-[#090c11]/90
                  p-5
                  shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                  backdrop-blur-2xl
                  lg:left-auto
                  lg:right-[5%]
                  lg:w-[min(39%,350px)]
                  lg:translate-x-0
                  xl:right-[6%]
                "
              >

                {/* Red card glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-red-500/30 via-transparent to-transparent opacity-70" />

                {/* Card content */}
                <div className="relative">

                  {/* Header */}
                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-400 sm:text-[10px] sm:tracking-[0.18em]">
                        {loadingTournament
                          ? "Loading Tournament"
                          : tournament
                          ? "Upcoming Tournament"
                          : "Tournament Update"}
                      </span>
                    </div>

                    <Trophy
                      size={18}
                      className="text-white/50"
                    />
                  </div>

                  {/* Loading */}
                  {loadingTournament ? (
                    <>
                      <div className="space-y-2">
                        <div className="h-5 w-4/5 animate-pulse rounded bg-white/10" />

                        <div className="h-5 w-3/5 animate-pulse rounded bg-white/10" />
                      </div>

                      <div className="mt-5 h-px bg-white/10" />

                      <div className="mt-5 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(
                          (item) => (
                            <div
                              key={item}
                              className="h-16 animate-pulse rounded-xl bg-white/[0.06]"
                            />
                          )
                        )}
                      </div>
                    </>
                  ) : tournament ? (
                    <>
                      {/* Tournament name */}
                      <h2 className="max-w-[290px] text-[17px] font-bold leading-6 text-white sm:text-lg">
                        {tournament.name}
                      </h2>

                      {/* Date */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Clock3
                          size={14}
                          className="shrink-0 text-red-500"
                        />

                        <span>
                          {formatDate(
                            tournament.startDate
                          )}
                        </span>
                      </div>

                      {/* Location */}
                      {tournament.location && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <MapPin
                            size={14}
                            className="shrink-0 text-red-500"
                          />

                          <span className="truncate">
                            {tournament.location}
                          </span>
                        </div>
                      )}

                      {/* Status + Weight */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
                          {formatStatus(
                            tournament.status
                          )}
                        </span>

                        {tournament.weightClass && (
                          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-slate-400">
                            {tournament.weightClass}
                          </span>
                        )}

                      </div>

                      {/* Divider */}
                      <div className="my-5 h-px bg-white/10" />

                      {/* Countdown */}
                      {hasStarted ? (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-4 text-center">
                          <p className="text-sm font-bold text-red-400">
                            Tournament has started
                          </p>

                          <p className="mt-1 text-[10px] text-red-300/60">
                            Please check the event page for
                            current tournament information.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {countdownItems.map(
                            (item) => (
                              <div
                                key={item.label}
                                className="rounded-xl border border-white/10 bg-white/[0.055] px-1.5 py-3 text-center shadow-inner sm:px-2"
                              >
                                <div className="text-lg font-black tracking-tight text-white sm:text-xl">
                                  {item.value}
                                </div>

                                <div className="mt-1 text-[7px] font-semibold tracking-[0.13em] text-slate-500 sm:text-[8px] sm:tracking-[0.15em]">
                                  {item.label}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Event CTA */}
                      <Link
                        href="/events"
                        className="group mt-5 flex items-center justify-between rounded-xl bg-red-600 px-4 py-3 text-xs font-bold !text-white shadow-[0_8px_25px_rgba(220,38,38,0.22)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_10px_35px_rgba(220,38,38,0.32)]"
                      >
                        <span>
                          VIEW EVENT DETAILS
                        </span>

                        <ArrowRight
                          size={15}
                          className="!text-white transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* No featured tournament */}
                      <h2 className="text-[17px] font-bold leading-6 text-white sm:text-lg">
                        No Upcoming Tournament
                      </h2>

                      <p className="mt-3 text-xs leading-5 text-slate-400">
                        Upcoming tournament information will
                        appear here when announced by the
                        Mumbai Boxing Association.
                      </p>

                      <div className="my-5 h-px bg-white/10" />

                      <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center">
                        <Trophy
                          size={24}
                          className="mx-auto text-slate-500"
                        />

                        <p className="mt-2 text-xs font-semibold text-slate-400">
                          Stay tuned for the next event
                        </p>
                      </div>

                      <Link
                        href="/events"
                        className="group mt-5 flex items-center justify-between rounded-xl bg-red-600 px-4 py-3 text-xs font-bold !text-white transition-all duration-200 hover:bg-red-500"
                      >
                        <span>
                          VIEW ALL TOURNAMENTS
                        </span>

                        <ArrowRight
                          size={15}
                          className="!text-white transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </>
                  )}

                </div>
              </div>

              {/* Bottom image detail */}
              <div className="absolute bottom-5 left-5 z-20 hidden items-center gap-3 lg:flex">
                <div className="h-8 w-px bg-red-500" />

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/60">
                    Mumbai
                  </p>

                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    Boxing Association
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =====================================================
            SCROLL INDICATOR
        ===================================================== */}
        <div className="mt-5 flex items-center justify-center gap-3 text-slate-500 sm:mt-6">

          <div className="hidden h-px w-10 bg-white/10 sm:block" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:text-[9px]">
            Scroll to explore
          </span>

          <ChevronDown
            size={14}
            className="animate-bounce text-red-500"
          />

          <div className="hidden h-px w-10 bg-white/10 sm:block" />

        </div>

      </div>
    </section>
  );
}