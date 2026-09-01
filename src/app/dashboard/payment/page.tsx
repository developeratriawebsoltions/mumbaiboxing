"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Payment = {
  id: number;
  type: string;
  amount: number;
  method: string | null;
  status: string;
  createdAt: string;
  membershipExpiry: string | null;
};

function downloadReceipt(p: Payment, userName: string) {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, 90, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Mumbai Boxing Association", W / 2, 38, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Official Payment Receipt", W / 2, 60, { align: "center" });

    // Receipt number badge
    doc.setFillColor(234, 179, 8);
    doc.roundedRect(W / 2 - 70, 70, 140, 24, 4, 4, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`PAY-${String(p.id).padStart(3, "0")}`, W / 2, 86, { align: "center" });

    // Body
    doc.setTextColor(30, 30, 30);
    const rows = [
      ["Receipt No.", `PAY-${String(p.id).padStart(3, "0")}`],
      ["Name", userName],
      ["Fee Type", p.type],
      ["Amount", `Rs. ${p.amount.toLocaleString("en-IN")}`],
      ["Payment Method", p.method ?? "—"],
      ["Date", new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
      ["Status", p.status],
    ];

    let y = 130;
    rows.forEach(([label, value], i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(40, y - 14, W - 80, 26, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(label, 55, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(value, 220, y + 4);
      y += 30;
    });

    // Status stamp
    if (p.status === "Paid") {
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(36);
      doc.setFont("helvetica", "bold");
      doc.text("PAID", W - 110, 200, { angle: 20 });
    }

    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.line(40, y + 20, W - 40, y + 20);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated receipt and does not require a signature.", W / 2, y + 38, { align: "center" });
    doc.text("Mumbai Boxing Association | mumbaiboxing.in", W / 2, y + 52, { align: "center" });

    doc.save(`MBA-Receipt-PAY-${String(p.id).padStart(3, "0")}.pdf`);
  });
}

export default function PaymentDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("Member");
  const [membershipExpiry, setMembershipExpiry] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.role) setRole(d.role);
        if (d.name) setUserName(d.name);
        else if (d.email) setUserName(d.email);
        if (d.membershipExpiry) setMembershipExpiry(d.membershipExpiry);
      })
      .catch(() => {});

    fetch("/api/payments")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setPayments(d); })
      .catch(() => setError("Failed to load payments."))
      .finally(() => setLoading(false));
  }, []);

  const membershipStatus = () => {
    if (!membershipExpiry) return null;
    const expiry = new Date(membershipExpiry);
    const now = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const expired = daysLeft <= 0;
    const expiringSoon = daysLeft > 0 && daysLeft <= 30;
    return { expiry, daysLeft, expired, expiringSoon };
  };

  const ms = membershipStatus();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const filtered = filter === "All" ? payments : payments.filter((p) => p.status === filter);
  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Payment Receipts</h2>
          <p className="text-gray-500 text-sm">
            {role === "coach" ? "Your coaching fee payments & receipts" : "Your fee payments & receipts"}
          </p>
        </div>

        {ms && (
          <div className={`rounded-xl border p-4 flex items-center justify-between ${
            ms.expired ? "bg-red-50 border-red-200" : ms.expiringSoon ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200"
          }`}>
            <div>
              <p className={`text-sm font-semibold ${
                ms.expired ? "text-red-700" : ms.expiringSoon ? "text-orange-700" : "text-green-700"
              }`}>
                {ms.expired ? "Membership Expired" : ms.expiringSoon ? `Membership Expiring Soon (${ms.daysLeft} days left)` : "Membership Active"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Valid until: {ms.expiry.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              ms.expired ? "bg-red-100 text-red-700" : ms.expiringSoon ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
            }`}>
              1-Year Membership
            </span>
          </div>
        )}

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Total Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, color: "text-green-600" },
                { label: "Pending", value: `₹${totalPending.toLocaleString("en-IN")}`, color: "text-orange-500" },
                { label: "Transactions", value: payments.length, color: "text-gray-700" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {["All", "Paid", "Pending"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === t ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-400">No payment records found.</div>
            ) : (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {["Receipt #", "Fee Type", "Amount", "Method", "Date", "Status", ""].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs">PAY-{String(p.id).padStart(3, "0")}</td>
                        <td className="px-4 py-3 font-medium">{p.type}</td>
                        <td className="px-4 py-3 font-semibold">₹{p.amount.toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 text-gray-500">{p.method ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${p.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.status === "Paid" && (
                            <button
                              onClick={() => downloadReceipt(p, userName)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-700 hover:to-slate-500 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                              Receipt
                            </button>
                          )}
                        </td>
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
