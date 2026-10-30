import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Clock3,
  Send,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

/* =========================================================
   SEO
   ========================================================= */

export const metadata: Metadata = {
  title: "Contact Us | North Bombay District Amateur Boxing Association (NBDABA)",
  description:
    "Contact the North Bombay District Amateur Boxing Association (NBDABA) for enquiries regarding boxing, athlete registration, tournaments, academies, affiliation and association activities.",
  keywords: [
    "North Bombay District Amateur Boxing Association (NBDABA) contact",
    "North Bombay District Amateur Boxing Association (NBDABA) email",
    "NBDABA boxing contact",
    "North Bombay boxing contact",
    "boxing association Mumbai",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | North Bombay District Amateur Boxing Association (NBDABA)",
    description:
      "Get in touch with the North Bombay District Amateur Boxing Association (NBDABA) for official enquiries, registrations, tournaments and affiliation.",
    type: "website",
    url: "/contact",
    siteName: "North Bombay District Amateur Boxing Association (NBDABA)",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | North Bombay District Amateur Boxing Association (NBDABA)",
    description:
      "Contact the North Bombay District Amateur Boxing Association (NBDABA) for official enquiries and assistance.",
  },
};

/* =========================================================
   PAGE
   ========================================================= */

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white">


      {/* =====================================================
          HERO
      ===================================================== */}

    
