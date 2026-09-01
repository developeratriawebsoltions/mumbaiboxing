"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users, IndianRupee } from "lucide-react";

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

export default function UpcomingTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setTournaments(d.filter((t) => t.status !== "completed").slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const formatDate = (start: string | null, end: string | null) => {
    if (!start) return "Date TBD";
    const s = new Date(start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    if (!end) return s;
    const e = new Date(end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    return `${s} – ${e}`;
  };

  const isOpen = (status: string) => status === "open";

  const statusLabel = (status: string) => {
    if (status === "open") return "Registration Open";
    if (status === "ongoing") return "Ongoing";
    return "Upcoming";
  };

  if (tournaments.length === 0) return null;

  return (
    <section className="py-24" style={{ background: "#070D14" }}>
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#DC2626" }}>Events</p>
            <h2 className="text-4xl font-extrabold" style={{ color: "#F8F9FA" }}>Upcoming Tournaments</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold" style={{ color: "#DC2626" }}>
            View All Events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tournaments.map((t, i) => (
            <div
              key={t.id}
              className={`animate-fade-up delay-${(i + 1) * 200} event-card group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
            >
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                style={isOpen(t.status)
                  ? { background: "rgba(34,197,94,0.15)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)" }
                  : { background: "rgba(220,38,38,0.12)", color: "#EF4444", border: "1px solid rgba(220,38,38,0.25)" }}
              >
                {statusLabel(t.status)}
              </span>

              <h3 className="font-bold text-lg text-white leading-snug">{t.name}</h3>

              <div className="mt-4 space-y-2 text-sm" style={{ color: "#94A3B8" }}>
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} style={{ color: "#DC2626" }} />
                  {formatDate(t.startDate, t.endDate)}
                </div>
                {t.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: "#DC2626" }} /> {t.location}
                  </div>
                )}
                {t.weightClass && (
                  <div className="flex items-center gap-2">
                    <Users size={14} style={{ color: "#DC2626" }} /> {t.weightClass}
                  </div>
                )}
                {t.entryFee != null && (
                  <div className="flex items-center gap-2">
                    <IndianRupee size={14} style={{ color: "#DC2626" }} /> Entry Fee: ₹{t.entryFee}
                  </div>
                )}
              </div>

              <Link
                href={isOpen(t.status) ? "/register" : "/events"}
                className="btn-gold mt-5 block text-center text-sm px-4 py-2.5 rounded-xl"
              >
                {isOpen(t.status) ? "Register Now" : "View Details"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
