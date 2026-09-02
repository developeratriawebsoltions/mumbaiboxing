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

export default function Hero() {
  const [time, setTime] = useState({
    d: 2,
    h: 18,
    m: 45,
    s: 33,
  });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;

        s--;

        if (s < 0) {
          s = 59;
          m--;
        }

        if (m < 0) {
          m = 59;
          h--;
        }

        if (h < 0) {
          h = 23;
          d--;
        }

        if (d < 0) {
          d = 0;
          h = 0;
          m = 0;
          s = 0;
        }

        return { d, h, m, s };
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const countdown = [
    {
      value: pad(time.d),
      label: "DAYS",
    },
    {
      value: pad(time.h),
      label: "HRS",
    },
    {
      value: pad(time.m),
      label: "MIN",
    },
    {
      value: pad(time.s),
      label: "SEC",
    },
  ];

  return (
    <section className="w-full bg-[#f7f8fa] px-3 pb-8 pt-4 sm:px-5 sm:pb-10 sm:pt-5 lg:px-6 lg:pb-10 lg:pt-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* =====================================================
            MAIN HERO
        ===================================================== */}
        <div className="relative w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:rounded-[28px]">

          <div
            className="
              grid
              min-h-[620px]
              lg:min-h-[calc(100svh-155px)]
              lg:max-h-[780px]
              grid-cols-1
              lg:grid-cols-[0.95fr_1.05fr]
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}
            <div className="relative z-10 flex items-center px-6 py-12 sm:px-9 sm:py-14 md:px-10 lg:px-10 xl:px-14 2xl:px-16">

              <div className="w-full max-w-[700px]">

                {/* Label */}
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-red-100 bg-red-50 px-3.5 py-2 sm:mb-7 sm:px-4">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-700 sm:text-[10px] sm:tracking-[0.2em]">
                    Mumbai Boxing Association
                  </span>

                  <span className="hidden h-4 w-px bg-red-200 sm:block" />

                  <span className="hidden text-[9px] font-semibold tracking-widest text-slate-500 sm:block">
                    EST. 1985
                  </span>
                </div>

                {/* Heading */}
                <h1
                  className="
                    font-black
                    leading-[0.9]
                    tracking-[-0.055em]
                    text-slate-950
                    text-[clamp(3.25rem,5.2vw,6rem)]
                  "
                >
                  WHERE
                  <br />

                  <span className="text-red-600">
                    CHAMPIONS
                  </span>

                  <br />

                  ARE BUILT.
                </h1>

                {/* Description */}
                <p className="mt-6 max-w-[580px] text-sm leading-6 text-slate-500 sm:mt-7 sm:text-base sm:leading-7">
                  Mumbai Boxing Association is dedicated to developing
                  boxers, promoting the sport, and building a stronger
                  boxing community.
                </p>

                {/* Buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">

                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold !text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl sm:px-7"
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
                    className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold !text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:px-7"
                  >
                    VIEW TOURNAMENTS

                    <Trophy
                      size={17}
                      strokeWidth={2}
                      className="text-red-600"
                    />
                  </Link>
                </div>

                {/* Bottom information */}
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-400 sm:mt-11 sm:gap-x-7">

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={15}
                      className="shrink-0 text-red-600"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">
                      Official Boxing Body
                    </span>
                  </div>

                  <div className="hidden h-4 w-px bg-slate-200 sm:block" />

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={15}
                      className="shrink-0 text-red-600"
                    />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">
                      Mumbai, India
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT IMAGE
            ================================================= */}
            <div className="relative min-h-[430px] overflow-hidden bg-slate-100 lg:min-h-0">

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/hero.png')",
                }}
              />

              {/* Light image treatment */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-black/10" />

              {/* Left fade */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/50 to-transparent" />

              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Image label */}
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3.5 py-2 backdrop-blur-md sm:left-6 sm:top-6 sm:px-4">
                <span className="h-2 w-2 rounded-full bg-red-500" />

                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white sm:text-[9px] sm:tracking-[0.18em]">
                  Mumbai Boxing
                </span>
              </div>

              {/* =================================================
                  LIVE TOURNAMENT CARD
              ================================================= */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-20
                  w-[min(86%,320px)]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-2xl
                  border
                  border-white/50
                  bg-white/95
                  p-5
                  shadow-[0_20px_50px_rgba(15,23,42,0.22)]
                  backdrop-blur-xl
                  lg:left-auto
                  lg:right-[5%]
                  lg:w-[min(38%,340px)]
                  lg:translate-x-0
                  xl:right-[6%]
                "
              >

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-600 sm:text-[10px] sm:tracking-[0.18em]">
                      Live Tournament
                    </span>
                  </div>

                  <Trophy
                    size={18}
                    className="text-slate-400"
                  />
                </div>

                {/* Tournament */}
                <h2 className="text-[17px] font-bold leading-6 text-slate-950 sm:text-lg">
                  Mumbai Boxing
                  <br />
                  Championship 2025
                </h2>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Clock3 size={14} />
                  <span>Semi Final</span>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-slate-200" />

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-2">
                  {countdown.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-slate-100 px-1.5 py-3 text-center sm:px-2"
                    >
                      <div className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                        {item.value}
                      </div>

                      <div className="mt-1 text-[7px] font-semibold tracking-[0.13em] text-slate-400 sm:text-[8px] sm:tracking-[0.15em]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Event CTA */}
                <Link
                  href="/events"
                  className="group mt-5 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold !text-white transition-all duration-200 hover:bg-red-600"
                >
                  <span>VIEW EVENT DETAILS</span>

                  <ArrowRight
                    size={15}
                    className="!text-white transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SCROLL INDICATOR
        ===================================================== */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 sm:mt-5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.22em] sm:text-[9px] sm:tracking-[0.25em]">
            Scroll to explore
          </span>

          <ChevronDown
            size={14}
            className="animate-bounce text-red-600"
          />
        </div>
      </div>
    </section>
  );
}