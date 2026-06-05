const notices = [
  { title: "Mumbai Open 2025 – Registration Now Open",           date: "10 Jan 2025", type: "Event",    typeClass: "badge-blue"   },
  { title: "Annual Renewal Deadline – 31 January 2025",          date: "05 Jan 2025", type: "Notice",   typeClass: "badge-gold"   },
  { title: "New Weight Category Rules – BFI Circular #24/2025", date: "01 Jan 2025", type: "Circular", typeClass: "badge-purple" },
  { title: "Borivali Trials – Draw Sheet Published",             date: "28 Dec 2024", type: "Event",    typeClass: "badge-blue"   },
  { title: "District Under-19 Championship – Venue Confirmed",  date: "20 Dec 2024", type: "Notice",   typeClass: "badge-gold"   },
];

const ticker = notices.map((n) => n.title).join("   •   ");

export default function Notices() {
  return (
    <section className="py-24" style={{ background: "#F1F5F9" }}>
      <div className="container mx-auto px-6">

        {/* Live ticker */}
        <div
          className="flex items-center gap-4 rounded-2xl px-6 py-3 mb-14 overflow-hidden"
          style={{ background: "#0B1120", border: "1px solid rgba(212,160,23,0.25)" }}
        >
          <span
            className="flex-shrink-0 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg,#D4A017,#F0C040)", color: "#0B1120" }}
          >
            LIVE
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="animate-ticker whitespace-nowrap text-sm font-medium" style={{ color: "#94A3B8" }}>
              {ticker}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>Updates</p>
          <h2 className="text-4xl font-extrabold" style={{ color: "#0B1120" }}>Official Notices</h2>
        </div>

        <div className="space-y-3">
          {notices.map((n, i) => (
            <div
              key={i}
              className={`animate-fade-up delay-${(i + 1) * 100} notice-row group flex items-center justify-between rounded-2xl px-6 py-4 border cursor-pointer transition-all duration-200`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                  style={{ background: "#D4A017" }}
                />
                <p className="text-sm font-semibold truncate" style={{ color: "#0B1120" }}>{n.title}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${n.typeClass}`}>{n.type}</span>
                <span className="text-xs hidden sm:block" style={{ color: "#94A3B8" }}>{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
