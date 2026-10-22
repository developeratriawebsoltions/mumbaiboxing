import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Trophy,
} from "lucide-react";

const notices = [
  {
    title: "Mumbai District Boxing Championship",
    desc: "Registration now open for all academies.",
    date: "12 AUG 2025",
    type: "IMPORTANT",
    Icon: AlertCircle,
    iconBg: "bg-red-50",
    iconColor: "text-[#DC2626]",
  },
  {
    title: "Annual Tournament Schedule Released",
    desc: "Check the detailed schedule and venues.",
    date: "08 AUG 2025",
    type: "TOURNAMENT",
    Icon: Trophy,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Coaches Certification Program",
    desc: "New batch registrations starting soon.",
    date: "05 AUG 2025",
    type: "NOTICE",
    Icon: GraduationCap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Free Health Check-up Camp",
    desc: "Free health checkup for registered boxers.",
    date: "01 AUG 2025",
    type: "EVENT",
    Icon: HeartPulse,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export default function Notices() {
  return (
    <section
      id="news"
      className="w-full overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-10 2xl:py-24">

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.12fr_0.88fr] xl:gap-7">

          {/* =====================================================
              OFFICIAL NOTICES
          ===================================================== */}
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6 lg:px-7">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <AlertCircle
                    size={19}
                    strokeWidth={1.8}
                    className="text-[#DC2626]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#DC2626]">
                    Updates
                  </p>

                  <h2 className="mt-0.5 text-base font-bold text-slate-950 sm:text-lg">
                    Official Notices
                  </h2>
                </div>
              </div>

              <Link
                href="/events"
                className="group hidden shrink-0 items-center gap-2 !text-slate-500 transition-colors duration-200 hover:!text-[#DC2626] sm:flex"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  View All
                </span>

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Notice List */}
            <div className="divide-y divide-slate-100">

              {notices.map((notice) => {
                const Icon = notice.Icon;

                return (
                  <div
                    key={notice.title}
                    className="group flex gap-3.5 px-5 py-5 transition-colors duration-200 hover:bg-slate-50 sm:gap-4 sm:px-6 lg:px-7"
                  >

                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notice.iconBg}`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className={notice.iconColor}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">

                        <p className="min-w-0 text-sm font-bold leading-5 text-slate-900">
                          {notice.title}
                        </p>

                        <div className="flex shrink-0 items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                          <CalendarDays size={11} />
                          <span>{notice.date}</span>
                        </div>

                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {notice.desc}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${notice.iconBg} ${notice.iconColor}`}
                      >
                        {notice.type}
                      </span>

                    </div>

                    {/* Arrow */}
                    <div className="hidden shrink-0 self-center sm:flex">
                      <ArrowRight
                        size={15}
                        className="text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#DC2626]"
                      />
                    </div>

                  </div>
                );
              })}

            </div>

            {/* Mobile View All */}
            <div className="border-t border-slate-100 px-5 py-4 sm:hidden">
              <Link
                href="/events"
                className="flex items-center justify-center gap-2 !text-[#DC2626]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                  View All Notices
                </span>

                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* =====================================================
              JOIN CTA
          ===================================================== */}
          <div className="relative min-h-[390px] overflow-hidden rounded-[22px] bg-slate-950 sm:min-h-[410px] lg:min-h-full">

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45"
              style={{
                backgroundImage: "url('/hero.png')",
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-950/75" />

            {/* Red Gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(127,29,29,0.58) 0%, rgba(17,24,39,0.88) 68%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex min-h-[390px] flex-col justify-between p-6 sm:min-h-[410px] sm:p-8 lg:min-h-full lg:p-9 xl:p-10">

              {/* Top Content */}
              <div>

                {/* Label */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-[2px] w-7 bg-[#EF4444]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F87171]">
                    Join Us
                  </p>
                </div>

                {/* Heading */}
                <h2 className="max-w-[440px] text-3xl font-black leading-[1.03] tracking-[-0.025em] text-white sm:text-4xl xl:text-[42px]">
                  READY TO STEP
                  <br />
                  INTO THE{" "}
                  <span className="text-[#EF4444]">
                    RING?
                  </span>
                </h2>

                <p className="mt-5 max-w-[390px] text-sm leading-6 text-white/60">
                  Join Mumbai&apos;s boxing community and be part of
                  something bigger.
                </p>

              </div>

              {/* Bottom CTA */}
              <div className="mt-10">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#DC2626] px-6 py-3.5 !text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-[#B91C1C] hover:shadow-xl"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.12em]">
                    Register Now
                  </span>

                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="!text-white transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>

            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full border-[30px] border-red-600/10" />

          </div>

        </div>
      </div>
    </section>
  );
}