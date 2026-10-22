import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Newspaper,
  Trophy,
  Users,
  ShieldCheck,
  Bell,
} from "lucide-react";

import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

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
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        {/* Ambient glow */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-red-600/[0.07] blur-3xl" />

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

          <div className="mb-10 flex items-center gap-2 text-xs">

            <Link
              href="/"
              className="text-slate-600 transition-colors hover:text-white"
            >
              Home
            </Link>

            <span className="text-slate-800">
              /
            </span>

            <span className="text-red-500">
              News
            </span>

          </div>

          <div className="max-w-[1050px]">

            {/* Label */}

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            {/* Heading */}

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[84px]">

              NEWS &{" "}

              <span className="text-red-500">
                ANNOUNCEMENTS
              </span>

            </h1>

            {/* Description */}

            <p className="mt-7 max-w-[850px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Stay informed with the latest news, official
              announcements, association activities, athlete
              development initiatives and updates from the
              Mumbai boxing community.
            </p>

            {/* Hero actions */}

            <div className="mt-9 flex flex-wrap gap-3">

              <a
                href="#latest-news"
                className="group inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition-all duration-200 hover:bg-red-700"
              >
                Latest News

                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />

              </a>

              <Link
                href="/events"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                View Tournaments

                <Trophy size={15} />

              </Link>

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

          <section
            id="latest-news"
            className="mt-16"
          >

            {/* Header */}

            <div className="mb-10">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Latest Updates
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl">

                LATEST NEWS &{" "}

                <span className="text-red-500">
                  ANNOUNCEMENTS
                </span>

              </h2>

              <p className="mt-4 max-w-[800px] text-sm leading-7 text-slate-500 sm:text-base">
                Official updates and important information from
                the Mumbai Boxing Association.
              </p>

            </div>

            {/* =================================================
                FEATURED NEWS
            ================================================= */}

            {featuredNews.length > 0 && (

              <div className="mb-16 grid gap-5 lg:grid-cols-2">

                {featuredNews
                  .slice(0, 2)
                  .map((item) => (

                    <article
                      key={item.id}
                      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#05070a] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
                    >

                      {/* Top red line */}

                      <div className="h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

                      {/* Decorative glow */}

                      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-600/[0.07] blur-3xl transition group-hover:bg-red-600/[0.12]" />

                      <div className="relative p-6 sm:p-8">

                        {/* Category + date */}

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="rounded-full border border-red-500/15 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-red-500">
                            {item.category}
                          </span>

                          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">

                            <CalendarDays
                              size={13}
                            />

                            {formatDate(
                              item.date
                            )}

                          </span>

                        </div>

                        {/* Title */}

                        <h3 className="mt-6 text-2xl font-black leading-tight tracking-tight text-white transition group-hover:text-red-500 sm:text-3xl">
                          {item.title}
                        </h3>

                        {/* Summary */}

                        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                          {item.summary}
                        </p>

                        {/* Location */}

                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-600">

                          <MapPin
                            size={14}
                            className="text-red-500"
                          />

                          {item.location}

                        </div>

                        {/* Content */}

                        <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-6">

                          {item.content
                            .slice(0, 2)
                            .map(
                              (
                                paragraph,
                                index
                              ) => (

                                <p
                                  key={index}
                                  className="text-sm leading-7 text-slate-500"
                                >
                                  {paragraph}
                                </p>

                              )
                            )}

                        </div>

                        {/* Bottom marker */}

                        <div className="mt-7 flex items-center gap-3">

                          <span className="h-px w-10 bg-red-600/60" />

                          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-700">
                            Official MBA Update
                          </span>

                        </div>

                      </div>

                    </article>

                  ))}

              </div>

            )}

            {/* =================================================
                ALL NEWS
            ================================================= */}

            <div>

              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <span className="h-[2px] w-7 bg-red-600/70" />

                    <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
                      Archive
                    </p>

                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                    ALL NEWS
                  </h2>

                </div>

                <span className="w-fit rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-slate-600">
                  {sortedNews.length}{" "}
                  {sortedNews.length === 1
                    ? "Update"
                    : "Updates"}
                </span>

              </div>

              {/* News cards */}

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {sortedNews.map(
                  (item) => (

                    <article
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#05070a] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
                    >

                      {/* Card header */}

                      <div className="relative flex h-36 items-end overflow-hidden bg-[#0d1118] p-5">

                        {/* Grid */}

                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.06]"
                          style={{
                            backgroundImage:
                              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                            backgroundSize:
                              "28px 28px",
                          }}
                        />

                        {/* Red glow */}

                        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-600/10 blur-2xl" />

                        {/* Icon */}

                        <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-red-500">

                          <Newspaper
                            className="h-5 w-5"
                          />

                        </div>

                        {/* Category */}

                        <span className="relative rounded-full bg-red-600 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(220,38,38,0.18)]">
                          {item.category}
                        </span>

                      </div>

                      {/* Card content */}

                      <div className="flex flex-1 flex-col p-6">

                        {/* Date */}

                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">

                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            item.date
                          )}

                        </div>

                        {/* Title */}

                        <h3 className="mt-4 text-xl font-black leading-tight text-white transition group-hover:text-red-500">
                          {item.title}
                        </h3>

                        {/* Summary */}

                        <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                          {item.summary}
                        </p>

                        {/* Location */}

                        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[10px] font-semibold text-slate-600">

                          <MapPin
                            size={14}
                            className="text-red-500"
                          />

                          {item.location}

                        </div>

                        {/* Footer marker */}

                        <div className="mt-5 flex items-center gap-2">

                          <span className="h-px w-6 bg-red-600/50 transition-all duration-300 group-hover:w-10" />

                          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-700">
                            MBA News
                          </span>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

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

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

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