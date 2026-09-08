"use client";

import Link from "next/link";
import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  Scale,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

const missions = [
  {
    number: "01",
    title: "Grassroots Development",
    description:
      "Systematically scout and train boxing talent across Borivali, Andheri, and Kurla talukas through structured tournaments and affiliated gyms.",
    icon: Target,
  },
  {
    number: "02",
    title: "Transparent Governance",
    description:
      "Digitize athlete registries, medical screening, weigh-ins, and selection trials to ensure complete fairness.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Community Empowerment",
    description:
      "Facilitate affordable access to coaching, protective equipment, and athlete welfare programs for boxers of all economic backgrounds.",
    icon: HeartHandshake,
  },
  {
    number: "04",
    title: "Technical Excellence",
    description:
      "Conduct periodic seminars and accreditation clinics for referees, judges, and corner coaches matching state and national regulations.",
    icon: Trophy,
  },
];

const committeeMembers = [
  {
    number: 1,
    name: "Mr. Subhash Mahadeo Kolge",
    designation: "President",
    portfolio: "Executive Leadership & Strategic Alliances",
  },
  {
    number: 2,
    name: "Mr. Rajendra Sakharam Jathar",
    designation: "Vice President",
    portfolio: "Technical Operations & Training Oversight",
  },
  {
    number: 3,
    name: "Mr. Subhodh Pandharinath Raorane",
    designation: "Secretary",
    portfolio: "Governance, Circulars & Official Records",
  },
  {
    number: 4,
    name: "Mr. Shailesh Chandrabhan Tripathi",
    designation: "Joint Secretary",
    portfolio: "Operations, Affiliation & Digital Platforms",
  },
  {
    number: 5,
    name: "Mr. Vivek Shrikant Rane",
    designation: "Treasurer",
    portfolio: "Finance, Audit & Accounts Management",
  },
  {
    number: 6,
    name: "Mr. Dipak Manohar Kurulkar",
    designation: "Executive Member",
    portfolio: "Committee Governance & Athlete Welfare",
  },
  {
    number: 7,
    name: "Mr. Nitin Prabhakar Thakoor",
    designation: "Executive Member",
    portfolio: "Committee Governance & Event Logistics",
  },
];

const focusAreas = [
  {
    title: "Athlete Development",
    description:
      "Creating structured opportunities for boxers to develop their skills and progress through competitive levels.",
    icon: Dumbbell,
  },
  {
    title: "Youth & Grassroots",
    description:
      "Encouraging young athletes to discover boxing through schools, gyms, academies, and local competitions.",
    icon: GraduationCap,
  },
  {
    title: "Technical Standards",
    description:
      "Supporting qualified officials, coaches, referees, and judges through continuous technical development.",
    icon: Scale,
  },
  {
    title: "Community Welfare",
    description:
      "Building an inclusive boxing environment where athletes from different economic backgrounds can participate.",
    icon: Users,
  },
];

