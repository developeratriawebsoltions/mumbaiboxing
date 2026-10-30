
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
  ChevronRight,
} from "lucide-react";

const committeeMembers = [
  {
    number: "01",
    role: "President",
    name: "Mr. Subhash Mahadeo Kolge",
    image: "/committee/subhash-kolge.jpeg",
  },
  {
    number: "02",
    role: "Vice President",
    name: "Vivek Shrikant Rane",
    image: "/committee/Vivek Shrikant Rane.jpeg",
  },
  {
    number: "03",
    role: "Secretary",
    name: "Mr. Subodh Pandharinath Raorane",
    image: "/committee/subodh-raorane.jpeg",
  },
  {
    number: "04",
    role: "Joint Secretary",
    name: "Mr. Shailesh Chandrabhan Tripathi",
    image: "/committee/shailesh-tripathi.jpeg",
  },
  {
    number: "05",
    role: "Treasurer",
    name: "Mr. Rajendra Sakharam Jathar",
    image: "/committee/Mr. Rajendra Sakharam Jathar.jpeg",
  },
  {
    number: "06",
    role: "Executive Committee Members",
    name: "Mr. Dipak Manohar Kurulkar",
    image: "/committee/dipak-kurulkar.png",
  },
  {
    number: "07",
    role: "Executive Committee Members",
    name: "Mr. Nitin Thakoor",
    image: "/committee/nitin-thakur.jpeg",
  },
];

