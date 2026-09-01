"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Doc = { id: number; label: string; filePath: string; fileType: string; createdAt: string };

type Boxer = {
  id: number;
  name: string;
  dob: string | null;
  weight: string | null;
  ageGroup: string | null;
  rank: number | null;
  academy: { name: string } | null;
  user: { email: string; createdAt: string; documents: Doc[] };
};

export default function BoxerDashboard() {
  const [boxer, setBoxer] = useState<Boxer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/boxer")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBoxer(data);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  const boxerId = boxer ? `MBA-BXR-${new Date(boxer.user.createdAt).getFullYear()}-${String(boxer.id).padStart(4, "0")}` : "—";

  return (
    <DashboardLayout role="boxer">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Boxer Dashboard</h2>
          <p className="text-gray-500 text-sm">Your personal boxing profile & records</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading profile...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {boxer && (
          <>
            {/* Profile Card */}
            <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-600">
                {boxer.name.charAt(0)}
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-gray-400">Full Name</p><p className="font-semibold">{boxer.name}</p></div>
                <div><p className="text-gray-400">Boxer ID</p><p className="font-semibold">{boxerId}</p></div>
                <div><p className="text-gray-400">Date of Birth</p><p className="font-semibold">{formatDate(boxer.dob)}</p></div>
                <div><p className="text-gray-400">Weight Category</p><p className="font-semibold">{boxer.weight ?? "—"}</p></div>
                <div><p className="text-gray-400">Age Group</p><p className="font-semibold">{boxer.ageGroup ?? "—"}</p></div>
                <div><p className="text-gray-400">Current Rank</p><p className="font-semibold text-red-600">{boxer.rank ? `#${boxer.rank}` : "—"}</p></div>
                <div><p className="text-gray-400">Academy</p><p className="font-semibold">{boxer.academy?.name ?? "—"}</p></div>
                <div><p className="text-gray-400">Email</p><p className="font-semibold">{boxer.user.email}</p></div>
                <div><p className="text-gray-400">Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
              </div>
              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download ID Card</button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Medical Records", badge: "Valid" },
                { title: "Tournament Entries", badge: "2 active" },
                { title: "Payment Receipts", badge: "View" },
                { title: "Certificates", badge: "3 available" },
              ].map((item) => (
                <div key={item.title} className="bg-white border rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow text-center">
                  <p className="font-medium text-sm">{item.title}</p>
                  <span className="text-xs text-blue-600 mt-1 block">{item.badge}</span>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-semibold text-lg mb-3">My Documents</h3>
              {(boxer.user.documents ?? []).length === 0 ? (
                <p className="text-gray-400 text-sm">No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(boxer.user.documents ?? []).map((doc) => (
                    <a
                      key={doc.id}
                      href={`/api/file?path=${encodeURIComponent(doc.filePath)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
                    >
                      {doc.fileType === "image" ? (
                        <img src={`/api/file?path=${encodeURIComponent(doc.filePath)}`} alt={doc.label} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-32 bg-red-50 rounded-lg flex items-center justify-center">
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

            {/* Bout History */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Bout History</h3>
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Event", "Opponent", "Result", "Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-sm">No bout records found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
