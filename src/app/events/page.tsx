"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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

const STATUS_FILTERS = ["All", "upcoming", "open", "ongoing", "completed"];

const statusLabel = (s: string) => {
  if (s === "open") return "Registration Open";
  if (s === "ongoing") return "Ongoing";
  if (s === "completed") return "Completed";
  return "Upcoming";
};

const statusStyle = (s: string) => {
  if (s === "open") return { background: "rgba(34,197,94,0.15)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)" };
  if (s === "ongoing") return { background: "rgba(59,130,246,0.15)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.25)" };
  if (s === "completed") return { background: "rgba(100,116,139,0.15)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.25)" };
  return { background: "rgba(212,160,23,0.12)", color: "#F0C040", border: "1px solid rgba(212,160,23,0.25)" };
};

const formatDate = (start: string | null, end: string | null) => {
  if (!start) return "Date TBD";
  const s = new Date(start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${s} – ${e}`;
};

export default function EventsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setTournaments(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? tournaments : tournaments.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen" style={{ background: "#0B1120" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "rgba(212,160,23,0.15)" }}>
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold" style={{ color: "#D4A017" }}>MBA</Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ color: "#94A3B8" }}>Login</Link>
            <Link href="/register" className="btn-gold text-sm font-semibold px-4 py-2 rounded-xl">Register</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>Events</p>
          <h1 className="text-4xl font-extrabold" style={{ color: "#F8F9FA" }}>All Tournaments</h1>
          <p className="mt-2 text-sm" style={{ color: "#94A3B8" }}>Browse all events and register for open tournaments</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors capitalize"
              style={filter === f
                ? { background: "#D4A017", color: "#0B1120" }
                : { background: "rgba(212,160,23,0.08)", color: "#94A3B8", border: "1px solid rgba(212,160,23,0.15)" }}
            >
              {f === "All" ? `All (${tournaments.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${tournaments.filter((t) => t.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 border animate-pulse" style={{ background: "#111827", borderColor: "rgba(212,160,23,0.15)", height: 240 }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24" style={{ color: "#94A3B8" }}>
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-lg font-semibold text-white">No tournaments found</p>
            <p className="text-sm mt-1">Check back soon for upcoming events.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ background: "#111827", borderColor: "rgba(212,160,23,0.15)" }}
              >
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4" style={statusStyle(t.status)}>
                  {statusLabel(t.status)}
                </span>

                <h3 className="font-bold text-lg text-white leading-snug">{t.name}</h3>

                <div className="mt-4 space-y-2 text-sm" style={{ color: "#94A3B8" }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#D4A017" }}>📅</span>
                    {formatDate(t.startDate, t.endDate)}
                  </div>
                  {t.location && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#D4A017" }}>📍</span> {t.location}
                    </div>
                  )}
                  {t.weightClass && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#D4A017" }}>🥊</span> {t.weightClass}
                    </div>
                  )}
                  {t.entryFee != null && (
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#D4A017" }}>💰</span> Entry Fee: ₹{t.entryFee}
                    </div>
                  )}
                </div>

                <Link
                  href={t.status === "open" ? "/register" : "#"}
                  className="btn-gold mt-5 block text-center text-sm px-4 py-2.5 rounded-xl"
                  style={t.status !== "open" ? { opacity: 0.45, pointerEvents: "none" } : {}}
                >
                  {t.status === "open" ? "Register Now" : t.status === "completed" ? "Completed" : "Coming Soon"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
