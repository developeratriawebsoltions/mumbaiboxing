"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MapPin,
  Trophy,
} from "lucide-react";
import LiveTournament from "./LiveTournament";

const data: Record<
  string,
  {
    rank: number;
    name: string;
    state: string;
    pts: number;
  }[]
> = {
  SENIOR: [
    {
      rank: 1,
      name: "Vikas Patil",
      state: "Maharashtra",
      pts: 980,
    },
    {
      rank: 2,
      name: "Arjun Kumar",
      state: "Rajasthan",
      pts: 920,
    },
    {
      rank: 3,
      name: "Sameer Khan",
      state: "Uttar Pradesh",
      pts: 870,
    },
    {
      rank: 4,
      name: "Rohit Sharma",
      state: "Delhi",
      pts: 780,
    },
    {
      rank: 5,
      name: "Imran Shaikh",
      state: "Maharashtra",
      pts: 710,
    },
  ],

  YOUTH: [
    {
      rank: 1,
      name: "Rahul Desai",
      state: "Maharashtra",
      pts: 860,
    },
    {
      rank: 2,
      name: "Karan Mehta",
      state: "Gujarat",
      pts: 810,
    },
    {
      rank: 3,
      name: "Dev Yadav",
      state: "UP",
      pts: 760,
    },
    {
      rank: 4,
      name: "Nikhil More",
      state: "Maharashtra",
      pts: 700,
    },
    {
      rank: 5,
      name: "Aditya Nair",
      state: "Kerala",
      pts: 650,
    },
  ],

  WOMEN: [
    {
      rank: 1,
      name: "Pooja Desai",
      state: "Maharashtra",
      pts: 940,
    },
    {
      rank: 2,
      name: "Sneha Kulkarni",
      state: "Maharashtra",
      pts: 890,
    },
    {
      rank: 3,
      name: "Priya Singh",
      state: "Delhi",
      pts: 820,
    },
    {
      rank: 4,
      name: "Anita Rao",
      state: "Karnataka",
      pts: 760,
    },
    {
      rank: 5,
      name: "Meena Patil",
      state: "Maharashtra",
      pts: 700,
    },
  ],
};

const rankStyles: Record<
  number,
  {
    bg: string;
    text: string;
  }
> = {
  1: {
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  2: {
    bg: "bg-slate-100",
    text: "text-slate-500",
  },
  3: {
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
};

export default function Rankings() {
  const [tab, setTab] = useState<
    "SENIOR" | "YOUTH" | "WOMEN"
  >("SENIOR");

  const rows = data[tab];
  const maxPts = rows[0].pts;

  return (
    <section
      id="rankings"
      className="w-full overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-14">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                Performance
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[68px]">
              TOP
              <span className="text-red-600">
                {" "}RANKINGS
              </span>
            </h2>
          </div>

          <Link
            href="/dashboard/ranking"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] !text-slate-600 transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:!text-red-600"
          >
            View Full Rankings

            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =====================================================
            TWO COLUMN CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.08fr_0.92fr] xl:gap-6">

          {/* ===================================================
              RANKING PANEL
          =================================================== */}
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6 lg:px-7">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <BarChart3
                    size={19}
                    strokeWidth={1.8}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Leaderboard
                  </p>

                  <h3 className="mt-0.5 text-base font-bold text-slate-950 sm:text-lg">
                    Current Rankings
                  </h3>
                </div>
              </div>

              <Trophy
                size={19}
                className="text-slate-300"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto px-5 pt-5 sm:px-6 lg:px-7">
              {(
                ["SENIOR", "YOUTH", "WOMEN"] as const
              ).map((category) => {
                const active = tab === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setTab(category)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold tracking-[0.08em] transition-all duration-200 ${
                      active
                        ? "bg-red-600 !text-white shadow-sm"
                        : "bg-slate-100 !text-slate-500 hover:bg-slate-200 hover:!text-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Ranking Rows */}
            <div className="space-y-2 px-5 py-5 sm:px-6 lg:px-7">

              {rows.map((row) => {
                const badge = rankStyles[row.rank];

                return (
                  <div
                    key={row.rank}
                    className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-200 hover:border-slate-100 hover:bg-slate-50 sm:gap-4 sm:p-3.5"
                  >

                    {/* Rank */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        badge
                          ? `${badge.bg} ${badge.text}`
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {String(row.rank).padStart(2, "0")}
                    </div>

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-600">
                      {row.name.charAt(0)}
                    </div>

                    {/* Name + Progress */}
                    <div className="min-w-0 flex-1">

                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {row.name}
                        </p>

                        <span className="shrink-0 text-xs font-black text-red-600">
                          {row.pts}
                          <span className="ml-1 text-[9px] font-medium text-slate-400">
                            pts
                          </span>
                        </span>
                      </div>

                      <div className="mb-2 flex items-center gap-1.5">
                        <MapPin
                          size={11}
                          className="shrink-0 text-slate-300"
                        />

                        <p className="truncate text-[10px] text-slate-400">
                          {row.state}
                        </p>
                      </div>

                      <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-600 transition-all duration-500"
                          style={{
                            width: `${(row.pts / maxPts) * 100}%`,
                          }}
                        />
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6 lg:px-7">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Category
                </span>

                <span className="text-xs font-bold text-slate-700">
                  {tab}
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================
              LIVE TOURNAMENT
          =================================================== */}
          <div className="min-w-0">
            <LiveTournament />
          </div>

        </div>
      </div>
    </section>
  );
}