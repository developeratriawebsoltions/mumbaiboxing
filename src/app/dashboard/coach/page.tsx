"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Doc = { id: number; label: string; filePath: string; fileType: string; createdAt: string };

type Boxer = {
  id: number;
  name: string;
  weight: string | null;
  rank: number | null;
  medical: { fitnessStatus: string } | null;
};

type Coach = {
  id: number;
  name: string;
  phone: string | null;
  user: { email: string; createdAt: string; documents: Doc[]; password?: string };
  academy: {
    name: string;
    boxers: Boxer[];
  } | null;
};

export default function CoachDashboard() {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/coach")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setCoach(d); })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const boxers = coach?.academy?.boxers ?? [];
  const coachId = coach
    ? `MBA-CCH-${new Date(coach.user.createdAt).getFullYear()}-${String(coach.id).padStart(4, "0")}`
    : "—";

  const medicalAlerts = boxers.filter(
    (b) => b.medical?.fitnessStatus === "Expired" || b.medical?.fitnessStatus === "Expiring Soon"
  ).length;

  return (
    <DashboardLayout role="coach">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Coach Dashboard</h2>
          <p className="text-gray-500 text-sm">Your coaching profile & boxer management</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {coach && (
          <>
            {/* Profile Card */}
            <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                {coach.name.charAt(0)}
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-gray-400">Full Name</p><p className="font-semibold">{coach.name}</p></div>
                <div><p className="text-gray-400">Coach ID</p><p className="font-semibold">{coachId}</p></div>
                <div><p className="text-gray-400">Email</p><p className="font-semibold">{coach.user.email}</p></div>
                <div><p className="text-gray-400">Phone</p><p className="font-semibold">{coach.phone ?? "—"}</p></div>
                <div><p className="text-gray-400">Academy</p><p className="font-semibold">{coach.academy?.name ?? "—"}</p></div>
                <div><p className="text-gray-400">Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download ID Card</button>
                <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Download Certificate</button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Boxers", value: boxers.length },
                { label: "Ranked Boxers", value: boxers.filter((b) => b.rank !== null).length },
                { label: "Medical Alerts", value: medicalAlerts },
                { label: "No Medical Record", value: boxers.filter((b) => !b.medical).length },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.label === "Medical Alerts" && s.value > 0 ? "text-red-600" : ""}`}>
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Boxers Table */}
            <div>
              <h3 className="font-semibold text-lg mb-3">My Boxers</h3>
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Name", "Weight", "Medical", "Rank"].map((h) => (
                        <th key={h} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {boxers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400">No boxers linked to your academy yet.</td>
                      </tr>
                    ) : (
                      boxers.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{b.name}</td>
                          <td className="px-4 py-3 text-gray-500">{b.weight ?? "—"}</td>
                          <td className="px-4 py-3">
                            {b.medical ? (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                b.medical.fitnessStatus === "Valid"
                                  ? "bg-green-100 text-green-700"
                                  : b.medical.fitnessStatus === "Expired"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-orange-100 text-orange-600"
                              }`}>
                                {b.medical.fitnessStatus}
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">No Record</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-red-600">
                            {b.rank ? `#${b.rank}` : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Documents */}
            <div>
              <h3 className="font-semibold text-lg mb-3">My Documents</h3>
              {(coach.user.documents ?? []).length === 0 ? (
                <p className="text-gray-400 text-sm">No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(coach.user.documents ?? []).map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
                    >
                      {doc.fileType === "image" ? (
                        <img src={doc.filePath} alt={doc.label} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📄</span>
                        </div>
                      )}
                      <p className="text-xs font-semibold text-gray-700 capitalize">{doc.label.replace(/-/g, " ")}</p>
                      <span className="text-xs text-blue-600">Click to view</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
