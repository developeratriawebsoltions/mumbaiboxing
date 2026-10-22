"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  MapPin,
  Phone,
  UserRound,
  Building2,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Users,
  ShieldCheck,
  X,
} from "lucide-react";

import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

/* =========================================================
   ACADEMY DATA

   Edit this array whenever you want to add/update academies.

   No database or API is required for this public page.
   ========================================================= */

const academies = [
  {
    id: 1,
    name: "Mumbai Boxing Academy",
    location: "Andheri",
    taluka: "Andheri",
    address: "Andheri, Mumbai, Maharashtra",
    contactPerson: "—",
    phone: "—",
    status: "Active",
  },

  {
    id: 2,
    name: "Example Boxing Club",
    location: "Borivali",
    taluka: "Borivali",
    address: "Borivali, Mumbai, Maharashtra",
    contactPerson: "—",
    phone: "—",
    status: "Active",
  },

  // Add more academies below.
  //
  // {
  //   id: 3,
  //   name: "New Boxing Academy",
  //   location: "Kurla",
  //   taluka: "Kurla",
  //   address: "Kurla, Mumbai, Maharashtra",
  //   contactPerson: "Coach Name",
  //   phone: "+91 XXXXX XXXXX",
  //   status: "Active",
  // },
];

/* =========================================================
   PAGE
   ========================================================= */

