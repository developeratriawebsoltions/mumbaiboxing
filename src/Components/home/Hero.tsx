"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [time, setTime] = useState({ d: 2, h: 18, m: 45, s: 11 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          d = 0;
          h = 0;
          m = 0;
          s = 0;
        }
        return { d, h, m, s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#f6f3f2]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.png')" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 21%, rgba(255,255,255,0.3) 38%, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.58) 100%)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1500px] flex-col justify-between px-5 pb-10 pt-5 md:px-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-[1440px] items-start justify-between gap-8">
          <div className="max-w-[680px] pt-16 md:pt-20 xl:pt-28">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d52f2f] bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f1f1f] backdrop-blur-sm">
              <span className="text-[#d52f2f]">EST. 1985</span>
              <span className="h-4 w-px bg-[#d52f2f]/60" />
              <span className="text-[#1a1a1a]">Building champions since 1985</span>
            </div>

            <h1
              className="leading-[0.82] font-black tracking-[-0.06em] text-[#0f172a]"
              style={{ fontSize: "clamp(4rem, 7vw, 11rem)" }}
            >
              WHERE
              <br />
              <span className="text-[#e53935]">CHAMPIONS</span>
              <br />
              ARE BUILT.
            </h1>

            <p className="mt-6 max-w-[430px] text-base leading-7 text-[#1f2937] md:text-lg">
              Mumbai Boxing Association is dedicated to developing boxers, promoting the sport, and building a stronger boxing community.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-[#e53935] px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(229,57,53,0.35)] transition hover:scale-[1.02] hover:bg-[#d62d2d]"
              >
                Explore Boxing
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-md border border-[#2a2a2a]/70 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#111827] shadow-sm backdrop-blur-sm transition hover:bg-white/20"
              >
                View Tournaments
              </Link>
            </div>

            <div className="mt-12 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#111827]/70">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e53935] ring-4 ring-[#f8d9d9]" />
              Scroll Down
            </div>
          </div>

          <div className="hidden lg:block pt-24 pb-8">
            <div className="w-[310px] rounded-[22px] border border-white/60 bg-white/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e53935] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live
                </span>
              </div>

              <p className="text-[17px] font-bold leading-tight text-[#111827]">
                Mumbai Boxing Championship 2025
              </p>
              <p className="mt-1 text-sm text-[#6b7280]">Semi Final</p>

              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[
                  { value: pad(time.d), label: "Days" },
                  { value: pad(time.h), label: "Hrs" },
                  { value: pad(time.m), label: "Min" },
                  { value: pad(time.s), label: "Sec" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-[24px] font-black leading-none text-[#111827]">{value}</div>
                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7a7f87]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/events" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#d62d2d]">
                View Live <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
