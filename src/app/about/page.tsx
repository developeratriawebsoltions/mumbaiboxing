"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { committeeMembers } from "@/data/committee";

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

/* =========================================================
   MISSION
========================================================= */

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

/* =========================================================
   FOCUS AREAS
========================================================= */

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

function CommitteeMemberCard({ member }: { member: typeof committeeMembers[0] }) {
  const [imgSrc, setImgSrc] = useState(member.image);

  return (
    <article
      className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#05070a] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
    >
      <div className="relative aspect-[4/4.3] overflow-hidden bg-[#0b0f15]">
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/20" />
        <div className="absolute left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-[9px] font-black text-white shadow-[0_8px_25px_rgba(220,38,38,0.25)]">
          MBA
        </div>
        <div className="absolute right-4 top-4 z-30 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-black tracking-wider text-slate-400 backdrop-blur-sm">
          #{String(member.number).padStart(2, "0")}
        </div>
        <div className="absolute inset-x-7 bottom-0 top-12 overflow-hidden rounded-t-[18px]">
          <img
            src={imgSrc}
            alt={member.name}
            onError={() => setImgSrc("/committee/placeholder.svg")}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070a] via-[#05070a]/50 to-transparent" />
        </div>
      </div>
      <div className="relative p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
          {member.role}
        </p>
        <h3 className="mt-2 min-h-[48px] text-base font-bold leading-6 text-white">
          {member.name}
        </h3>
        <div className="mt-5 h-px w-full bg-white/[0.08]" />
      </div>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-16" />
    </article>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page min-h-screen bg-[#f5f4f0] text-[#292824]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="about-hero relative isolate min-h-[600px] overflow-hidden border-b border-white/10 bg-[#05070a] lg:min-h-[660px]">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/about/about-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center] lg:object-center"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#05070a]/95 via-[#05070a]/75 to-[#05070a]/55 lg:bg-gradient-to-r lg:from-[#05070a]/95 lg:via-[#05070a]/75 lg:to-[#05070a]/15" />

        {/* Ambient Glow */}

        <div className="about-hero-content relative z-10 mx-auto w-full max-w-[1900px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">
          {/* Breadcrumb */}

          <div className="mb-10 flex items-center gap-2 text-xs text-slate-500">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <ChevronRight
              size={13}
              className="text-slate-700"
            />

            <span className="text-red-500">
              About Us
            </span>
          </div>

          <div className="max-w-[900px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                North Bombay District Amateur Boxing Association (NBDABA)
              </p>
            </div>

            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-[88px]">
              BUILDING THE FUTURE OF{" "}
              <span className="text-red-500">
                GRASSROOTS BOXING
              </span>
            </h1>

            <p className="mt-8 max-w-[760px] text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
              North Bombay District Amateur Boxing Association (NBDABA) is committed to developing world-class
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

     
<section className="about-intro relative overflow-hidden border-b border-slate-200 bg-[#f5f4f0]">
  {/* Subtle decorative background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.35]"
    style={{
      backgroundImage:
        "linear-gradient(#e8edf3 1px, transparent 1px), linear-gradient(90deg, #e8edf3 1px, transparent 1px)",
      backgroundSize: "48px 48px",
      maskImage:
        "linear-gradient(to right, transparent, black 65%, transparent)",
    }}
  />

  <div className="pointer-events-none absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-red-100/50 blur-[110px]" />

  <div className="relative mx-auto max-w-[1900px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

      {/* LEFT CONTENT */}
      <div className="lg:sticky lg:top-28">

        <div className="flex items-center gap-3">
          <span className="h-[3px] w-9 bg-[#f50919]" />

          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f50919]">
            About The Association
          </p>
        </div>

        <h2 className="mt-6 max-w-[650px] text-[clamp(36px,4.2vw,66px)] font-black uppercase leading-[1.04] tracking-[-0.055em] text-[#081421]">
          A STRONGER
          <br />
          FOUNDATION
          <br />
          FOR{" "}
          <span className="text-[#f50919]">
            BOXING.
          </span>
        </h2>

        <div className="mt-7 h-[4px] w-20 rounded-full bg-[#f50919]" />

        <p className="mt-7 max-w-[500px] text-[15px] font-medium leading-[1.85] text-slate-600 sm:text-[17px]">
          Building a stronger boxing community through
          athlete development, professional training,
          and opportunities for every aspiring champion.
        </p>

        <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-red-100 bg-white px-5 py-3 shadow-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#f50919]">
            ★
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-700">
            Discipline • Dedication • Determination
          </span>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="space-y-5">

        {/* Main introduction */}
        <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.04)] sm:p-9">
          <div className="absolute bottom-0 left-0 top-0 w-[4px] bg-[#f50919]" />

          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-[#f50919]">
              ✦
            </span>

            <h3 className="text-[19px] font-black tracking-tight text-[#081421]">
              Who We Are
            </h3>
          </div>

          <p className="text-[15px] leading-[1.9] text-slate-600 sm:text-[16px]">
            North Bombay District Amateur Boxing Association (NBDABA) is dedicated to creating a
            professional, accessible, and athlete-focused environment
            for the development of boxing across the region.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div className="group rounded-[20px] border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_16px_35px_rgba(15,23,42,0.07)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[23px] text-[#f50919] transition group-hover:bg-[#f50919] group-hover:text-white">
              ◎
            </div>

            <h3 className="mb-3 text-[18px] font-black text-[#081421]">
              Our Approach
            </h3>

            <p className="text-[14px] leading-[1.85] text-slate-600">
              Our approach combines grassroots participation,
              structured competition, responsible governance,
              technical development, athlete welfare, and
              community involvement.
            </p>
          </div>

          <div className="group rounded-[20px] border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_16px_35px_rgba(15,23,42,0.07)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[23px] text-[#f50919] transition group-hover:bg-[#f50919] group-hover:text-white">
              ↗
            </div>

            <h3 className="mb-3 text-[18px] font-black text-[#081421]">
              Our Commitment
            </h3>

            <p className="text-[14px] leading-[1.85] text-slate-600">
              By strengthening the foundations of the sport,
              the Association aims to provide boxers with
              meaningful opportunities to develop their abilities
              and progress towards higher levels of competition.
            </p>
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="flex flex-col gap-5 rounded-[20px] bg-[#081421] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-400">
              Our Vision
            </p>

            <h3 className="mt-2 text-[18px] font-black leading-snug text-white sm:text-[20px]">
              Developing the next generation
              <br className="hidden sm:block" />
              {" "}of boxing champions.
            </h3>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f50919] text-2xl text-white">
            ↗
          </span>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* =========================================================
          VISION
      ========================================================= */}

  
