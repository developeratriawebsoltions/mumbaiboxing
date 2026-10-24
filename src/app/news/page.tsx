import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  FileText,
  Megaphone,
  MapPin,
  Newspaper,
  Star,
  Trophy,
  ShieldCheck,
  Bell,
  TrendingUp,
} from "lucide-react";

import { news } from "@/data/news";

/* =========================================================
   SEO
   ========================================================= */

export const metadata: Metadata = {
  title: "News & Announcements | Mumbai Boxing Association",
  description:
    "Read the latest news, official announcements, boxing activities, athlete development updates and events from the Mumbai Boxing Association.",
  keywords: [
    "Mumbai Boxing Association news",
    "Mumbai boxing news",
    "MBA boxing news",
    "boxing announcements Mumbai",
    "Mumbai boxing",
    "boxing events Mumbai",
    "boxing academy Mumbai",
  ],
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "News & Announcements | Mumbai Boxing Association",
    description:
      "Latest news, official announcements and updates from the Mumbai Boxing Association.",
    type: "website",
    url: "/news",
    siteName: "Mumbai Boxing Association",
  },
  twitter: {
    card: "summary",
    title: "News & Announcements | Mumbai Boxing Association",
    description:
      "Latest news, official announcements and updates from the Mumbai Boxing Association.",
  },
};

/* =========================================================
   PAGE
   ========================================================= */

