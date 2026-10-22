"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Radio,
  Trophy,
} from "lucide-react";

type LiveMatch = {
  tournamentName: string;
  round: string;
  redCorner: {
    name: string;
    state: string;
    score: number;
  };
  blueCorner: {
    name: string;
    state: string;
    score: number;
  };
  time: string;
};

const MOCK: LiveMatch = {
  tournamentName: "Mumbai Boxing Championship 2025",
  round: "SEMI FINAL",
  redCorner: {
    name: "Vikas Patil",
    state: "Maharashtra",
    score: 2,
  },
  blueCorner: {
    name: "Arjun Kumar",
    state: "Rajasthan",
    score: 1,
  },
  time: "01:24",
};

export default function LiveTournament() {
  const [match] = useState<LiveMatch>(MOCK);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setBlink((b) => !b);
    }, 900);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#090c11] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">

      {/* =====================================================
          AMBIENT GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-red-600/5 blur-3xl" />

      {/* =====================================================
          SUBTLE GRID
      ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
            <Radio
              size={18}
              strokeWidth={1.8}
              className="text-red-500"
            />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Live Coverage
            </p>

            <h3 className="mt-0.5 text-base font-bold text-white">
              Live Match
            </h3>
          </div>

        </div>

        {/* Live badge */}

        <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">

          <span
            className={`h-2 w-2 rounded-full bg-red-500 transition-opacity duration-200 ${
              blink ? "opacity-100" : "opacity-30"
            }`}
          />

          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-red-500">
            Live
          </span>

        </div>

      </div>

      {/* =====================================================
          TOURNAMENT INFO
      ===================================================== */}

      <div className="relative z-10 px-5 pb-3 pt-6 text-center sm:px-6">

        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">

          <Trophy
            size={18}
            strokeWidth={1.7}
            className="text-red-500"
          />

        </div>

        <h2 className="text-lg font-black leading-6 tracking-tight text-white">
          {match.tournamentName}
        </h2>

        <div className="mt-2 flex items-center justify-center gap-2">

          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[9px] font-black tracking-[0.12em] text-red-500">
            {match.round}
          </span>

        </div>

      </div>

      {/* =====================================================
          FIGHTERS / SCORE
      ===================================================== */}

      <div className="relative z-10 px-5 py-6 sm:px-6">

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">

          {/* =================================================
              RED CORNER
          ================================================= */}

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-500/10 bg-red-500/10 text-xl font-black text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.08)]">
              {match.redCorner.name.charAt(0)}
            </div>

            <p className="truncate text-sm font-bold text-white">
              {match.redCorner.name}
            </p>

            <div className="mt-1 flex items-center justify-center gap-1">

              <MapPin
                size={10}
                className="text-slate-600"
              />

              <p className="truncate text-[10px] text-slate-500">
                {match.redCorner.state}
              </p>

            </div>

            <span className="mt-2 inline-block text-[8px] font-black uppercase tracking-[0.14em] text-red-500">
              Red Corner
            </span>

          </div>

          {/* =================================================
              SCORE
          ================================================= */}

          <div className="flex flex-col items-center">

            <div className="flex items-center gap-2 sm:gap-3">

              <span className="text-4xl font-black tracking-tight text-white">
                {match.redCorner.score}
              </span>

              <span className="text-[10px] font-black text-slate-600">
                VS
              </span>

              <span className="text-4xl font-black tracking-tight text-white">
                {match.blueCorner.score}
              </span>

            </div>

            <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Current Score
            </span>

          </div>

          {/* =================================================
              BLUE CORNER
          ================================================= */}

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500/10 bg-blue-500/10 text-xl font-black text-blue-400">
              {match.blueCorner.name.charAt(0)}
            </div>

            <p className="truncate text-sm font-bold text-white">
              {match.blueCorner.name}
            </p>

            <div className="mt-1 flex items-center justify-center gap-1">

              <MapPin
                size={10}
                className="text-slate-600"
              />

              <p className="truncate text-[10px] text-slate-500">
                {match.blueCorner.state}
              </p>

            </div>

            <span className="mt-2 inline-block text-[8px] font-black uppercase tracking-[0.14em] text-blue-400">
              Blue Corner
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          ROUND / TIMER
      ===================================================== */}

      <div className="relative z-10 mx-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 sm:mx-6">

        <div className="flex items-center justify-between">

          {/* Round */}

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Current Round
            </p>

            <p className="mt-1 text-sm font-black text-white">
              Round 3
            </p>

          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Timer */}

          <div className="flex items-center gap-2">

            <Clock3
              size={16}
              className="text-red-500"
            />

            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Time
              </p>

              <p className="mt-1 text-sm font-black tabular-nums text-red-500">
                {match.time}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="relative z-10 mt-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6">

        <Link
          href="/events"
          className="group flex w-full items-center justify-between rounded-xl border border-red-500 bg-red-600 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:bg-red-700 hover:shadow-[0_10px_35px_rgba(220,38,38,0.2)]"
        >

          <span>
            View Live Match
          </span>

          <ArrowRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />

        </Link>

      </div>

    </div>
  );
}