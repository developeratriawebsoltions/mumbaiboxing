"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { useEffect, useState } from "react";

type Doc = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  createdAt: string;
  userRole?: string;
  userName?: string;
};

const fileUrl = (p: string) => `/api/file?path=${encodeURIComponent(p)}`;

export default function DocumentsDashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const role = useRole();

  useEffect(() => {
    if (!role) return;
    const url = role === "superadmin" ? "/api/admin/documents" : `/api/${role}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (role === "superadmin") {
          setDocs(Array.isArray(d) ? d : []);
        } else {
          // boxer/coach: documents are inside user.documents
          setDocs(Array.isArray(d?.user?.documents) ? d.user.documents : []);
        }
      })
      .finally(() => setLoading(false));
  }, [role]);

  const isAdmin = role === "superadmin";

  const filtered =
    !isAdmin || filter === "All"
      ? docs
      : docs.filter((d) => (d as Doc & { userRole: string }).userRole === filter.toLowerCase());

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {isAdmin ? "Document Dashboard" : "My Documents"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isAdmin ? "All uploaded documents by boxers & coaches" : "Your uploaded documents"}
          </p>
        </div>

        {/* Stats */}
        <div className={`grid gap-4 ${isAdmin ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
          {isAdmin ? (
            <>
              {[
                { label: "Total Documents", value: docs.length, color: "text-gray-700" },
                { label: "Boxer Docs", value: docs.filter((d) => (d as any).userRole === "boxer").length, color: "text-red-600" },
                { label: "Coach Docs", value: docs.filter((d) => (d as any).userRole === "coach").length, color: "text-blue-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { label: "Total Uploaded", value: docs.length, color: "text-gray-700" },
                { label: "Images", value: docs.filter((d) => d.fileType === "image").length, color: "text-green-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Filter (admin only) */}
        {isAdmin && (
          <div className="flex gap-2">
            {["All", "Boxer", "Coach"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading documents...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm">No documents found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setPreview(doc)}
                className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-2"
              >
                {doc.fileType === "image" ? (
                  <img src={fileUrl(doc.filePath)} alt={doc.label} className="w-full h-28 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-28 bg-red-50 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                <p className="text-xs font-semibold text-gray-700 capitalize">
                  {doc.label.replace(/-/g, " ")}
                </p>
                {isAdmin && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{(doc as any).userName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      (doc as any).userRole === "boxer" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {(doc as any).userRole}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold capitalize">{preview.label.replace(/-/g, " ")}</p>
                {isAdmin && (
                  <p className="text-xs text-gray-500">{(preview as any).userName} · {(preview as any).userRole}</p>
                )}
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            {preview.fileType === "image" ? (
              <img src={fileUrl(preview.filePath)} alt={preview.label} className="w-full rounded-xl max-h-96 object-contain" />
            ) : (
              <iframe src={fileUrl(preview.filePath)} className="w-full h-96 rounded-xl border" />
            )}
            <a
              href={fileUrl(preview.filePath)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center text-sm text-blue-600 hover:underline"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
