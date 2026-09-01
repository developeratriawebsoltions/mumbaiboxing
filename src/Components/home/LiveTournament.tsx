"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type LiveMatch = {
  tournamentName: string;
  round: string;
  redCorner: { name: string; state: string; score: number };
  blueCorner: { name: string; state: string; score: number };
  time: string;
};

const MOCK: LiveMatch = {
  tournamentName: "Mumbai Boxing Championship 2025",
  round: "SEMI FINAL",
  redCorner: { name: "Vikas Patil", state: "Maharashtra", score: 2 },
  blueCorner: { name: "Arjun Kumar", state: "Rajasthan", score: 1 },
  time: "01:24",
};

export default function LiveTournament() {
  const [match] = useState<LiveMatch>(MOCK);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-white">
          Live Tournament
        </span>
        <span
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(220,38,38,0.15)", color: "#EF4444", border: "1px solid rgba(220,38,38,0.3)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: blink ? "#EF4444" : "transparent", transition: "background 0.2s" }}
          />
          LIVE
        </span>
      </div>

      {/* Tournament name */}
      <div className="px-5 pt-5 pb-3 text-center">
        <p className="text-base font-extrabold text-white leading-snug">{match.tournamentName}</p>
        <p className="text-xs font-bold tracking-widest mt-1" style={{ color: "#DC2626" }}>
          {match.round}
        </p>
      </div>

      {/* VS block */}
      <div className="flex items-center justify-between px-5 py-4 gap-3">
        {/* Red corner */}
        <div className="flex-1 text-center">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-extrabold"
            style={{ background: "rgba(220,38,38,0.2)", color: "#EF4444", border: "2px solid rgba(220,38,38,0.4)" }}
          >
            {match.redCorner.name.charAt(0)}
          </div>
          <p className="text-xs font-bold text-white">{match.redCorner.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>{match.redCorner.state}</p>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: "#DC2626" }}>
            Red Corner
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-white">{match.redCorner.score}</span>
            <span className="text-lg font-bold" style={{ color: "#6b7280" }}>VS</span>
            <span className="text-4xl font-extrabold text-white">{match.blueCorner.score}</span>
          </div>
        </div>

        {/* Blue corner */}
        <div className="flex-1 text-center">
          <div
            className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-extrabold"
            style={{ background: "rgba(59,130,246,0.2)", color: "#60A5FA", border: "2px solid rgba(59,130,246,0.4)" }}
          >
            {match.blueCorner.name.charAt(0)}
          </div>
          <p className="text-xs font-bold text-white">{match.blueCorner.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>{match.blueCorner.state}</p>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: "#60A5FA" }}>
            Blue Corner
          </p>
        </div>
      </div>

      {/* Round & Timer */}
      <div
        className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="text-xs font-bold text-white">ROUND 3</span>
        <span className="text-sm font-extrabold" style={{ color: "#DC2626" }}>{match.time}</span>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 mt-auto">
        <Link
          href="/events"
          className="block text-center text-xs font-bold py-2.5 rounded-xl transition-all"
          style={{ background: "rgba(220,38,38,0.12)", color: "#EF4444", border: "1px solid rgba(220,38,38,0.25)" }}
        >
          VIEW LIVE MATCH →
        </Link>
      </div>
    </div>
  );
}
