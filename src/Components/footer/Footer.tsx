import Link from "next/link";

const footerLinks = [
  {
    heading: "Association",
    links: [
      { label: "About Us",        href: "#about" },
      { label: "Official Notices", href: "#" },
      { label: "Contact Us",      href: "#" },
      { label: "Grievance Cell",  href: "#" },
    ],
  },
  {
    heading: "Members",
    links: [
      { label: "Boxer Registration",  href: "/dashboard/boxer" },
      { label: "Coach Registration",  href: "/dashboard/coach" },
      { label: "Academy Affiliation", href: "/dashboard/academy" },
      { label: "School / College",    href: "/dashboard/school" },
    ],
  },
  {
    heading: "Portal",
    links: [
      { label: "Rankings",     href: "/dashboard/ranking" },
      { label: "Tournaments",  href: "/dashboard/tournament" },
      { label: "Certificates", href: "/dashboard/certificates" },
      { label: "Payments",     href: "/dashboard/payment" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0B1120" }}>
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,#D4A017,transparent)" }} />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-display text-lg"
                style={{ background: "linear-gradient(135deg,#F0C040,#D4A017)", color: "#0B1120" }}
              >
                M
              </div>
              <span className="font-display text-xl tracking-wider text-white">
                MUMBAI <span style={{ color: "#D4A017" }}>BOXING</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
              Official governing body for amateur boxing across Mumbai. BFI affiliated since 1985.
            </p>
            <div className="mt-6 space-y-2 text-sm" style={{ color: "#475569" }}>
              <p>📧 info@mumbaiboxing.org</p>
              <p>📞 +91 22 1234 5678</p>
              <p>📍 Mumbai, Maharashtra</p>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "#D4A017" }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(212,160,23,0.12)" }}
        >
          <p className="text-xs" style={{ color: "#334155" }}>
            © 2025 Mumbai Boxing Association. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((t) => (
              <Link key={t} href="#" className="footer-link text-xs transition-colors">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
