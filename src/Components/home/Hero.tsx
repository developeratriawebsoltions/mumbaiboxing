"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [time, setTime] = useState({ d: 2, h: 18, m: 45, s: 33 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = 0; h = 0; m = 0; s = 0; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* BG image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.png')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.25) 100%)" }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center container mx-auto px-6 pt-28 pb-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">

          {/* Left — headline */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/30 px-3 py-1 mb-6 text-[11px] tracking-widest text-white/80 uppercase">
              <span className="text-white/50">EST. 1985</span>
              <span className="w-px h-3 bg-white/30" />
              BUILDING CHAMPIONS SINCE 1985
            </div>

            <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(38px,8vw,96px)" }}>
              WHERE
              <br />
              <span style={{ color: "#DC2626" }}>CHAMPIONS</span>
              <br />
              ARE BUILT.
            </h1>

            <p className="mt-6 text-sm leading-relaxed max-w-sm" style={{ color: "#94A3B8" }}>
              Mumbai Boxing Association is dedicated to developing boxers, promoting the sport, and building a stronger boxing community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white uppercase tracking-wider"
                style={{ background: "#DC2626" }}>
                EXPLORE BOXING →
              </Link>
              <Link href="/events"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold uppercase tracking-wider"
                style={{ border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}>
                VIEW TOURNAMENTS
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-white/50 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              SCROLL DOWN
            </div>
          </div>

          {/* Right — Live countdown */}
          <div className="hidden lg:block shrink-0 w-64 rounded-lg p-5 self-center"
            style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-white font-bold text-base leading-tight">Mumbai Boxing Championship 2025</p>
            <p className="text-slate-400 text-xs mt-1 mb-4">Semi Final</p>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[{ v: pad(time.d), l: "DAYS" }, { v: pad(time.h), l: "HRS" }, { v: pad(time.m), l: "MIN" }, { v: pad(time.s), l: "SEC" }].map(({ v, l }) => (
                <div key={l}>
                  <div className="text-2xl font-extrabold text-white">{v}</div>
                  <div className="text-[9px] text-slate-400 tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            <Link href="/events" className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: "#DC2626" }}>
              VIEW LIVE →
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
