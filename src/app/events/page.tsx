"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  UserRound,
  Wallet,
} from "lucide-react";
import { tournamentUrl } from "@/lib/tournament-url";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
  imageUrl: string | null;
};

const STATUS_FILTERS = ["All", "upcoming", "open", "ongoing", "completed"];

function statusLabel(status: string) {
  if (status === "open") return "Registration Open";
  if (status === "ongoing") return "Ongoing";
  if (status === "completed") return "Completed";
  return "Upcoming";
}

function formatDate(start: string | null, end: string | null) {
  if (!start) return "Date to be announced";

  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return "Date to be announced";

  const format = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const formattedStart = format(startDate);
  if (!end) return formattedStart;

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) return formattedStart;
  return `${formattedStart} – ${format(endDate)}`;
}

function EventDetail({
  icon: Icon,
  children,
}: {
  icon: typeof CalendarDays;
  children: React.ReactNode;
}) {
  return (
    <p className="flex min-w-0 items-center gap-3 text-sm leading-6 text-[#52647a] sm:text-[15px]">
      <Icon
        size={18}
        strokeWidth={2.6}
        aria-hidden="true"
        className="shrink-0 text-[#f50919]"
      />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

export default function EventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchTournaments = useCallback(async () => {
    const response = await fetch("/api/tournaments", {
      cache: "no-store",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Unable to load tournaments.");
    }
    if (!Array.isArray(data)) {
      throw new Error("Tournament data is unavailable right now.");
    }

    return data as Tournament[];
  }, []);

  useEffect(() => {
    let active = true;

    fetchTournaments()
      .then((data) => {
        if (active) {
          setTournaments(data);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load tournaments. Please try again."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchTournaments]);

  function loadTournaments() {
    setLoading(true);
    setError("");
    fetchTournaments()
      .then((data) => {
        setTournaments(data);
      })
      .catch((loadError) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tournaments. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }

  const filtered =
    filter === "All"
      ? tournaments
      : tournaments.filter(
          (tournament) =>
            tournament.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_50%_15%,#ffffff_0%,#f8fafd_65%,#f0f4f9_100%)] text-[#101b2d]">
      <div className="mx-auto max-w-[1488px] px-5 pb-20 pt-8 sm:px-8 sm:pt-10 lg:px-0">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-medium text-[#75849a] sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-[#f50919]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#f50919]">Tournaments</span>
        </nav>

        <header className="mb-7">
          <p className="mb-2 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f50919] sm:text-sm">
            <span className="h-[3px] w-7 rounded-full bg-[#f50919]" />
            Events
          </p>
          <h1 className="text-[clamp(38px,4vw,52px)] font-black leading-[1.08] tracking-[-0.055em] text-[#101b2d]">
            All <span className="text-[#f50919]">Tournaments</span>
          </h1>
          <p className="mt-2 text-base leading-7 text-[#75849a] sm:text-lg">
            Browse all events and register for open tournaments.
          </p>
        </header>

        {!loading && !error && (
          <div
            className="mb-5 flex flex-wrap gap-2 pb-1"
            aria-label="Filter tournaments by status"
          >
            {STATUS_FILTERS.map((status) => {
              const selected = filter === status;
              const count =
                status === "All"
                  ? tournaments.length
                  : tournaments.filter(
                      (tournament) =>
                        tournament.status.toLowerCase() ===
                        status.toLowerCase()
                    ).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  aria-pressed={selected}
                  className={`min-h-[46px] shrink-0 rounded-full border px-4 text-sm font-semibold capitalize transition sm:px-6 ${
                    selected
                      ? "border-[#f50919] bg-[#f50919] text-white shadow-[0_8px_20px_rgba(245,9,25,0.18)]"
                      : "border-[#e0e6ee] bg-white text-[#53657b] hover:border-[#f50919] hover:text-[#f50919]"
                  }`}
                >
                  {status === "All"
                    ? `All (${count})`
                    : `${status.charAt(0).toUpperCase()}${status.slice(1)} (${count})`}
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="grid max-w-[840px] gap-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[326px] animate-pulse rounded-[18px] border border-[#e3e9f1] bg-white shadow-[0_14px_40px_rgba(20,38,62,0.06)]"
                aria-label="Loading tournaments"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="max-w-[840px] rounded-[18px] border border-red-100 bg-white px-6 py-12 text-center shadow-[0_14px_40px_rgba(20,38,62,0.06)]">
            <h2 className="text-lg font-bold text-[#101b2d]">
              Events could not load
            </h2>
            <p role="alert" className="mt-2 text-sm text-[#64748b]">
              {error}
            </p>
            <button
              type="button"
              onClick={loadTournaments}
              className="mt-5 rounded-full bg-[#f50919] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d60013]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="max-w-[840px] rounded-[18px] border border-[#e3e9f1] bg-white px-6 py-16 text-center shadow-[0_14px_40px_rgba(20,38,62,0.06)]">
            <CalendarDays size={36} className="mx-auto text-[#f50919]" />
            <h2 className="mt-4 text-lg font-bold text-[#101b2d]">
              No tournaments found
            </h2>
            <p className="mt-2 text-sm text-[#75849a]">
              Check back soon for upcoming events.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid max-w-[840px] gap-5">
            {filtered.map((tournament) => {
              const isOpen = tournament.status.toLowerCase() === "open";
              const badgeStyle = isOpen
                ? "bg-[#e2f8ec] text-[#119453]"
                : tournament.status.toLowerCase() === "ongoing"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-600";

              return (
                <article
                  key={tournament.id}
                  className="group flex flex-col gap-5 rounded-[18px] border border-[#e3e9f1] bg-white p-3 shadow-[0_14px_40px_rgba(20,38,62,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(20,38,62,0.12)] sm:flex-row sm:gap-7 sm:p-3"
                >
                  <div className="relative h-[230px] w-full shrink-0 overflow-hidden rounded-[13px] bg-[#e8edf3] sm:h-[304px] sm:w-[292px]">
                    <Image
                      src={tournament.imageUrl || "/home/hero-bg-mobile.png"}
                      alt={tournament.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 292px"
                      loading="eager"
                      fetchPriority="high"
                      unoptimized
                      className="object-cover object-[72%_center] transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-1 sm:py-3 sm:pr-5">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex min-h-[34px] items-center gap-2 rounded-full px-3.5 text-xs font-bold ${badgeStyle}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isOpen ? "bg-[#12a150]" : "bg-current"
                          }`}
                        />
                        {statusLabel(tournament.status)}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f1] text-[#f50919]">
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </div>

                    <h2 className="mt-3 text-[23px] font-black leading-tight tracking-[-0.035em] text-[#101b2d] sm:text-[25px]">
                      {tournament.name}
                    </h2>

                    <div className="mt-3 space-y-1.5">
                      <EventDetail icon={CalendarDays}>
                        {formatDate(tournament.startDate, tournament.endDate)}
                      </EventDetail>
                      {tournament.location && (
                        <EventDetail icon={MapPin}>
                          {tournament.location}
                        </EventDetail>
                      )}
                      {tournament.weightClass && (
                        <EventDetail icon={UserRound}>
                          {tournament.weightClass}
                        </EventDetail>
                      )}
                      <EventDetail icon={Wallet}>
                        Entry Fee: ₹{tournament.entryFee ?? 500}
                      </EventDetail>
                    </div>

                    <Link
                      href={tournamentUrl(tournament)}
                      className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-4 rounded-full bg-[#f50919] px-6 text-sm font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_10px_22px_rgba(245,9,25,0.15)] transition hover:bg-[#d60013] sm:mt-auto sm:w-fit sm:min-w-[208px]"
                    >
                      View details
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
