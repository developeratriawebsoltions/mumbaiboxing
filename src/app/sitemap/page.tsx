import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const sections = [
  {
    title: "Main Website",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/#about" },
      { label: "Official Notices", href: "/#news" },
      { label: "Contact Us", href: "/#contact" },
      { label: "Grievance Cell", href: "/grievance" },
    ],
  },

  {
    title: "Registration",
    links: [
      { label: "Registration", href: "/register" },
      { label: "Login", href: "/login" },
    ],
  },

  {
    title: "Members & Portal",
    links: [
      { label: "Rankings", href: "/dashboard/ranking" },
      { label: "Tournaments", href: "/events" },
      { label: "Certificates", href: "/login" },
      { label: "Payments", href: "/login" },
    ],
  },

  {
    title: "Information",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Grievance Cell", href: "/grievance" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
            Mumbai Boxing Association
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Sitemap
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Find the main pages, registration services, tournaments, rankings,
            member portal, and association information.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
                  {section.title}
                </h2>

                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-sm text-slate-600 transition-colors hover:text-red-600"
                      >
                        <span>{link.label}</span>

                        <ArrowUpRight
                          size={14}
                          className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}