const highlights = [
  {
    title: "Athlete Development",
    description:
      "Creating pathways from grassroots boxing to higher levels of competition.",
    icon: Users,
  },
  {
    title: "Transparent Governance",
    description:
      "Promoting fairness, accountability, and professional sporting administration.",
    icon: ShieldCheck,
  },
  {
    title: "Sporting Excellence",
    description:
      "Supporting athletes, coaches, officials, and boxing communities.",
    icon: Award,
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-white text-[#081019]"
    >
      {/* ABOUT SECTION */}
      <div className="relative isolate overflow-hidden">
        {/* Decorative dots - no background image */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[23%] top-12 hidden h-24 w-32 opacity-40 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(#f50919 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Decorative red rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-28 h-72 w-72 rounded-full border border-red-200"
        >
          <div className="absolute inset-4 rounded-full border border-red-200" />
          <div className="absolute inset-8 rounded-full border border-red-200" />
          <div className="absolute inset-12 rounded-full border border-red-200" />
          <div className="absolute inset-16 rounded-full border border-red-200" />
          <div className="absolute inset-20 rounded-full border border-red-200" />
        </div>

        <div
          className="
            relative mx-auto grid w-full max-w-[1900px]
            grid-cols-1 items-center gap-12
            px-5 pb-20 pt-20
            sm:px-8 sm:py-24
            lg:grid-cols-[1.12fr_0.88fr]
            lg:gap-16 lg:px-12 lg:py-28
            xl:px-16
          "
        >
          {/* LEFT CONTENT */}
          <div className="relative z-10 max-w-[800px]">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[3px] w-8 shrink-0 bg-[#f50919]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#f50919] sm:text-xs">
                About North Bombay District Amateur Boxing Association (NBDABA)
              </span>
            </div>

            <h2
              className="
                max-w-[850px]
                text-[clamp(42px,5.2vw,76px)]
                font-black uppercase
                leading-[0.99]
                tracking-[-0.065em]
                text-[#080d14]
              "
            >
              THE HEART OF
              <br />
              <span className="text-[#f50919]">BOXING</span>{" "}
              IN MUMBAI
            </h2>

            <p className="mt-8 max-w-[650px] text-[15px] font-medium leading-[1.85] text-[#17212d] sm:text-[17px]">
              North Bombay District Amateur Boxing Association (NBDABA) is dedicated to
              strengthening grassroots boxing, developing
              athletes, supporting coaches and academies,
              and creating opportunities for boxers to
              compete at every level.
            </p>

            <p className="mt-5 max-w-[650px] text-[14px] leading-[1.9] text-[#66758a] sm:text-[16px]">
              From grassroots development and athlete
              welfare to transparent governance and
              technical excellence, the Association works
              to build a stronger and more accessible
              boxing ecosystem across Mumbai.
            </p>

            <Link
              href="/about"
              className="
                group mt-8 inline-flex min-h-12
                items-center justify-center gap-5
                rounded-full bg-[#f50919]
                px-8 py-3.5 text-xs font-extrabold
                uppercase tracking-[0.05em] text-white
                shadow-[0_12px_28px_rgba(245,9,25,0.16)]
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#cf0010]
              "
            >
              Explore About Us
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-9 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#f50919]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#66758a]">
                Train <span className="text-red-500">·</span>{" "}
                Compete <span className="text-red-500">·</span>{" "}
                Belong
              </span>
            </div>
          </div>

          {/* RIGHT FEATURE CARDS */}
          <div className="relative z-10 w-full">
            <div className="mb-7 flex justify-start lg:justify-end">
              <div
                className="
                  inline-flex items-center gap-3
                  rounded-full border border-[#dce2e9]
                  bg-white px-5 py-3
                  shadow-[0_5px_20px_rgba(0,0,0,0.03)]
                "
              >
                <ShieldCheck
                  size={18}
                  className="text-[#f50919]"
                />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#344256]">
                  Established Since 1985
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      group flex items-center gap-5
                      rounded-[18px]
                      border border-[#e7ebf0]
                      bg-white
                      px-5 py-6
                      shadow-[0_12px_35px_rgba(10,20,30,0.035)]
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-red-200
                      hover:shadow-[0_18px_40px_rgba(10,20,30,0.08)]
                      sm:px-6
                    "
                  >
                    <div
                      className="
                        flex h-14 w-14 shrink-0
                        items-center justify-center
                        rounded-full bg-[#fff0f1]
                        text-[#f50919]
                        transition-colors
                        group-hover:bg-[#ffe1e4]
                      "
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-extrabold text-[#101722] sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-5 text-[#68778b] sm:text-[13px]">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-[#344256] transition-transform group-hover:translate-x-1 group-hover:text-[#f50919]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION DIVIDER */}
      <div className="mx-auto max-w-[1900px] px-5 sm:px-8 lg:px-12">
        <div className="h-px w-full bg-[#e6e9ee]" />
      </div>

      {/* MANAGING COMMITTEE */}
      <div
        className="
          relative mx-auto w-full max-w-[1900px]
          px-5 pb-20 pt-20
          sm:px-8 sm:pb-24
          lg:px-12 lg:pt-24
          xl:px-16
        "
      >
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[3px] w-8 bg-[#f50919]" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#f50919] sm:text-xs">
              North Bombay District Amateur Boxing Association
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-7">
            <div>
              <h2
                className="
                  max-w-[1050px]
                  text-[clamp(38px,4.8vw,68px)]
                  font-black uppercase
                  leading-[0.98]
                  tracking-[-0.055em]
                  text-[#080d14]
                "
              >
                MANAGING COMMITTEE
                <br />
                <span className="text-[#f50919]">
                  2025 – 2030
                </span>
              </h2>

              <p className="mt-5 text-sm text-[#66758a] sm:text-base">
                Managing Committee (2025 – 2030)
              </p>
            </div>

            <div
              className="
                inline-flex items-center gap-3
                rounded-full border border-red-100
                bg-[#fff7f7] px-5 py-3
              "
            >
              <Users size={19} className="text-[#f50919]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#101820]">
                Our Team
              </span>
            </div>
          </div>

          {/* COMMITTEE GRID */}
          <div
            className="
              mt-11 grid grid-cols-1 gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {committeeMembers.map((member) => (
              <article
                key={member.number}
                className="
                  group relative overflow-hidden
                  rounded-[12px]
                  border border-[#e5e8ed]
                  border-b-[3px] border-b-[#f50919]
                  bg-white
                  shadow-[0_8px_24px_rgba(0,0,0,0.035)]
                  transition-all duration-300
                  hover:-translate-y-1.5
                  hover:shadow-[0_18px_38px_rgba(0,0,0,0.1)]
                "
              >
                {/* MEMBER PHOTO */}
                <div className="relative aspect-[4/3.8] overflow-hidden bg-[#eef0f2]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="
                      object-cover object-top
                      transition-transform duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* Number */}
                  {/* <div
                    className="
                      absolute left-3 top-3 z-10
                      flex h-10 min-w-11
                      items-center justify-center
                      rounded-[7px] bg-[#f50919]
                      px-2 text-[13px] font-black text-white
                      shadow-[0_4px_12px_rgba(245,9,25,0.25)]
                    "
                  >
                    {member.number}
                  </div> */}

                  {/* Large outline number */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute
                      right-3 top-2
                      text-[78px] font-black
                      leading-none tracking-[-0.08em]
                      text-transparent opacity-40
                      [-webkit-text-stroke:1px_white]
                    "
                  >
                    {/* {member.number} */}
                  </span>
                </div>

                {/* MEMBER INFORMATION */}
                <div className="relative flex min-h-[112px] flex-col justify-center px-4 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#f50919]">
                    {member.role}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="text-[14px] font-extrabold leading-[1.4] text-[#101820] sm:text-[15px]">
                      {member.name}
                    </h3>

                    <span
                      aria-hidden="true"
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-full border-2 border-red-100
                        text-[#101820]
                        transition-all duration-300
                        group-hover:border-[#f50919]
                        group-hover:bg-[#f50919]
                        group-hover:text-white
                      "
                    >
                      <ChevronRight size={17} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BOTTOM DECORATION */}
        <div className="mt-20 flex items-center justify-center gap-3 sm:gap-4">
          <span className="h-px w-8 bg-[#c5ccd5] sm:w-14" />
          <span className="h-2 w-2 shrink-0 bg-[#f50919]" />
          <span className="text-center text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#718095] sm:text-[10px]">
            The Heart of Boxing in Mumbai
          </span>
          <span className="h-2 w-2 shrink-0 bg-[#f50919]" />
          <span className="h-px w-8 bg-[#c5ccd5] sm:w-14" />
        </div>
      </div>
    </section>
  );
}