<section
  id="vision"
  className="about-vision relative isolate overflow-hidden bg-[#070b10] py-16 sm:py-20 lg:py-24"
>
  {/* Background decorative grid */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  {/* Red ambient glow */}
  <div className="pointer-events-none absolute -right-40 top-0 h-[550px] w-[550px] rounded-full bg-red-600/10 blur-[130px]" />

  <div className="relative mx-auto max-w-[1900px] px-5 sm:px-7 lg:px-8 xl:px-10 2xl:px-12">

    {/* MAIN VISION CARD */}
    <div className="relative isolate overflow-hidden rounded-[26px] border border-red-600/40 bg-[#0b0d12] shadow-[0_30px_90px_rgba(0,0,0,.35)] sm:rounded-[34px]">

      {/* Right side red atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_90%_45%,rgba(220,20,35,.3),transparent_55%)]"
      />

      {/* Decorative diagonal stripe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-0 hidden h-full w-44 skew-x-[-22deg] bg-red-600/10 lg:block"
      />

      {/* Subtle horizontal lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent 0px,transparent 44px,white 45px)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:min-h-[440px] lg:grid-cols-[230px_minmax(0,1fr)_270px] xl:grid-cols-[260px_minmax(0,1fr)_330px]">

        {/* LEFT - VISION TITLE */}
        <div className="relative z-10 flex flex-col justify-center px-7 pb-5 pt-9 sm:px-10 lg:py-14 lg:pl-12 lg:pr-8">

          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#f50919] text-white shadow-[0_10px_35px_rgba(245,9,25,.3)]">
            <Target size={32} strokeWidth={2.5} />
          </div>

          <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#ff3344]">
            Our Vision
          </p>

          <h2 className="mt-2 text-[42px] font-black leading-none tracking-[-0.055em] text-white sm:text-[50px] lg:text-[54px]">
            Vision
          </h2>

          <div className="mt-7 h-[4px] w-20 rounded-full bg-[#f50919]" />

          {/* Vertical divider desktop */}
          <div className="absolute bottom-14 right-0 top-14 hidden w-px bg-gradient-to-b from-transparent via-red-500/40 to-transparent lg:block" />
        </div>

        {/* CENTER - VISION STATEMENT */}
        <div className="relative z-10 flex flex-col justify-center px-7 pb-10 pt-5 sm:px-10 lg:py-14 lg:pl-12 lg:pr-3">

          <span
            aria-hidden="true"
            className="mb-1 block h-12 font-serif text-[90px] font-black leading-none text-[#f50919]"
          >
            “
          </span>

          <p className="max-w-[850px] text-[18px] font-medium leading-[1.85] text-slate-200 sm:text-[21px] lg:text-[22px] xl:text-[24px]">
            To establish{" "}
            <span className="font-bold text-[#ff3344]">
              North Bombay
            </span>{" "}
            as a premier hub for grassroots boxing excellence in
            India by developing{" "}
            <span className="font-bold text-[#ff3344]">
              world-class athletes
            </span>
            , upholding the highest standards of sportsmanship
            and technical officiating, and creating inclusive
            pathways from{" "}
            <span className="font-bold text-[#ff3344]">
              school level to national and international podiums.
            </span>
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#f50919]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              North Bombay District Amateur Boxing Association (NBDABA)
            </span>
          </div>
        </div>

        {/* RIGHT - BOXER VISUAL */}
        <div className="relative hidden min-h-[440px] lg:block">

          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(239,20,35,.3),transparent_65%)]" />

          {/* Boxer image - replace with your own asset */}
          <div
            className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
            style={{
              backgroundImage:
                "url('/home/vision-boxer.png')",
            }}
            role="img"
            aria-label="Boxer wearing red boxing gloves"
          />

          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b0d12] to-transparent" />
        </div>
      </div>

      {/* Bottom red accent */}
      <div className="absolute bottom-0 left-0 h-[3px] w-40 bg-gradient-to-r from-[#f50919] to-transparent" />
    </div>
  </div>