export default function AcademiesPage() {
  const [search, setSearch] = useState("");
  const [selectedTaluka, setSelectedTaluka] =
    useState("All");

  /* -------------------------------------------------------
     UNIQUE TALUKAS
     ------------------------------------------------------- */

  const talukas = useMemo(() => {
    const values = academies
      .map((academy) => academy.taluka)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, []);

  /* -------------------------------------------------------
     FILTERED ACADEMIES
     ------------------------------------------------------- */

  const filteredAcademies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return academies.filter((academy) => {
      const matchesSearch =
        !query ||
        academy.name
          .toLowerCase()
          .includes(query) ||
        academy.location
          .toLowerCase()
          .includes(query) ||
        academy.taluka
          .toLowerCase()
          .includes(query) ||
        academy.address
          .toLowerCase()
          .includes(query);

      const matchesTaluka =
        selectedTaluka === "All" ||
        academy.taluka === selectedTaluka;

      return (
        matchesSearch &&
        matchesTaluka
      );
    });
  }, [search, selectedTaluka]);

  const activeAcademies =
    academies.filter(
      (academy) =>
        academy.status.toLowerCase() ===
        "active"
    ).length;

  const locations = new Set(
    academies.map(
      (academy) => academy.location
    )
  ).size;

  const clearFilters = () => {
    setSearch("");
    setSelectedTaluka("All");
  };

  return (
    <main className="min-h-screen bg-[#05070a] text-white">

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        {/* Ambient red glow */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-600/[0.07] blur-3xl" />

        {/* Background grid */}

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

          <div className="mb-10 flex items-center gap-2 text-xs text-slate-600">

            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <span className="text-slate-800">
              /
            </span>

            <span className="text-red-500">
              Academies
            </span>

          </div>

          <div className="max-w-[1050px]">

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[82px]">

              AFFILIATED{" "}

              <span className="text-red-500">
                BOXING
              </span>

              <br />

              ACADEMIES & CLUBS

            </h1>

            <p className="mt-7 max-w-[850px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Explore the boxing academies and clubs affiliated
              with the Mumbai Boxing Association. Find registered
              training centres, their locations and affiliation
              information across the Mumbai region.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

                <Building2
                  size={17}
                  className="text-red-500"
                />

                <span className="text-xs font-semibold text-slate-400">
                  Affiliated Clubs
                </span>

              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">

                <ShieldCheck
                  size={17}
                  className="text-red-500"
                />

                <span className="text-xs font-semibold text-slate-400">
                  Official Network
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#090c11]">

        {/* Background glow */}

        <div className="pointer-events-none absolute -left-40 top-60 h-[500px] w-[500px] rounded-full bg-red-600/[0.035] blur-[150px]" />

        <div className="pointer-events-none absolute -right-40 bottom-60 h-[500px] w-[500px] rounded-full bg-red-900/[0.05] blur-[150px]" />

        {/* Background grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-14 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              icon={
                <Building2 size={19} />
              }
              value={academies.length}
              label="Affiliated Clubs"
            />

            <StatCard
              icon={
                <CheckCircle2 size={19} />
              }
              value={activeAcademies}
              label="Active Affiliations"
            />

            <StatCard
              icon={
                <MapPin size={19} />
              }
              value={locations}
              label="Locations"
            />

            <StatCard
              icon={
                <Users size={19} />
              }
              value="MBA"
              label="Association Network"
            />

          </div>

          {/* =================================================
              DIRECTORY
          ================================================= */}

          <section
            id="affiliated-clubs"
            className="mt-16"
          >

            {/* Heading */}

            <div className="mb-8">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Official Directory
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl">

                AFFILIATED CLUBS{" "}

                <span className="text-red-500">
                  LIST
                </span>

              </h2>

              <p className="mt-4 max-w-[800px] text-sm leading-7 text-slate-400 sm:text-base">
                Browse the clubs affiliated with the Mumbai
                Boxing Association. Search by academy, club,
                location or taluka.
              </p>

            </div>

            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="rounded-[26px] border border-white/10 bg-[#05070a] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-6 lg:p-7">

              <div className="-mx-5 -mt-5 mb-6 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent sm:-mx-6 sm:-mt-6 lg:-mx-7 lg:-mt-7" />

              <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">

                {/* Search */}

                <div className="relative">

                  <Search
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search academy, club, location..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-12 pr-10 text-sm font-medium text-white outline-none transition placeholder:text-slate-700 focus:border-red-500/40 focus:bg-white/[0.04]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                </div>

                {/* Location */}

                <select
                  value={selectedTaluka}
                  onChange={(e) =>
                    setSelectedTaluka(
                      e.target.value
                    )
                  }
                  className="h-12 rounded-xl border border-white/10 bg-[#090c11] px-4 text-sm font-semibold text-slate-300 outline-none transition focus:border-red-500/40"
                >

                  {talukas.map(
                    (taluka) => (
                      <option
                        key={taluka}
                        value={taluka}
                        className="bg-[#090c11] text-white"
                      >
                        {taluka === "All"
                          ? "All Locations"
                          : taluka}
                      </option>
                    )
                  )}

                </select>

                {/* Clear */}

                {(search ||
                  selectedTaluka !==
                    "All") && (

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="h-12 rounded-xl border border-white/10 px-5 text-sm font-bold text-slate-400 transition hover:border-red-500/20 hover:bg-white/[0.03] hover:text-white"
                  >
                    Clear Filters
                  </button>

                )}

              </div>

              {/* Result count */}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-4">

                <p className="text-sm text-slate-600">

                  Showing{" "}

                  <span className="font-bold text-slate-300">
                    {filteredAcademies.length}
                  </span>{" "}

                  of{" "}

                  <span className="font-bold text-slate-300">
                    {academies.length}
                  </span>{" "}

                  affiliated clubs

                </p>

                {selectedTaluka !==
                  "All" && (

                  <span className="rounded-full border border-red-500/15 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
                    {selectedTaluka}
                  </span>

                )}

              </div>

            </div>

            {/* =================================================
                DESKTOP DIRECTORY
            ================================================= */}

            <div className="mt-8 hidden overflow-hidden rounded-[26px] border border-white/10 bg-[#05070a] shadow-[0_25px_70px_rgba(0,0,0,0.3)] lg:block">

              <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead>

                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        #
                      </th>

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Academy / Club
                      </th>

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Location
                      </th>

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Address
                      </th>

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Contact
                      </th>

                      <th className="px-6 py-5 text-left text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredAcademies.map(
                      (academy, index) => (

                        <tr
                          key={academy.id}
                          className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.025]"
                        >

                          {/* Number */}

                          <td className="px-6 py-6 text-sm font-bold text-slate-700">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </td>

                          {/* Academy */}

                          <td className="px-6 py-6">

                            <div className="flex items-center gap-4">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                                <Trophy className="h-5 w-5" />
                              </div>

                              <div>

                                <p className="font-bold text-slate-200">
                                  {academy.name}
                                </p>

                                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-700">
                                  MBA Affiliated Club
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Location */}

                          <td className="px-6 py-6">

                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">

                              <MapPin className="h-4 w-4 text-red-500" />

                              {academy.location}

                            </div>

                            <p className="mt-1 text-xs text-slate-700">
                              {academy.taluka} Taluka
                            </p>

                          </td>

                          {/* Address */}

                          <td className="max-w-xs px-6 py-6">

                            <p className="text-sm leading-6 text-slate-500">
                              {academy.address}
                            </p>

                          </td>

                          {/* Contact */}

                          <td className="px-6 py-6">

                            <div className="space-y-2">

                              {academy.contactPerson !==
                                "—" && (

                                <div className="flex items-center gap-2 text-sm text-slate-400">

                                  <UserRound className="h-4 w-4 text-slate-600" />

                                  {academy.contactPerson}

                                </div>

                              )}

                              {academy.phone !==
                                "—" && (

                                <div className="flex items-center gap-2 text-sm text-slate-500">

                                  <Phone className="h-4 w-4 text-slate-600" />

                                  {academy.phone}

                                </div>

                              )}

                              {academy.contactPerson ===
                                "—" &&
                                academy.phone ===
                                  "—" && (

                                <span className="text-sm text-slate-700">
                                  Contact details unavailable
                                </span>

                              )}

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-6">

                            <StatusBadge
                              status={
                                academy.status
                              }
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="mt-8 grid gap-4 lg:hidden">

              {filteredAcademies.map(
                (academy, index) => (

                  <article
                    key={academy.id}
                    className="rounded-[22px] border border-white/10 bg-[#05070a] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.2)]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                          <Trophy className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-500">
                            Club #
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </p>

                          <h3 className="mt-1 truncate text-lg font-black text-white">
                            {academy.name}
                          </h3>

                        </div>

                      </div>

                      <StatusBadge
                        status={
                          academy.status
                        }
                      />

                    </div>

                    <div className="mt-5 space-y-4 border-t border-white/[0.06] pt-5">

                      <DetailRow
                        icon={
                          <MapPin className="h-4 w-4" />
                        }
                        label="Location"
                        value={
                          academy.location
                        }
                      />

                      <DetailRow
                        icon={
                          <Building2 className="h-4 w-4" />
                        }
                        label="Taluka"
                        value={
                          academy.taluka
                        }
                      />

                      <DetailRow
                        icon={
                          <MapPin className="h-4 w-4" />
                        }
                        label="Address"
                        value={
                          academy.address
                        }
                      />

                      {academy.contactPerson !==
                        "—" && (

                        <DetailRow
                          icon={
                            <UserRound className="h-4 w-4" />
                          }
                          label="Contact Person"
                          value={
                            academy.contactPerson
                          }
                        />

                      )}

                      {academy.phone !==
                        "—" && (

                        <DetailRow
                          icon={
                            <Phone className="h-4 w-4" />
                          }
                          label="Phone"
                          value={
                            academy.phone
                          }
                        />

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredAcademies.length ===
              0 && (

              <div className="mt-8 rounded-[26px] border border-dashed border-white/10 bg-[#05070a] px-6 py-20 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">

                  <Search className="h-6 w-6 text-slate-600" />

                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  No affiliated clubs found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  We couldn&apos;t find an academy
                  matching your current search or
                  location filter.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Reset Search
                </button>

              </div>

            )}

          </section>

          {/* =================================================
              AFFILIATION INFORMATION
          ================================================= */}

          <section className="mt-20">

            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">

              {/* Left */}

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Affiliation Network
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

                  BUILDING A STRONGER{" "}

                  <span className="text-red-500">
                    BOXING ECOSYSTEM
                  </span>

                </h2>

                <p className="mt-6 text-base leading-8 text-slate-400">
                  Affiliated clubs play an important
                  role in developing boxing talent and
                  creating opportunities for athletes to
                  participate in structured competitions.
                </p>

                <p className="mt-4 text-base leading-8 text-slate-400">
                  Through its affiliated network, the
                  Mumbai Boxing Association supports
                  organized athlete development,
                  competition pathways, coaching and
                  sporting standards.
                </p>

              </div>

              {/* Right */}

              <div className="grid gap-4 sm:grid-cols-2">

                <InfoCard
                  icon={
                    <Trophy className="h-5 w-5" />
                  }
                  title="Athlete Development"
                  description="Supporting athletes through structured boxing training and competitive opportunities."
                />

                <InfoCard
                  icon={
                    <Users className="h-5 w-5" />
                  }
                  title="Club Network"
                  description="Connecting boxing clubs and academies through an organized affiliation framework."
                />

                <InfoCard
                  icon={
                    <ShieldCheck className="h-5 w-5" />
                  }
                  title="Sporting Standards"
                  description="Promoting responsible coaching, competition and sporting practices."
                />

                <InfoCard
                  icon={
                    <MapPin className="h-5 w-5" />
                  }
                  title="Local Reach"
                  description="Expanding access to boxing opportunities across different locations."
                />

              </div>

            </div>

          </section>

          {/* =================================================
              CTA
          ================================================= */}

          <section className="relative mt-20 overflow-hidden rounded-[28px] border border-white/10 bg-[#05070a]">

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:p-12">

              <div className="max-w-2xl">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Join the Network
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">

                  INTERESTED IN BECOMING AN{" "}

                  <span className="text-red-500">
                    AFFILIATED ACADEMY?
                  </span>

                </h2>

                <p className="mt-4 leading-7 text-slate-500">
                  Learn more about membership and
                  affiliation with the Mumbai Boxing
                  Association.
                </p>

              </div>

              <Link
                href="/register"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition hover:bg-red-700"
              >
                Become a Member

                <ArrowRight
                  className="h-4 w-4"
                />

              </Link>

            </div>

          </section>

          {/* Bottom decoration */}

          <div className="mt-16 flex items-center justify-center gap-3 sm:mt-20">

            <span className="h-px w-16 bg-white/[0.07]" />

            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
              Train · Compete · Belong
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

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#05070a] p-5 transition-all duration-300 hover:border-red-500/15">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
          {icon}
        </div>

        <div>

          <p className="text-2xl font-black text-white">
            {value}
          </p>

          <p className="mt-0.5 text-sm font-medium text-slate-600">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const isActive =
    status.toLowerCase() ===
    "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] ${
        isActive
          ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/[0.03] text-slate-600"
      }`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive
            ? "bg-emerald-500"
            : "bg-slate-600"
        }`}
      />

      {status}

    </span>
  );
}

/* =========================================================
   MOBILE DETAIL ROW
   ========================================================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-red-500">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-700">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-400">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   INFORMATION CARD
   ========================================================= */

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-[22px] border border-white/10 bg-[#05070a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
        {icon}
      </div>

      <h3 className="mt-5 font-black text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}