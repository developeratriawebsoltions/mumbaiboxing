"use client";

import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

import {
  Award,
  ChevronDown,
  Crown,
  Medal,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

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

const seasons = ["2026", "2025", "2024", "all"];

const categories = [
  "All Categories",
  "Sub-Junior",
  "Junior",
  "Youth",
  "Elite",
];

const genders = [
  "All Genders",
  "Male",
  "Female",
];

const weightCategories = [
  "All Weight Categories",
  "46–48 kg",
  "48–50 kg",
  "50–52 kg",
  "52–54 kg",
  "54–57 kg",
  "57–60 kg",
  "60–65 kg",
  "65–70 kg",
  "70–75 kg",
  "75–80 kg",
  "80–85 kg",
  "85–90 kg",
  "90+ kg",
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [season, setSeason] = useState("2026");
  const [category, setCategory] =
    useState("All Categories");
  const [gender, setGender] =
    useState("All Genders");
  const [weightCategory, setWeightCategory] =
    useState("All Weight Categories");

  const [search, setSearch] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD RANKINGS
  |--------------------------------------------------------------------------
  */

  async function fetchRankings() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (season !== "all") {
        params.set("season", season);
      } else {
        params.set("season", "all");
      }

      if (category !== "All Categories") {
        params.set("category", category);
      }

      if (gender !== "All Genders") {
        params.set("gender", gender);
      }

      if (
        weightCategory !==
        "All Weight Categories"
      ) {
        params.set(
          "weightCategory",
          weightCategory
        );
      }

      const query = params.toString();

      const res = await fetch(
        `/api/rankings?${query}`,
        {
          cache: "no-store",
        }
      );

      const data: RankingsResponse =
        await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data?.error ||
            "Unable to load rankings."
        );
      }

      setRankings(
        Array.isArray(data.rankings)
          ? data.rankings
          : []
      );
    } catch (err) {
      console.error(
        "Public rankings error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load rankings."
      );

      setRankings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRankings();
  }, [
    season,
    category,
    gender,
    weightCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredRankings = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return rankings;
    }

    return rankings.filter((boxer) => {
      return (
        boxer.name
          ?.toLowerCase()
          .includes(query) ||
        boxer.membershipId
          ?.toLowerCase()
          .includes(query) ||
        boxer.academy?.name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [rankings, search]);

  /*
  |--------------------------------------------------------------------------
  | TOP THREE
  |--------------------------------------------------------------------------
  */

  const topThree =
    filteredRankings.slice(0, 3);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalPoints =
    filteredRankings.reduce(
      (sum, boxer) =>
        sum + boxer.points,
      0
    );

  const totalTournaments =
    filteredRankings.reduce(
      (sum, boxer) =>
        sum + boxer.tournaments,
      0
    );

  const totalGold =
    filteredRankings.reduce(
      (sum, boxer) =>
        sum + boxer.medals.gold,
      0
    );

  const totalSilver =
    filteredRankings.reduce(
      (sum, boxer) =>
        sum + boxer.medals.silver,
      0
    );

  const totalBronze =
    filteredRankings.reduce(
      (sum, boxer) =>
        sum + boxer.medals.bronze,
      0
    );

  return (
    <main className="min-h-screen bg-[#05070a] text-white">

      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        {/* Ambient Glow */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        {/* Grid */}

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

            <a
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </a>

            <ChevronDown
              size={12}
              className="-rotate-90 text-slate-700"
            />

            <span className="text-red-500">
              Rankings
            </span>

          </div>

          <div className="max-w-[1050px]">

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[84px]">

              OFFICIAL{" "}

              <span className="text-red-500">
                BOXING
              </span>

              <br />

              RANKINGS

            </h1>

            <p className="mt-7 max-w-[850px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Follow the official Mumbai Boxing Association
              rankings, calculated from verified tournament
              performances and the Association&apos;s points
              system.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

                <ShieldCheck
                  size={17}
                  className="text-red-500"
                />

                <span className="text-xs font-semibold text-slate-400">
                  Official Rankings
                </span>

              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

                <Trophy
                  size={17}
                  className="text-red-500"
                />

                <span className="text-xs font-semibold text-slate-400">
                  Verified Results
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          RANKING CONTENT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#090c11]">

        <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-red-600/[0.035] blur-[150px]" />

        <div className="pointer-events-none absolute -right-40 bottom-40 h-[500px] w-[500px] rounded-full bg-red-900/[0.05] blur-[150px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          {/* =====================================================
              TITLE
          ===================================================== */}

          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Official Leaderboard
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">

                {season === "all"
                  ? "ALL-TIME"
                  : season}

                {" "}

                <span className="text-red-500">
                  RANKINGS
                </span>

              </h2>

              <p className="mt-4 max-w-[750px] text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                Rankings are based on approved tournament
                results and accumulated performance points.
              </p>

            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-4 py-3">

              <Award
                size={17}
                className="text-red-500"
              />

              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                {filteredRankings.length} Ranked Boxers
              </span>

            </div>

          </div>

          {/* =====================================================
              FILTER PANEL
          ===================================================== */}

          <div className="rounded-[26px] border border-white/10 bg-[#05070a] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-6 lg:p-7">

            {/* Top Red Line */}

            <div className="-mx-5 -mt-5 mb-6 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent sm:-mx-6 sm:-mt-6 lg:-mx-7 lg:-mt-7" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

              <FilterSelect
                label="Season"
                value={season}
                onChange={setSeason}
                options={seasons}
                formatOption={(value) =>
                  value === "all"
                    ? "All Seasons"
                    : value
                }
              />

              <FilterSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={categories}
              />

              <FilterSelect
                label="Gender"
                value={gender}
                onChange={setGender}
                options={genders}
              />

              <FilterSelect
                label="Weight Category"
                value={weightCategory}
                onChange={setWeightCategory}
                options={weightCategories}
              />

            </div>

            {/* Search */}

            <div className="mt-5">

              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Search Boxer
              </label>

              <div className="relative">

                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by boxer name, membership ID or academy..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-red-500/40 focus:bg-white/[0.04]"
                />

              </div>

            </div>

          </div>

          {/* =====================================================
              TOP PERFORMERS
          ===================================================== */}

          {!loading &&
            !error &&
            topThree.length > 0 && (

              <div className="mt-14">

                <div className="mb-6">

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">
                    Leading Boxers
                  </p>

                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    TOP PERFORMERS
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  {topThree.map(
                    (boxer, index) => (
                      <TopBoxerCard
                        key={boxer.boxerId}
                        boxer={boxer}
                        position={index + 1}
                      />
                    )
                  )}

                </div>

              </div>
            )}

          {/* =====================================================
              SUMMARY STATS
          ===================================================== */}

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <StatCard
              icon={
                <Users size={19} />
              }
              label="Ranked Boxers"
              value={
                loading
                  ? "—"
                  : filteredRankings.length
              }
            />

            <StatCard
              icon={
                <Trophy size={19} />
              }
              label="Tournament Results"
              value={
                loading
                  ? "—"
                  : totalTournaments
              }
            />

            <StatCard
              icon={
                <Award size={19} />
              }
              label="Total Points"
              value={
                loading
                  ? "—"
                  : totalPoints
              }
            />

          </div>

          {/* =====================================================
              RANKING TABLE
          ===================================================== */}

          <div className="mt-10 overflow-hidden rounded-[26px] border border-white/10 bg-[#05070a] shadow-[0_25px_70px_rgba(0,0,0,0.3)]">

            <div className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Table Header */}

            <div className="border-b border-white/[0.07] px-5 py-5 sm:px-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                    Official Standings
                  </p>

                  <h3 className="mt-1 text-xl font-black text-white">
                    RANKING TABLE
                  </h3>

                </div>

                <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex">

                  <Medal size={15} />

                  <span>
                    Gold · Silver · Bronze
                  </span>

                </div>

              </div>

            </div>

            {loading ? (

              <LoadingState />

            ) : error ? (

              <ErrorState
                message={error}
                onRetry={fetchRankings}
              />

            ) : filteredRankings.length === 0 ? (

              <EmptyState />

            ) : (

              <>

                {/* =================================================
                    DESKTOP TABLE
                ================================================= */}

                <div className="hidden overflow-x-auto lg:block">

                  <table className="w-full min-w-[1050px]">

                    <thead>

                      <tr className="border-b border-white/[0.06] bg-white/[0.02]">

                        <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Rank
                        </th>

                        <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Boxer
                        </th>

                        <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Academy
                        </th>

                        <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Category
                        </th>

                        <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Weight
                        </th>

                        <th className="px-5 py-4 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Tournaments
                        </th>

                        <th className="px-5 py-4 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Medals
                        </th>

                        <th className="px-5 py-4 text-right text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Points
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredRankings.map(
                        (boxer) => (
                          <RankingTableRow
                            key={boxer.boxerId}
                            boxer={boxer}
                          />
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    MOBILE
                ================================================= */}

                <div className="divide-y divide-white/[0.06] lg:hidden">

                  {filteredRankings.map(
                    (boxer) => (
                      <RankingMobileCard
                        key={boxer.boxerId}
                        boxer={boxer}
                      />
                    )
                  )}

                </div>

              </>
            )}

            {!loading &&
              !error &&
              filteredRankings.length > 0 && (

                <div className="border-t border-white/[0.06] bg-white/[0.015] px-5 py-4 sm:px-7">

                  <div className="flex flex-col gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-700 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                      {season === "all"
                        ? "All Time"
                        : `Season ${season}`}
                    </span>

                    <span>
                      {filteredRankings.length} Ranked Athletes
                    </span>

                  </div>

                </div>
              )}

          </div>

          {/* =====================================================
              MEDAL SUMMARY
          ===================================================== */}

          <section className="mt-16">

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Performance Summary
                </p>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">

                MEDALS &{" "}

                <span className="text-red-500">
                  ACHIEVEMENT
                </span>

              </h2>

              <p className="mt-3 max-w-[700px] text-sm leading-7 text-slate-400">
                Medal counts provide a quick view of
                competitive achievement across the
                selected ranking results.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <MedalSummaryCard
                label="Gold"
                value={
                  loading
                    ? "—"
                    : totalGold
                }
                className="border-amber-500/15 bg-amber-500/[0.035] text-amber-400"
              />

              <MedalSummaryCard
                label="Silver"
                value={
                  loading
                    ? "—"
                    : totalSilver
                }
                className="border-slate-400/15 bg-slate-400/[0.025] text-slate-300"
              />

              <MedalSummaryCard
                label="Bronze"
                value={
                  loading
                    ? "—"
                    : totalBronze
                }
                className="border-orange-500/15 bg-orange-500/[0.025] text-orange-400"
              />

            </div>

          </section>

          {/* =====================================================
              POINTS SYSTEM
          ===================================================== */}

          <section className="mt-20">

            <div className="mb-10 max-w-[850px]">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Points System
                </p>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

                HOW POINTS ARE{" "}

                <span className="text-red-500">
                  AWARDED
                </span>

              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                Points are awarded according to tournament
                level and final medal result.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <PointsCard
                title="District"
                gold={20}
                silver={12}
                bronze={8}
                none={2}
              />

              <PointsCard
                title="State"
                gold={40}
                silver={25}
                bronze={15}
                none={5}
              />

              <PointsCard
                title="National"
                gold={70}
                silver={45}
                bronze={30}
                none={10}
              />

              <PointsCard
                title="International"
                gold={100}
                silver={70}
                bronze={50}
                none={15}
              />

            </div>

          </section>

          {/* =====================================================
              METHODOLOGY
          ===================================================== */}

          <section className="relative mt-20 overflow-hidden rounded-[28px] border border-white/10 bg-[#05070a] p-7 sm:p-10 lg:p-12">

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/8 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 shadow-[0_10px_35px_rgba(220,38,38,0.2)]">
                  <ShieldCheck size={21} />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Ranking Methodology
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">

                  HOW THE{" "}

                  <span className="text-red-500">
                    RANKINGS WORK
                  </span>

                </h2>

              </div>

              <div className="space-y-5 text-sm leading-7 text-slate-400 sm:text-base">

                <p>
                  Only verified and approved tournament
                  records contribute points to the official
                  rankings.
                </p>

                <p>
                  A boxer&apos;s ranking is determined
                  primarily by total accumulated points
                  during the selected season.
                </p>

                <p>
                  When boxers have equal points, medal
                  performance and the latest tournament
                  result are used as additional ranking
                  factors.
                </p>

                <p>
                  This system provides a transparent way to
                  recognize consistent competitive
                  performance across different levels of
                  boxing.
                </p>

              </div>

            </div>

          </section>

          {/* =====================================================
              BOTTOM DECORATION
          ===================================================== */}

          <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">

            <span className="h-px w-16 bg-white/[0.07]" />

            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
              Performance · Discipline · Excellence
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

            <span className="h-px w-16 bg-white/[0.07]" />

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}

/* =============================================================
   FILTER SELECT
============================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
  formatOption,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  formatOption?: (value: string) => string;
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.025] px-4 pr-10 text-sm font-medium text-slate-300 outline-none transition-all focus:border-red-500/40 focus:bg-white/[0.04]"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#090c11] text-white"
            >
              {formatOption
                ? formatOption(option)
                : option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
        />

      </div>

    </div>
  );
}

/* =============================================================
   TOP BOXER CARD
============================================================= */

function TopBoxerCard({
  boxer,
  position,
}: {
  boxer: Ranking;
  position: number;
}) {
  const initials = boxer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const isFirst = position === 1;
  const isSecond = position === 2;

  return (
    <article
      className={`group relative overflow-hidden rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 ${
        isFirst
          ? "border-red-500/25 bg-red-500/[0.035] shadow-[0_20px_60px_rgba(220,38,38,0.06)]"
          : "border-white/10 bg-[#05070a] hover:border-white/15"
      }`}
    >

      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-600/5 blur-3xl" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-black ${
              isFirst
                ? "border-red-500/25 bg-red-500/10 text-red-500"
                : isSecond
                  ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
                  : "border-orange-500/20 bg-orange-500/10 text-orange-400"
            }`}
          >
            #{position}
          </div>

          {isFirst ? (
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">

              <Crown
                size={12}
                className="text-red-500"
              />

              <span className="text-[8px] font-black uppercase tracking-[0.12em] text-red-500">
                Leader
              </span>

            </div>
          ) : (
            <Trophy
              size={18}
              className={
                isSecond
                  ? "text-slate-500"
                  : "text-orange-500/70"
              }
            />
          )}

        </div>

        <div className="mt-7 flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-red-500/15 bg-red-500/[0.07] text-base font-black text-red-500">
            {initials}
          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-red-500">
              Rank #{position}
            </p>

            <h3 className="mt-1 truncate text-base font-bold text-white">
              {boxer.name}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-600">
              {boxer.academy?.name ||
                "Academy not listed"}
            </p>

          </div>

        </div>

        <div className="mt-6 flex items-end justify-between border-t border-white/[0.07] pt-5">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Points
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {boxer.points}
            </p>

          </div>

          <div className="text-right">

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Medals
            </p>

            <p className="mt-1 text-sm font-bold text-slate-400">
              {boxer.medals.gold}G ·{" "}
              {boxer.medals.silver}S ·{" "}
              {boxer.medals.bronze}B
            </p>

          </div>

        </div>

      </div>

    </article>
  );
}

/* =============================================================
   DESKTOP TABLE ROW
============================================================= */

function RankingTableRow({
  boxer,
}: {
  boxer: Ranking;
}) {
  const initials = boxer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <tr className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.025]">

      {/* Rank */}

      <td className="px-5 py-5">

        <RankBadge rank={boxer.rank} />

      </td>

      {/* Boxer */}

      <td className="px-5 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/15 bg-red-500/[0.07] text-xs font-black text-red-500">
            {initials}
          </div>

          <div>

            <p className="font-bold text-slate-200">
              {boxer.name}
            </p>

            {boxer.membershipId && (
              <p className="mt-0.5 text-[10px] text-slate-600">
                {boxer.membershipId}
              </p>
            )}

          </div>

        </div>

      </td>

      {/* Academy */}

      <td className="px-5 py-5 text-sm text-slate-500">
        {boxer.academy?.name || "—"}
      </td>

      {/* Category */}

      <td className="px-5 py-5">

        <div>

          <p className="text-sm font-semibold text-slate-400">
            {boxer.category || "—"}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-600">
            {boxer.gender || "—"}
          </p>

        </div>

      </td>

      {/* Weight */}

      <td className="px-5 py-5 text-sm text-slate-500">
        {boxer.weightCategory ||
          boxer.weight ||
          "—"}
      </td>

      {/* Tournaments */}

      <td className="px-5 py-5 text-center text-sm font-semibold text-slate-400">
        {boxer.tournaments}
      </td>

      {/* Medals */}

      <td className="px-5 py-5">

        <div className="flex justify-center gap-2 text-xs font-bold">

          <span className="text-amber-400">
            {boxer.medals.gold}
          </span>

          <span className="text-slate-400">
            {boxer.medals.silver}
          </span>

          <span className="text-orange-400">
            {boxer.medals.bronze}
          </span>

        </div>

      </td>

      {/* Points */}

      <td className="px-5 py-5 text-right">

        <span className="text-xl font-black text-red-500">
          {boxer.points}
        </span>

      </td>

    </tr>
  );
}

/* =============================================================
   MOBILE CARD
============================================================= */

function RankingMobileCard({
  boxer,
}: {
  boxer: Ranking;
}) {
  const initials = boxer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="p-5 sm:p-6">

      <div className="flex items-start gap-4">

        <RankBadge rank={boxer.rank} />

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-500/15 bg-red-500/[0.07] text-sm font-black text-red-500">
          {initials}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <h3 className="truncate font-bold text-white">
                {boxer.name}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-600">
                {boxer.academy?.name ||
                  "Academy not listed"}
              </p>

            </div>

            <div className="shrink-0 text-right">

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                Points
              </p>

              <p className="text-2xl font-black text-red-500">
                {boxer.points}
              </p>

            </div>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-4">

            <MiniStat
              label="Category"
              value={
                boxer.category ||
                boxer.ageGroup ||
                "—"
              }
            />

            <MiniStat
              label="Weight"
              value={
                boxer.weightCategory ||
                boxer.weight ||
                "—"
              }
            />

            <MiniStat
              label="Events"
              value={String(
                boxer.tournaments
              )}
            />

            <MiniStat
              label="Medals"
              value={`${boxer.medals.gold}G ${boxer.medals.silver}S ${boxer.medals.bronze}B`}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   RANK BADGE
============================================================= */

function RankBadge({
  rank,
}: {
  rank: number;
}) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  return (
    <div
      className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg px-2 text-xs font-black ${
        isFirst
          ? "bg-red-600 text-white shadow-[0_5px_18px_rgba(220,38,38,0.2)]"
          : isSecond
            ? "border border-slate-400/15 bg-slate-400/10 text-slate-300"
            : isThird
              ? "border border-orange-500/15 bg-orange-500/10 text-orange-400"
              : "border border-white/[0.06] bg-white/[0.025] text-slate-600"
      }`}
    >
      #{rank}
    </div>
  );
}

