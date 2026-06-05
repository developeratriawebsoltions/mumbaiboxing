const stats = [
  { value: "1,240+", label: "Registered Boxers",  icon: "🥊", delay: "delay-100" },
  { value: "186+",   label: "Certified Coaches",   icon: "🏅", delay: "delay-200" },
  { value: "42+",    label: "Academies & Clubs",   icon: "🏛️", delay: "delay-300" },
  { value: "15+",    label: "Tournaments / Year",  icon: "🏆", delay: "delay-400" },
  { value: "3",      label: "Talukas Covered",     icon: "📍", delay: "delay-500" },
  { value: "100%",   label: "Digital Records",     icon: "📱", delay: "delay-600" },
];

export default function Stats() {
  return (
    <section className="py-20" style={{ background: "#F8FAFC" }}>
      <div className="container mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
            By The Numbers
          </p>
          <h2 className="text-4xl font-extrabold" style={{ color: "#0B1120" }}>
            Mumbai Boxing at a Glance
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`animate-fade-up ${s.delay} stat-card group rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-2 cursor-default`}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{s.label}</p>
              <div className="mt-3 h-px mx-auto w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: "#D4A017" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
