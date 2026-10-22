import Link from "next/link";
import {
  Swords,
  GraduationCap,
  Building2,
  Trophy,
  BarChart2,
  HeartPulse,
  CreditCard,
  ScrollText,
  FolderCheck,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    Icon: Swords,
    title: "Boxer Registration",
    desc: "Register boxers with digital ID, weight category & taluka assignment.",
    href: "/dashboard/boxer",
  },
  {
    Icon: GraduationCap,
    title: "Coach Certification",
    desc: "Issue AIBA-standard coach certificates with QR verification.",
    href: "/dashboard/coach",
  },
  {
    Icon: Building2,
    title: "Academy Management",
    desc: "Affiliation, renewal, member tracking & event submissions.",
    href: "/dashboard/academy",
  },
  {
    Icon: Trophy,
    title: "Tournament Hub",
    desc: "Event creation, draw sheets, bout schedules & medal tally.",
    href: "/dashboard/tournament",
  },
  {
    Icon: BarChart2,
    title: "Live Rankings",
    desc: "Real-time age-wise, weight-wise & taluka-wise boxer rankings.",
    href: "/dashboard/ranking",
  },
  {
    Icon: HeartPulse,
    title: "Medical Records",
    desc: "Fitness certificates, injury tracking & competition eligibility.",
    href: "/dashboard/medical",
  },
  {
    Icon: CreditCard,
    title: "Payment Gateway",
    desc: "Registration, renewal & tournament fee management with receipts.",
    href: "/dashboard/payment",
  },
  {
    Icon: ScrollText,
    title: "Digital Certificates",
    desc: "Participation, merit & affiliation certificates with PDF export.",
    href: "/dashboard/certificates",
  },
  {
    Icon: FolderCheck,
    title: "Document Verification",
    desc: "Aadhaar, birth certificate & qualification document approvals.",
    href: "/dashboard/documents",
  },
];

export default function Services() {
  return (
    <section
      id="academies"
      className="w-full overflow-hidden bg-[#f7f8fa]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mb-12 flex flex-col justify-between gap-7 lg:mb-14 lg:flex-row lg:items-end">

          <div className="max-w-[850px]">

            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                What We Offer
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[68px]">
              COMPLETE BOXING
              <br />
              <span className="text-red-600">
                MANAGEMENT PLATFORM
              </span>
            </h2>
          </div>

          <p className="max-w-[500px] text-sm leading-7 text-slate-500 sm:text-[15px] lg:pb-1">
            Everything a boxing association needs — from boxer
            registration to tournament results, all managed through
            one connected platform.
          </p>
        </div>

        {/* =====================================================
            SERVICE GRID
        ===================================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => {
            const Icon = service.Icon;

            return (
              <Link
                key={service.title}
                href={service.href}
                className={`group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-6 ${
                  index === 0
                    ? "sm:col-span-2 lg:col-span-2"
                    : ""
                }`}
              >

                {/* Background Number */}
                <span className="pointer-events-none absolute -right-2 -top-5 select-none text-[100px] font-black leading-none text-slate-50 transition-colors duration-300 group-hover:text-red-50 sm:text-[110px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Top Row */}
                <div className="relative z-10 flex items-start justify-between">

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 transition-all duration-300 group-hover:bg-red-600">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                      className="text-red-600 transition-colors duration-300 group-hover:text-white"
                    />
                  </div>

                  {/* Arrow */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-red-100 group-hover:bg-red-50 group-hover:text-red-600">
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-7">

                  <h3 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    {service.title}
                  </h3>

                  <p className="mt-2 max-w-[500px] text-sm leading-6 text-slate-500">
                    {service.desc}
                  </p>

                </div>

                {/* Explore Link */}
                <div className="relative z-10 mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-red-600 sm:text-[11px]">

                  <span>
                    Explore Service
                  </span>

                  <span className="h-px w-6 bg-red-600 transition-all duration-300 group-hover:w-10" />

                </div>

                {/* Bottom Accent */}
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}

        </div>

        {/* =====================================================
            BOTTOM INFO
        ===================================================== */}
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
              <Trophy
                size={17}
                className="text-red-600"
              />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              One platform for the entire boxing ecosystem.
            </p>

          </div>

          <Link
            href="/register"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] !text-red-600"
          >
            Get Started

            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

        </div>
      </div>
    </section>
  );
}