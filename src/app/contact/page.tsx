import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
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

import Navbar from "@/Components/navbar/Navbar";
import Footer from "@/Components/footer/Footer";

/* =========================================================
   SEO
   ========================================================= */

export const metadata: Metadata = {
  title: "Contact Us | Mumbai Boxing Association",
  description:
    "Contact the Mumbai Boxing Association for enquiries regarding boxing, athlete registration, tournaments, academies, affiliation and association activities.",
  keywords: [
    "Mumbai Boxing Association contact",
    "Mumbai Boxing Association email",
    "Mumbai boxing contact",
    "boxing association Mumbai",
    "MBA boxing contact",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Mumbai Boxing Association",
    description:
      "Get in touch with the Mumbai Boxing Association for official enquiries, registrations, tournaments and affiliation.",
    type: "website",
    url: "/contact",
    siteName: "Mumbai Boxing Association",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Mumbai Boxing Association",
    description:
      "Contact the Mumbai Boxing Association for official enquiries and assistance.",
  },
};

/* =========================================================
   PAGE
   ========================================================= */

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#05070a]">

        {/* Ambient glows */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-red-600/[0.07] blur-3xl" />

        {/* Grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12">

          {/* Breadcrumb */}

          <div className="mb-10 flex items-center gap-2 text-xs">

            <Link
              href="/"
              className="text-slate-600 transition-colors hover:text-white"
            >
              Home
            </Link>

            <span className="text-slate-800">
              /
            </span>

            <span className="text-red-500">
              Contact
            </span>

          </div>

          <div className="max-w-[1050px]">

            {/* Label */}

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-9 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.45)]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                Mumbai Boxing Association
              </p>

            </div>

            {/* Heading */}

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[84px]">

              CONTACT{" "}

              <span className="text-red-500">
                US
              </span>

            </h1>

            {/* Description */}

            <p className="mt-7 max-w-[850px] text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Have an enquiry about boxing, athlete registration,
              tournaments, academy affiliation or the activities of
              the Mumbai Boxing Association? Get in touch with us
              through the official contact details below.
            </p>

            {/* Hero CTA */}

            <div className="mt-9 flex flex-wrap gap-3">

              <a
                href="mailto:info@mumbaiboxing.org"
                className="group inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition-all duration-200 hover:bg-red-700"
              >
                Send an Email

                <Mail
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />

              </a>

              <a
                href="tel:+912212345678"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Call Association

                <Phone size={15} />

              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#090c11]">

        {/* Background glow */}

        <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-red-600/[0.04] blur-[150px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-red-900/[0.04] blur-[150px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          {/* Section header */}

          <div className="mb-10">

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                Official Contact
              </p>

            </div>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl">

              GET IN{" "}

              <span className="text-red-500">
                TOUCH
              </span>

            </h2>

          </div>

          {/* Contact cards */}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {/* =================================================
                EMAIL
            ================================================= */}

            <a
              href="mailto:info@mumbaiboxing.org"
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#05070a] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
            >

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-600/[0.06] blur-3xl transition group-hover:bg-red-600/[0.1]" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition group-hover:bg-red-600 group-hover:text-white">

                  <Mail size={21} />

                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Email
                </p>

                <h3 className="mt-2 break-all text-lg font-black text-white transition group-hover:text-red-500">
                  info@mumbaiboxing.org
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Send us your enquiry or official communication
                  by email.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">

                  Contact Association

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </div>

            </a>

            {/* =================================================
                PHONE
            ================================================= */}

            <a
              href="tel:+912212345678"
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#05070a] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
            >

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-600/[0.06] blur-3xl transition group-hover:bg-red-600/[0.1]" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition group-hover:bg-red-600 group-hover:text-white">

                  <Phone size={21} />

                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Phone
                </p>

                <h3 className="mt-2 text-lg font-black text-white transition group-hover:text-red-500">
                  +91 22 1234 5678
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Contact the association during official working
                  hours.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">

                  Call Association

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />

                </div>

              </div>

            </a>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#05070a] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20"
            >

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-600/[0.06] blur-3xl transition group-hover:bg-red-600/[0.1]" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500 transition group-hover:bg-red-600 group-hover:text-white">

                  <MapPin size={21} />

                </div>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Location
                </p>

                <h3 className="mt-2 text-lg font-black text-white">
                  Mumbai, Maharashtra
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Mumbai Boxing Association and its affiliated
                  boxing network operate across Mumbai.
                </p>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">

                  Mumbai Boxing Network

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ENQUIRY SECTION
      ===================================================== */}

      <section className="relative overflow-hidden border-y border-white/10 bg-[#05070a]">

        <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/[0.045] blur-[150px]" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-start">

            {/* =================================================
                LEFT
            ================================================= */}

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Get In Touch
                </p>

              </div>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.035em] text-white sm:text-5xl">

                WE'RE HERE{" "}

                <span className="text-red-500">
                  TO HELP
                </span>

              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
                For official enquiries relating to the Mumbai
                Boxing Association, please contact us using the
                information provided on this page.
              </p>

              {/* Contact rows */}

              <div className="mt-9 space-y-5">

                {/* Email */}

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                    <Mail size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-white">
                      Email Enquiries
                    </p>

                    <a
                      href="mailto:info@mumbaiboxing.org"
                      className="mt-1 block text-sm font-semibold text-red-500 transition hover:text-red-400"
                    >
                      info@mumbaiboxing.org
                    </a>

                  </div>

                </div>

                {/* Phone */}

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                    <Phone size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-white">
                      Telephone
                    </p>

                    <a
                      href="tel:+912212345678"
                      className="mt-1 block text-sm font-semibold text-red-500 transition hover:text-red-400"
                    >
                      +91 22 1234 5678
                    </a>

                  </div>

                </div>

                {/* Official enquiries */}

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                    <Clock3 size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-white">
                      Official Enquiries
                    </p>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                      Please use the official email or telephone
                      number for association-related enquiries.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                COMMON ENQUIRIES
            ================================================= */}

            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#090c11] p-6 sm:p-8">

              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-red-600/[0.07] blur-3xl" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07] text-red-500">
                  <Send size={19} />
                </div>

                <h3 className="mt-5 text-2xl font-black text-white">
                  COMMON ENQUIRIES
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  You can contact the association regarding the
                  following areas:
                </p>

                <ul className="mt-6 space-y-3">

                  {[
                    "Athlete registration",
                    "Coach registration",
                    "Academy affiliation",
                    "Tournament participation",
                    "Official association matters",
                    "Boxing development activities",
                  ].map((item) => (

                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-red-500/15 hover:bg-red-500/[0.035] hover:text-white"
                    >

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <ArrowRight size={12} />
                      </span>

                      {item}

                    </li>

                  ))}

                </ul>

                <a
                  href="mailto:info@mumbaiboxing.org"
                  className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_30px_rgba(220,38,38,0.15)] transition hover:bg-red-700"
                >
                  Send an Email

                  <Mail size={15} />

                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK LINKS
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#090c11]">

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          <div className="text-center">

            <div className="flex items-center justify-center gap-3">

              <span className="h-[2px] w-8 bg-red-600" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                Explore MBA
              </p>

              <span className="h-[2px] w-8 bg-red-600" />

            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">

              FIND WHAT YOU'RE{" "}

              <span className="text-red-500">
                LOOKING FOR
              </span>

            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Explore the different sections of the Mumbai Boxing
              Association website.
            </p>

          </div>

          <div className="mx-auto mt-9 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickLink
              href="/about"
              title="About MBA"
              icon={<Users size={16} />}
            />

            <QuickLink
              href="/academies"
              title="Academies"
              icon={<ShieldCheck size={16} />}
            />

            <QuickLink
              href="/rankings"
              title="Rankings"
              icon={<Trophy size={16} />}
            />

            <QuickLink
              href="/news"
              title="News"
              icon={<MessageSquare size={16} />}
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative overflow-hidden border-t border-white/10 bg-[#05070a]">

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-[-160px] h-80 w-80 rounded-full bg-red-600/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24 xl:px-10 2xl:px-12">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3">

                <span className="h-[2px] w-8 bg-red-600" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Mumbai Boxing Association
                </p>

              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">

                READY TO BE PART OF THE{" "}

                <span className="text-red-500">
                  BOXING COMMUNITY?
                </span>

              </h2>

              <p className="mt-5 max-w-2xl leading-7 text-slate-500">
                Register with the Mumbai Boxing Association and
                become part of the association's growing sporting
                network.
              </p>

            </div>

            <Link
              href="/register"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition-all duration-200 hover:bg-red-700"
            >

              Become a Member

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM BRAND LINE
      ===================================================== */}

      <section className="bg-[#05070a]">

        <div className="mx-auto max-w-[1600px] px-5 pb-16 sm:px-7 lg:px-8 xl:px-10 2xl:px-12">

          <div className="flex items-center justify-center gap-3">

            <span className="h-px w-16 bg-white/[0.07]" />

            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-700">
              Train · Compete · Belong
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

            <span className="h-px w-16 bg-white/[0.07]" />

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

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