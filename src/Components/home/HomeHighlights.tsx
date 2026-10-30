"use client";

import Link from "next/link";
import { tournamentUrl } from "@/lib/tournament-url";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  isFeatured: boolean;
};

function isTournament(value: unknown): value is Tournament {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.status === "string" &&
    typeof item.isFeatured === "boolean" &&
    (typeof item.location === "string" || item.location === null) &&
    (typeof item.startDate === "string" || item.startDate === null) &&
    (typeof item.endDate === "string" || item.endDate === null) &&
    (typeof item.weightClass === "string" || item.weightClass === null)
  );
}

function formatDate(value: string | null) {
  if (!value) return "Date to be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(event: Tournament) {
  const start = formatDate(event.startDate);
  if (!event.endDate || start === "Date to be announced") return start;

  const end = formatDate(event.endDate);
  return end === start ? start : `${start} – ${end}`;
}

function eventLabel(event: Tournament) {
  if (event.isFeatured) return "Featured Tournament";
  if (event.status === "ongoing") return "Current Event";
  if (event.status === "open") return "Registration Open";
  return "Upcoming Event";
}

export default function HomeHighlights() {
  const [events, setEvents] = useState<Tournament[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setEventsLoading(true);
      setEventsError(false);
      try {
        const response = await fetch("/api/tournaments", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Tournament listings are unavailable.");
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Tournament listings returned an invalid response.");
        }

        const activeEvents = data
          .filter(isTournament)
          .filter(
            (event) =>
              !["completed", "cancelled"].includes(event.status)
          )
          .sort((first, second) => {
            if (first.isFeatured !== second.isFeatured) {
              return first.isFeatured ? -1 : 1;
            }

            const firstDate = first.startDate
              ? new Date(first.startDate).getTime()
              : Number.POSITIVE_INFINITY;
            const secondDate = second.startDate
              ? new Date(second.startDate).getTime()
              : Number.POSITIVE_INFINITY;
            return (
              (Number.isFinite(firstDate)
                ? firstDate
                : Number.POSITIVE_INFINITY) -
              (Number.isFinite(secondDate)
                ? secondDate
                : Number.POSITIVE_INFINITY)
            );
          })
          .slice(0, 2);

        if (!cancelled) {
          setEvents(activeEvents);
        }
      } catch {
        if (!cancelled) {
          setEventsError(true);
        }
      } finally {
        if (!cancelled) {
          setEventsLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <section
      aria-labelledby="home-upcoming-tournaments"
      className="relative z-20 bg-white pb-16 pt-10 sm:pt-12"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-600">
              <span className="h-[2px] w-6 bg-red-600" />
              North Bombay District Amateur Boxing Association (NBDABA)
            </p>
            <h2
              id="home-upcoming-tournaments"
              className="text-3xl font-black tracking-tight text-[#071015] sm:text-4xl"
            >
              Upcoming Tournaments
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
          >
            View all tournaments
            <ArrowRight size={16} />
          </Link>
        </div>

        {eventsLoading ? (
          <div
            role="status"
            aria-label="Loading featured tournaments"
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-[230px] animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : eventsError ? (
          <div
            role="status"
            className="rounded-2xl border border-slate-200 p-8 text-center"
          >
            <h2 className="font-bold text-slate-900">
              Unable to load tournaments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tournament information is temporarily unavailable.
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div
            role="status"
            className="rounded-2xl border border-slate-200 p-8 text-center"
          >
            <h2 className="font-bold text-slate-900">
              No tournaments announced
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Featured and upcoming events will appear here when available.
            </p>
            <Link
              href="/events"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
            >
              Browse all events
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="relative min-h-[230px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-y-0 right-0 w-[58%] bg-cover ${
                    index === 0
                      ? "bg-[position:76%_center]"
                      : "bg-[position:70%_center]"
                  }`}
                  style={{
                    backgroundImage: `url('${
                      index === 0
                        ? "/home/hero-bg-desktop.png"
                        : "/hero.png"
                    }')`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-white"
                  style={{
                    clipPath: "polygon(0 0, 62% 0, 45% 100%, 0 100%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[48%] w-[12%] bg-red-600/80"
                  style={{
                    clipPath: "polygon(85% 0, 100% 0, 15% 100%, 0 100%)",
                  }}
                />

                <div className="relative z-10 flex min-h-[230px] w-[70%] flex-col items-start p-4 sm:w-[65%] sm:p-6">
                  <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-red-600">
                    <span className="h-[2px] w-6 bg-red-600" />
                    {eventLabel(event)}
                  </div>

                  <h2 className="max-w-[320px] text-[clamp(17px,2vw,25px)] font-black leading-[1.05] tracking-tight text-[#071015]">
                    {event.name}
                  </h2>

                  <div className="mt-3 space-y-2 text-[11px] text-slate-600 sm:text-xs">
                    <p className="flex items-start gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-red-600"
                      />
                      <span>{formatDateRange(event)}</span>
                    </p>
                    {event.location && (
                      <p className="flex items-start gap-2">
                        <MapPin
                          size={15}
                          className="shrink-0 text-red-600"
                        />
                        <span>{event.location}</span>
                      </p>
                    )}
                    {event.weightClass && (
                      <p className="flex items-start gap-2">
                        <Users size={15} className="shrink-0 text-red-600" />
                        <span>{event.weightClass}</span>
                      </p>
                    )}
                  </div>

                  <Link
                    href={tournamentUrl(event)}
                    className="mt-auto inline-flex items-center gap-3 rounded-full bg-red-600 px-5 py-2.5 text-[10px] font-extrabold text-white transition hover:bg-red-700"
                  >
                    VIEW DETAILS
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
