"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Boxer = {
  id: number;
  name: string;
  weight: string | null;
  rank: number | null;
  medical: { fitnessStatus: string } | null;
};

export default function CoachBoxersPage() {
  const [boxers, setBoxers] = useState<Boxer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/coach")
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) setError(d.error);
        else setBoxers(d.academy?.boxers ?? []);
      })
      .catch(() => setError("Failed to load boxers."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = boxers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const medicalColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-500";
    if (status === "Valid") return "bg-green-100 text-green-700";
    if (status === "Expired") return "bg-red-100 text-red-600";
    return "bg-orange-100 text-orange-600";
  };

  return (
    <DashboardLayout role="coach">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Boxers</h2>
          <p className="text-gray-500 text-sm">All boxers registered under your academy</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Boxers", value: boxers.length },
                { label: "Ranked", value: boxers.filter((b) => b.rank !== null).length },
                { label: "Medical Valid", value: boxers.filter((b) => b.medical?.fitnessStatus === "Valid").length },
                { label: "Medical Alerts", value: boxers.filter((b) => b.medical?.fitnessStatus !== "Valid" || !b.medical).length },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.label === "Medical Alerts" && s.value > 0 ? "text-red-600" : ""}`}>
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search boxer by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["#", "Name", "Weight", "Rank", "Medical Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                        {search ? "No boxers match your search." : "No boxers linked to your academy yet."}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b, i) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium">{b.name}</td>
                        <td className="px-4 py-3 text-gray-500">{b.weight ?? "—"}</td>
                        <td className="px-4 py-3 font-semibold text-red-600">{b.rank ? `#${b.rank}` : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${medicalColor(b.medical?.fitnessStatus)}`}>
                            {b.medical?.fitnessStatus ?? "No Record"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