export default function AboutPage() {
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

        <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-7 sm:py-28 lg:px-8 lg:py-32 xl:px-10 2xl:px-12">

          {/* Breadcrumb */}

          <div className="mb-10 flex items-center gap-2 text-xs text-slate-500">

            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <ChevronRight size={13} className="text-slate-700" />

            <span className="text-red-500">
              About Us
            </span>

          </div>

          <div className="max-w-[1050px]">

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-[88px]">
              BUILDING THE FUTURE OF{" "}
              <span className="text-red-500">
                GRASSROOTS BOXING
              </span>
            </h1>

            <p className="mt-8 max-w-[900px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Mumbai Boxing Association is committed to developing world-class
              athletes, strengthening the boxing community, and creating
              inclusive pathways from school-level participation to national
              and international competition.
            </p>

          </div>

          {/* Hero Actions */}

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">

            <Link
              href="#vision"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-red-700 hover:shadow-[0_12px_35px_rgba(220,38,38,0.2)]"
            >
              Explore Our Vision

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3.5">

              <ShieldCheck
                size={17}
                className="text-red-500"
              />

              <span className="text-xs font-semibold text-slate-400">
                Established Since 1985
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#090c11]">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  About The Association
                </p>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                A STRONGER FOUNDATION FOR{" "}
                <span className="text-red-500">
                  BOXING
                </span>
              </h2>

            </div>

            <div className="space-y-6 text-[15px] leading-8 text-slate-400 sm:text-base sm:leading-9">

              <p>
                Mumbai Boxing Association is dedicated to creating a
                professional, accessible, and athlete-focused environment for
                the development of boxing across the region.
              </p>

              <p>
                Our approach combines grassroots participation, structured
                competition, responsible governance, technical development,
                athlete welfare, and community involvement.
              </p>

              <p>
                By strengthening the foundations of the sport, the Association
                aims to provide boxers with meaningful opportunities to develop
                their abilities and progress towards higher levels of
                competition.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          VISION
      ========================================================= */}

      <section
        id="vision"
        className="relative overflow-hidden border-b border-white/10 bg-[#05070a]"
      >

        <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-red-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="rounded-[30px] border border-red-500/20 bg-red-500/[0.035] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.2)] sm:p-10 lg:p-14">

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">

              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_10px_35px_rgba(220,38,38,0.2)]">
                  <Target size={24} />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Our Vision
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Vision
                </h2>

              </div>

              <div className="flex items-center">

                <p className="text-xl font-medium leading-9 text-slate-300 sm:text-2xl sm:leading-10 lg:text-[28px] lg:leading-[1.65]">
                  To establish North Bombay as a premier hub for grassroots
                  boxing excellence in India by developing world-class
                  athletes, upholding the highest standards of sportsmanship
                  and technical officiating, and creating inclusive pathways
                  from school level to national and international podiums.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          MISSION
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#090c11]">

        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-red-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="mb-12 max-w-[900px]">

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                Our Mission
              </p>

            </div>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              FOUR PILLARS.{" "}
              <span className="text-red-500">
                ONE PURPOSE.
              </span>
            </h2>

            <p className="mt-5 max-w-[750px] text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
              Our mission is built around four core priorities that guide the
              Association&apos;s work across athletes, coaches, officials,
              academies, and the wider boxing community.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {missions.map((mission) => {
              const Icon = mission.icon;

              return (
                <article
                  key={mission.number}
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#05070a] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8"
                >

                  {/* Number */}

                  <div className="absolute right-6 top-5 text-5xl font-black tracking-tighter text-white/[0.035] transition-colors duration-300 group-hover:text-red-500/[0.08]">
                    {mission.number}
                  </div>

                  <div className="relative">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 transition-all duration-200 group-hover:bg-red-600 group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
                      {mission.title}
                    </h3>

                    <p className="mt-3 max-w-[650px] text-sm leading-7 text-slate-400 sm:text-[15px]">
                      {mission.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">

                      <CheckCircle2 size={13} />

                      Association Mission

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          FOCUS AREAS
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Our Focus
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                DEVELOPING THE{" "}
                <span className="text-red-500">
                  SPORT
                </span>
              </h2>

              <p className="mt-5 max-w-[600px] text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
                Every part of the boxing ecosystem matters. Our focus extends
                beyond competition to the people, infrastructure, standards,
                and opportunities that help the sport grow sustainably.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {focusAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <div
                    key={area.title}
                    className="group rounded-2xl border border-white/10 bg-[#090c11] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-[#0b0f15]"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition-colors duration-200 group-hover:bg-red-600 group-hover:text-white">
                      <Icon size={19} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-white">
                      {area.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {area.description}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          EXECUTIVE COMMITTEE
      ========================================================= */}

      <section
        id="committee"
        className="relative overflow-hidden border-b border-white/10 bg-[#090c11]"
      >

        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-red-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="mb-12 max-w-[900px]">

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                Executive Committee · 2025–2030
              </p>

            </div>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
              LEADERSHIP &{" "}
              <span className="text-red-500">
                GOVERNANCE
              </span>
            </h2>

            <p className="mt-5 max-w-[800px] text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
              The Executive Committee provides leadership across governance,
              technical operations, finance, athlete welfare, affiliation,
              digital platforms, and event management.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {committeeMembers.map((member) => (
              <article
                key={member.number}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#05070a] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:shadow-[0_20px_55px_rgba(0,0,0,0.4)]"
              >

                {/* =================================================
                    PHOTO AREA
                ================================================= */}

                <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0f15]">

                  {/* Subtle grid */}

                  <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Red glow */}

                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" />

                  {/* Association Badge */}

                  <div className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-[10px] font-black text-white shadow-[0_8px_25px_rgba(220,38,38,0.2)]">
                    MBA
                  </div>

                  {/* Number */}

                  <div className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[9px] font-black tracking-wider text-slate-400 backdrop-blur-sm">
                    #{String(member.number).padStart(2, "0")}
                  </div>

                  {/* Photo Placeholder */}

                  <div className="relative flex h-full w-full items-center justify-center">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-white/[0.04] text-2xl font-black text-slate-500 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                      {member.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(1, 3)
                        .map((word) => word[0])
                        .join("")}
                    </div>

                  </div>

                </div>

                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
                    {member.designation}
                  </p>

                  <h3 className="mt-2 text-base font-bold leading-6 text-white">
                    {member.name}
                  </h3>

                  <div className="mt-4 border-t border-white/10 pt-4">

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Portfolio
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                      {member.portfolio}
                    </p>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

      {/* =========================================================
          GOVERNANCE STATEMENT
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a] text-white">

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-red-600/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          <div className="rounded-[28px] border border-white/10 bg-[#090c11] p-7 sm:p-10 lg:p-12">

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div className="max-w-[850px]">

                <div className="flex items-center gap-3">

                  <span className="h-[2px] w-8 bg-red-600" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Our Commitment
                  </p>

                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  BUILDING A STRONGER{" "}
                  <span className="text-red-500">
                    BOXING COMMUNITY
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Through responsible governance, athlete-focused development,
                  technical excellence, and community participation, Mumbai
                  Boxing Association is committed to creating a stronger
                  foundation for the future of boxing.
                </p>

              </div>

              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-red-700 hover:shadow-[0_12px_35px_rgba(220,38,38,0.2)]"
              >
                Become Part of the Association

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          REGISTRATION
      ========================================================= */}

      <section className="border-b border-white/10 bg-[#090c11]">

        <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-8 xl:px-10 2xl:px-12">

          <div className="flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <Award
                size={15}
                className="text-red-500"
              />

              <span>
                Mumbai Boxing Association
              </span>

            </div>

            <div className="flex items-start gap-2 sm:items-center">

              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-red-500 sm:mt-0"
              />

              <span>
                Regd. No. F-45151 (MUM) under The Bombay Public Trusts Act, 1950
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <Footer />
    </main>
  );
}