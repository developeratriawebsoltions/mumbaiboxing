
import Link from "next/link";
import Image from "next/image";
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
      className="relative w-full overflow-hidden border-t border-slate-100 bg-white"
    >
      <div className="mx-auto max-w-[1900px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">

        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[760px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#f50919]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#f50919]">
                Latest Updates
              </span>
            </div>

            <h2 className="text-[clamp(34px,4vw,56px)] font-black leading-[1.08] tracking-[-0.055em] text-[#080e19]">
              News &{" "}
              <span className="text-[#f50919]">
                Announcements
              </span>
            </h2>

            <p className="mt-4 max-w-[650px] text-sm leading-7 text-slate-500 sm:text-base">
              Stay updated with the latest announcements,
              activities and developments from the Mumbai
              Boxing Association.
            </p>
          </div>

          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold !text-[#f50919]"
          >
            View All News
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* NEWS CARDS */}
        {latestNews.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((item) => (
              <article
                key={item.id}
                className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e8edf3] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
              >
                {/* CARD IMAGE */}
                <div className="relative h-[210px] overflow-hidden bg-[#eef1f5] sm:h-[225px]">
                  <Image
                    src="/home/hero-bg-desktop.png"
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-[70%_center] transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-5 z-10 rounded-full bg-[#f50919] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    {item.category}
                  </span>

                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm">
                    <Newspaper size={18} />
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays
                      size={16}
                      className="text-[#f50919]"
                    />
                    <span>{formatDate(item.date)}</span>
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-[19px] font-black leading-[1.3] tracking-tight text-[#0a1020] transition-colors group-hover:text-[#f50919]">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.75] text-[#66758a]">
                    {item.summary}
                  </p>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[#f50919]"
                    />
                    <span className="truncate">
                      {item.location}
                    </span>
                  </div>

                  <Link
                    href="/news"
                    className="group/link mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide !text-[#f50919]"
                  >
                    Read News
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <Newspaper
              size={34}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-lg font-black text-[#0a1020]">
              No news available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              News and announcements will appear here.
            </p>
          </div>
        )}

        {/* BOTTOM CTA */}
        {latestNews.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/news"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#f50919] px-9 py-3 text-sm font-extrabold !text-white shadow-[0_10px_25px_rgba(245,9,25,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#d60013]"
            >
              Explore All News
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}

        {/* BOTTOM DECORATION */}
        <div className="mt-9 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#f50919]" />
          <span className="text-center text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Official MBA Updates
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#f50919]" />
          <span className="h-px w-10 bg-slate-300" />
        </div>
      </div>
    </section>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
