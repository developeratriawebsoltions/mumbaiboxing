import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  Gavel,
  HeartPulse,
  Scale,
  ShieldCheck,
  Trophy,
  Users,
  Whistle,
  type LucideIcon,
} from "lucide-react";
import { committeeMembers } from "@/data/committee";

export const metadata: Metadata = createPageMetadata({
  title: "Governance & Committees",
  description:
    "Explore NBDABA's executive committee and governance commissions for athlete welfare, fair selection, technical standards, and accountability.",
  path: "/governance",
  image: "/gov/commitee-bg-hero.png",
  imageAlt: "NBDABA governance and committees",
});

const governanceCommittees = [
  {
    id: "athletes-commission",
    number: "01",
    title: "Athletes Commission",
    icon: Users,
    mandate:
      "Represents boxers’ voices on welfare, training conditions and technical concerns, bringing athlete perspectives directly to association leadership.",
    composition: [
      "Chair / Convenor: Senior international or national boxer",
      "Members: Eminent elite men and women boxers from the district",
      "At least 50% active or recently retired national or international boxers, with equal representation of women and men",
    ],
  },
  {
    id: "icc",
    number: "02",
    title: "Internal Complaints Committee (POSH / ICC)",
    icon: ShieldCheck,
    mandate:
      "Provides a channel to prevent, prohibit and address sexual harassment affecting women athletes, coaches, officials and support staff.",
    composition: [
      "Presiding Officer: Senior woman official or executive",
      "Two internal members committed to the cause of women or familiar with sports-related issues",
      "One independent external member from an NGO or a legal advocate familiar with sexual-harassment matters",
    ],
  },
  {
    id: "selection-committee",
    number: "03",
    title: "Selection & Talent Identification Committee",
    icon: BadgeCheck,
    mandate:
      "Oversees district trials, eligibility and transparent, merit-based selection for teams and championship representation, including standby rosters.",
    composition: [
      "Chair: Chief Coach or senior national boxing coach",
      "Convenor: Joint Secretary or State Technical Officer",
      "Members: Eminent former national boxers and technical experts who are free of conflicts of interest",
    ],
  },
  {
    id: "technical-commission",
    number: "04",
    title: "Technical, Referees & Judges Commission",
    icon: Whistle,
    mandate:
      "Supports consistent officiating, assigns qualified officials, conducts technical clinics and oversees tournament equipment and ring specifications.",
    composition: [
      "Chair / Convenor: State Technical Officer or senior boxing official",
      "Members: Certified referees, judges and ring masters",
    ],
  },
  {
    id: "grievance-committee",
    number: "05",
    title: "Disputes & Grievance Redressal Committee",
    icon: Gavel,
    mandate:
      "Offers a neutral forum for time-bound consideration of bout protests, selection disputes and administrative grievances raised by athletes, coaches or clubs.",
    composition: [
      "Chair: Legal expert or senior sports administrator",
      "Members: Senior executive member and veteran sportsperson",
    ],
  },
  {
    id: "ethics-commission",
    number: "06",
    title: "Ethics, Fair Play & Disciplinary Commission",
    icon: Scale,
    mandate:
      "Promotes adherence to association bylaws and codes of conduct, supports anti-corruption and anti-doping awareness, and reviews disciplinary concerns.",
    composition: [
      "Chair: Independent arbitrator or senior association leader",
      "Members: Association Secretary and independent sports official",
    ],
  },
  {
    id: "medical-commission",
    number: "07",
    title: "Medical, Anti-Doping & Athlete Safety Commission",
    icon: HeartPulse,
    mandate:
      "Coordinates athlete medical clearances, annual medical records, ringside medical support and anti-doping and safety awareness.",
    composition: [
      "Head / Chief Medical Officer: Qualified sports physician or registered MBBS doctor",
      "Members: Physical conditioning or nutrition expert and designated safety officer",
    ],
  },
];

