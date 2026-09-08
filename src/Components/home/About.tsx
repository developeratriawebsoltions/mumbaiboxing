"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#05070a]"
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Red glow */}
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-red-600/[0.055] blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-red-900/[0.07] blur-[140px]" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.022]"
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

          <div className="max-w-[950px]">

            {/* Section label */}
            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
                About Mumbai Boxing Association
              </p>

            </div>

            {/* Heading */}
            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl xl:text-[68px]">

              THE HEART OF{" "}

              <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.12)]">
                BOXING
              </span>{" "}

              IN MUMBAI

            </h2>

          </div>

          {/* =================================================
              ESTABLISHED BADGE
          ================================================= */}

          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm lg:flex">

            <ShieldCheck
              size={17}
              className="text-red-500"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Established Since 1985
            </span>

          </div>

        </div>

        {/* =====================================================
            INTRO CONTENT
        ===================================================== */}

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">

          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <div>

            <p className="max-w-[850px] text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
              Mumbai Boxing Association is dedicated to strengthening
              grassroots boxing, developing athletes, supporting coaches and
              academies, and creating opportunities for boxers to compete at
              every level.
            </p>

            <p className="mt-5 max-w-[850px] text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              From grassroots development and athlete welfare to transparent
              governance and technical excellence, the Association works to
              build a stronger and more accessible boxing ecosystem across
              Mumbai.
            </p>

            {/* Button */}
            <div className="mt-8">

              <Link
                href="/about"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-red-600
                  px-6
                  py-3.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  !text-white
                  shadow-[0_10px_30px_rgba(220,38,38,0.2)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-red-500
                  hover:shadow-[0_15px_40px_rgba(220,38,38,0.3)]
                "
              >
                Explore About Us

                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </Link>

            </div>

            {/* Small credibility line */}
            <div className="mt-8 flex items-center gap-3">

              <span className="h-px w-8 bg-red-500/50" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                Train · Compete · Belong
              </span>

            </div>

          </div>

          {/* ===================================================
              RIGHT HIGHLIGHTS
          =================================================== */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">

            {/* =================================================
                ATHLETE DEVELOPMENT
            ================================================= */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#090c11]
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.2)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-red-500/20
                hover:bg-[#0b0f15]
              "
            >

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-600/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-500/10">
                  <Users
                    size={20}
                    strokeWidth={1.9}
                  />
                </div>

                <div>

                  <p className="text-sm font-bold text-white">
                    Athlete Development
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Creating pathways from grassroots boxing to higher levels
                    of competition.
                  </p>

                </div>

              </div>

              {/* Bottom accent */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-10" />

            </div>

            {/* =================================================
                TRANSPARENT GOVERNANCE
            ================================================= */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#090c11]
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.2)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-red-500/20
                hover:bg-[#0b0f15]
              "
            >

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-600/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-500/10">
                  <ShieldCheck
                    size={20}
                    strokeWidth={1.9}
                  />
                </div>

                <div>

                  <p className="text-sm font-bold text-white">
                    Transparent Governance
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Promoting fairness, accountability, and professional
                    sporting administration.
                  </p>

                </div>

              </div>

              {/* Bottom accent */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-10" />

            </div>

            {/* =================================================
                SPORTING EXCELLENCE
            ================================================= */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#090c11]
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.2)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-red-500/20
                hover:bg-[#0b0f15]
              "
            >

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-600/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-500/10">
                  <Award
                    size={20}
                    strokeWidth={1.9}
                  />
                </div>

                <div>

                  <p className="text-sm font-bold text-white">
                    Sporting Excellence
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Supporting athletes, coaches, officials, and boxing
                    communities.
                  </p>

                </div>

              </div>

              {/* Bottom accent */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-300 group-hover:w-10" />

            </div>

          </div>
        </div>

        {/* =====================================================
            BOTTOM DIVIDER
        ===================================================== */}

        <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">

          <span className="h-px w-16 bg-white/10" />

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
            The Heart of Boxing in Mumbai
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="h-px w-16 bg-white/10" />

        </div>

      </div>
    </section>
  );
}