"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";

const milestones = [
  {
    year: "1985",
    title: "Founded",
    desc: "Mumbai Boxing Association established.",
  },
  {
    year: "2000",
    title: "City-Wide Reach",
    desc: "Expansion of academies across all districts.",
  },
  {
    year: "2015",
    title: "National Stage",
    desc: "Consistent national-level tournament wins.",
  },
  {
    year: "2026",
    title: "Digital Era",
    desc: "Complete digital management platform.",
    active: true,
  },
];

const highlights = [
  "Building Champions",
  "Promoting Fitness",
  "Creating Opportunities",
  "Stronger Communities",
];

export default function About() {
  return (
    <section
      id="about"
      className="w-full overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

        {/* =====================================================
            TOP INTRO
        ===================================================== */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[1fr_auto] lg:items-end">

          <div>
            {/* Section Label */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                About Us
              </p>
            </div>

            {/* Heading */}
            <h2 className="max-w-[850px] text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[68px]">
              THE HEART OF{" "}
              <span className="text-red-600">
                BOXING
              </span>{" "}
              IN MUMBAI
            </h2>
          </div>

          {/* Established Badge */}
          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 lg:flex">
            <ShieldCheck
              size={17}
              className="text-red-600"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Established Since 1985
            </span>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">

          {/* ===================================================
              LEFT — MISSION
          =================================================== */}
          <div className="flex flex-col justify-center">

            <p className="max-w-[650px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
              For nearly four decades, the Mumbai Boxing Association
              has been the cornerstone of combat sports in Maharashtra —
              shaping lives through discipline, determination, and the
              relentless spirit of boxing.
            </p>

            {/* Highlights */}
            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-red-100 hover:bg-red-50/40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 transition-colors group-hover:bg-red-100">
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="text-red-600"
                    />
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-9">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] !text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-lg"
              >
                Learn More

                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Supporting Features */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8 sm:gap-6">

              {/* Discipline */}
              <div>
                <Target
                  size={20}
                  strokeWidth={1.8}
                  className="mb-3 text-red-600"
                />

                <p className="text-xs font-bold text-slate-900">
                  Discipline
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Building strong foundations.
                </p>
              </div>

              {/* Excellence */}
              <div>
                <Trophy
                  size={20}
                  strokeWidth={1.8}
                  className="mb-3 text-red-600"
                />

                <p className="text-xs font-bold text-slate-900">
                  Excellence
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Competing at every level.
                </p>
              </div>

              {/* Community */}
              <div>
                <Users
                  size={20}
                  strokeWidth={1.8}
                  className="mb-3 text-red-600"
                />

                <p className="text-xs font-bold text-slate-900">
                  Community
                </p>

                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Growing boxing together.
                </p>
              </div>

            </div>
          </div>

          {/* ===================================================
              RIGHT — TIMELINE
          =================================================== */}
          <div className="relative">

            {/* Timeline Heading */}
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Our Journey
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                  Four Decades of Progress
                </h3>
              </div>

              <div className="hidden rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-red-600 sm:block">
                1985 — 2026
              </div>
            </div>

            {/* Timeline Container */}
            <div className="relative rounded-[24px] border border-slate-200 bg-[#f8fafc] p-4 sm:p-6 lg:p-7">

              {/* Vertical Line */}
              <div className="absolute bottom-10 left-[31px] top-10 w-px bg-slate-200 sm:left-[44px]" />

              {/* Red Progress Line */}
              <div className="absolute left-[31px] top-10 h-[72%] w-px bg-red-600 sm:left-[44px]" />

              {/* Milestones */}
              <div className="relative space-y-4 sm:space-y-5">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.year}
                    className={`relative flex gap-3 rounded-2xl border p-4 transition-all duration-200 sm:gap-5 sm:p-5 ${
                      milestone.active
                        ? "border-red-100 bg-white shadow-[0_10px_30px_rgba(220,38,38,0.08)]"
                        : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
                    }`}
                  >

                    {/* Timeline Dot */}
                    <div className="relative z-10 flex w-7 shrink-0 justify-center sm:w-9">
                      <div
                        className={`mt-1.5 h-3.5 w-3.5 rounded-full ${
                          milestone.active
                            ? "bg-red-600 ring-4 ring-red-100"
                            : "border-[3px] border-slate-300 bg-[#f8fafc]"
                        }`}
                      />
                    </div>

                    {/* Year */}
                    <div className="w-14 shrink-0 sm:w-20">
                      <span
                        className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wide ${
                          milestone.active
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {milestone.year}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-950 sm:text-[15px]">
                        {milestone.title}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-[13px]">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                BOTTOM STAT
            ================================================= */}
            <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:grid-cols-3 sm:items-center sm:gap-0">

              {/* Years */}
              <div className="sm:pr-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Years of Legacy
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  40+
                </p>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 sm:block" />

              {/* Mission */}
              <div className="sm:px-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Mission
                </p>

                <p className="mt-1 text-sm font-bold text-slate-950">
                  Build Champions
                </p>
              </div>

              <div className="hidden h-10 w-px bg-slate-100 sm:block" />

              {/* Community */}
              <div className="col-span-2 border-t border-slate-100 pt-4 sm:col-span-1 sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Community
                </p>

                <p className="mt-1 text-sm font-bold text-slate-950">
                  Stronger Together
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}