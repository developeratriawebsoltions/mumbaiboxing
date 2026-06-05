import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#060C18" }}>

      {/* Centre glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[320px] rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(ellipse, #D4A017 0%, transparent 70%)" }} />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(rgba(212,160,23,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,1) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      <div className="relative container mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7"
          style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.30)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: "#D4A017" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#F0C040" }}>
            Join the Association Today
          </span>
        </div>

        {/* Headline — Bebas */}
        <h2 className="font-display text-[72px] md:text-[96px] leading-none text-white tracking-wide max-w-3xl mx-auto">
          READY TO START YOUR
          <br />
          <span className="text-gold-shimmer">BOXING JOURNEY?</span>
        </h2>

        <p className="mt-6 text-lg max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
          Register as a boxer, coach or academy on the official Mumbai Boxing Association portal.
          Get your digital ID, track rankings and enter tournaments — all in one place.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard" className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm">
            Register Now →
          </Link>
          <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm">
            Go to Portal
          </Link>
        </div>

        {/* Mini stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-10">
          {[
            { value: "Free", label: "Registration" },
            { value: "Instant", label: "Digital ID" },
            { value: "24/7", label: "Portal Access" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-sm mt-1" style={{ color: "#475569" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