export default function NewsPage() {
  const sortedNews = [...news].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  const featuredNews = sortedNews.filter(
    (item) => item.featured
  );

  return (
    <main className="min-h-screen bg-[#05070a] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

  
{/* =====================================================
    NEWS & ANNOUNCEMENTS — REDESIGNED HERO
===================================================== */}

<section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070a0f]">

  {/* Background decorative elements */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
      backgroundSize: "56px 56px",
    }}
  />

  {/* Red diagonal stripes */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -top-40 bottom-[-160px] left-[57%] hidden w-32 -skew-x-[28deg] bg-gradient-to-b from-red-700/50 via-red-800/25 to-red-950/5 lg:block"
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-40 -right-16 hidden h-[600px] w-28 -skew-x-[28deg] bg-red-700/25 lg:block"
  />

  <div className="pointer-events-none absolute -left-40 bottom-[-200px] h-[500px] w-[500px] rounded-full bg-red-600/15 blur-[130px]" />

  {/* Dotted pattern */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute right-8 top-12 hidden h-32 w-32 opacity-30 lg:block"
    style={{
      backgroundImage:
        "radial-gradient(#ff263b 1.5px,transparent 1.5px)",
      backgroundSize: "24px 24px",
    }}
  />

  <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

    {/* Breadcrumb */}
    <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-3 text-xs">
      <Link href="/" className="text-slate-500 transition hover:text-white">
        Home
      </Link>
      <span className="text-slate-700">/</span>
      <span className="font-semibold text-red-500">News</span>
    </nav>

    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">

      {/* LEFT CONTENT */}
      <div className="relative z-10">

        <div className="flex items-center gap-4">
          <span className="h-[2px] w-10 bg-[#ff1730]" />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#ff3045] sm:text-xs">
            Mumbai Boxing Association
          </p>
        </div>

        <h1 className="mt-8 text-[clamp(44px,5.2vw,88px)] font-black uppercase leading-[0.98] tracking-[-0.055em] text-white">
          NEWS &amp;
          <br />
          <span className="text-[#ff263b]">
            ANNOUNCEMENTS
          </span>
        </h1>

        <p className="mt-8 max-w-[690px] text-[15px] leading-8 text-slate-400 sm:text-lg sm:leading-9">
          Stay informed with the latest news, official
          announcements, association activities, athlete
          development initiatives and updates from the
          Mumbai boxing community.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">

          <a
            href="#latest-news"
            className="group inline-flex items-center justify-center gap-6 rounded-full bg-[#f50920] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_12px_40px_rgba(245,9,32,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d90019]"
          >
            Latest News
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>

          <Link
            href="/events"
            className="group inline-flex items-center justify-center gap-5 rounded-full border border-white/20 bg-white/[0.035] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-red-500 hover:bg-red-500/10"
          >
            View Tournaments
            <Trophy size={17} />
          </Link>

        </div>

        {/* Bottom mini indicators */}
        <div className="mt-12 flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Updates
          </span>
          <span className="h-4 w-px bg-white/10" />
          <span>Events</span>
          <span className="h-4 w-px bg-white/10" />
          <span>Achievements</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10">

        {/* Decorative news symbol */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/2 hidden h-56 w-56 -translate-y-1/2 items-center justify-center rounded-[40px] border border-red-500/20 bg-[#121019]/80 text-red-500/50 shadow-[0_0_90px_rgba(220,38,38,0.12)] -rotate-12 xl:flex"
        >
          <Newspaper size={110} strokeWidth={1.1} />
        </div>

        <div className="relative ml-auto max-w-[520px] space-y-3">

          {/* Featured announcement */}
          <article className="group relative overflow-hidden rounded-[22px] border border-red-500/35 bg-[#101117]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-red-500/70 sm:p-7">

            <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                <Megaphone size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-red-600/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Official Updates
                </span>

                <h3 className="mt-4 text-lg font-extrabold leading-snug text-white sm:text-xl">
                  Latest Association Announcements
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Discover important updates about tournaments,
                  registrations and association activities.
                </p>

                <a
                  href="#latest-news"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 transition hover:text-red-300"
                >
                  Explore Updates
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </article>

          {/* Upcoming events */}
          <Link
            href="/events"
            className="group flex items-center gap-4 rounded-[18px] border border-white/10 bg-[#0c1017]/95 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-white">
              <CalendarDays size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-white">
                Upcoming Events
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Explore upcoming boxing tournaments and events.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-red-500 transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Official announcements */}
          <a
            href="#latest-news"
            className="group flex items-center gap-4 rounded-[18px] border border-white/10 bg-[#0c1017]/95 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-white">
              <FileText size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-white">
                Official Announcements
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Read important notices from the association.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-red-500 transition-transform group-hover:translate-x-1"
            />
          </a>

          {/* News highlights */}
          <a
            href="#latest-news"
            className="group flex items-center gap-4 rounded-[18px] border border-white/10 bg-[#0c1017]/95 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/40"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] text-white">
              <Star size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-white">
                News &amp; Highlights
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Stories and highlights from Mumbai's boxing community.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-red-500 transition-transform group-hover:translate-x-1"
            />
          </a>

        </div>
      </div>
    </div>
  </div>
</section>


      {/* =====================================================
          NEWS CONTENT
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#090c11]">

        {/* Ambient background */}

        <div className="pointer-events-none absolute -left-40 top-80 h-[500px] w-[500px] rounded-full bg-red-600/[0.035] blur-[150px]" />

        <div className="pointer-events-none absolute -right-40 top-[45%] h-[500px] w-[500px] rounded-full bg-red-900/[0.04] blur-[150px]" />

        {/* Grid */}

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

          <div className="grid gap-4 sm:grid-cols-3">

            <StatCard
              value={news.length}
              label="Published Updates"
              icon={
                <Newspaper size={19} />
              }
            />

            <StatCard
              value={featuredNews.length}
              label="Featured Updates"
              icon={
                <Bell size={19} />
              }
            />

            <StatCard
              value="2026"
              label="Current Season"
              icon={
                <CalendarDays size={19} />
              }
            />

          </div>

          {/* =================================================
              LATEST NEWS
          ================================================= */}

       
{/* =====================================================
    LATEST NEWS & ANNOUNCEMENTS
    Redesigned — Mumbai Boxing Association
===================================================== */}

<section id="latest-news" className="relative mt-16">

  {/* Section heading */}
  <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <div className="flex items-center gap-3">
        <span className="h-[2px] w-9 bg-[#ff1730]" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#ff3045]">
          Latest Updates
        </span>
      </div>

      <h2 className="mt-5 max-w-[950px] text-4xl font-black uppercase leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[54px]">
        LATEST NEWS &amp;{" "}
        <span className="text-[#ff263b]">
          ANNOUNCEMENTS
        </span>
      </h2>

      <p className="mt-4 max-w-[720px] text-sm leading-7 text-slate-400 sm:text-base">
        Official updates and important information from the
        Mumbai Boxing Association.
      </p>
    </div>

    <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      <span className="text-xs font-semibold text-slate-300">
        {sortedNews.length} Published Updates
      </span>
    </div>
  </div>

  {/* Featured articles */}
  {featuredNews.length > 0 && (
    <div className="mb-20 grid gap-5 lg:grid-cols-2">
      {featuredNews.slice(0, 2).map((item, index) => {
        const GraphicIcon =
          index % 2 === 0 ? Megaphone : TrendingUp;

        return (
          <article
            key={item.id}
            className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#0b1017] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-[0_25px_65px_rgba(0,0,0,0.3)]"
          >
            {/* Top accent */}
            <div className="absolute left-0 top-0 z-10 h-24 w-[3px] bg-[#ff1730]" />

            <div className="relative flex flex-1 flex-col p-6 sm:p-8">

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.07em] text-[#ff3549]">
                  {item.category}
                </span>

                <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={14} />
                  {formatDate(item.date)}
                </span>
              </div>

              {/* Content + artwork */}
              <div className="mt-6 grid flex-1 gap-6 sm:grid-cols-[minmax(0,1fr)_170px] xl:grid-cols-[minmax(0,1fr)_190px]">

                <div className="flex min-w-0 flex-col">
                  <h3 className="text-[23px] font-black leading-[1.2] tracking-[-0.035em] text-white transition-colors group-hover:text-red-400 sm:text-[27px]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {item.summary}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={15} className="shrink-0 text-red-500" />
                    {item.location}
                  </div>
                </div>

                {/* CSS graphic — no image required */}
                <div className="relative hidden min-h-[225px] overflow-hidden rounded-[20px] border border-red-500/15 bg-gradient-to-br from-[#2b0b13] via-[#130b12] to-[#070b10] sm:flex sm:items-center sm:justify-center">

                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-600/25 blur-[60px]" />

                  <div className="absolute -bottom-12 left-8 h-[320px] w-14 rotate-[32deg] bg-red-600/20" />

                  <div
                    className="absolute right-3 top-4 h-24 w-24 opacity-50"
                    style={{
                      backgroundImage:
                        "radial-gradient(#ff263b 1.5px, transparent 1.5px)",
                      backgroundSize: "18px 18px",
                    }}
                  />

                  <div className="relative flex h-32 w-32 rotate-[-12deg] items-center justify-center rounded-[28px] border border-red-500/35 bg-gradient-to-br from-red-900/50 to-[#150b12] shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:rotate-0">
                    <GraphicIcon
                      size={62}
                      strokeWidth={1.5}
                      className="text-[#ff263b]"
                    />
                  </div>
                </div>
              </div>

              {/* Article excerpt */}
              {item.content?.length > 0 && (
                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  {item.content.slice(0, 1).map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm leading-7 text-slate-400"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-7 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Official MBA Update
                </span>

                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#ff3045]">
                  Featured News
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  )}

  {/* =====================================================
      ALL NEWS ARCHIVE
  ===================================================== */}

  <div>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-8 bg-red-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-red-500">
            News Archive
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          ALL <span className="text-[#ff263b]">NEWS</span>
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          Browse all published association updates and announcements.
        </p>
      </div>

      <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-400">
        {sortedNews.length}{" "}
        {sortedNews.length === 1 ? "Update" : "Updates"}
      </span>
    </div>

    {/* News grid */}
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

      {sortedNews.map((item, index) => {
        const CardIcon =
          index % 3 === 0
            ? Newspaper
            : index % 3 === 1
              ? TrendingUp
              : Megaphone;

        return (
          <article
            key={item.id}
            className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1017] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40"
          >
            {/* Graphic header */}
            <div className="relative flex h-[170px] items-center justify-center overflow-hidden border-b border-white/10 bg-[#100d13]">

              <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-red-600/15 blur-[70px]" />

              <div className="absolute left-1/2 top-[-60px] h-[300px] w-16 -translate-x-1/2 rotate-[30deg] bg-red-700/20" />

              <div
                className="absolute right-4 top-4 h-20 w-20 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(#ff263b 1.5px,transparent 1.5px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative flex h-20 w-20 rotate-[-10deg] items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110">
                <CardIcon size={36} strokeWidth={1.6} />
              </div>

              <span className="absolute bottom-4 left-5 rounded-full border border-red-500/30 bg-[#200b12] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-red-400">
                {item.category}
              </span>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col p-6">

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} className="text-red-500" />
                {formatDate(item.date)}
              </div>

              <h3 className="mt-4 text-xl font-black leading-snug tracking-tight text-white transition-colors group-hover:text-red-400">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
                {item.summary}
              </p>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-500">
                <MapPin size={14} className="text-red-500" />
                {item.location}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  MBA News
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/50 text-red-500 transition-all group-hover:bg-red-600 group-hover:text-white">
                  <ArrowRight size={17} />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>

    {sortedNews.length === 0 && (
      <div className="rounded-2xl border border-white/10 bg-[#0b1017] px-6 py-16 text-center">
        <Newspaper size={36} className="mx-auto text-slate-600" />
        <h3 className="mt-4 text-lg font-bold text-white">
          No news available
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Check back for the latest association updates.
        </p>
      </div>
    )}
  </div>
</section>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <section className="mt-20">

            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

              {/* Left */}

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-red-500">

                  <Newspaper
                    className="h-6 w-6"
                  />

                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Official Information
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

                  STAY CONNECTED{" "}

                  <span className="text-red-500">
                    WITH MBA
                  </span>

                </h2>

                <p className="mt-6 text-base leading-8 text-slate-500">
                  This page provides updates relating to the
                  Mumbai Boxing Association, its affiliated
                  clubs, athletes, coaches, tournaments and
                  sporting activities.
                </p>

                <p className="mt-4 text-base leading-8 text-slate-500">
                  Important announcements and official
                  information will be published here as they
                  become available.
                </p>

              </div>

              {/* Right */}

              <div className="rounded-[26px] border border-white/10 bg-[#05070a] p-6 sm:p-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">

                    <ShieldCheck
                      size={18}
                    />

                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                      MBA Network
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white">
                      Looking for something else?
                    </h3>

                  </div>

                </div>

                <p className="mt-5 text-sm leading-7 text-slate-500">
                  Explore tournaments, rankings and affiliated
                  academies through the Mumbai Boxing
                  Association website.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  <QuickLink
                    href="/rankings"
                    label="Rankings"
                  />

                  <QuickLink
                    href="/academies"
                    label="Academies"
                  />

                  <QuickLink
                    href="/events"
                    label="Tournaments"
                  />

                  <QuickLink
                    href="/about"
                    label="About MBA"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              CTA
          ================================================= */}

          <section className="relative mt-20 overflow-hidden rounded-[28px] border border-white/10 bg-[#05070a]">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:p-12">

              <div className="max-w-2xl">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Mumbai Boxing Association
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">

                  FOLLOW THE LATEST{" "}

                  <span className="text-red-500">
                    BOXING UPDATES
                  </span>

                </h2>

                <p className="mt-4 leading-7 text-slate-500">
                  Discover tournaments, rankings, affiliated
                  academies and other activities across the MBA
                  boxing network.
                </p>

              </div>

              <Link
                href="/register"
                className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition hover:bg-red-700"
              >

                Become a Member

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
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

    </main>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
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

          <p className="mt-1 text-sm font-medium text-slate-600">
            {label}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   QUICK LINK
   ========================================================= */

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-bold text-slate-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/[0.04] hover:text-white"
    >

      {label}

      <ArrowRight
        size={15}
        className="text-slate-700 transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-500"
      />

    </Link>
  );
}

/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
}