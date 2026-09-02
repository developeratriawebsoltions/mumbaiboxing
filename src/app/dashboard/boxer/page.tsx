"use client";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
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

type BoxerForm = {
  name: string;
  dob: string;
  weight: string;
  ageGroup: string;
};

export default function BoxerDashboard() {
  const [boxer, setBoxer] = useState<Boxer | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BoxerForm>({
    name: "",
    dob: "",
    weight: "",
    ageGroup: "",
  });

  useEffect(() => {
    fetch("/api/boxer")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setBoxer(data);
          setForm({
            name: data.name ?? "",
            dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
            weight: data.weight ?? "",
            ageGroup: data.ageGroup ?? "",
          });
        }
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const openEditor = () => {
    if (!boxer) return;
    setForm({
      name: boxer.name,
      dob: boxer.dob ? new Date(boxer.dob).toISOString().slice(0, 10) : "",
      weight: boxer.weight ?? "",
      ageGroup: boxer.ageGroup ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!boxer) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/boxer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob || null,
          weight: form.weight || null,
          ageGroup: form.ageGroup || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }

      setBoxer(data);
      setIsEditing(false);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadIdCard = () => {
    if (!boxer) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, 12, pageWidth - 24, 92, 4, 4, "F");

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Mumbai Boxing Association", 20, 28);

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Official Boxer ID Card", 20, 38);

    doc.setDrawColor(220, 38, 38);
    doc.line(20, 44, pageWidth - 20, 44);

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(11);
    doc.text(`Name: ${boxer.name}`, 20, 56);
    doc.text(`Boxer ID: ${boxerId}`, 20, 66);
    doc.text(`Weight Category: ${boxer.weight ?? "—"}`, 20, 76);
    doc.text(`Age Group: ${boxer.ageGroup ?? "—"}`, 20, 86);

    doc.setFillColor(239, 68, 68);
    doc.roundedRect(pageWidth - 60, 20, 32, 32, 6, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(boxer.name.charAt(0).toUpperCase(), pageWidth - 46, 42, { align: "center" });

    doc.save(`boxer-id-${boxer.id}.pdf`);
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

  const boxerId = boxer ? `MBA-BXR-${new Date(boxer.user.createdAt).getFullYear()}-${String(boxer.id).padStart(4, "0")}` : "—";

  return (
    <DashboardLayout role="boxer">
      <div className="space-y-6 text-black">
        <div>
          <h2 className="text-2xl font-bold text-black">Boxer Dashboard</h2>
          <p className="text-sm text-black/80">Your personal boxing profile & records</p>
        </div>

        {loading && <p className="text-sm text-black/70">Loading profile...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {boxer && (
          <>
            {/* Profile Card */}
            <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-600">
                  {boxer.name.charAt(0)}
                </div>
                <div className="md:hidden">
                  <p className="text-xl font-bold text-black">{boxer.name}</p>
                  <p className="text-sm text-black/70">Boxer Profile</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-black/70">Full Name</p><p className="font-semibold text-black">{boxer.name}</p></div>
                <div><p className="text-black/70">Boxer ID</p><p className="font-semibold text-black">{boxerId}</p></div>
                <div><p className="text-black/70">Date of Birth</p><p className="font-semibold text-black">{formatDate(boxer.dob)}</p></div>
                <div><p className="text-black/70">Weight Category</p><p className="font-semibold text-black">{boxer.weight ?? "—"}</p></div>
                <div><p className="text-black/70">Age Group</p><p className="font-semibold text-black">{boxer.ageGroup ?? "—"}</p></div>
                <div><p className="text-black/70">Current Rank</p><p className="font-semibold text-red-600">{boxer.rank ? `#${boxer.rank}` : "—"}</p></div>
                <div><p className="text-black/70">Academy</p><p className="font-semibold text-black">{boxer.academy?.name ?? "—"}</p></div>
                <div><p className="text-black/70">Email</p><p className="font-semibold text-black">{boxer.user.email}</p></div>
                <div><p className="text-black/70">Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
              </div>

              <div className="flex flex-col gap-2 ml-auto w-full md:w-auto">
                <button
                  type="button"
                  onClick={openEditor}
                  className="text-sm border border-gray-200 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={handleDownloadIdCard}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download ID Card
                </button>
              </div>
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
                <p className="text-sm text-black/70">No documents uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(boxer.user.documents ?? []).map((doc) => (
                    <a
                      key={doc.id}
                      href={`/api/file?path=${encodeURIComponent(doc.filePath)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 text-black"
                    >
                      {doc.fileType === "image" ? (
                        <img src={`/api/file?path=${encodeURIComponent(doc.filePath)}`} alt={doc.label} className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-32 bg-red-50 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📄</span>
                        </div>
                      )}
                      <p className="text-xs font-semibold capitalize text-black">{doc.label.replace(/-/g, " ")}</p>
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
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-black/70">No bout records found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-black">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-500 hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Weight Category</label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 75kg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Age Group</label>
                <input
                  type="text"
                  value={form.ageGroup}
                  onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. U21"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
