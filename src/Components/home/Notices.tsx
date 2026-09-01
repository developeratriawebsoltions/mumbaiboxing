import Link from "next/link";
import { AlertCircle, Trophy, GraduationCap, HeartPulse } from "lucide-react";

const notices = [
  {
    title: "Mumbai District Boxing Championship",
    desc: "Registration now open for all academies.",
    date: "12 AUG 2025",
    type: "IMPORTANT",
    Icon: AlertCircle,
    iconBg: "rgba(220,38,38,0.15)",
    iconColor: "#EF4444",
  },
  {
    title: "Annual Tournament Schedule Released",
    desc: "Check the detailed schedule and venues.",
    date: "08 AUG 2025",
    type: "TOURNAMENT",
    Icon: Trophy,
    iconBg: "rgba(234,179,8,0.15)",
    iconColor: "#FBBF24",
  },
  {
    title: "Coaches Certification Program",
    desc: "New batch registrations starting soon.",
    date: "05 AUG 2025",
    type: "NOTICE",
    Icon: GraduationCap,
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#60A5FA",
  },
  {
    title: "Free Health Check-up Camp",
    desc: "Free health checkup for registered boxers.",
    date: "01 AUG 2025",
    type: "EVENT",
    Icon: HeartPulse,
    iconBg: "rgba(34,197,94,0.15)",
    iconColor: "#4ADE80",
  },
];

export default function Notices() {
  return (
    <section className="py-16" style={{ background: "#070D14" }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* ── Notices panel ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#DC2626" }}>
                  Updates
                </p>
                <h2 className="text-lg font-extrabold text-white">Official Notices</h2>
              </div>
              <Link href="/events" className="text-xs font-semibold" style={{ color: "#DC2626" }}>
                VIEW ALL →
              </Link>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {notices.map((n, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: n.iconBg }}
                  >
                    <n.Icon size={16} style={{ color: n.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-white leading-snug">{n.title}</p>
                      <span className="text-[10px] flex-shrink-0 font-bold" style={{ color: "#6b7280" }}>{n.date}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{n.desc}</p>
                    <span
                      className="inline-block text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-full"
                      style={{ background: n.iconBg, color: n.iconColor }}
                    >
                      {n.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA panel ── */}
          <div
            className="rounded-2xl overflow-hidden relative flex flex-col justify-between p-8 min-h-[340px]"
            style={{ background: "linear-gradient(145deg,#070D14 0%,#1a0a0a 100%)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(220,38,38,0.18) 0%, transparent 65%)" }}
            />

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#DC2626" }}>
                Join Us
              </p>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                READY TO STEP<br />INTO THE RING?
              </h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                Join Mumbai&apos;s boxing community and be part of something bigger.
              </p>
            </div>

            <div className="relative mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#DC2626,#EF4444)", boxShadow: "0 8px 24px rgba(220,38,38,0.3)" }}
              >
                REGISTER NOW →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