/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-400">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#05070a] p-5 transition-all duration-300 hover:border-red-500/15">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
          {icon}
        </div>

        <div>

          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {label}
          </p>

          <p className="mt-1 text-2xl font-black text-white">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   MEDAL SUMMARY CARD
============================================================= */

function MedalSummaryCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number | string;
  className: string;
}) {
  return (
    <div
      className={`rounded-[22px] border p-6 ${className}`}
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
        <Medal size={19} />
      </div>

      <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}

/* =============================================================
   POINTS CARD
============================================================= */

function PointsCard({
  title,
  gold,
  silver,
  bronze,
  none,
}: {
  title: string;
  gold: number;
  silver: number;
  bronze: number;
  none: number;
}) {
  return (
    <div className="group rounded-[22px] border border-white/10 bg-[#05070a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
          <Trophy
            size={18}
            className="text-red-500"
          />
        </div>

        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-700">
          Tournament
        </span>

      </div>

      <h3 className="mt-6 text-xl font-black text-white">
        {title}
      </h3>

      <div className="mt-6 space-y-3">

        <PointRow
          label="Gold"
          value={gold}
          className="text-amber-400"
        />

        <PointRow
          label="Silver"
          value={silver}
          className="text-slate-300"
        />

        <PointRow
          label="Bronze"
          value={bronze}
          className="text-orange-400"
        />

        <PointRow
          label="Participation"
          value={none}
          className="text-red-500"
        />

      </div>

    </div>
  );
}

function PointRow({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5 last:border-0 last:pb-0">

      <span className="text-xs font-medium text-slate-600">
        {label}
      </span>

      <span
        className={`text-sm font-black ${className}`}
      >
        {value} pts
      </span>

    </div>
  );
}

/* =============================================================
   STATES
============================================================= */

function LoadingState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-5">

      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-red-600" />

      <p className="mt-5 text-sm font-medium text-slate-600">
        Loading official rankings...
      </p>

    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
        <ShieldCheck size={21} />
      </div>

      <p className="mt-4 text-sm font-semibold text-red-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
      >
        Try Again
      </button>

    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-600">
        <Trophy size={21} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">
        No rankings found
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        There are no verified tournament results
        matching the selected filters.
      </p>

    </div>
  );
}