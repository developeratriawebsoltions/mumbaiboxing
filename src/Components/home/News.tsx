import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Newspaper,
} from "lucide-react";

import { news } from "@/data/news";

export default function News() {
  const latestNews = [...news]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 3);

  return (
    <section
      id="news"
      className="relative overflow-hidden border-t border-white/10 bg-[#05070a]"
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Red glow */}
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-600/[0.07] blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-900/[0.08] blur-[150px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.07] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-400">
                Latest Updates
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              News &{" "}
              <span className="text-red-500">
                Announcements
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Stay updated with the latest announcements,
              activities and developments from the Mumbai
              Boxing Association.
            </p>
          </div>

          {/* View all */}
          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold !text-red-400 transition hover:!text-red-300"
          >
            View All News

            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =====================================================
            LATEST NEWS
        ===================================================== */}

        {latestNews.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {latestNews.map((item) => (
              <article
                key={item.id}
                className="
                  group
                  relative
                  flex
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#090c11]
                  shadow-[0_15px_50px_rgba(0,0,0,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-red-500/25
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                "
              >

                {/* Subtle red top line */}
                <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="relative flex h-36 items-end overflow-hidden bg-[#0c1118] p-5">

                  {/* Decorative glow */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />

                  {/* Grid */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                      backgroundSize: "35px 35px",
                    }}
                  />

                  {/* Newspaper icon */}
                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400 backdrop-blur-sm transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-red-400">
                    <Newspaper className="h-5 w-5" />
                  </div>

                  {/* Category */}
                  <span className="relative z-10 rounded-full border border-red-500/20 bg-red-600/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_5px_20px_rgba(220,38,38,0.2)]">
                    {item.category}
                  </span>
                </div>

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="flex flex-1 flex-col p-6">

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4 text-red-500" />

                    <span>
                      {formatDate(item.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight text-white transition-colors duration-200 group-hover:text-red-400">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                    {item.summary}
                  </p>

                  {/* Location */}
                  <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-slate-500">
                    <MapPin className="h-4 w-4 text-red-500" />

                    <span className="truncate">
                      {item.location}
                    </span>
                  </div>

                  {/* Read more */}
                  <Link
                    href="/news"
                    className="group/link mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide !text-slate-400 transition-colors hover:!text-red-400"
                  >
                    Read News

                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}

          </div>
        ) : (
          /* =====================================================
             EMPTY STATE
          ===================================================== */
          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">

            <Newspaper className="mx-auto h-8 w-8 text-slate-600" />

            <h3 className="mt-4 text-lg font-black text-white">
              No news available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              News and announcements will appear here.
            </p>
          </div>
        )}

        {/* =====================================================
            BOTTOM BUTTON
        ===================================================== */}

        {latestNews.length > 0 && (
          <div className="mt-9 flex justify-center">

            <Link
              href="/news"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-6
                py-3
                text-sm
                font-bold
                !text-white
                backdrop-blur-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-red-500/25
                hover:bg-red-500/10
                hover:!text-red-400
              "
            >
              Explore All News

              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

          </div>
        )}

        {/* =====================================================
            BOTTOM DECORATION
        ===================================================== */}

        <div className="mt-12 flex items-center justify-center gap-3">

          <span className="h-px w-10 bg-white/10" />

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
            Official MBA Updates
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="h-px w-10 bg-white/10" />

        </div>

      </div>
    </section>
  );
}

/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}