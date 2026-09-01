"use client";
import { useState } from "react";
import Link from "next/link";
import LiveTournament from "./LiveTournament";

const data: Record<string, { rank: number; name: string; state: string; pts: number }[]> = {
  SENIOR: [
    { rank: 1, name: "Vikas Patil",    state: "Maharashtra", pts: 980 },
    { rank: 2, name: "Arjun Kumar",    state: "Rajasthan",   pts: 920 },
    { rank: 3, name: "Sameer Khan",    state: "Uttar Pradesh", pts: 870 },
    { rank: 4, name: "Rohit Sharma",   state: "Delhi",       pts: 780 },
    { rank: 5, name: "Imran Shaikh",   state: "Maharashtra", pts: 710 },
  ],
  YOUTH: [
    { rank: 1, name: "Rahul Desai",    state: "Maharashtra", pts: 860 },
    { rank: 2, name: "Karan Mehta",    state: "Gujarat",     pts: 810 },
    { rank: 3, name: "Dev Yadav",      state: "UP",          pts: 760 },
    { rank: 4, name: "Nikhil More",    state: "Maharashtra", pts: 700 },
    { rank: 5, name: "Aditya Nair",    state: "Kerala",      pts: 650 },
  ],
  WOMEN: [
    { rank: 1, name: "Pooja Desai",    state: "Maharashtra", pts: 940 },
    { rank: 2, name: "Sneha Kulkarni", state: "Maharashtra", pts: 890 },
    { rank: 3, name: "Priya Singh",    state: "Delhi",       pts: 820 },
    { rank: 4, name: "Anita Rao",      state: "Karnataka",   pts: 760 },
    { rank: 5, name: "Meena Patil",    state: "Maharashtra", pts: 700 },
  ],
};

const rankColors: Record<number, { bg: string; text: string }> = {
  1: { bg: "rgba(234,179,8,0.15)",  text: "#FBBF24" },
  2: { bg: "rgba(148,163,184,0.15)", text: "#94A3B8" },
  3: { bg: "rgba(180,83,9,0.15)",   text: "#F97316" },
};

export default function Rankings() {
  const [tab, setTab] = useState<"SENIOR" | "YOUTH" | "WOMEN">("SENIOR");
  const rows = data[tab];
  const maxPts = rows[0].pts;

  return (
    <section className="py-16" style={{ background: "#070D14" }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Rankings panel ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#DC2626" }}>
                  Leaderboard
                </p>
                <h2 className="text-lg font-extrabold text-white">Top Rankings</h2>
              </div>
              <Link href="/dashboard/ranking" className="text-xs font-semibold" style={{ color: "#DC2626" }}>
                VIEW FULL RANKINGS →
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex px-5 pt-4 gap-2">
              {(["SENIOR", "YOUTH", "WOMEN"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="text-[11px] font-bold px-4 py-1.5 rounded-full transition-all"
                  style={
                    tab === t
                      ? { background: "#DC2626", color: "#fff" }
                      : { background: "rgba(255,255,255,0.06)", color: "#6b7280" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Rows */}
            <div className="px-5 py-4 space-y-3">
              {rows.map((r) => {
                const badge = rankColors[r.rank];
                return (
                  <div key={r.rank} className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                      style={badge
                        ? { background: badge.bg, color: badge.text }
                        : { background: "rgba(255,255,255,0.06)", color: "#94A3B8" }}
                    >
                      {String(r.rank).padStart(2, "0")}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(220,38,38,0.15)", color: "#DC2626" }}
                    >
                      {r.name.charAt(0)}
                    </div>

                    {/* Name + bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-white truncate">{r.name}</p>
                        <span className="text-xs font-extrabold ml-2 flex-shrink-0" style={{ color: "#EF4444" }}>
                          {r.pts} <span className="text-[10px] font-normal" style={{ color: "#6b7280" }}>pts</span>
                        </span>
                      </div>
                      <p className="text-[10px] mb-1" style={{ color: "#6b7280" }}>{r.state}</p>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(r.pts / maxPts) * 100}%`,
                            background: "linear-gradient(90deg,#DC2626,#EF4444)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Live Tournament panel ── */}
          <LiveTournament />
        </div>
      </div>
    </section>
  );
}
