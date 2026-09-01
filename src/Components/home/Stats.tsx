import { Users, UserCheck, Building2, CalendarDays, Award } from "lucide-react";

const stats = [
  { value: "1,240+", label: "REGISTERED BOXERS",   Icon: Users        },
  { value: "186+",   label: "CERTIFIED COACHES",    Icon: UserCheck    },
  { value: "42+",    label: "AFFILIATED ACADEMIES", Icon: Building2    },
  { value: "15+",    label: "TOURNAMENTS / YEAR",   Icon: CalendarDays },
  { value: "3",      label: "NATIONAL TITLES",      Icon: Award        },
];

export default function Stats() {
  return (
    <section className="py-6" style={{ background: "#070D14" }}>
      <div className="container mx-auto px-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-8 px-4 text-center"
                style={{
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <s.Icon size={28} color="#DC2626" strokeWidth={1.5} className="mb-3" />
                <span className="text-3xl font-extrabold text-white leading-none">{s.value}</span>
                <span className="text-[10px] font-bold tracking-widest mt-2" style={{ color: "#6b7280" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
