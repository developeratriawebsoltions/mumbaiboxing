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
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)]">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <Radio
              size={18}
              strokeWidth={1.8}
              className="text-[#DC2626]"
            />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Live Coverage
            </p>

            <h3 className="mt-0.5 text-base font-bold text-slate-950">
              Live Match
            </h3>
          </div>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5">
          <span
            className={`h-2 w-2 rounded-full bg-[#DC2626] transition-opacity duration-200 ${
              blink ? "opacity-100" : "opacity-30"
            }`}
          />

          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#DC2626]">
            Live
          </span>
        </div>
      </div>

      {/* =====================================================
          TOURNAMENT INFO
      ===================================================== */}
      <div className="px-5 pb-3 pt-6 text-center sm:px-6">

        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
          <Trophy
            size={18}
            strokeWidth={1.7}
            className="text-[#DC2626]"
          />
        </div>

        <h2 className="text-lg font-black leading-6 tracking-tight text-slate-950">
          {match.tournamentName}
        </h2>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black tracking-[0.12em] text-[#DC2626]">
            {match.round}
          </span>
        </div>

      </div>

      {/* =====================================================
          FIGHTERS / SCORE
      ===================================================== */}
      <div className="px-5 py-6 sm:px-6">

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">

          {/* RED CORNER */}
          <div className="text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-50 bg-red-50 text-xl font-black text-[#DC2626]">
              {match.redCorner.name.charAt(0)}
            </div>

            <p className="truncate text-sm font-bold text-slate-950">
              {match.redCorner.name}
            </p>

            <div className="mt-1 flex items-center justify-center gap-1">
              <MapPin
                size={10}
                className="text-slate-300"
              />

              <p className="truncate text-[10px] text-slate-400">
                {match.redCorner.state}
              </p>
            </div>

            <span className="mt-2 inline-block text-[8px] font-black uppercase tracking-[0.14em] text-[#DC2626]">
              Red Corner
            </span>

          </div>

          {/* SCORE */}
          <div className="flex flex-col items-center">

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-4xl font-black tracking-tight text-slate-950">
                {match.redCorner.score}
              </span>

              <span className="text-[10px] font-black text-slate-300">
                VS
              </span>

              <span className="text-4xl font-black tracking-tight text-slate-950">
                {match.blueCorner.score}
              </span>
            </div>

            <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-300">
              Current Score
            </span>

          </div>

          {/* BLUE CORNER */}
          <div className="text-center">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-50 bg-blue-50 text-xl font-black text-blue-500">
              {match.blueCorner.name.charAt(0)}
            </div>

            <p className="truncate text-sm font-bold text-slate-950">
              {match.blueCorner.name}
            </p>

            <div className="mt-1 flex items-center justify-center gap-1">
              <MapPin
                size={10}
                className="text-slate-300"
              />

              <p className="truncate text-[10px] text-slate-400">
                {match.blueCorner.state}
              </p>
            </div>

            <span className="mt-2 inline-block text-[8px] font-black uppercase tracking-[0.14em] text-blue-500">
              Blue Corner
            </span>

          </div>

        </div>
      </div>

      {/* =====================================================
          ROUND / TIMER
      ===================================================== */}
      <div className="mx-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 sm:mx-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Current Round
            </p>

            <p className="mt-1 text-sm font-black text-slate-950">
              Round 3
            </p>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <Clock3
              size={16}
              className="text-[#DC2626]"
            />

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Time
              </p>

              <p className="mt-1 text-sm font-black tabular-nums text-[#DC2626]">
                {match.time}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}
      <div className="mt-auto px-5 pb-5 pt-5 sm:px-6 sm:pb-6">

        <Link
          href="/events"
          className="group flex w-full items-center justify-between rounded-xl bg-[#DC2626] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:bg-[#B91C1C] hover:shadow-lg hover:shadow-red-900/10"
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