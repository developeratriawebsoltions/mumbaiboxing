
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  LockKeyhole,
  Users,
  Camera,
  Play,
  BriefcaseBusiness,
} from "lucide-react";

const footerLinks = [
  {
    heading: "Association",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Governance & Committees", href: "/governance" },
      { label: "Official Notices", href: "/news" },
      { label: "Tournaments", href: "/events" },
      { label: "News & Updates", href: "/news" },
      { label: "Contact Us", href: "/contact" },
      { label: "Grievance Cell", href: "/grievance" },
    ],
  },
  {
    heading: "Members",
    links: [
      { label: "Boxer Registration", href: "/register" },
      { label: "Coach Registration", href: "/register" },
      { label: "Academy Affiliation", href: "/register" },
      { label: "Membership Benefits", href: "/register" },
      { label: "Rules & Regulations", href: "/about" },
      { label: "Downloads", href: "/login" },
    ],
  },
  {
    heading: "Portal",
    links: [
      { label: "Rankings", href: "/rankings" },
      { label: "Tournaments", href: "/events" },
      { label: "Certificates", href: "/login" },
      { label: "Payments", href: "/login" },
      { label: "FAQs", href: "/contact" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Connect this form to your newsletter API before launch.
    setNotice("Newsletter signup is not yet available.");
  }

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#050b10] text-white"
    >
      <div className="mx-auto max-w-[1880px] px-5 pt-6 sm:px-8 lg:px-12 xl:px-20">

        {/* TOP MEMBERSHIP BANNER */}
        <div className="flex flex-col gap-6 rounded-[22px] border border-[#f50919] bg-[linear-gradient(110deg,#111017_0%,#080e15_65%,#180b13_100%)] px-6 py-6 shadow-[0_0_35px_rgba(245,9,25,0.06)] md:flex-row md:items-center md:justify-between md:px-10">

          <div className="flex items-start gap-5 md:items-center">
            <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full border border-red-600/25 bg-red-600/10 text-[#ff1025]">
              <ShieldCheck size={32} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-[21px] font-extrabold leading-tight tracking-tight sm:text-[26px]">
                Official{" "}
                <span className="text-[#ff172b]">
                  Mumbai Boxing
                </span>{" "}
                Association
              </h2>

              <p className="mt-2 text-[13px] leading-relaxed text-[#aab9cc] sm:text-[15px]">
                Registration: Regd. No. F-45151 (MUM)
                under The Bombay Public Trusts Act, 1950
              </p>
            </div>
          </div>

          <div className="hidden h-14 w-px bg-white/10 md:block" />

          <Link
            href="/register"
            className="inline-flex min-h-[54px] shrink-0 items-center justify-center gap-3 rounded-full bg-[#f50919] px-8 text-[13px] font-extrabold uppercase text-white shadow-[0_0_28px_rgba(245,9,25,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d80718]"
          >
            Become a Member
            <ArrowRight size={19} />
          </Link>
        </div>

        {/* FIVE-COLUMN FOOTER */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_0.9fr_1.25fr] lg:gap-x-8 lg:pt-16 xl:gap-x-12">

          {/* BRAND COLUMN */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="relative h-[72px] w-[72px] shrink-0">
                <Image
                  src="/logo/download.webp"
                  alt="Mumbai Boxing Association"
                  fill
                  sizes="72px"
                  className="object-contain"
                />
              </div>

              <div>
                <div className="text-[19px] font-black uppercase leading-tight tracking-tight">
                  Mumbai{" "}
                  <span className="text-[#ff172b]">
                    Boxing
                  </span>
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-[#cbd5e1]">
                  Association
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-[360px] text-[14px] leading-[1.75] text-[#a8b8cb]">
              Official governing body for amateur boxing
              across Mumbai. Building athletes,
              strengthening the boxing community, and
              creating a professional sporting ecosystem.
            </p>

            <div className="mt-4 h-[3px] w-10 bg-[#f50919]" />

            <div className="mt-5 space-y-3">
              <a
                href="mailto:info@mumbaiboxing.org"
                className="group flex items-center gap-3 text-[13px] text-[#c4cfdf] transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f50919] text-white">
                  <Mail size={16} />
                </span>
                info@mumbaiboxing.org
              </a>

              <a
                href="tel:+912212345678"
                className="group flex items-center gap-3 text-[13px] text-[#c4cfdf] transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f50919] text-white">
                  <Phone size={16} />
                </span>
                +91 22 1234 5678
              </a>

              <div className="flex items-center gap-3 text-[13px] text-[#c4cfdf]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f50919] text-white">
                  <MapPin size={17} />
                </span>
                Mumbai, Maharashtra
              </div>
            </div>

            {/* SOCIAL ICONS */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Users, label: "Facebook" },
                { icon: Camera, label: "Instagram" },
                { icon: Play, label: "YouTube" },
                { icon: BriefcaseBusiness, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  title={`${label} link coming soon`}
                  aria-label={`${label} link coming soon`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#526071] text-[#e2e8f0] transition hover:border-[#f50919] hover:bg-[#f50919]"
                >
                  <Icon size={18} />
                </span>
              ))}
            </div>
          </div>

          {/* NAVIGATION COLUMNS */}
          {footerLinks.map((column) => (
            <div
              key={column.heading}
              className="lg:border-l lg:border-white/10 lg:pl-6"
            >
              <h3 className="flex items-center gap-3 text-[14px] font-extrabold uppercase tracking-[0.07em] text-white">
                <span className="h-6 w-[4px] bg-[#f50919]" />
                {column.heading}
              </h3>

              <ul className="mt-7 space-y-5">
                {column.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-3 text-[13px] leading-5 text-[#b7c4d5] transition duration-200 hover:translate-x-1 hover:text-white"
                    >
                      <ChevronRight
                        size={17}
                        strokeWidth={3}
                        className="shrink-0 text-[#ff1025]"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* NEWSLETTER COLUMN */}
          <div className="lg:border-l lg:border-white/10 lg:pl-6">
            <h3 className="flex items-center gap-3 text-[14px] font-extrabold uppercase tracking-[0.07em] text-white">
              <span className="h-6 w-[4px] bg-[#f50919]" />
              Stay Updated
            </h3>

            <p className="mt-7 text-[14px] leading-[1.75] text-[#c2cedd]">
              Get the latest updates on tournaments,
              notices, rankings and more.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-6 space-y-3"
            >
              <div className="flex min-h-[52px] items-center gap-3 rounded-full border border-[#344354] bg-[#0b141e] px-5 focus-within:border-red-500">
                <Mail
                  size={19}
                  className="shrink-0 text-[#e2e8f0]"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="w-full min-w-0 bg-transparent text-[13px] text-white outline-none placeholder:text-[#8091a7]"
                />
              </div>

              <button
                type="submit"
                className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-[#f50919] text-[14px] font-extrabold text-white transition hover:bg-[#d80718]"
              >
                Subscribe
                <ArrowRight size={18} />
              </button>
            </form>

            {notice && (
              <p role="status" className="mt-3 text-xs text-amber-300">
                {notice}
              </p>
            )}

            <div className="mt-5 flex items-center gap-2 text-[12px] text-[#8290a3]">
              <LockKeyhole size={14} />
              No spam. Unsubscribe anytime.
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="border-t border-white/15">
        <div className="mx-auto grid max-w-[1880px] grid-cols-1 items-center gap-5 px-5 py-7 text-center sm:px-8 lg:grid-cols-3 lg:px-12 lg:text-left xl:px-20">

          <p className="text-[12px] text-[#b9c5d5]">
            © {new Date().getFullYear()} Mumbai Boxing Association.
            All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="hidden h-px w-8 bg-white/30 sm:block" />
            <span className="h-2 w-2 rounded-full bg-[#f50919] shadow-[0_0_12px_#f50919]" />
            <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.3em] text-[#c6d0df]">
              Train · Compete · Belong
            </span>
            <span className="h-2 w-2 rounded-full bg-[#f50919] shadow-[0_0_12px_#f50919]" />
            <span className="hidden h-px w-8 bg-white/30 sm:block" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-end">
            <Link
              href="/privacy-policy"
              className="text-[12px] text-[#b9c5d5] transition hover:text-white"
            >
              Privacy Policy
            </Link>
            <span className="text-white/40">|</span>
            <Link
              href="/terms"
              className="text-[12px] text-[#b9c5d5] transition hover:text-white"
            >
              Terms of Use
            </Link>
            <span className="text-white/40">|</span>
            <Link
              href="/sitemap"
              className="text-[12px] text-[#b9c5d5] transition hover:text-white"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
