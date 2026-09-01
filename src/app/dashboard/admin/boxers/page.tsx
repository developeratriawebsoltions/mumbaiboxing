"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Doc = { id: number; label: string; filePath: string; fileType: string };

type Boxer = {
  id: number;
  name: string;
  dob: string | null;
  weight: string | null;
  ageGroup: string | null;
  rank: number | null;
  createdAt: string;
  user: { email: string; createdAt: string; documents: Doc[] };
  academy: { name: string } | null;
  medical: { fitnessStatus: string; expiryDate: string | null; eligible: boolean } | null;
};

export default function AdminBoxersPage() {
  const [boxers, setBoxers] = useState<Boxer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterMedical, setFilterMedical] = useState("All");
  const [docsModal, setDocsModal] = useState<{ name: string; docs: Doc[] } | null>(null);
  const [preview, setPreview] = useState<Doc | null>(null);

  useEffect(() => {
    fetch("/api/admin/boxers")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setBoxers(d); })
      .catch(() => setError("Failed to load boxers."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const filtered = boxers.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (b.academy?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchMedical =
      filterMedical === "All" ||
      (filterMedical === "No Record" ? !b.medical : b.medical?.fitnessStatus === filterMedical);
    return matchSearch && matchMedical;
  });

  const medicalColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-500";
    if (status === "Valid") return "bg-green-100 text-green-700";
    if (status === "Expired") return "bg-red-100 text-red-600";
    return "bg-orange-100 text-orange-600";
  };

  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">All Boxers</h2>
          <p className="text-gray-500 text-sm">Complete list of registered boxers</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Boxers", value: boxers.length, color: "text-gray-800" },
                { label: "Medical Valid", value: boxers.filter((b) => b.medical?.fitnessStatus === "Valid").length, color: "text-green-600" },
                { label: "Medical Expired", value: boxers.filter((b) => b.medical?.fitnessStatus === "Expired").length, color: "text-red-600" },
                { label: "No Medical Record", value: boxers.filter((b) => !b.medical).length, color: "text-orange-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name, email or academy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 flex-wrap">
                {["All", "Valid", "Expired", "Expiring Soon", "No Record"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterMedical(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterMedical === f ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">{filtered.length} of {boxers.length} boxers</p>

            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["ID", "Name", "Email", "DOB", "Weight", "Age Group", "Rank", "Academy", "Medical", "Eligible", "Documents", "Registered"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={12} className="px-4 py-8 text-center text-gray-400">No boxers found.</td></tr>
                  ) : (
                    filtered.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          MBA-BXR-{new Date(b.user.createdAt).getFullYear()}-{String(b.id).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{b.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{b.user.email}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(b.dob)}</td>
                        <td className="px-4 py-3 text-gray-500">{b.weight ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{b.ageGroup ?? "—"}</td>
                        <td className="px-4 py-3 font-semibold text-red-600">{b.rank ? `#${b.rank}` : "—"}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.academy?.name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${medicalColor(b.medical?.fitnessStatus)}`}>
                            {b.medical?.fitnessStatus ?? "No Record"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {b.medical ? (
                            <span className={`text-xs px-2 py-1 rounded-full ${b.medical.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {b.medical.eligible ? "Yes" : "No"}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDocsModal({ name: b.name, docs: b.user.documents ?? [] })}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 whitespace-nowrap"
                          >
                            {(b.user.documents ?? []).length} docs
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(b.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Documents Modal */}
      {docsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => { setDocsModal(null); setPreview(null); }}>
          <div className="bg-white rounded-2xl p-5 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{docsModal.name}</p>
                <p className="text-xs text-gray-500">{docsModal.docs.length} document(s) uploaded</p>
              </div>
              <button onClick={() => { setDocsModal(null); setPreview(null); }} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>

            {docsModal.docs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No documents uploaded.</p>
            ) : preview ? (
              <div>
                <button onClick={() => setPreview(null)} className="text-xs text-blue-600 hover:underline mb-3 block">← Back to all docs</button>
                <p className="font-medium text-sm capitalize mb-3">{preview.label.replace(/-/g, " ")}</p>
                {preview.fileType === "image" ? (
                  <img src={preview.filePath} alt={preview.label} className="w-full rounded-xl max-h-96 object-contain" />
                ) : (
                  <iframe src={preview.filePath} className="w-full h-96 rounded-xl border" />
                )}
                <a href={preview.filePath} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-sm text-blue-600 hover:underline">
                  Open in new tab ↗
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {docsModal.docs.map((doc) => (
                  <div key={doc.id} onClick={() => setPreview(doc)} className="border rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2">
                    {doc.fileType === "image" ? (
                      <img src={doc.filePath} alt={doc.label} className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-24 bg-red-50 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">📄</span>
                      </div>
                    )}
                    <p className="text-xs font-medium text-gray-700 capitalize">{doc.label.replace(/-/g, " ")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