<section className="relative isolate min-h-[580px] overflow-hidden border-b border-white/10 bg-[#05070a] sm:min-h-[640px] lg:min-h-[680px] xl:min-h-[720px]">

  {/* Full-width boxing background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-30 bg-[url('/contact/contact-hero.webp')] bg-cover bg-[position:65%_center] bg-no-repeat sm:bg-[position:60%_center] lg:bg-center"
  />

  {/* Dark gradient for readability */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[#05070a]/95 via-[#05070a]/85 to-[#05070a]/30 lg:from-[#05070a]/95 lg:via-[#05070a]/65 lg:to-transparent"
  />

  {/* Mobile dark overlay */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 bg-[#05070a]/20 lg:hidden"
  />

  {/* Red diagonal graphic */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-[58%] hidden w-[110px] -skew-x-[28deg] bg-gradient-to-b from-red-600/50 via-red-600/25 to-transparent lg:block"
  />

  {/* Subtle grid on left */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 opacity-[0.045] lg:block"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)",
      backgroundSize: "65px 65px",
    }}
  />

  {/* Decorative red dots */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-5 top-24 hidden h-28 w-28 opacity-70 lg:block"
    style={{
      backgroundImage:
        "radial-gradient(circle,#ff1730 2px,transparent 2.5px)",
      backgroundSize: "29px 29px",
    }}
  />

  {/* Main content */}
  <div className="relative mx-auto flex min-h-[580px] max-w-[1600px] flex-col justify-center px-5 py-16 sm:min-h-[640px] sm:px-8 lg:min-h-[680px] lg:px-12 lg:py-24 xl:min-h-[720px] xl:px-16">

    <div className="max-w-[800px]">

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex items-center gap-3 text-[12px] font-medium sm:mb-12"
      >
        <Link
          href="/"
          className="text-slate-300 transition-colors hover:text-white"
        >
          Home
        </Link>

        <span className="text-slate-500">›</span>

        <span className="font-semibold text-[#ff263b]">
          Contact
        </span>
      </nav>

      {/* Eyebrow */}
      <div className="mb-6 flex items-center gap-4">
        <span className="h-[3px] w-10 bg-[#ff1026] shadow-[0_0_14px_rgba(255,16,38,0.5)]" />

        <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#ff3549] sm:text-[11px]">
          North Bombay District Amateur Boxing Association (NBDABA)
        </p>
      </div>

      {/* Main heading */}
      <h1 className="text-[clamp(52px,8vw,104px)] font-black uppercase leading-[0.94] tracking-[-0.065em] text-white">
        CONTACT{" "}
        <span className="text-[#ff263b]">
          US
        </span>
      </h1>

      {/* Description */}
      <p className="mt-7 max-w-[710px] text-[15px] leading-[1.9] text-slate-200 sm:text-[17px] lg:mt-9 lg:text-[18px]">
        Have an enquiry about boxing, athlete registration,
        tournaments, academy affiliation or the activities
        of the North Bombay District Amateur Boxing Association (NBDABA)? Get in touch with
        us through the official contact details below.
      </p>

      {/* Buttons */}
      <div className="mt-9 flex flex-wrap items-center gap-4 lg:mt-10">

        <a
          href="mailto:info@mumbaiboxing.org"
          className="group inline-flex min-h-[54px] items-center justify-center gap-4 rounded-full bg-[#f50919] px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.09em] text-white shadow-[0_12px_35px_rgba(245,9,25,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d90015] sm:px-8"
        >
          Send an Email

          <Mail
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>

        <a
          href="tel:+912212345678"
          className="group inline-flex min-h-[54px] items-center justify-center gap-4 rounded-full border border-white/50 bg-[#080d13]/45 px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.09em] text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#101820] sm:px-8"
        >
          Call Association

          <Phone size={16} />
        </a>

      </div>

    </div>
  </div>
</section>


      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

<section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8fa]">

  {/* Subtle background accents */}
  <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-red-500/[0.035] blur-[120px]" />
  <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-red-500/[0.035] blur-[120px]" />

  <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

    {/* SECTION HEADER */}
    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

      <div className="max-w-[750px]">
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 bg-[#f50919]" />

          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f50919]">
            Official Contact
          </p>
        </div>

        <h2 className="mt-5 text-[clamp(38px,4.5vw,64px)] font-black uppercase leading-[1.02] tracking-[-0.05em] text-[#101820]">
          GET IN <span className="text-[#f50919]">TOUCH.</span>
        </h2>

        <p className="mt-5 max-w-[650px] text-[15px] leading-8 text-slate-600 sm:text-base">
          Have questions about boxing, athlete registrations,
          tournaments or academy affiliation? Reach out to
          the North Bombay District Amateur Boxing Association (NBDABA) through our official
          contact channels.
        </p>
      </div>

      <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 md:flex">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f50919]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
          Official Association Support
        </span>
      </div>

    </div>

    {/* CONTACT CARDS */}
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">

      {/* EMAIL CARD */}
      <a
        href="mailto:info@mumbaiboxing.org"
        className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_8px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)] sm:p-9"
      >

        <span className="absolute right-8 top-8 text-[12px] font-black tracking-[0.12em] text-slate-300">
          01 / 03
        </span>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-all duration-300 group-hover:bg-[#f50919] group-hover:text-white">
          <Mail size={27} strokeWidth={1.8} />
        </div>

        <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f50919]">
          Email Us
        </p>

        <h3 className="mt-2 break-all text-[clamp(18px,1.6vw,23px)] font-extrabold tracking-tight text-[#101820]">
          info@mumbaiboxing.org
        </h3>

        <p className="mt-4 text-[14px] leading-7 text-slate-500">
          Send us your enquiry or official communication
          by email. Our team will assist you with the
          relevant information.
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#f50919]">
            Send an Email
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-[#f50919] transition-all duration-300 group-hover:border-[#f50919] group-hover:bg-[#f50919] group-hover:text-white">
            <ArrowRight size={18} />
          </span>
        </div>
      </a>

      {/* PHONE CARD */}
      <a
        href="tel:+912212345678"
        className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_8px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)] sm:p-9"
      >

        <span className="absolute right-8 top-8 text-[12px] font-black tracking-[0.12em] text-slate-300">
          02 / 03
        </span>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-all duration-300 group-hover:bg-[#f50919] group-hover:text-white">
          <Phone size={27} strokeWidth={1.8} />
        </div>

        <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f50919]">
          Call Us
        </p>

        <h3 className="mt-2 text-[clamp(19px,1.7vw,24px)] font-extrabold tracking-tight text-[#101820]">
          +91 22 1234 5678
        </h3>

        <p className="mt-4 text-[14px] leading-7 text-slate-500">
          Speak with the association regarding
          registrations, tournaments and official
          enquiries during working hours.
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#f50919]">
            Call Association
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-[#f50919] transition-all duration-300 group-hover:border-[#f50919] group-hover:bg-[#f50919] group-hover:text-white">
            <ArrowRight size={18} />
          </span>
        </div>
      </a>

      {/* LOCATION CARD */}
      <div className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_8px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)] sm:p-9 md:col-span-2 lg:col-span-1">

        <span className="absolute right-8 top-8 text-[12px] font-black tracking-[0.12em] text-slate-300">
          03 / 03
        </span>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-all duration-300 group-hover:bg-[#f50919] group-hover:text-white">
          <MapPin size={27} strokeWidth={1.8} />
        </div>

        <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f50919]">
          Our Location
        </p>

        <h3 className="mt-2 text-[clamp(19px,1.7vw,24px)] font-extrabold tracking-tight text-[#101820]">
          Mumbai, Maharashtra
        </h3>

        <p className="mt-4 text-[14px] leading-7 text-slate-500">
          North Bombay District Amateur Boxing Association (NBDABA) and its affiliated
          boxing network operate across Mumbai,
          supporting athletes and academies.
        </p>

        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#f50919]">
            <MapPin size={18} />
          </span>

          <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-600">
            NBDABA Network
          </span>
        </div>
      </div>

    </div>

  </div>
