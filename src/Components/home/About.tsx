const highlights = [
  { title: "Founded 1985",  desc: "Over 4 decades of developing boxing talent in Mumbai." },
  { title: "BFI Affiliated", desc: "Officially recognized by Boxing Federation of India." },
  { title: "3 Talukas",     desc: "Active chapters in Borivali, Andheri & Kurla talukas." },
  { title: "Digital First", desc: "Fully digital boxer IDs, certificates & records system." },
];

export default function About() {
  return (
    <section id="about" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — visual block */}
          <div className="animate-fade-up relative">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center"
              style={{ background: "linear-gradient(145deg,#060C18 0%,#0B1120 60%,#111827 100%)" }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(ellipse at 30% 70%,rgba(212,160,23,.35) 0%,transparent 60%)" }}
              />
              <div className="relative text-center px-8">
                <div className="text-8xl mb-4 drop-shadow-2xl">🥊</div>
                <p className="font-display text-4xl text-white tracking-widest">SINCE 1985</p>
                <p className="text-sm mt-2" style={{ color: "#94A3B8" }}>Shaping Mumbai's Boxing Legacy</p>
              </div>
              <div
                className="absolute bottom-6 left-6 rounded-2xl px-5 py-3 shadow-2xl"
                style={{ background: "linear-gradient(135deg,#D4A017,#F0C040)" }}
              >
                <p className="text-2xl font-extrabold" style={{ color: "#0B1120" }}>40+</p>
                <p className="text-xs font-semibold" style={{ color: "rgba(11,17,32,.7)" }}>Years of Excellence</p>
              </div>
              <div className="absolute top-6 right-6 bg-white rounded-2xl px-5 py-3 shadow-2xl">
                <p className="text-2xl font-extrabold" style={{ color: "#0B1120" }}>1,240+</p>
                <p className="text-xs font-semibold" style={{ color: "#64748B" }}>Active Boxers</p>
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div className="animate-slide-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#D4A017" }}>About Us</p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#0B1120" }}>
              The Heart of Boxing<br />in Mumbai
            </h2>
            <p className="mt-5 leading-relaxed text-base" style={{ color: "#64748B" }}>
              Mumbai Boxing Association (MBA) is the premier governing body for amateur boxing
              across Mumbai. We manage registrations, certifications, rankings and events for
              boxers, coaches and academies across all three talukas — Borivali, Andheri and Kurla.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="about-highlight-card group flex gap-3 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className="w-2 h-2 mt-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                    style={{ background: "#D4A017" }}
                  />
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#0B1120" }}>{h.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