type GovernanceLink = { label: string; href: string };

const iconFor = (href: string): LucideIcon => {
  if (href.includes("athletes")) return Users;
  if (href.includes("icc")) return ShieldCheck;
  if (href.includes("selection")) return Trophy;
  if (href.includes("technical")) return Whistle;
  if (href.includes("grievance")) return Gavel;
  if (href.includes("medical")) return HeartPulse;
  return FileCheck2;
};

const governanceNavLinks: GovernanceLink[] = [
  { label: "Executive Committee", href: "#executive-committee" },
  { label: "Athletes Commission", href: "#athletes-commission" },
  { label: "Internal Complaints Committee (POSH / ICC)", href: "#icc" },
  { label: "Selection Committee", href: "#selection-committee" },
  { label: "Technical & Officiating Commission", href: "#technical-commission" },
  { label: "Grievance & Disciplinary Body", href: "#grievance-committee" },
  { label: "Ethics & Fair Play", href: "#ethics-commission" },
  { label: "Medical & Athlete Safety Commission", href: "#medical-commission" },
];

export default function GovernancePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f5f7fb] text-[#07172c]">
 
 <section className="relative isolate overflow-hidden bg-[#06172c] text-white">
      {/* Image is a separate background asset, not a screenshot with baked-in UI. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-[position:58%_center] opacity-85 sm:bg-center" style={{ backgroundImage: "url('/gov/commitee-bg-hero.png')" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[#06172c]/95 via-[#06172c]/78 to-[#06172c]/45 lg:from-[#06172c]/94 lg:via-[#06172c]/55 lg:to-[#06172c]/35" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#06172c]/90 via-transparent to-[#06172c]/10" />

      <div className="relative mx-auto w-full max-w-[1800px] px-4 pb-6 pt-7 sm:px-6 sm:pb-8 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-xs text-slate-300 sm:mb-16 sm:text-sm lg:mb-20">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="text-slate-500">/</span>
          <span aria-current="page" className="font-bold text-white">Governance</span>
        </nav>

        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,.75fr)] lg:gap-8 xl:gap-14">
          <div className="min-w-0 lg:pb-12">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-extrabold uppercase leading-5 tracking-[.12em] text-white/90 sm:text-xs sm:tracking-[.17em]">
              <span className="h-[3px] w-8 shrink-0 bg-[#ff2538]" />
              North Bombay District Amateur Boxing Association
            </p>
            <h1 className="max-w-[1000px] text-[clamp(2.55rem,6.5vw,6.7rem)] font-black uppercase leading-[.94] tracking-[-.055em] [text-wrap:balance]">
              Governance &amp;<br />
              <span className="text-[#ff3043]">Committees</span>
            </h1>
            <p className="mt-6 max-w-[650px] text-sm leading-7 text-slate-100 sm:text-base sm:leading-8 xl:text-lg">
              Meet the NBDABA executive committee and explore the commissions that support athlete representation, safe sport, fair selection, technical standards and accountable governance in North Bombay boxing.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#executive-committee" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#f50919] px-6 py-3 text-xs font-extrabold text-white transition hover:bg-[#d50919] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm">
                Meet Our Leadership <ArrowRight size={18} />
              </a>
              <a href="#athletes-commission" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/60 bg-[#06172c]/35 px-6 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm">
                Explore All Committees <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <aside className="min-w-0 rounded-[22px] border border-white/35 bg-[#142238]/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,.32)] backdrop-blur-xl sm:p-7 xl:p-9">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f50919]"><ShieldCheck size={21} /></span>
              <span className="text-[11px] font-extrabold uppercase tracking-[.18em] text-slate-200">Our Foundation</span>
            </div>
            <h2 className="mt-6 text-[clamp(1.5rem,2.7vw,2.5rem)] font-black leading-[1.12] tracking-tight">Strong Leadership.<br />Fair Competition.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-200">A governance structure designed to promote transparent decisions, protect athletes and uphold the highest standards across the boxing community.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/20 pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                { href: "#athletes-commission", label: "Athlete Representation" },
                { href: "#selection-committee", label: "Fair & Transparent Selection" },
                { href: "#icc", label: "Safety & Accountability" },
                { href: "#technical-commission", label: "Technical Excellence" },
              ].map((item) => {
                const Icon = iconFor(item.href);
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ed1c24] text-white">
                      <Icon size={19} />
                    </span>
                    <span className="text-xs font-semibold leading-5 text-white sm:text-sm">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-white/20 pt-5">
              <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-300">Governance Framework</p><div className="mt-3 h-1.5 w-32 max-w-full overflow-hidden rounded-full bg-white/15"><div className="h-full w-[32%] rounded-full bg-[#f50919]" /></div></div>
              <span className="text-4xl font-black">07<span className="text-[#ff3043]">.</span></span>
            </div>
          </aside>
        </div>

        <nav aria-label="Governance sections" className="mt-10 rounded-2xl border border-white/25 bg-[#112238]/80 p-2 backdrop-blur-xl sm:mt-14 lg:mt-20">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
            {governanceNavLinks.map((item) => {
              const Icon = iconFor(item.href);
              return <a key={item.href} href={item.href} className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Icon size={22} className="shrink-0 text-[#ff4657]" /><span className="min-w-0 flex-1 leading-5">{item.label}</span><ArrowRight size={15} className="shrink-0 text-slate-300 transition group-hover:translate-x-1" /></a>;
            })}
          </div>
        </nav>
      </div>
    </section>

      <section
        id="executive-committee"
        className="scroll-mt-20 border-b border-slate-200 bg-white"
      >
        <div className="mx-auto w-full max-w-[1680px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:px-12 lg:py-20 xl:px-16">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ed1c24] sm:text-[11px]">
                Managing Committee · 2025–2030
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,3.2vw,3rem)] font-black tracking-tight text-[#07172c]">
                Executive Committee
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              The current managing committee of the North Bombay District
              Amateur Boxing Association.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
            {committeeMembers.map((member) => (
              <article
                key={member.number}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md sm:gap-4 sm:p-4"
              >
                <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:h-[76px] sm:w-[76px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 640px) 76px, 64px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#ed1c24]">
                    {member.role}
                  </p>
                  <h3 className="mt-1 break-words text-sm font-bold leading-5 text-[#07172c] sm:text-base">
                    {member.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f5f7fb]">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:px-12 lg:py-20 xl:px-16">
          <div className="mb-8 max-w-4xl sm:mb-10">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ed1c24] sm:text-[11px]">
              Governance framework
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.2vw,3rem)] font-black tracking-tight text-[#07172c]">
              Commissions &amp; statutory committees
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The mandates and role-based compositions below describe the
              association’s governance framework. Individual appointments for
              these commissions can be published once formally confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 2xl:grid-cols-3">
            {governanceCommittees.map((committee) => {
              const Icon = committee.icon;

              return (
                <article
                  key={committee.id}
                  id={committee.id}
                  className="scroll-mt-24 min-w-0 rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:p-6 xl:p-8"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-[#ed1c24]">
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ed1c24]">
                        Commission {committee.number}
                      </p>
                      <h3 className="mt-1 break-words text-lg font-extrabold leading-snug text-[#07172c] sm:text-xl">
                        {committee.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#07172c]">
                      Role &amp; mandate
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {committee.mandate}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#07172c]">
                      Composition
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {committee.composition.map((member) => (
                        <li
                          key={member}
                          className="flex gap-3 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ed1c24]" />
                          <span>{member}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 shrink-0 text-[#ed1c24]" size={20} />
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              For a concern or appeal, visit the grievance information page or
              contact the association.
            </p>
          </div>
          <Link
            href="/grievance"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#ed1c24] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c9151c]"
          >
            Grievance information
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
