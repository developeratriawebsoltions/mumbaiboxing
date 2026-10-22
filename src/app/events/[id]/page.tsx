"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function TournamentDetailsPage() {
  const params = useParams<{ id: string }>();
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
        const selected = tournaments.find(
          (item) => item.id === Number(params.id)
        );

        if (!cancelled) {
          if (selected) {
            setTournament(selected);
          } else {
            setError("This tournament could not be found.");
          }
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load tournament details. Please try again.");
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
  }, [params.id]);

  const registrationOpen = tournament?.status.toLowerCase() === "open";

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-extrabold text-red-500">
            MUMBAI BOXING
          </Link>
          <Link href="/events" className="text-sm font-semibold text-slate-300 hover:text-white">
            All events
          </Link>
        </div>
      </header>

      <section className="container mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
          Tournament details
        </p>

        {loading ? (
          <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-8" aria-label="Loading tournament details">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="mt-5 h-8 max-w-md rounded bg-white/10" />
            <div className="mt-8 h-20 rounded bg-white/10" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
            <h1 className="text-2xl font-bold">Tournament details are unavailable</h1>
            <p role="alert" className="mt-3 text-sm leading-6 text-slate-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
            >
              Try again
            </button>
            <Link href="/events" className="mt-5 inline-block text-sm font-semibold text-red-400 hover:text-red-300">
              Browse all events
            </Link>
          </div>
        ) : tournament ? (
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
                {tournament.name}
              </h1>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold capitalize text-slate-300">
                {tournament.status.replaceAll("_", " ")}
              </span>
            </div>

            <dl className="mt-8 grid gap-5 border-y border-white/10 py-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dates
                </dt>
                <dd className="mt-1 text-sm text-slate-200">
                  {formatDate(tournament.startDate)}
                  {tournament.endDate &&
                    ` – ${formatDate(tournament.endDate)}`}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Venue
                </dt>
                <dd className="mt-1 text-sm text-slate-200">
                  {tournament.location || "Venue to be announced"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Weight class
                </dt>
                <dd className="mt-1 text-sm text-slate-200">
                  {tournament.weightClass || "Details to be announced"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Entry fee
                </dt>
                <dd className="mt-1 text-sm text-slate-200">
                  ₹{(tournament.entryFee ?? 500).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-sm leading-6 text-slate-400">
              Tournament entry is available to registered boxers with an active
              Mumbai Boxing Association membership. Sign in or create a boxer
              account, complete membership payment if needed, then return here
              to finish tournament entry.
            </p>

            {registrationOpen ? (
              <Link
                href={`/register?tournamentId=${tournament.id}`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-500 sm:w-auto"
              >
                Register for this tournament
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-xl bg-slate-700 px-5 py-3.5 text-sm font-bold text-slate-300 sm:w-auto"
              >
                Registration is not open
              </button>
            )}
          </article>
        ) : null}
      </section>
    </main>
  );
}
