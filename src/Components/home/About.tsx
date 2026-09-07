"use client";

import {
  ShieldCheck,
  Target,
  Users,
  Trophy,
  Scale,
  Award,
} from "lucide-react";

const missions = [
  {
    title: "Grassroots Development",
    description:
      "Systematically scout and train boxing talent across Borivali, Andheri, and Kurla talukas through structured tournaments and affiliated gyms.",
    icon: Target,
  },
  {
    title: "Transparent Governance",
    description:
      "Digitize athlete registries, medical screening, weigh-ins, and selection trials to ensure complete fairness.",
    icon: ShieldCheck,
  },
  {
    title: "Community Empowerment",
    description:
      "Facilitate affordable access to coaching, protective equipment, and athlete welfare programs for boxers of all economic backgrounds.",
    icon: Users,
  },
  {
    title: "Technical Excellence",
    description:
      "Conduct periodic seminars and accreditation clinics for referees, judges, and corner coaches matching state and national regulations.",
    icon: Trophy,
  },
];

const committeeMembers = [
  {
    number: 1,
    name: "Mr. Subhash Mahadeo Kolge",
    designation: "President",
    portfolio: "Executive Leadership & Strategic Alliances",
  },
  {
    number: 2,
    name: "Mr. Rajendra Sakharam Jathar",
    designation: "Vice President",
    portfolio: "Technical Operations & Training Oversight",
  },
  {
    number: 3,
    name: "Mr. Subhodh Pandharinath Raorane",
    designation: "Secretary",
    portfolio: "Governance, Circulars & Official Records",
  },
  {
    number: 4,
    name: "Mr. Shailesh Chandrabhan Tripathi",
    designation: "Joint Secretary",
    portfolio: "Operations, Affiliation & Digital Platforms",
  },
  {
    number: 5,
    name: "Mr. Vivek Shrikant Rane",
    designation: "Treasurer",
    portfolio: "Finance, Audit & Accounts Management",
  },
  {
    number: 6,
    name: "Mr. Dipak Manohar Kurulkar",
    designation: "Executive Member",
    portfolio: "Committee Governance & Athlete Welfare",
  },
  {
    number: 7,
    name: "Mr. Nitin Prabhakar Thakoor",
    designation: "Executive Member",
    portfolio: "Committee Governance & Event Logistics",
  },
];

export default function About() {
  return (
    <>
      {/* =========================================================
          ABOUT US
      ========================================================= */}
      <section
        id="about"
        className="w-full overflow-hidden bg-white"
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          {/* =====================================================
              SECTION HEADER
          ===================================================== */}
          <div className="mb-14 max-w-[1050px] lg:mb-16">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                About Us
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[68px]">
              BUILDING THE FUTURE OF{" "}
              <span className="text-red-600">
                GRASSROOTS BOXING
              </span>
            </h2>

            <p className="mt-6 max-w-[850px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
              Mumbai Boxing Association is committed to developing athletes,
              strengthening boxing infrastructure, and creating transparent,
              inclusive pathways for boxers to progress from grassroots
              competition to the national and international stage.
            </p>
          </div>

          {/* =====================================================
              VISION
          ===================================================== */}
          <div className="mb-14 rounded-[28px] border border-red-100 bg-red-50/50 p-6 sm:p-8 lg:mb-20 lg:p-10 xl:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">

              <div className="flex items-center gap-4 lg:block">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                  <Target size={22} strokeWidth={2} />
                </div>

                <div className="lg:mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                    Our Vision
                  </p>

                  <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Vision
                  </h3>
                </div>
              </div>

              <div>
                <p className="text-lg font-medium leading-8 text-slate-700 sm:text-xl sm:leading-9 lg:text-[22px]">
                  To establish North Bombay as a premier hub for grassroots
                  boxing excellence in India by developing world-class
                  athletes, upholding the highest standards of sportsmanship
                  and technical officiating, and creating inclusive pathways
                  from school level to national and international podiums.
                </p>
              </div>

            </div>
          </div>

          {/* =====================================================
              MISSION
          ===================================================== */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                  Our Mission
                </p>
              </div>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Four Pillars of Our Mission
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {missions.map((mission) => {
                const Icon = mission.icon;

                return (
                  <div
                    key={mission.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors duration-200 group-hover:bg-red-600 group-hover:text-white">
                      <Icon
                        size={20}
                        strokeWidth={1.9}
                      />
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">
                      Mission Pillar
                    </p>

                    <h4 className="mt-2 text-lg font-bold tracking-tight text-slate-950">
                      {mission.title}
                    </h4>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {mission.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          EXECUTIVE COMMITTEE
      ========================================================= */}
      <section
        id="committee"
        className="w-full overflow-hidden border-t border-slate-100 bg-[#f8fafc]"
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          {/* =====================================================
              COMMITTEE HEADER
          ===================================================== */}
          <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-[850px]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-600">
                  Executive Committee · 2025–2030
                </p>
              </div>

              <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
                LEADERSHIP &{" "}
                <span className="text-red-600">
                  GOVERNANCE
                </span>
              </h2>

              <p className="mt-5 max-w-[750px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
                Meet the executive committee responsible for strategic
                leadership, technical operations, governance, athlete welfare,
                finance, affiliation, and event management.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm lg:flex">
              <ShieldCheck
                size={17}
                className="text-red-600"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Association Leadership
              </span>
            </div>
          </div>

          {/* =====================================================
              COMMITTEE GRID
          ===================================================== */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {committeeMembers.map((member) => (
              <article
                key={member.number}
                className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                {/* Photo Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                  {/* Association Badge */}
                  <div className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-[10px] font-black tracking-tight text-white shadow-md">
                    MBA
                  </div>

                  {/* Serial Number */}
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-black tracking-wider text-slate-500 backdrop-blur-sm">
                    #{String(member.number).padStart(2, "0")}
                  </div>

                  {/* Photo Placeholder */}
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white text-2xl font-black text-slate-300 shadow-sm">
                      {member.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(1, 3)
                        .map((word) => word[0])
                        .join("")}
                    </div>
                  </div>

                </div>

                {/* Card Content */}
                <div className="p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-600">
                    {member.designation}
                  </p>

                  <h3 className="mt-2 text-base font-bold leading-6 text-slate-950">
                    {member.name}
                  </h3>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Portfolio
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {member.portfolio}
                    </p>
                  </div>

                </div>
              </article>
            ))}
          </div>

          {/* =====================================================
              COMMITTEE FOOTER
          ===================================================== */}
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Scale size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Executive Committee
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Governing term 2025–2030
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Award
                size={15}
                className="text-red-600"
              />
              Mumbai Boxing Association
            </div>

          </div>

        </div>
      </section>
    </>
  );
}