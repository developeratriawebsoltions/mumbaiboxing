import {
  Users,
  UserCheck,
  Building2,
  CalendarDays,
  Award,
} from "lucide-react";

const stats = [
  {
    value: "1,240+",
    label: "REGISTERED BOXERS",
    Icon: Users,
  },
  {
    value: "186+",
    label: "CERTIFIED COACHES",
    Icon: UserCheck,
  },
  {
    value: "42+",
    label: "AFFILIATED ACADEMIES",
    Icon: Building2,
  },
  {
    value: "15+",
    label: "TOURNAMENTS / YEAR",
    Icon: CalendarDays,
  },
  {
    value: "3",
    label: "NATIONAL TITLES",
    Icon: Award,
  },
];

export default function Stats() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05070a] px-3 pb-10 pt-0 sm:px-5 lg:px-6 xl:px-8">

      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[250px] w-[500px] rounded-full bg-red-600/[0.05] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px]">

        {/* =====================================================
            STATS CARD
        ===================================================== */}

        <div className="relative z-20 -mt-1 w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#090c11] shadow-[0_20px_70px_rgba(0,0,0,0.45)]">

          {/* Top highlight */}
          <div className="absolute left-1/4 right-1/4 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-5">

            {stats.map((stat, index) => {
              const Icon = stat.Icon;

              return (
                <div
                  key={stat.label}
                  className={`
                    group
                    relative
                    flex
                    min-h-[150px]
                    flex-col
                    items-center
                    justify-center
                    px-3
                    py-7
                    text-center
                    transition-all
                    duration-300
                    hover:bg-white/[0.025]

                    ${
                      index !== stats.length - 1
                        ? "border-b border-white/10"
                        : ""
                    }

                    md:border-b-0

                    ${
                      index !== stats.length - 1
                        ? "md:border-r"
                        : ""
                    }

                    ${
                      index === 1
                        ? "border-r border-white/10"
                        : ""
                    }

                    ${
                      index === 3
                        ? "border-r border-white/10"
                        : ""
                    }
                  `}
                >

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-500/10 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.12)]">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className="text-red-500 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* =================================================
                      NUMBER
                  ================================================= */}

                  <span className="text-[28px] font-black leading-none tracking-tight text-white sm:text-[32px] lg:text-[34px]">
                    {stat.value}
                  </span>

                  {/* =================================================
                      LABEL
                  ================================================= */}

                  <span className="mt-2 text-[8px] font-bold tracking-[0.14em] text-slate-500 sm:text-[9px] sm:tracking-[0.16em] lg:text-[10px]">
                    {stat.label}
                  </span>

                  {/* =================================================
                      HOVER ACCENT
                  ================================================= */}

                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] transition-all duration-300 group-hover:w-12" />

                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}