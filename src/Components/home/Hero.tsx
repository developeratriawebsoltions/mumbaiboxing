import Link from "next/link";

const heroStats = [
  { value: "1,240+", label: "Registered Boxers" },
  { value: "186+",   label: "Certified Coaches"  },
  { value: "42+",    label: "Academies"           },
  { value: "15+",    label: "Tournaments / Year"  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #060C18 0%, #0B1120 55%, #0E1A30 100%)" }}>

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animate-glow-pulse absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%)" }} />
        <div className="animate-glow-pulse delay-400 absolute bottom-0 right-[-100px] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(212,160,23,0.10) 0%, transparent 70%)" }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: "linear-gradient(rgba(212,160,23,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,1) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      {/* Decorative rings */}
      <div className="absolute right-[-160px] top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(212,160,23,0.06)" }} />
      <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(212,160,23,0.10)" }} />

      <div className="relative container mx-auto px-6 py-28 md:py-36">
        <div className="max-w-4xl">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
            style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.30)" }}>
            <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: "#D4A017" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#F0C040" }}>
              Official Boxing Association Portal — Mumbai
            </span>
          </div>

          {/* Headline — Bebas Neue */}
          <h1 className="animate-fade-up delay-100 font-display text-[80px] md:text-[110px] leading-none text-white tracking-wide">
            WHERE
            <br />
            <span className="text-gold-shimmer">CHAMPIONS</span>
            <br />
            ARE BUILT.
          </h1>

          {/* Sub */}
          <p className="animate-fade-up delay-200 mt-7 text-lg leading-relaxed max-w-2xl"
            style={{ color: "#94A3B8" }}>
            Mumbai Boxing Association — the official platform for boxer registrations,
            tournament management, live rankings, certifications and complete academy operations
            across Mumbai's three talukas.
          </p>

          {/* Buttons */}
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap gap-4">
            <Link href="/dashboard" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm">
              Register Now <span>→</span>
            </Link>
            <Link href="/dashboard/ranking" className="btn-ghost inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm">
              View Rankings
            </Link>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-up delay-400 mt-10 flex flex-wrap gap-6">
            {["BFI Affiliated", "3 Talukas", "Annual Championships", "Digital IDs"].map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm" style={{ color: "#64748B" }}>
                <span style={{ color: "#D4A017" }}>✓</span> {b}
              </div>
            ))}
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="animate-fade-up delay-500 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {heroStats.map((s, i) => (
            <div key={s.label}
              className={`glass-card group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 delay-${(i+1)*100}`}>
              {/* Gold top line */}
              <div className="h-px mb-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(90deg,transparent,#D4A017,transparent)" }} />
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F1F5F9, transparent)" }} />
    </section>
  );
}
