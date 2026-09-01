"use client";
import { Check } from "lucide-react";

const milestones = [
  { year: "1985", title: "Founded",           desc: "Mumbai Boxing Association established." },
  { year: "2000", title: "City-Wide Reach",   desc: "Expansion of academies across all districts." },
  { year: "2015", title: "National Stage",    desc: "Consistent national-level tournament wins." },
  { year: "2026", title: "Digital Era",       desc: "Complete digital management platform.", active: true },
];

const highlights = [
  "Building Champions",
  "Promoting Fitness",
  "Creating Opportunities",
  "Stronger Communities",
];

export default function About() {
  return (
    <section id="about" style={{ background: "#070D14" }}>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Mission */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "#DC2626" }}>
              About Us
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase leading-tight mb-6">
              The Heart of<br />
              <span style={{ color: "#DC2626" }}>Boxing</span> in Mumbai
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#94A3B8" }}>
              For nearly four decades, the Mumbai Boxing Association has been the cornerstone of
              combat sports in Maharashtra — shaping lives through discipline, determination, and
              the relentless spirit of boxing.
            </p>

            <ul className="grid grid-cols-2 gap-3 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(220,38,38,0.15)", border: "1px solid #DC2626" }}>
                    <Check size={11} color="#DC2626" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:gap-4"
              style={{ background: "#DC2626" }}
            >
              Learn More <span>→</span>
            </a>
          </div>

          {/* RIGHT: Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, #DC2626 15%, #DC2626 85%, transparent)" }} />

            <div className="flex flex-col gap-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start pl-14 relative">
                  {/* Dot */}
                  <div
                    className="absolute left-[14px] top-1.5 w-3 h-3 rounded-full shrink-0"
                    style={
                      m.active
                        ? { background: "#DC2626", boxShadow: "0 0 0 4px rgba(220,38,38,0.2)" }
                        : { background: "#0A0F18", border: "2px solid rgba(255,255,255,0.3)" }
                    }
                  />

                  {/* Year badge */}
                  <div
                    className="shrink-0 px-3 py-1 text-xs font-extrabold rounded"
                    style={
                      m.active
                        ? { background: "#DC2626", color: "#fff" }
                        : { background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {m.year}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{m.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