</section>

      {/* =====================================================
          ENQUIRY SECTION
      ===================================================== */}

<section className="relative overflow-hidden border-y border-slate-200 bg-white">
  {/* Soft background decoration */}
  <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-red-500/[0.035] blur-[110px]" />

  <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">

      {/* LEFT CONTENT */}
      <div className="lg:pt-5">

        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 bg-[#f50919]" />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f50919]">
            Get In Touch
          </p>
        </div>

        {/* Heading */}
        <h2 className="mt-6 max-w-[650px] text-[clamp(38px,4.2vw,66px)] font-black uppercase leading-[1.03] tracking-[-0.05em] text-[#111827]">
          WE'RE HERE
          <br />
          <span className="text-[#f50919]">TO HELP.</span>
        </h2>

        <p className="mt-6 max-w-[580px] text-[15px] leading-8 text-slate-600 sm:text-base">
          Have a question about the North Bombay District Amateur Boxing Association (NBDABA)?
          Our team is here to guide you with athlete registration,
          tournaments, academy affiliation and other official
          enquiries.
        </p>

        {/* Contact information */}
        <div className="mt-10 max-w-[600px] divide-y divide-slate-100 rounded-[24px] border border-slate-200 bg-[#fafbfc] px-6 sm:px-8">

          {/* Email */}
          <div className="group flex items-start gap-5 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-colors group-hover:bg-[#f50919] group-hover:text-white">
              <Mail size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-500">
                Email Enquiries
              </p>

              <a
                href="mailto:info@mumbaiboxing.org"
                className="mt-2 block break-all text-[15px] font-bold text-[#111827] transition-colors hover:text-[#f50919] sm:text-lg"
              >
                info@mumbaiboxing.org
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="group flex items-start gap-5 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-colors group-hover:bg-[#f50919] group-hover:text-white">
              <Phone size={21} />
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-500">
                Telephone
              </p>

              <a
                href="tel:+912212345678"
                className="mt-2 block text-[17px] font-bold text-[#111827] transition-colors hover:text-[#f50919]"
              >
                +91 22 1234 5678
              </a>
            </div>
          </div>

          {/* Official Enquiries */}
          <div className="group flex items-start gap-5 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#f50919] transition-colors group-hover:bg-[#f50919] group-hover:text-white">
              <Clock3 size={21} />
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-500">
                Official Enquiries
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                Please use our official email or telephone number
                for association-related enquiries.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT ENQUIRY PANEL */}
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8f9fb] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] sm:p-9 lg:p-10">

        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[4px] bg-[#f50919]" />

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f50919] text-white shadow-[0_10px_25px_rgba(245,9,25,0.18)]">
            <Send size={23} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f50919]">
              How Can We Help?
            </p>

            <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.035em] text-[#111827] sm:text-3xl">
              COMMON ENQUIRIES
            </h3>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-7 text-slate-600">
          Contact the association for assistance with any
          of the following areas.
        </p>

        {/* Enquiry items */}
        <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

          {[
            "Athlete registration",
            "Coach registration",
            "Academy affiliation",
            "Tournament participation",
            "Official association matters",
            "Boxing development activities",
          ].map((item, index) => (
            <li
              key={item}
              className="group flex min-h-[70px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#f50919] transition-colors group-hover:bg-[#f50919] group-hover:text-white">
                <ArrowRight size={16} />
              </span>

              <span className="text-[13px] font-bold leading-5 text-[#263244]">
                {item}
              </span>
            </li>
          ))}

        </ul>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-[20px] bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <p className="text-sm font-bold text-[#111827]">
            Need assistance with something else?
          </p>

          <p className="mt-2 text-[13px] leading-6 text-slate-500">
            Send us an email with your enquiry and relevant details.
          </p>

          <a
            href="mailto:info@mumbaiboxing.org"
            className="group mt-5 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#f50919] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_25px_rgba(245,9,25,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d90015]"
          >
            Send an Email
            <Mail
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

      </div>

    </div>
  </div>
</section>


      {/* =====================================================
          QUICK LINKS
      ===================================================== */}
{/* =====================================================
    EXPLORE MBA — WHITE PREMIUM DESIGN
===================================================== */}

<section className="relative isolate overflow-hidden bg-[#f7f9fc]">

  {/* Decorative background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage:
        "linear-gradient(#111827 1px,transparent 1px),linear-gradient(90deg,#111827 1px,transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />

  {/* Decorative red glow */}
  <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-500/[0.07] blur-[100px]" />

  {/* Background boxing gloves */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-24 top-0 hidden h-full w-[400px] bg-contain bg-left-top bg-no-repeat opacity-[0.07] lg:block"
    style={{
      backgroundImage: "url('/about/boxing-gloves.png')",
    }}
  />

  <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-10 lg:py-28">

    {/* Heading */}
    <div className="mx-auto max-w-[1000px] text-center">

      <div className="flex items-center justify-center gap-4">
        <span className="h-[2px] w-10 bg-[#f50919]" />

        <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#f50919]">
          Explore MBA
        </p>

        <span className="h-[2px] w-10 bg-[#f50919]" />
      </div>

      <h2 className="mt-6 text-3xl font-black uppercase leading-[1.08] tracking-[-0.045em] text-[#080d16] sm:text-4xl lg:text-[52px]">
        FIND WHAT YOU'RE{" "}
        <span className="text-[#f50919]">
          LOOKING FOR
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-8 text-slate-500 sm:text-base">
        Explore the different sections of the NBDABA
        Association website.
      </p>
    </div>

    {/* Quick link cards */}
    <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {[
        {
          href: "/about",
          title: "About MBA",
          description:
            "Learn about our vision, mission and association details.",
          icon: <Users size={26} strokeWidth={2.2} />,
        },
        {
          href: "/academies",
          title: "Academies",
          description:
            "Find affiliated boxing academies across Mumbai.",
          icon: <ShieldCheck size={26} strokeWidth={2.2} />,
        },
        {
          href: "/rankings",
          title: "Rankings",
          description:
            "Explore latest rankings and athlete performance.",
          icon: <Trophy size={26} strokeWidth={2.2} />,
        },
        {
          href: "/news",
          title: "News",
          description:
            "Stay updated with the latest news and announcements.",
          icon: <MessageSquare size={26} strokeWidth={2.2} />,
        },
      ].map((item) => (

        <Link
          key={item.href}
          href={item.href}
          className="group relative flex min-h-[205px] flex-col overflow-hidden rounded-[22px] border border-[#e7ebf1] bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-2 hover:border-red-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.1)] sm:p-7"
        >

          <div className="flex items-start justify-between gap-3">

            {/* Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#f50919] transition-all duration-300 group-hover:bg-[#f50919] group-hover:text-white">
              {item.icon}
            </div>

            {/* Arrow */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-300 text-[#f50919] transition-all duration-300 group-hover:border-[#f50919] group-hover:bg-[#f50919] group-hover:text-white">
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>

          </div>

          <h3 className="mt-6 text-lg font-extrabold tracking-tight text-[#101827]">
            {item.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
            {item.description}
          </p>

          {/* Bottom red indicator */}
          <div className="mt-6 h-[3px] w-16 rounded-full bg-[#f50919] transition-all duration-300 group-hover:w-full" />

        </Link>
      ))}

    </div>
  </div>
</section>


{/* =====================================================
    MEMBERSHIP CTA — PREMIUM SPLIT DESIGN
===================================================== */}

<section className="relative isolate overflow-hidden bg-[#070a10]">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage:
        "linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />

  <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />

  <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-10 bg-[#ff1730]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#ff3045]">
            Join North Bombay District Amateur Boxing Association (NBDABA)
          </span>
        </div>

        <h2 className="mt-7 max-w-[850px] text-[clamp(38px,4.5vw,72px)] font-black uppercase leading-[1.03] tracking-[-0.055em] text-white">
          YOUR JOURNEY
          <br />
          STARTS{" "}
          <span className="text-[#ff263b]">
            HERE.
          </span>
        </h2>

        <p className="mt-7 max-w-[610px] text-[15px] leading-8 text-slate-400 sm:text-base">
          Become part of Mumbai&apos;s growing boxing community.
          Connect with the association, access structured sporting
          opportunities and take the next step in your boxing journey.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Athlete Registration",
            "Tournament Opportunities",
            "Academy Network",
            "Boxing Development",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-sm font-semibold text-slate-300"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-[#ff3045]">
                <CheckCircle2 size={16} />
              </span>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-8 rounded-full bg-[#f50919] px-8 py-4 text-sm font-extrabold uppercase text-white shadow-[0_12px_35px_rgba(245,9,25,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d90015]"
          >
            Become a Member
            <ArrowRight
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-red-500 hover:bg-white/5"
          >
            Explore Association
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -right-6 -top-6 h-full w-full rotate-3 rounded-[32px] border border-red-500/20 bg-red-600/[0.06]" />

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#10151e] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f50919] via-red-500 to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/15 text-[#ff3045]">
              <Trophy size={30} />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-red-500">
              MBA Community
            </span>
          </div>

          <h3 className="mt-10 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
            TRAIN.
            <br />
            COMPETE.
            <br />
            <span className="text-[#ff263b]">
              BELONG.
            </span>
          </h3>

          <p className="mt-6 max-w-[400px] text-sm leading-7 text-slate-400">
            A stronger boxing community begins with passionate athletes,
            dedicated coaches and connected academies.
          </p>

          <div className="mt-9 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Your Next Step
                </p>
                <p className="mt-2 text-base font-bold text-white">
                  Join the Association
                </p>
              </div>

              <Link
                href="/register"
                aria-label="Register with North Bombay District Amateur Boxing Association (NBDABA)"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f50919] text-white transition-all duration-300 hover:scale-110 hover:bg-red-700"
              >
                <ArrowRight size={21} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* =====================================================
    BOTTOM BRAND LINE
===================================================== */}

<section className="border-t border-white/10 bg-[#070b10]">

  <div className="mx-auto max-w-[1600px] px-5 py-9 sm:px-7 lg:px-10">

    <div className="flex items-center justify-center gap-4">

      <span className="h-px w-10 bg-white/20 sm:w-20" />

      <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff1730] shadow-[0_0_12px_rgba(255,23,48,0.8)]" />

      <p className="text-center text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 sm:text-[11px]">
        Train · Compete · Belong
      </p>

      <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff1730] shadow-[0_0_12px_rgba(255,23,48,0.8)]" />

      <span className="h-px w-10 bg-white/20 sm:w-20" />

    </div>

  </div>
</section>


    </main>
  );
}

/* =========================================================
   QUICK LINK
   ========================================================= */

function QuickLink({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#05070a] px-5 py-4 text-sm font-bold text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/20 hover:bg-red-500/[0.035] hover:text-white"
    >

      <div className="flex items-center gap-3">

        <span className="text-red-500">
          {icon}
        </span>

        {title}

      </div>

      <ArrowRight
        size={15}
        className="text-slate-700 transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-500"
      />

    </Link>
  );
}