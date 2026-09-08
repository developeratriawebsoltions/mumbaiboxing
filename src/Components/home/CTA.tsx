import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#05070a] py-24 sm:py-28 lg:py-32">

      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      {/* Large red centre glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="
            h-[280px]
            w-[650px]
            rounded-full
            bg-red-600/10
            blur-[120px]
            sm:h-[340px]
            sm:w-[800px]
          "
        />
      </div>

      {/* Secondary glow */}
      <div className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-red-900/10 blur-[140px]" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-red-700/[0.06] blur-[130px]" />

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Top red line */}
      <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto max-w-5xl px-6 text-center">

        {/* Badge */}
        <div
          className="
            mb-7
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-red-500/20
            bg-red-500/[0.07]
            px-4
            py-1.5
            shadow-[0_0_30px_rgba(239,68,68,0.05)]
          "
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
            Join the Association Today
          </span>
        </div>

        {/* Small eyebrow */}
        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-600">
          Mumbai Boxing Association
        </p>

        {/* Headline */}
        <h2 className="font-display mx-auto max-w-4xl text-[48px] leading-[0.9] tracking-wide text-white sm:text-[64px] md:text-[80px] lg:text-[96px]">

          READY TO START YOUR

          <br />

          <span className="text-red-500 drop-shadow-[0_0_35px_rgba(239,68,68,0.15)]">
            BOXING JOURNEY?
          </span>

        </h2>

        {/* Description */}
        <p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:text-lg">
          Register as a boxer, coach or academy on the
          official Mumbai Boxing Association portal.
          Get your digital ID, track rankings and enter
          tournaments — all in one place.
        </p>

        {/* =====================================================
            BUTTONS
        ===================================================== */}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">

          <Link
            href="/dashboard"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-10
              py-4
              text-sm
              font-bold
              !text-white
              shadow-[0_12px_35px_rgba(220,38,38,0.22)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-red-500
              hover:shadow-[0_16px_45px_rgba(220,38,38,0.32)]
            "
          >
            Register Now

            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/15
              bg-white/[0.03]
              px-10
              py-4
              text-sm
              font-bold
              !text-white
              backdrop-blur-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-white/25
              hover:bg-white/[0.07]
            "
          >
            Go to Portal
          </Link>

        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}
        <div className="mx-auto mt-14 h-px max-w-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent sm:mt-16" />

        {/* =====================================================
            MINI STATS
        ===================================================== */}
        <div className="mt-10 grid grid-cols-1 sm:mt-12 sm:grid-cols-3">

          {[
            {
              value: "Free",
              label: "Registration",
            },
            {
              value: "Instant",
              label: "Digital ID",
            },
            {
              value: "24/7",
              label: "Portal Access",
            },
          ].map((s, index) => (
            <div
              key={s.label}
              className={`
                px-5 py-4
                ${
                  index !== 0
                    ? "border-t border-white/10 sm:border-l sm:border-t-0"
                    : ""
                }
              `}
            >
              <p className="text-3xl font-black tracking-tight text-white">
                {s.value}
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:text-[10px]">
                {s.label}
              </p>
            </div>
          ))}

        </div>

        {/* =====================================================
            BOTTOM DECORATION
        ===================================================== */}
        <div className="mt-12 flex items-center justify-center gap-3">

          <span className="h-px w-12 bg-white/10" />

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
            Train · Compete · Belong
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

          <span className="h-px w-12 bg-white/10" />

        </div>

      </div>
    </section>
  );
}