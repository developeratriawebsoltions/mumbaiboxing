"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Entry = {
  id: number;
  createdAt: string;
  boxer: {
    id: number;
    name: string;
    weight: string | null;
    ageGroup: string | null;
    academy: { name: string } | null;
  };
};

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  entryFee: number | null;
  _count: { entries: number };
};

export default function TournamentEntriesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/tournaments").then((r) => r.json()),
      fetch(`/api/admin/tournaments?entries=${id}`).then((r) => r.json()),
    ])
      .then(([tournaments, entriesData]) => {
        const t = tournaments.find((t: Tournament) => t.id === Number(id));
        if (t) setTournament(t);
        if (Array.isArray(entriesData)) setEntries(entriesData);
        else setError(entriesData.error ?? "Failed to load entries.");
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";

  const filtered = entries.filter((e) =>
    e.boxer.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.boxer.academy?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const STATUS_COLOR: Record<string, string> = {
    upcoming: "bg-yellow-100 text-yellow-700",
    open: "bg-green-100 text-green-700",
    ongoing: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6">

        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/admin/tournaments")}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tournaments
          </button>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && tournament && (
          <>
            {/* Tournament Info Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{tournament.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {formatDate(tournament.startDate)}
                    {tournament.endDate ? ` – ${formatDate(tournament.endDate)}` : ""}
                    {tournament.location ? ` · ${tournament.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {tournament.entryFee != null && (
                    <span className="text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                      Entry Fee: ₹{tournament.entryFee}
                    </span>
                  )}
                  <span className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium ${STATUS_COLOR[tournament.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {tournament.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                {[
                  { label: "Total Registered", value: entries.length },
                  { label: "Total Revenue", value: `₹${((tournament.entryFee ?? 0) * entries.length).toLocaleString("en-IN")}` },
                  { label: "Academies", value: new Set(entries.map((e) => e.boxer.academy?.name).filter(Boolean)).size },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by boxer or academy..."
                  className="w-full border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <p className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Entries Table */}
            {filtered.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
                <p className="text-4xl mb-3">🥊</p>
                <p className="font-medium">{search ? "No results found." : "No boxers registered yet."}</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["#", "Boxer Name", "Weight", "Age Group", "Academy / Club", "Registered On"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((e, i) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-medium">{e.boxer.name}</td>
                        <td className="px-4 py-3 text-gray-500">{e.boxer.weight ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{e.boxer.ageGroup ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{e.boxer.academy?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(e.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
