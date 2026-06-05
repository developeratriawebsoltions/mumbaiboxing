import Link from "next/link";

const services = [
  { icon: "🥊", title: "Boxer Registration",    desc: "Register boxers with digital ID, weight category & taluka assignment.",   href: "/dashboard/boxer" },
  { icon: "🏅", title: "Coach Certification",   desc: "Issue AIBA-standard coach certificates with QR verification.",            href: "/dashboard/coach" },
  { icon: "🏛️", title: "Academy Management",    desc: "Affiliation, renewal, member tracking & event submissions.",             href: "/dashboard/academy" },
  { icon: "🏆", title: "Tournament Hub",         desc: "Event creation, draw sheets, bout schedules & medal tally.",            href: "/dashboard/tournament" },
  { icon: "📊", title: "Live Rankings",          desc: "Real-time age-wise, weight-wise & taluka-wise boxer rankings.",         href: "/dashboard/ranking" },
  { icon: "🏥", title: "Medical Records",        desc: "Fitness certificates, injury tracking & competition eligibility.",      href: "/dashboard/medical" },
  { icon: "💳", title: "Payment Gateway",        desc: "Registration, renewal & tournament fee management with receipts.",      href: "/dashboard/payment" },
  { icon: "📜", title: "Digital Certificates",   desc: "Participation, merit & affiliation certificates with PDF export.",      href: "/dashboard/certificates" },
  { icon: "📁", title: "Document Verification", desc: "Aadhaar, birth certificate & qualification document approvals.",        href: "/dashboard/documents" },
];

const delays = ["delay-100","delay-200","delay-300","delay-100","delay-200","delay-300","delay-100","delay-200","delay-300"];

export default function Services() {
  return (
    <section className="py-24" style={{ background: "#F1F5F9" }}>
      <div className="container mx-auto px-6">

        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
            What We Offer
          </p>
          <h2 className="text-4xl font-extrabold" style={{ color: "#0B1120" }}>
            Complete Boxing Management Platform
          </h2>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Everything a boxing association needs — from boxer registration to tournament results, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Link
              key={s.title}
              href={s.href}
              className={`service-card animate-fade-up ${delays[i]} group block rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(212,160,23,0.12)" }}>
                {s.icon}
              </div>
              <h3 className="font-bold text-lg text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{s.desc}</p>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold" style={{ color: "#D4A017" }}>
                Explore
                <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
