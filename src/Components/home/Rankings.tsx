"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Medal,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";

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

const tabs = [
  {
    label: "ALL",
    value: "all",
  },
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

const pointsTable = [
  {
    type: "District",
    gold: 20,
    silver: 12,
    bronze: 8,
    participation: 2,
  },
  {
    type: "State",
    gold: 40,
    silver: 25,
    bronze: 15,
    participation: 5,
  },
  {
    type: "National",
    gold: 70,
    silver: 45,
    bronze: 30,
    participation: 10,
  },
  {
    type: "International",
    gold: 100,
    silver: 70,
    bronze: 50,
    participation: 15,
  },
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [season, setSeason] = useState<number | null>(null);

  const [tab, setTab] = useState<
    "ALL" | "SENIOR" | "YOUTH" | "WOMEN"
  >("ALL");

  const [seasonFilter, setSeasonFilter] = useState("current");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD LIVE RANKINGS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadRankings() {
      try {
        setLoading(true);
        setError("");

        const url =
          seasonFilter === "all"
            ? "/api/rankings?season=all"
            : "/api/rankings";

        const response = await fetch(url, {
          cache: "no-store",
        });

        const data: RankingsResponse = await response.json();

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
        console.error("Rankings page error:", err);

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
  }, [seasonFilter]);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredRankings = useMemo(() => {
    const selectedCategory =
      tabs.find((item) => item.label === tab)?.value;

    const normalizedSearch = search.trim().toLowerCase();

    return rankings.filter((ranking) => {
      /*
       * Category filter
       */

      if (
        selectedCategory &&
        selectedCategory !== "all"
      ) {
        const category =
          ranking.category?.trim().toLowerCase();

        const ageGroup =
          ranking.ageGroup?.trim().toLowerCase();

        const selected =
          selectedCategory.toLowerCase();

        const matchesCategory =
          category === selected ||
          ageGroup === selected;

        if (!matchesCategory) {
          return false;
        }
      }

      /*
       * Search
       */

      if (normalizedSearch) {
        const name =
          ranking.name?.toLowerCase() || "";

        const academy =
          ranking.academy?.name?.toLowerCase() || "";

        const membership =
          ranking.membershipId?.toLowerCase() || "";

        if (
          !name.includes(normalizedSearch) &&
          !academy.includes(normalizedSearch) &&
          !membership.includes(normalizedSearch)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rankings, tab, search]);

  /*
  |--------------------------------------------------------------------------
  | TOP THREE
  |--------------------------------------------------------------------------
  */

  const topThree = useMemo(() => {
    return [...filteredRankings]
      .sort((a, b) => {
        if (a.rank !== b.rank) {
          return a.rank - b.rank;
        }

        return b.points - a.points;
      })
      .slice(0, 3);
  }, [filteredRankings]);

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const totalPoints = useMemo(() => {
    return filteredRankings.reduce(
      (sum, ranking) => sum + ranking.points,
      0
    );
  }, [filteredRankings]);

  const totalTournaments = useMemo(() => {
    return filteredRankings.reduce(
      (sum, ranking) => sum + ranking.tournaments,
      0
    );
  }, [filteredRankings]);

  const totalGold = useMemo(() => {
    return filteredRankings.reduce(
      (sum, ranking) => sum + ranking.medals.gold,
      0
    );
  }, [filteredRankings]);

  const totalSilver = useMemo(() => {
    return filteredRankings.reduce(
      (sum, ranking) => sum + ranking.medals.silver,
      0
    );
  }, [filteredRankings]);

  const totalBronze = useMemo(() => {
    return filteredRankings.reduce(
      (sum, ranking) => sum + ranking.medals.bronze,
      0
    );
  }, [filteredRankings]);

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          {/* Breadcrumb */}

          <div className="mb-10 flex items-center gap-2 text-xs text-slate-500">

            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <span className="text-slate-700">
              /
            </span>

            <span className="text-red-500">
              Rankings
            </span>

          </div>

          <div className="max-w-[1000px]">

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[82px]">
              BOXING{" "}
              <span className="text-red-500">
                RANKINGS
              </span>
            </h1>

            <p className="mt-7 max-w-[850px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Track verified athlete performance across tournaments,
              categories, medals, and points. Rankings are calculated from
              approved tournament results recorded through the Mumbai Boxing
              Association system.
            </p>

          </div>

          {/* Hero Meta */}

          <div className="mt-10 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

              <BarChart3
                size={15}
                className="text-red-500"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {season
                  ? `Season ${season}`
                  : "Current Season"}
              </span>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

              <ShieldCheck
                size={15}
                className="text-red-500"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Verified Results
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}

      <section className="border-b border-white/10 bg-[#090c11]">

        <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-5 sm:px-7 lg:grid-cols-4 lg:px-8 xl:px-10 2xl:px-12">

          <div className="border-b border-r border-white/10 px-4 py-8 sm:px-6 lg:border-b-0">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Users size={17} className="text-red-500" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Ranked Athletes
              </p>

            </div>

            <p className="mt-5 text-3xl font-black text-white">
              {loading ? "—" : filteredRankings.length}
            </p>

          </div>

          <div className="border-b border-white/10 px-4 py-8 sm:px-6 lg:border-b-0 lg:border-r">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Trophy size={17} className="text-red-500" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Tournament Entries
              </p>

            </div>

            <p className="mt-5 text-3xl font-black text-white">
              {loading ? "—" : totalTournaments}
            </p>

          </div>

          <div className="border-r border-white/10 px-4 py-8 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Target size={17} className="text-red-500" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Total Points
              </p>

            </div>

            <p className="mt-5 text-3xl font-black text-white">
              {loading ? "—" : totalPoints}
            </p>

          </div>

          <div className="px-4 py-8 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Medal size={17} className="text-red-500" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                Gold Medals
              </p>

            </div>

            <p className="mt-5 text-3xl font-black text-white">
              {loading ? "—" : totalGold}
            </p>

          </div>

        </div>
      </section>

      {/* =========================================================
          MAIN RANKINGS
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#05070a]">

        <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-red-600/[0.035] blur-[150px]" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          {/* Section Header */}

          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-5 flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-500" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Official Leaderboard
                </p>

              </div>

              <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                ATHLETE{" "}
                <span className="text-red-500">
                  RANKINGS
                </span>
              </h2>

            </div>

            {/* Season selector */}

            <div className="relative">

              <select
                value={seasonFilter}
                onChange={(e) =>
                  setSeasonFilter(e.target.value)
                }
                className="appearance-none rounded-xl border border-white/10 bg-[#090c11] py-3 pl-4 pr-10 text-xs font-bold uppercase tracking-[0.1em] text-slate-300 outline-none transition-colors focus:border-red-500/40"
              >
                <option value="current">
                  Current Season
                </option>

                <option value="all">
                  All Time
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

            </div>

          </div>

          {/* =====================================================
              CONTROLS
          ===================================================== */}

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Tabs */}

            <div className="flex gap-2 overflow-x-auto">

              {tabs.map((item) => {

                const active = tab === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setTab(item.label)
                    }
                    className={`shrink-0 rounded-full px-5 py-2.5 text-[10px] font-black tracking-[0.1em] transition-all duration-200 ${
                      active
                        ? "bg-red-600 text-white shadow-[0_8px_25px_rgba(220,38,38,0.18)]"
                        : "border border-white/10 bg-white/[0.025] text-slate-500 hover:border-white/15 hover:bg-white/[0.05] hover:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

            </div>

            {/* Search */}

            <div className="relative w-full lg:w-[300px]">

              <Search
                size={15}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search athlete..."
                className="w-full rounded-xl border border-white/10 bg-[#090c11] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-red-500/40"
              />

            </div>

          </div>

          {/* =====================================================
              TOP THREE
          ===================================================== */}

          {!loading &&
            !error &&
            topThree.length > 0 && (

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

                {topThree.map((ranking) => {

                  const isFirst =
                    ranking.rank === 1;

                  const isSecond =
                    ranking.rank === 2;

                  const isThird =
                    ranking.rank === 3;

                  return (
                    <article
                      key={ranking.boxerId}
                      className={`relative overflow-hidden rounded-[24px] border p-6 ${
                        isFirst
                          ? "border-amber-500/20 bg-amber-500/[0.035]"
                          : isSecond
                            ? "border-slate-400/15 bg-slate-400/[0.025]"
                            : "border-orange-500/15 bg-orange-500/[0.025]"
                      }`}
                    >

                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-2xl" />

                      <div className="relative">

                        <div className="flex items-start justify-between">

                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-black ${
                              isFirst
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : isSecond
                                  ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
                                  : "border-orange-500/20 bg-orange-500/10 text-orange-400"
                            }`}
                          >
                            #{ranking.rank}
                          </div>

                          <Trophy
                            size={19}
                            className={
                              isFirst
                                ? "text-amber-400"
                                : isSecond
                                  ? "text-slate-400"
                                  : "text-orange-400"
                            }
                          />

                        </div>

                        <div className="mt-7 flex items-center gap-3">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-sm font-black text-red-500">
                            {ranking.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-white">
                              {ranking.name}
                            </h3>

                            <p className="mt-1 truncate text-[10px] text-slate-600">
                              {ranking.academy?.name ||
                                "Mumbai Boxing Association"}
                            </p>

                          </div>

                        </div>

                        <div className="mt-6 flex items-end justify-between">

                          <div>

                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                              Points
                            </p>

                            <p className="mt-1 text-3xl font-black text-white">
                              {ranking.points}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                              Medals
                            </p>

                            <p className="mt-1 text-xs font-bold text-slate-400">
                              {ranking.medals.gold}G{" "}
                              {ranking.medals.silver}S{" "}
                              {ranking.medals.bronze}B
                            </p>

                          </div>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#090c11] shadow-[0_25px_70px_rgba(0,0,0,0.3)]">

            {/* Top red line */}

            <div className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Table Header */}

            <div className="hidden grid-cols-[70px_minmax(260px,1.5fr)_1fr_120px_150px_130px] gap-4 border-b border-white/[0.07] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600 lg:grid">

              <span>
                Rank
              </span>

              <span>
                Boxer
              </span>

              <span>
                Academy
              </span>

              <span>
                Category
              </span>

              <span>
                Medals
              </span>

              <span className="text-right">
                Points
              </span>

            </div>

            {/* Loading */}

            {loading ? (

              <div className="space-y-1 p-3">

                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-4 rounded-xl p-4"
                    >

                      <div className="h-9 w-9 rounded-full bg-white/[0.05]" />

                      <div className="h-10 w-10 rounded-full bg-white/[0.05]" />

                      <div className="flex-1">

                        <div className="h-3 w-40 rounded bg-white/[0.05]" />

                        <div className="mt-2 h-2 w-24 rounded bg-white/[0.03]" />

                      </div>

                      <div className="hidden h-3 w-16 rounded bg-white/[0.04] sm:block" />

                    </div>
                  )
                )}

              </div>

            ) : error ? (

              <div className="px-5 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                  <ShieldCheck
                    size={20}
                    className="text-red-500"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-red-400">
                  Unable to load rankings.
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Please try again later.
                </p>

              </div>

            ) : filteredRankings.length === 0 ? (

              <div className="px-5 py-20 text-center">

                <Trophy
                  size={36}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-4 text-sm font-semibold text-slate-400">
                  No rankings available
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Verified tournament results will appear here.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-white/[0.05]">

                {filteredRankings.map(
                  (ranking) => (

                    <div
                      key={ranking.boxerId}
                      className="group px-4 py-4 transition-colors hover:bg-white/[0.02] sm:px-6"
                    >

                      {/* Desktop */}

                      <div className="hidden grid-cols-[70px_minmax(260px,1.5fr)_1fr_120px_150px_130px] items-center gap-4 lg:grid">

                        {/* Rank */}

                        <div>

                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-black ${
                              ranking.rank === 1
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : ranking.rank === 2
                                  ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
                                  : ranking.rank === 3
                                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                    : "border-white/[0.06] bg-white/[0.025] text-slate-600"
                            }`}
                          >
                            {String(
                              ranking.rank
                            ).padStart(2, "0")}
                          </div>

                        </div>

                        {/* Boxer */}

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/15 bg-red-500/[0.07] text-xs font-black text-red-500">
                            {ranking.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-slate-200">
                              {ranking.name}
                            </p>

                            <p className="mt-1 truncate text-[10px] text-slate-600">
                              {ranking.membershipId ||
                                "Membership ID unavailable"}
                            </p>

                          </div>

                        </div>

                        {/* Academy */}

                        <p className="truncate text-xs text-slate-500">
                          {ranking.academy?.name ||
                            "Mumbai Boxing Association"}
                        </p>

                        {/* Category */}

                        <div>

                          <p className="text-xs font-semibold text-slate-400">
                            {ranking.category ||
                              ranking.ageGroup ||
                              "—"}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            {ranking.weightCategory ||
                              ranking.weight ||
                              "—"}
                          </p>

                        </div>

                        {/* Medals */}

                        <div className="flex items-center gap-3 text-[10px] font-bold">

                          <span className="text-amber-400">
                            {ranking.medals.gold}G
                          </span>

                          <span className="text-slate-400">
                            {ranking.medals.silver}S
                          </span>

                          <span className="text-orange-400">
                            {ranking.medals.bronze}B
                          </span>

                        </div>

                        {/* Points */}

                        <div className="text-right">

                          <p className="text-base font-black text-red-500">
                            {ranking.points}
                          </p>

                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                            points
                          </p>

                        </div>

                      </div>

                      {/* Mobile */}

                      <div className="lg:hidden">

                        <div className="flex items-start gap-3">

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${
                              ranking.rank === 1
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : ranking.rank === 2
                                  ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
                                  : ranking.rank === 3
                                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                    : "border-white/[0.06] bg-white/[0.025] text-slate-600"
                            }`}
                          >
                            {ranking.rank}
                          </div>

                          <div className="flex min-w-0 flex-1 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/15 bg-red-500/[0.07] text-xs font-black text-red-500">
                              {ranking.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-white">
                                {ranking.name}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-slate-600">
                                {ranking.academy?.name ||
                                  "Mumbai Boxing Association"}
                              </p>

                            </div>

                          </div>

                          <div className="text-right">

                            <p className="text-base font-black text-red-500">
                              {ranking.points}
                            </p>

                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-700">
                              pts
                            </p>

                          </div>

                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.05] pt-3">

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                              Category
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-slate-400">
                              {ranking.category ||
                                ranking.ageGroup ||
                                "—"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                              Weight
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-slate-400">
                              {ranking.weightCategory ||
                                ranking.weight ||
                                "—"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                              Medals
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-slate-400">
                              {ranking.medals.gold}G{" "}
                              {ranking.medals.silver}S{" "}
                              {ranking.medals.bronze}B
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            {/* Footer */}

            {!loading &&
              !error &&
              filteredRankings.length > 0 && (

                <div className="border-t border-white/[0.06] bg-white/[0.015] px-5 py-4 sm:px-6">

                  <div className="flex flex-col gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                      {season
                        ? `Season ${season}`
                        : "All Time Rankings"}
                    </span>

                    <span>
                      {filteredRankings.length} Ranked Athletes
                    </span>

                  </div>

                </div>
              )}

          </div>

        </div>
      </section>

      {/* =========================================================
          MEDAL SUMMARY
      ========================================================= */}

      <section className="border-y border-white/10 bg-[#090c11]">

        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Performance Summary
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                MEDALS &{" "}
                <span className="text-red-500">
                  ACHIEVEMENT
                </span>
              </h2>

              <p className="mt-5 max-w-[600px] text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
                Athlete rankings reflect accumulated performance from verified
                tournament results. Medal counts provide a quick view of
                competitive achievement.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.035] p-6">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <Medal
                    size={19}
                    className="text-amber-400"
                  />
                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Gold
                </p>

                <p className="mt-1 text-3xl font-black text-amber-400">
                  {loading ? "—" : totalGold}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-400/15 bg-slate-400/[0.025] p-6">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-400/10">
                  <Medal
                    size={19}
                    className="text-slate-300"
                  />
                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Silver
                </p>

                <p className="mt-1 text-3xl font-black text-slate-300">
                  {loading ? "—" : totalSilver}
                </p>

              </div>

              <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.025] p-6">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                  <Medal
                    size={19}
                    className="text-orange-400"
                  />
                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Bronze
                </p>

                <p className="mt-1 text-3xl font-black text-orange-400">
                  {loading ? "—" : totalBronze}
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          POINTS SYSTEM
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#05070a]">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="mb-12 max-w-[850px]">

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                Ranking Methodology
              </p>

            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              POINTS{" "}
              <span className="text-red-500">
                SYSTEM
              </span>
            </h2>

            <p className="mt-5 max-w-[750px] text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
              Points are awarded according to tournament level and verified
              finishing position. Approved tournament history contributes to
              an athlete&apos;s ranking record.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {pointsTable.map((item) => (

              <article
                key={item.type}
                className="group rounded-[22px] border border-white/10 bg-[#090c11] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <Trophy
                      size={18}
                      className="text-red-500"
                    />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">
                    Tournament
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  {item.type}
                </h3>

                <div className="mt-6 space-y-3">

                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-slate-500">
                      Gold
                    </span>

                    <span className="text-sm font-black text-amber-400">
                      {item.gold}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-slate-500">
                      Silver
                    </span>

                    <span className="text-sm font-black text-slate-300">
                      {item.silver}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">

                    <span className="text-xs text-slate-500">
                      Bronze
                    </span>

                    <span className="text-sm font-black text-orange-400">
                      {item.bronze}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-500">
                      Participation
                    </span>

                    <span className="text-sm font-black text-red-500">
                      {item.participation}
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>
      </section>

      {/* =========================================================
          METHODOLOGY / CTA
      ========================================================= */}

      <section className="relative overflow-hidden border-t border-white/10 bg-[#090c11]">

        <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-red-600/8 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-red-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="rounded-[28px] border border-white/10 bg-[#05070a] p-7 sm:p-10 lg:p-12">

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div className="max-w-[850px]">

                <div className="flex items-center gap-3">

                  <span className="h-[2px] w-8 bg-red-600" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Train · Compete · Belong
                  </p>

                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  EARN YOUR PLACE{" "}
                  <span className="text-red-500">
                    IN THE RANKINGS
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Participate in recognized competitions, build your record,
                  represent your academy, and progress through the MBA
                  competitive pathway.
                </p>

              </div>

              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-red-700 hover:shadow-[0_12px_35px_rgba(220,38,38,0.2)]"
              >
                Become a Member

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </Link>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}