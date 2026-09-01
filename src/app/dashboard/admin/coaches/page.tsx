"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Doc = { id: number; label: string; filePath: string; fileType: string };

type Coach = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: string;
  user: { email: string; createdAt: string; documents: Doc[] };
  academy: { name: string } | null;
};

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [docsModal, setDocsModal] = useState<{ name: string; docs: Doc[] } | null>(null);
  const [preview, setPreview] = useState<Doc | null>(null);

  useEffect(() => {
    fetch("/api/admin/coaches")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setCoaches(d); })
      .catch(() => setError("Failed to load coaches."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const filtered = coaches.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.user.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.academy?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">All Coaches</h2>
          <p className="text-gray-500 text-sm">Complete list of registered coaches</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Total Coaches", value: coaches.length, color: "text-gray-800" },
                { label: "With Academy", value: coaches.filter((c) => c.academy).length, color: "text-blue-600" },
                { label: "Without Academy", value: coaches.filter((c) => !c.academy).length, color: "text-orange-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search by name, email or academy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-400">{filtered.length} of {coaches.length} coaches</p>

            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["ID", "Name", "Email", "Phone", "Academy", "Status", "Documents", "Registered"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No coaches found.</td></tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          MBA-CCH-{new Date(c.user.createdAt).getFullYear()}-{String(c.id).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{c.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{c.user.email}</td>
                        <td className="px-4 py-3 text-gray-500">{c.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.academy?.name ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDocsModal({ name: c.name, docs: c.user.documents ?? [] })}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 whitespace-nowrap"
                          >
                            {(c.user.documents ?? []).length} docs
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
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
                      <div className="w-full h-24 bg-blue-50 rounded-lg flex items-center justify-center">
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
