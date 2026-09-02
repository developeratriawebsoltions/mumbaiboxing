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
    <section className="w-full bg-[#f7f8fa] px-3 pb-10 pt-0 sm:px-5 lg:px-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* Stats Card */}
        <div className="relative z-20 -mt-1 w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

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
                    min-h-[145px]
                    flex-col
                    items-center
                    justify-center
                    px-3
                    py-7
                    text-center
                    transition-colors
                    duration-200
                    hover:bg-slate-50

                    ${
                      index !== stats.length - 1
                        ? "border-b border-slate-100"
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
                        ? "border-r border-slate-100"
                        : ""
                    }

                    ${
                      index === 3
                        ? "border-r border-slate-100"
                        : ""
                    }
                  `}
                >
                  {/* Icon */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 transition-all duration-200 group-hover:bg-red-100">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className="text-red-600"
                    />
                  </div>

                  {/* Number */}
                  <span className="text-[28px] font-black leading-none tracking-tight text-slate-950 sm:text-[32px] lg:text-[34px]">
                    {stat.value}
                  </span>

                  {/* Label */}
                  <span className="mt-2 text-[8px] font-bold tracking-[0.14em] text-slate-400 sm:text-[9px] sm:tracking-[0.16em] lg:text-[10px]">
                    {stat.label}
                  </span>

                  {/* Hover Accent */}
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-red-600 transition-all duration-300 group-hover:w-10" />
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}