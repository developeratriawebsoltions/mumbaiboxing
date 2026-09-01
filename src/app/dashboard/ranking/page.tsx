"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

type RankedBoxer = {
  id: number;
  name: string;
  weight: string | null;
  ageGroup: string | null;
  rank: number;
  academy: { name: string } | null;
  isMe: boolean;
};

export default function RankingDashboard() {
  const role = useRole();
  const [rankings, setRankings] = useState<RankedBoxer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rankings")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setRankings(d); })
      .catch(() => setError("Failed to load rankings."))
      .finally(() => setLoading(false));
  }, []);

  const me = rankings.find((r) => r.isMe);

  const rankStyle = (rank: number) =>
    rank === 1 ? "bg-yellow-100 text-yellow-700"
    : rank === 2 ? "bg-gray-200 text-gray-700"
    : rank === 3 ? "bg-orange-100 text-orange-600"
    : "bg-slate-100 text-slate-600";

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Rankings</h2>
          <p className="text-gray-500 text-sm">Current boxer rankings</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <>
            {me && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${rankStyle(me.rank)}`}>
                  #{me.rank}
                </span>
                <div>
                  <p className="font-semibold text-sm">Your Current Rank</p>
                  <p className="text-xs text-gray-500">{me.weight ?? "—"} · {me.ageGroup ?? "—"} · {me.academy?.name ?? "—"}</p>
                </div>
              </div>
            )}

            {rankings.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-400">No rankings available yet.</div>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Rank", "Boxer", "Weight", "Age Group", "Academy"].map((h) => (
                        <th key={h} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rankings.map((r) => (
                      <tr key={r.id} className={`hover:bg-gray-50 ${r.isMe ? "bg-blue-50" : ""}`}>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankStyle(r.rank)}`}>
                            {r.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {r.name} {r.isMe && <span className="text-xs text-blue-600 ml-1">(You)</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{r.weight ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{r.ageGroup ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{r.academy?.name ?? "—"}</td>
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
