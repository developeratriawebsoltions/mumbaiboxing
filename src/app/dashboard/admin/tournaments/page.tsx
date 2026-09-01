"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
  createdAt: string;
  _count: { entries: number };
};

const EMPTY = { name: "", location: "", startDate: "", endDate: "", weightClass: "", status: "upcoming", entryFee: "500" };
const STATUSES = ["upcoming", "open", "ongoing", "completed"];

const STATUS_COLOR: Record<string, string> = {
  upcoming: "bg-yellow-100 text-yellow-700",
  open: "bg-green-100 text-green-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
};

const FEE_TABLE = [
  { category: "🏢 Club / Academy Registration", fee: "₹1,500" },
  { category: "🥊 Coach Registration", fee: "₹1,000" },
  { category: "🥊 Boxer Registration", fee: "₹100" },
  { category: "🧑⚖️ Referee & Judge Registration", fee: "₹1,500" },
  { category: "🏆 District Championship Fee", fee: "₹500 per boxer" },
  { category: "🏆 State Championship Entry Fee", fee: "₹500 per boxer" },
  { category: "📋 MBA Registration Fee (when applicable)", fee: "₹500 per boxer" },
];

export default function AdminTournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"tournaments" | "registration" | "fees">("tournaments");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/tournaments")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setTournaments(d); })
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";

  const toInputDate = (d: string | null) => (d ? new Date(d).toISOString().split("T")[0] : "");

  function openCreate() {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(t: Tournament) {
    setForm({
      name: t.name,
      location: t.location ?? "",
      startDate: toInputDate(t.startDate),
      endDate: toInputDate(t.endDate),
      weightClass: t.weightClass ?? "",
      status: t.status,
      entryFee: t.entryFee != null ? String(t.entryFee) : "",
    });
    setEditId(t.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { ...form, id: editId } : form;
    const res = await fetch("/api/admin/tournaments", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowForm(false); load(); }
    else setError("Failed to save.");
    setSaving(false);
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/admin/tournaments?id=${id}`, { method: "DELETE" });
    if (res.ok) { setDeleteId(null); load(); }
    else setError("Failed to delete.");
  }

  const upcoming = tournaments.filter((t) => t.status !== "completed");
  const completed = tournaments.filter((t) => t.status === "completed");

  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">🥊 Upcoming Tournaments</h2>
            <p className="text-gray-500 text-sm">North Bombay District Amateur Boxing Association</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors self-start"
          >
            + Add Tournament
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["tournaments", "registration", "fees"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? "bg-white shadow text-slate-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "tournaments" ? "Tournaments" : tab === "registration" ? "Registration Form" : "Fee Structure"}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* TOURNAMENTS TAB */}
        {activeTab === "tournaments" && !loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total", value: tournaments.length, color: "text-gray-800" },
                { label: "Upcoming", value: upcoming.length, color: "text-yellow-600" },
                { label: "Open / Ongoing", value: tournaments.filter((t) => t.status === "open" || t.status === "ongoing").length, color: "text-green-600" },
                { label: "Completed", value: completed.length, color: "text-gray-400" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {tournaments.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
                <p className="text-4xl mb-3">🏆</p>
                <p className="font-medium">No tournaments yet</p>
                <p className="text-sm mt-1">Click "Add Tournament" to create the first one.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["#", "Tournament Name", "Location", "Start Date", "End Date", "Weight Class", "Entry Fee", "Entries", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tournaments.map((t, i) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{t.name}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{t.location ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(t.startDate)}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(t.endDate)}</td>
                        <td className="px-4 py-3 text-gray-500">{t.weightClass ?? "—"}</td>
                        <td className="px-4 py-3 font-semibold text-green-700">{t.entryFee != null ? `₹${t.entryFee}` : "—"}</td>
                        <td className="px-4 py-3 text-center font-semibold text-blue-600">{t._count.entries}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLOR[t.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/dashboard/admin/tournaments/${t.id}`)}
                              className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100 font-medium"
                            >
                              👥 Entries
                            </button>
                            <button
                              onClick={() => openEdit(t)}
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteId(t.id)}
                              className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* REGISTRATION FORM TAB */}
        {activeTab === "registration" && (
          <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6 max-w-3xl">
            <div className="text-center border-b pb-4">
              <p className="text-2xl font-bold">🥊 NORTH BOMBAY DISTRICT AMATEUR BOXING ASSOCIATION</p>
              <p className="text-lg font-semibold mt-1">BOXER ANNUAL REGISTRATION FORM – 2026</p>
              <p className="text-sm text-gray-500 mt-1">Registration Period: 1 January 2026 to 31 December 2026</p>
              <p className="text-sm font-medium text-red-600 mt-1">Annual Boxer Registration Fee: ₹100</p>
            </div>
            {[
              { section: "SECTION 1 — BOXER BASIC DETAILS", fields: ["Full Name of Boxer *", "Father's Name *", "Mother's Name", "Date of Birth *", "Gender * (Male / Female)", "Aadhaar Number *", "Mobile Number *", "Email ID", "Blood Group", "Residential Address *", "City / Area *"] },
              { section: "SECTION 2 — BOXING DETAILS", fields: ["Current Weight (kg) *", "Current Weight Category *", "Year Started Boxing *", "Boxing Experience (Beginner / District / Divisional / State / National / International)", "Major Boxing Achievements", "BFI Registration Number (if available)", "NSRS ID (if available)", "Previous District Registration Number (if applicable)"] },
              { section: "SECTION 3 — CURRENT CLUB / ACADEMY & COACH", fields: ["Current Club / Academy Name *", "Club / Academy Registration Number", "Current Coach Name *", "Coach Registration Number", "Coach Mobile Number *", "Training Centre Address *", "Date/Year Joined Current Club / Academy *"] },
              { section: "SECTION 4 — BOXER'S FIRST / ORIGINAL BOXING ACADEMY", fields: ["Name of Academy/Club where Boxer Started Boxing *", "First Boxing Coach Name", "Year Started Boxing at First Academy", "Has the Boxer ever transferred from another Club/Academy? * (No / Yes)", "If YES: Previous Club/Academy Name, Previous Coach Name, Reason for Transfer, Date/Year of Transfer", "NOC obtained from Previous Club? (Yes / No / Not Applicable)", "Upload NOC / Transfer Document (if applicable)"] },
              { section: "SECTION 5 — PARENT / GUARDIAN DETAILS", fields: ["Parent / Guardian Full Name *", "Relationship with Boxer *", "Parent / Guardian Mobile Number *", "Parent / Guardian Email ID", "Parent / Guardian Address"] },
              { section: "SECTION 6 — EMERGENCY & MEDICAL DETAILS", fields: ["Emergency Contact Name *", "Relationship with Boxer *", "Emergency Contact Number *", "Any injury/medical condition affecting boxing participation? (No / Yes – Please specify)", "Medical/Fitness Certificate (if applicable)"] },
              { section: "SECTION 7 — DOCUMENT UPLOAD", fields: ["Aadhaar Card *", "Birth Certificate / Age Proof *", "Recent Passport-size Photograph *", "Medical/Fitness Certificate (if applicable)", "BFI/NSRS Registration Proof (if available)", "Previous Boxing Certificate / Achievement Certificate (if applicable)", "NOC / Transfer Certificate (if applicable)"] },
              { section: "SECTION 8 — REGISTRATION FEE", fields: ["Annual Boxer Registration Fee: ₹100", "Payment Status * (Paid / Pending)", "Payment Mode (UPI / GPay / Bank Transfer / Cash)", "Transaction ID / UTR Number", "Upload Payment Screenshot"] },
              { section: "SECTION 9 — DECLARATION", fields: ["I hereby declare that the information provided is true and correct.", "Declaration checkbox *", "Name of Boxer / Parent / Guardian *", "Date of Submission *"] },
            ].map(({ section, fields }) => (
              <div key={section}>
                <h3 className="font-semibold text-sm bg-slate-900 text-white px-3 py-2 rounded-lg mb-3">{section}</h3>
                <ul className="space-y-1.5 pl-2">
                  {fields.map((f) => (
                    <li key={f} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-center text-red-700 font-medium">
              🥊 Register • Train • Compete • Represent North Bombay 🥊
            </div>
          </div>
        )}

        {/* FEE STRUCTURE TAB */}
        {activeTab === "fees" && (
          <div className="bg-white border rounded-xl shadow-sm p-6 max-w-2xl space-y-4">
            <div className="text-center border-b pb-4">
              <p className="text-xl font-bold">🥊 North Bombay District Amateur Boxing Association</p>
              <p className="font-semibold mt-1">Annual Registration & Participation Fee Structure – 2026</p>
              <p className="text-sm text-gray-500 mt-1">Registration Period: 1 January 2026 to 31 December 2026</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-right px-4 py-3">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {FEE_TABLE.map(({ category, fee }) => (
                  <tr key={category} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-600">{fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              ⚠️ <strong>Important:</strong> All Clubs/Academies, Coaches, Boxers and Referees & Judges are requested to complete their annual registration for the 2026 calendar year.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{editId ? "Edit Tournament" : "Add Tournament"}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Tournament Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. North Bombay District Championship 2026" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Location / Venue</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kandivali Sports Complex, Mumbai" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Weight Class</label>
                <input value={form.weightClass} onChange={(e) => setForm({ ...form, weightClass: e.target.value })} placeholder="e.g. All categories / 60kg / 75kg" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Entry Fee (₹)</label>
                  <input type="number" min="0" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} placeholder="e.g. 500" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl">🗑️</p>
            <p className="font-semibold">Delete this tournament?</p>
            <p className="text-sm text-gray-500">All boxer entries for this tournament will also be removed. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
