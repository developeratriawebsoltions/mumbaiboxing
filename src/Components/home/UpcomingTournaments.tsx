import Link from "next/link";

const events = [
  {
    name: "Mumbai Open Boxing Championship 2025",
    date: "20 Feb 2025",
    venue: "Andheri Sports Complex",
    entries: 128,
    status: "Registration Open",
    categories: ["Senior", "Junior", "Youth"],
    open: true,
  },
  {
    name: "Borivali Taluka Boxing Trials",
    date: "15 Mar 2025",
    venue: "Borivali Indoor Stadium",
    entries: 64,
    status: "Registration Open",
    categories: ["Senior", "Youth"],
    open: true,
  },
  {
    name: "District Under-19 Championship",
    date: "10 Apr 2025",
    venue: "Kurla Sports Hall",
    entries: 0,
    status: "Upcoming",
    categories: ["Junior", "Youth"],
    open: false,
  },
];

export default function UpcomingTournaments() {
  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>Events</p>
            <h2 className="text-4xl font-extrabold" style={{ color: "#0B1120" }}>Upcoming Tournaments</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold" style={{ color: "#D4A017" }}>
            View All Events →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev, i) => (
            <div
              key={ev.name}
              className={`animate-fade-up delay-${(i + 1) * 200} event-card group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
            >
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                style={ev.open
                  ? { background: "rgba(34,197,94,0.15)", color: "#4ADE80", border: "1px solid rgba(34,197,94,0.25)" }
                  : { background: "rgba(212,160,23,0.12)", color: "#F0C040", border: "1px solid rgba(212,160,23,0.25)" }}
              >
                {ev.status}
              </span>

              <h3 className="font-bold text-lg text-white leading-snug">{ev.name}</h3>

              <div className="mt-4 space-y-2 text-sm" style={{ color: "#94A3B8" }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#D4A017" }}>📅</span> {ev.date}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#D4A017" }}>📍</span> {ev.venue}
                </div>
                {ev.entries > 0 && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#D4A017" }}>👥</span> {ev.entries} entries registered
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {ev.categories.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(212,160,23,0.10)", color: "#D4A017" }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <Link href={ev.open ? "/register" : "/events"} className="btn-gold mt-5 block text-center text-sm px-4 py-2.5 rounded-xl">
                {ev.open ? "Register Now" : "View Details"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
