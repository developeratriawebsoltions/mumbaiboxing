"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  IndianRupee,
  Info,
  MapPin,
} from "lucide-react";
import { tournamentSlug, tournamentUrl } from "@/lib/tournament-url";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
};

function formatDate(value: string | null) {
  if (!value) return "Date to be announced";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateRange(tournament: Tournament) {
  const start = formatDate(tournament.startDate);
  if (!tournament.endDate) return start;

  return `${start} – ${formatDate(tournament.endDate)}`;
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-5">
      <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#f50919]">
        <Icon size={24} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-[0.1em] text-[#74849b]">
          {label}
        </span>
        <span className="mt-1 block break-words text-[15px] font-bold leading-6 text-[#101b2d]">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function TournamentDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTournament() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/tournaments", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load tournament details.");
        }

        if (!Array.isArray(data)) {
          throw new Error("Tournament data is unavailable right now.");
        }

        const tournaments: Tournament[] = data;
        const legacyId = Number(params.id);
        const selected = Number.isInteger(legacyId) && legacyId > 0
          ? tournaments.find((item) => item.id === legacyId)
          : tournaments.find((item) => tournamentSlug(item.name) === params.id);

        if (!cancelled) {
          if (selected) {
            setTournament(selected);
            if (Number.isInteger(legacyId) && legacyId > 0) {
              router.replace(tournamentUrl(selected));
            }
          } else {
            setError("This tournament could not be found.");
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load tournament details. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTournament();
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  const registrationOpen = tournament?.status.toLowerCase() === "open";
  const statusLabel = tournament?.status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,#f8fafd_62%,#f0f4f9_100%)] text-[#101b2d]">
      <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 sm:px-8 sm:pt-7 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-medium text-[#75849a] sm:text-sm"
          >
            <Link href="/" className="transition-colors hover:text-[#f50919]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/events"
              className="transition-colors hover:text-[#f50919]"
            >
              Tournaments
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate font-semibold text-[#f50919]">
              {tournament?.name || "Tournament"}
            </span>
          </nav>

          <Link
            href="/events"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#e1e7ef] bg-white px-4 text-xs font-bold text-[#142033] shadow-sm transition hover:border-[#f50919] hover:text-[#f50919] sm:px-5 sm:text-sm"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            All events
          </Link>
        </div>

        <section className="mx-auto mt-6 max-w-[856px] sm:mt-5">
          <p className="mb-3 flex items-center gap-3 pl-1 text-xs font-extrabold uppercase tracking-[0.17em] text-[#f50919]">
            <span className="h-[3px] w-10 rounded-full bg-[#f50919]" />
            Tournament details
          </p>

          {loading ? (
            <div
              className="animate-pulse rounded-[20px] border border-[#e3e9f1] bg-white p-6 shadow-[0_18px_50px_rgba(20,38,62,0.08)] sm:p-8"
              aria-label="Loading tournament details"
            >
              <div className="h-9 w-2/3 rounded bg-slate-100" />
              <div className="mt-8 h-px bg-slate-100" />
              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-14 rounded-xl bg-slate-100" />
                ))}
              </div>
              <div className="mt-7 h-24 rounded-xl bg-slate-100" />
            </div>
          ) : error ? (
            <div className="rounded-[20px] border border-[#e3e9f1] bg-white p-7 shadow-[0_18px_50px_rgba(20,38,62,0.08)] sm:p-9">
              <h1 className="text-2xl font-extrabold text-[#101b2d]">
                Tournament details are unavailable
              </h1>
              <p role="alert" className="mt-3 text-sm leading-6 text-[#64748b]">
                {error}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-[#f50919] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d60013]"
              >
                Try again
              </button>
              <Link
                href="/events"
                className="ml-4 text-sm font-bold text-[#f50919] hover:underline"
              >
                Browse all events
              </Link>
            </div>
          ) : tournament ? (
            <article className="rounded-[20px] border border-[#e3e9f1] bg-white p-6 shadow-[0_20px_55px_rgba(20,38,62,0.1)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4eaf1] pb-6">
                <h1 className="text-[30px] font-black leading-tight tracking-[-0.04em] text-[#101b2d] sm:text-[38px]">
                  {tournament.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-bold ${
                    registrationOpen
                      ? "bg-[#e2f8ec] text-[#173f2c]"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      registrationOpen ? "bg-[#12a150]" : "bg-slate-400"
                    }`}
                  />
                  {statusLabel}
                </span>
              </div>

              <dl className="grid gap-x-8 gap-y-7 border-b border-[#e4eaf1] py-6 sm:grid-cols-2 sm:py-7">
                <DetailItem
                  icon={CalendarDays}
                  label="Dates"
                  value={formatDateRange(tournament)}
                />
                <DetailItem
                  icon={MapPin}
                  label="Venue"
                  value={tournament.location || "Venue to be announced"}
                />
                <DetailItem
                  icon={Dumbbell}
                  label="Weight class"
                  value={tournament.weightClass || "Details to be announced"}
                />
                <DetailItem
                  icon={IndianRupee}
                  label="Entry fee"
                  value={`₹${(tournament.entryFee ?? 500).toLocaleString("en-IN")}`}
                />
              </dl>

              <div className="mt-6 flex gap-4 rounded-xl bg-[#f0f5fc] px-5 py-5 text-sm leading-[1.65] text-[#63748e] sm:items-center sm:px-6">
                <Info
                  size={30}
                  className="mt-0.5 shrink-0 text-[#142033]"
                  aria-hidden="true"
                />
                <p>
                  Tournament entry is available to registered boxers with an
                  active Mumbai Boxing Association membership. Sign in or
                  create a boxer account, complete membership payment if
                  needed, then return here to finish tournament entry.
                </p>
              </div>

              {registrationOpen ? (
                <Link
                  href={`/register?tournamentId=${tournament.id}`}
                  className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-10 rounded-full bg-[#f50919] px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_25px_rgba(245,9,25,0.18)] transition hover:-translate-y-0.5 hover:bg-[#d60013] sm:w-auto sm:min-w-[324px]"
                >
                  Register for this tournament
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex min-h-[52px] cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-8 py-4 text-sm font-bold text-slate-500"
                >
                  Registration is not open
                </button>
              )}
            </article>
          ) : null}
        </section>
      </div>
    </main>
  );
}
