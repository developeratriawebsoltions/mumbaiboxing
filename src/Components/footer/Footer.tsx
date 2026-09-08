import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const footerLinks = [
  {
    heading: "Association",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Official Notices", href: "/news" },
      { label: "Contact Us", href: "/contact" },
      { label: "Grievance Cell", href: "/grievance" },
    ],
  },

  {
    heading: "Members",
    links: [
      {
        label: "Boxer Registration",
        href: "/register",
      },
      {
        label: "Coach Registration",
        href: "/register",
      },
      {
        label: "Academy Affiliation",
        href: "/register",
      },
    ],
  },

  {
    heading: "Portal",
    links: [
      {
        label: "Rankings",
        href: "/rankings",
      },
      {
        label: "Tournaments",
        href: "/events",
      },
      {
        label: "Certificates",
        href: "/login",
      },
      {
        label: "Payments",
        href: "/login",
      },
      {
        label: "Sitemap",
        href: "/sitemap",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="
        relative
        overflow-hidden
        border-t
        border-white/[0.08]
        bg-[#05070a]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Red ambient glow */}

        <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-red-600/[0.035] blur-[150px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-red-900/[0.05] blur-[150px]" />

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="relative mx-auto max-w-[1440px] px-6 py-16 lg:px-10">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="max-w-sm">

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >

              {/* Logo */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-600
                  text-lg
                  font-black
                  tracking-tight
                  text-white
                  shadow-[0_0_25px_rgba(220,38,38,0.15)]
                  transition-all
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:bg-red-500
                  group-hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]
                "
              >
                MB
              </div>

              <div className="leading-none">

                <div className="text-sm font-bold tracking-[0.18em] text-white">
                  MUMBAI
                </div>

                <div className="mt-1 text-xs font-bold tracking-[0.22em] text-red-500">
                  BOXING ASSOCIATION
                </div>

              </div>

            </Link>

            {/* Description */}

            <p className="mt-6 text-sm leading-7 text-slate-500">
              Official governing body for amateur boxing across Mumbai.
              Building athletes, strengthening the boxing community, and
              creating a professional sporting ecosystem.
            </p>

            {/* =================================================
                CONTACT DETAILS
            ================================================= */}

            <div className="mt-7 space-y-4">

              {/* Email */}

              <a
                href="mailto:info@mumbaiboxing.org"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-slate-400
                  transition-colors
                  hover:text-white
                "
              >

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-slate-500
                    transition-all
                    group-hover:border-red-500/20
                    group-hover:bg-red-500/[0.07]
                    group-hover:text-red-500
                  "
                >
                  <Mail size={16} />
                </span>

                <span>
                  info@mumbaiboxing.org
                </span>

              </a>

              {/* Phone */}

              <a
                href="tel:+912212345678"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-slate-400
                  transition-colors
                  hover:text-white
                "
              >

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-slate-500
                    transition-all
                    group-hover:border-red-500/20
                    group-hover:bg-red-500/[0.07]
                    group-hover:text-red-500
                  "
                >
                  <Phone size={16} />
                </span>

                <span>
                  +91 22 1234 5678
                </span>

              </a>

              {/* Location */}

              <div className="flex items-center gap-3 text-sm text-slate-400">

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-slate-500
                  "
                >
                  <MapPin size={16} />
                </span>

                <span>
                  Mumbai, Maharashtra
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              LINK COLUMNS
          ================================================= */}

          {footerLinks.map((col) => (

            <div key={col.heading}>

              <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-red-500">
                {col.heading}
              </h4>

              <ul className="space-y-3">

                {col.links.map((link) => (

                  <li key={link.label}>

                    <Link
                      href={link.href}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1
                        text-sm
                        text-slate-500
                        transition-colors
                        duration-200
                        hover:text-white
                      "
                    >

                      <span>
                        {link.label}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="
                          translate-y-0
                          opacity-0
                          transition-all
                          duration-200
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                          group-hover:opacity-100
                          group-hover:text-red-500
                        "
                      />

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}

        </div>

        {/* =====================================================
            ASSOCIATION / REGISTRATION BADGE
        ===================================================== */}

        <div
          className="
            mt-14
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#090c11]
            px-5
            py-4
            shadow-[0_15px_45px_rgba(0,0,0,0.2)]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-red-500/15
                bg-red-500/[0.07]
                text-red-500
              "
            >
              <ShieldCheck size={18} />
            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Official Mumbai Boxing Association
              </p>

              <p className="mt-0.5 text-xs leading-5 text-slate-600">
                Registration: Regd. No. F-45151 (MUM) under The Bombay Public
                Trusts Act, 1950
              </p>

            </div>

          </div>

          {/* Become Member */}

          <Link
            href="/login"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-red-600
              px-5
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-wider
              !text-white
              shadow-[0_5px_20px_rgba(220,38,38,0.16)]
              transition-all
              duration-200
              hover:bg-red-500
              hover:shadow-[0_8px_25px_rgba(220,38,38,0.25)]
            "
          >
            Become a Member

            <ArrowUpRight size={14} />
          </Link>

        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div
          className="
            mt-10
            flex
            flex-col
            gap-5
            border-t
            border-white/[0.07]
            pt-6
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <p className="text-xs text-slate-700">
            © 2026 Mumbai Boxing Association. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

            <Link
              href="/privacy-policy"
              className="
                text-xs
                text-slate-700
                transition-colors
                hover:text-slate-300
              "
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="
                text-xs
                text-slate-700
                transition-colors
                hover:text-slate-300
              "
            >
              Terms of Use
            </Link>

            <Link
              href="/sitemap"
              className="
                text-xs
                text-slate-700
                transition-colors
                hover:text-slate-300
              "
            >
              Sitemap
            </Link>

          </div>

        </div>

        {/* =====================================================
            BOTTOM DECORATION
        ===================================================== */}

        <div className="mt-10 flex items-center justify-center gap-3">

          <span className="h-px w-12 bg-white/[0.06]" />

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-slate-800">
            Train · Compete · Belong
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />

          <span className="h-px w-12 bg-white/[0.06]" />

        </div>

      </div>
    </footer>
  );
}