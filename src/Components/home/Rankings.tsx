"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MapPin,
  Trophy,
} from "lucide-react";
import LiveTournament from "./LiveTournament";

type Ranking = {
  rank: number;
  boxerId: number;
  name: string;
  membershipId: string | null;
  gender: string | null;
  category: string | null;
  weight: string | null;
  weightCategory: string | null;
  ageGroup: string | null;
  academy: {
    id: number;
    name: string;
  } | null;
  points: number;
  tournaments: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  latestTournamentDate: string | null;
};

type RankingsResponse = {
  success: boolean;
  season: number | null;
  rankingType: string;
  count: number;
  rankings: Ranking[];
  error?: string;
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

const tabs = [
  {
    label: "SENIOR",
    value: "Senior",
  },
  {
    label: "YOUTH",
    value: "Youth",
  },
  {
    label: "WOMEN",
    value: "Women",
  },
] as const;

export default function Rankings() {
  const [tab, setTab] = useState<
    "SENIOR" | "YOUTH" | "WOMEN"
  >("SENIOR");

  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [season, setSeason] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ----------------------------------------------------------
   * LOAD LIVE RANKINGS
   * ----------------------------------------------------------
   *
   * The homepage uses the same ranking API as the
   * dashboard ranking page.
   */
  useEffect(() => {
    async function loadRankings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/rankings", {
          cache: "no-store",
        });

        const data: RankingsResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data?.error || "Failed to load rankings."
          );
        }

        setRankings(
          Array.isArray(data.rankings)
            ? data.rankings
            : []
        );

        setSeason(data.season ?? null);
      } catch (err) {
        console.error("Homepage rankings error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load rankings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRankings();
  }, []);

  /*
   * ----------------------------------------------------------
   * FILTER BY CATEGORY
   * ----------------------------------------------------------
   */
  const rows = useMemo(() => {
    const selectedCategory =
      tabs.find((item) => item.label === tab)?.value;

    if (!selectedCategory) {
      return rankings;
    }

    return rankings.filter((ranking) => {
      const category =
        ranking.category?.trim().toLowerCase();

      const ageGroup =
        ranking.ageGroup?.trim().toLowerCase();

      const selected =
        selectedCategory.toLowerCase();

      /*
       * Support both category and ageGroup data.
       *
       * Example:
       * category = "Elite"
       * ageGroup = "Senior"
       */
      return (
        category === selected ||
        ageGroup === selected
      );
    });
  }, [rankings, tab]);

  /*
   * Homepage shows top 5.
   */
  const displayRows = rows.slice(0, 5);

  const maxPts =
    displayRows.length > 0
      ? Math.max(
          ...displayRows.map((row) => row.points),
          1
        )
      : 1;

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
              {tabs.map((category) => {
                const active =
                  tab === category.label;

                return (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() =>
                      setTab(category.label)
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold tracking-[0.08em] transition-all duration-200 ${
                      active
                        ? "bg-red-600 !text-white shadow-sm"
                        : "bg-slate-100 !text-slate-500 hover:bg-slate-200 hover:!text-slate-700"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Ranking Rows */}
            <div className="space-y-2 px-5 py-5 sm:px-6 lg:px-7">

              {loading ? (
                <div className="space-y-3 py-3">
                  {[1, 2, 3, 4, 5].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 animate-pulse"
                      >
                        <div className="h-9 w-9 rounded-full bg-slate-100" />

                        <div className="h-9 w-9 rounded-full bg-slate-100" />

                        <div className="flex-1">
                          <div className="h-3 w-32 rounded bg-slate-100" />
                          <div className="mt-2 h-2 w-20 rounded bg-slate-100" />
                          <div className="mt-2 h-1 w-full rounded bg-slate-100" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-red-600">
                    Unable to load rankings.
                  </p>
                </div>
              ) : displayRows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-10 text-center">
                  <Trophy
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    No rankings available
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Verified tournament results will appear here.
                  </p>
                </div>
              ) : (
                displayRows.map((row) => {
                  const badge =
                    rankStyles[row.rank];

                  return (
                    <div
                      key={row.boxerId}
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
                        {String(row.rank).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-black text-red-600">
                        {row.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Name + Progress */}
                      <div className="min-w-0 flex-1">

                        <div className="mb-1 flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {row.name}
                          </p>

                          <span className="shrink-0 text-xs font-black text-red-600">
                            {row.points}

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
                            {row.academy?.name ||
                              "Mumbai Boxing Association"}
                          </p>
                        </div>

                        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-red-600 transition-all duration-500"
                            style={{
                              width: `${
                                (row.points /
                                  maxPts) *
                                100
                              }%`,
                            }}
                          />
                        </div>

                      </div>
                    </div>
                  );
                })
              )}

            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6 lg:px-7">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  {season
                    ? `Season ${season}`
                    : "Current Season"}
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