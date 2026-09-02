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
      { label: "About Us", href: "#about" },
      { label: "Official Notices", href: "#news" },
      { label: "Contact Us", href: "#contact" },
      { label: "Grievance Cell", href: "#" },
    ],
  },
  {
    heading: "Members",
    links: [
      { label: "Boxer Registration", href: "/dashboard/boxer" },
      { label: "Coach Registration", href: "/dashboard/coach" },
      { label: "Academy Affiliation", href: "/dashboard/academy" },
      { label: "School / College", href: "/dashboard/school" },
    ],
  },
  {
    heading: "Portal",
    links: [
      { label: "Rankings", href: "/dashboard/ranking" },
      { label: "Tournaments", href: "/dashboard/tournament" },
      { label: "Certificates", href: "/dashboard/certificates" },
      { label: "Payments", href: "/dashboard/payment" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-slate-200 bg-white text-slate-900"
    >
      {/* Main Footer */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-black tracking-tight text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                MB
              </div>

              <div className="leading-none">
                <div className="text-sm font-bold tracking-[0.18em] text-slate-950">
                  MUMBAI
                </div>
                <div className="mt-1 text-xs font-bold tracking-[0.22em] text-red-600">
                  BOXING ASSOCIATION
                </div>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-500">
              Official governing body for amateur boxing across Mumbai.
              Building athletes, strengthening the boxing community, and
              creating a professional sporting ecosystem.
            </p>

            {/* Contact Details */}
            <div className="mt-7 space-y-4">
              <a
                href="mailto:info@mumbaiboxing.org"
                className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-red-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                  <Mail size={16} />
                </span>

                <span>info@mumbaiboxing.org</span>
              </a>

              <a
                href="tel:+912212345678"
                className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-red-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-red-50 group-hover:text-red-600">
                  <Phone size={16} />
                </span>

                <span>+91 22 1234 5678</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <MapPin size={16} />
                </span>

                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                {col.heading}
              </h4>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-950"
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={13}
                        className="translate-y-0 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Association Badge */}
        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Official Mumbai Boxing Association
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                BFI affiliated since 1985
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20"
          >
            Become a Member
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-400">
            © 2026 Mumbai Boxing Association. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((text) => (
              <Link
                key={text}
                href="#"
                className="text-xs text-slate-400 transition-colors hover:text-slate-900"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}