import Link from "next/link";

const topRankings = [
  { rank: 1, name: "Rahul Sharma",   weight: "60 KG", taluka: "Borivali", points: 120, gender: "Male"   },
  { rank: 2, name: "Pooja Desai",    weight: "52 KG", taluka: "Andheri",  points: 115, gender: "Female" },
  { rank: 3, name: "Aman Singh",     weight: "65 KG", taluka: "Andheri",  points: 110, gender: "Male"   },
  { rank: 4, name: "Sneha Kulkarni", weight: "46 KG", taluka: "Borivali", points: 102, gender: "Female" },
  { rank: 5, name: "Vikas More",     weight: "60 KG", taluka: "Kurla",    points: 98,  gender: "Male"   },
];

const rankBadge: Record<number, string> = {
  1: "rank-gold",
  2: "rank-silver",
  3: "rank-bronze",
};

export default function Rankings() {
  return (
    <section className="py-24" style={{ background: "#060C18" }}>
      <div className="container mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
              Leaderboard
            </p>
            <h2 className="text-4xl font-extrabold text-white">Top Ranked Boxers</h2>
            <p className="mt-2 text-sm" style={{ color: "#94A3B8" }}>
              Current season standings across all weight categories
            </p>
          </div>
          <Link
            href="/dashboard/ranking"
            className="rank-link text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View Full Rankings →
          </Link>
        </div>

        <div className="space-y-3">
          {topRankings.map((r, i) => (
            <div
              key={r.rank}
              className={`animate-fade-up delay-${(i + 1) * 100} ranking-row group flex items-center gap-4 rounded-2xl px-6 py-4 transition-all duration-300`}
            >
              {/* Rank badge */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${rankBadge[r.rank] ?? "rank-default"}`}>
                {r.rank}
              </div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: "rgba(212,160,23,0.15)", color: "#D4A017" }}
              >
                {r.name.charAt(0)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{r.name}</p>
                <p className="text-xs" style={{ color: "#64748B" }}>{r.taluka} Taluka · {r.gender}</p>
              </div>

              {/* Weight */}
              <div className="hidden sm:block text-center">
                <p className="text-sm font-semibold" style={{ color: "#CBD5E1" }}>{r.weight}</p>
                <p className="text-xs" style={{ color: "#475569" }}>Weight</p>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="text-xl font-extrabold" style={{ color: "#F0C040" }}>{r.points}</p>
                <p className="text-xs" style={{ color: "#475569" }}>pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