</section>


      {/* =========================================================
          MISSION
      ========================================================= */}

<section className="about-mission relative overflow-hidden bg-[#05080d] text-white">
  {/* Subtle background grid */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
      backgroundSize: "65px 65px",
    }}
  />

  {/* HERO BANNER */}
  <div className="relative min-h-[420px] overflow-hidden md:min-h-[480px] lg:min-h-[510px]">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/home/mission-boxer.jpg')",
        backgroundPosition: "center 35%",
      }}
    />

    <div className="absolute inset-0 bg-gradient-to-r from-[#05080d] via-[#05080d]/90 to-[#05080d]/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-transparent to-transparent" />

    <div className="relative mx-auto flex min-h-[420px] max-w-[1900px] items-center px-5 py-20 sm:px-8 md:min-h-[480px] lg:min-h-[510px] lg:px-12">
      <div className="max-w-[670px]">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-[3px] w-12 bg-[#ff102b]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#ff3047]">
            Our Mission
          </span>
        </div>

        <h2 className="text-[clamp(42px,5vw,76px)] font-black uppercase leading-[0.98] tracking-[-0.055em]">
          FOUR PILLARS.
          <br />
          <span className="text-[#ff1734]">
            ONE PURPOSE.
          </span>
        </h2>

        <p className="mt-7 max-w-[610px] text-[15px] leading-7 text-slate-200 sm:text-lg sm:leading-8">
          Our mission is built around four core priorities that
          guide the Association&apos;s work across athletes,
          coaches, officials, academies, and the wider
          boxing community.
        </p>
      </div>
    </div>
  </div>

  {/* MISSION CARDS */}
  <div className="relative z-10 mx-auto max-w-[1900px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
    <div className="-mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
      {missions.map((mission, index) => {
        const Icon = mission.icon;

        const images = [
          "/home/mission-athlete.jpg",
          "/home/mission-competition.jpg",
          "/home/mission-governance.jpg",
          "/home/mission-community.jpg",
        ];

        return (
          <article
            key={mission.number}
            className="group relative isolate min-h-[310px] overflow-hidden rounded-[22px] border border-red-600/50 bg-[#0b0e14] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff1734] hover:shadow-[0_20px_60px_rgba(255,0,40,0.12)] sm:min-h-[340px]"
          >
            {/* Card background image */}
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${images[index % images.length]}')`,
              }}
            />

            {/* Readability overlay */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#090b11] via-[#090b11]/95 via-50% to-[#090b11]/30" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#090b11]/70 to-transparent" />

            {/* Decorative number */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-4 text-[85px] font-black leading-none tracking-[-0.08em] text-transparent opacity-40"
              style={{
                WebkitTextStroke: "1px rgba(255,90,110,0.55)",
              }}
            >
              {mission.number}
            </span>

            {/* Card content */}
            <div className="relative flex h-full min-h-[310px] flex-col justify-between p-6 sm:min-h-[340px] sm:p-8">
              <div>
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-600 bg-red-600/10 text-[#ff1734] transition-colors duration-300 group-hover:bg-red-600 group-hover:text-white">
                    <Icon size={27} strokeWidth={2.2} />
                  </div>

                  <h3 className="max-w-[270px] pt-1 text-[21px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[24px]">
                    {mission.title}
                  </h3>
                </div>

                <p className="mt-7 max-w-[360px] text-[14px] leading-[1.8] text-slate-300 sm:text-[15px]">
                  {mission.description}
                </p>
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#ff3047]">
                  <CheckCircle2 size={17} />
                  Association Mission
                </div>

                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-600 bg-[#080a0f] text-white transition-all duration-300 group-hover:bg-red-600"
                >
                  <span className="text-xl">→</span>
                </div>
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

   

<section className="about-focus relative isolate overflow-hidden border-b border-white/10 bg-[#070b10]">

  {/* FULL SECTION BACKGROUND IMAGE */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none absolute inset-0 -z-20
      bg-[url('/about/focus-bg.png')]
      bg-no-repeat
      bg-[position:38%_center]
      bg-cover
      sm:bg-[position:40%_center]
      lg:bg-[position:center_center]
      xl:bg-[length:100%_100%]
    "
  />

  {/* Background readability overlays */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none absolute inset-0 -z-10
      bg-gradient-to-r
      from-[#070b10]/90
      via-[#070b10]/35
      to-[#070b10]/75
      lg:from-[#070b10]/35
      lg:via-transparent
      lg:to-[#070b10]/20
    "
  />

  {/* Mobile background darkening */}
  <div className="pointer-events-none absolute inset-0 -z-10 bg-[#070b10]/30 lg:bg-transparent" />

  <div className="relative mx-auto max-w-[1900px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">

      {/* LEFT CONTENT */}
      <div className="relative flex min-h-[440px] flex-col items-start justify-center sm:min-h-[510px] lg:min-h-[620px]">

        <div className="relative z-10 flex items-center gap-3">
          <span className="h-[2px] w-10 bg-[#ff1026]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#ff3045]">
            Our Focus
          </span>
        </div>

        <h2 className="relative z-10 mt-7 max-w-[600px] text-[clamp(42px,4.2vw,72px)] font-black uppercase leading-[0.98] tracking-[-0.055em] text-white">
          DEVELOPING
          <br />
          THE <span className="text-[#ff263b]">SPORT</span>
        </h2>

        <p className="relative z-10 mt-7 max-w-[410px] text-[15px] leading-8 text-slate-300 sm:text-base">
          Every part of the boxing ecosystem matters. Our
          focus extends beyond competition to the people,
          infrastructure, standards, and opportunities that
          help the sport grow sustainably.
        </p>

        <a
          href="#focus-areas"
          className="relative z-10 mt-8 inline-flex items-center gap-8 rounded-full bg-[#f50919] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_35px_rgba(245,9,25,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d90015]"
        >
          Our Initiatives
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* RIGHT FEATURE CARDS */}
      <div
        id="focus-areas"
        className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {focusAreas.map((area, index) => {
          const Icon = area.icon;

          return (
            <article
              key={area.title}
              className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-[22px] border border-red-500/25 bg-[#0c1017]/95 p-7 shadow-[0_15px_40px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/60 hover:bg-[#12151d] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-8"
            >

              {/* Background number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-3 text-[85px] font-black leading-none tracking-[-0.08em] text-transparent opacity-40"
                style={{
                  WebkitTextStroke:
                    "1px rgba(255,45,65,0.35)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-600/25 to-red-950/20 text-[#ff3549] transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">
                <Icon size={25} strokeWidth={2} />
              </div>

              <h3 className="relative z-10 mt-7 text-xl font-extrabold tracking-tight text-white">
                {area.title}
              </h3>

              <p className="relative z-10 mt-3 flex-1 text-[14px] leading-7 text-slate-400">
                {area.description}
              </p>

              {/* Bottom accent */}
              <div className="relative z-10 mt-7 flex items-center justify-between">
                <span className="h-[2px] w-10 bg-[#ff1730] transition-all duration-300 group-hover:w-20" />

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 text-lg text-white transition-all duration-300 group-hover:bg-red-600">
                  <span aria-hidden="true">→</span>
                </span>
              </div>

            </article>
          );
        })}
      </div>
    </div>
  </div>
</section>



      {/* =========================================================
          MANAGING COMMITTEE
      ========================================================= */}

      <section
        id="committee"
        className="about-committee relative overflow-hidden border-b border-[#e5e2dc] bg-[#f5f4f0]"
      >
        <div className="relative mx-auto max-w-[1900px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">
          {/* =====================================================
              COMMITTEE HEADER
          ===================================================== */}

          <div className="mb-12 max-w-[1050px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                North Bombay District Amateur Boxing Association
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl xl:text-[70px]">
              MANAGING COMMITTEE{" "}
              <span className="text-red-500">
                2025 – 2030
              </span>
            </h2>

            <p className="mt-6 text-base font-medium text-slate-400 sm:text-lg">
              Managing Committee (2025 – 2030)
            </p>
          </div>

          {/* =====================================================
              COMMITTEE MEMBERS
          ===================================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {committeeMembers.map((member) => (
              <CommitteeMemberCard key={member.number} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          GOVERNANCE STATEMENT
      ========================================================= */}

      <section className="about-governance relative overflow-hidden border-b border-[#e5e2dc] bg-white">
        <div className="relative mx-auto max-w-[1900px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">
          <div className="rounded-2xl border border-[#e5e2dc] bg-[#f5f4f0] p-7 sm:p-10 lg:p-12">
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

      <section className="about-registration border-b border-[#e5e2dc] bg-[#f5f4f0]">
        <div className="mx-auto max-w-[1900px] px-5 py-8 sm:px-7 lg:px-8 xl:px-10 2xl:px-12">
          <div className="flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Award
                size={15}
                className="text-red-500"
              />

              <span>
                North Bombay District Amateur Boxing Association (NBDABA)
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


    </main>
  );
}