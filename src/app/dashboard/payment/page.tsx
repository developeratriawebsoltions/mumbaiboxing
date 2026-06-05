"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useState } from "react";

const tabs = ["All", "Pending", "Paid"];

const payments = [
  { id: "PAY-001", name: "Rahul Sharma", type: "Registration Fee", amount: "₹500", method: "UPI", date: "10 Jan 2025", status: "Paid" },
  { id: "PAY-002", name: "Mumbai Boxing Academy", type: "Renewal Fee", amount: "₹2,000", method: "Bank Transfer", date: "08 Jan 2025", status: "Paid" },
  { id: "PAY-003", name: "Aman Singh", type: "Tournament Fee", amount: "₹300", method: "UPI", date: "12 Jan 2025", status: "Pending" },
  { id: "PAY-004", name: "Borivali Boxing Club", type: "Renewal Fee", amount: "₹2,000", method: "Cash", date: "05 Jan 2025", status: "Pending" },
  { id: "PAY-005", name: "Pooja Desai", type: "Registration Fee", amount: "₹500", method: "UPI", date: "09 Jan 2025", status: "Paid" },
];

export default function PaymentDashboard() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? payments : payments.filter((p) => p.status === active);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payment Dashboard</h2>
            <p className="text-gray-500 text-sm">Track fees, payments, receipts & audit reports</p>
          </div>
          <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800">Export Audit Report</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Collected", value: "₹1,84,500", color: "text-green-600" },
            { label: "Pending", value: "₹84,500", color: "text-orange-500" },
            { label: "This Month", value: "₹42,000", color: "text-blue-600" },
            { label: "Transactions", value: "342", color: "text-gray-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Fee Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Registration Fees", amount: "₹62,000" },
            { label: "Tournament Fees", amount: "₹38,400" },
            { label: "Renewal Fees", amount: "₹84,100" },
            { label: "Other Fees", amount: "₹0" },
          ].map((f) => (
            <div key={f.label} className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500">{f.label}</p>
              <p className="text-xl font-bold mt-1">{f.amount}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active === t ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {["ID", "Name", "Fee Type", "Amount", "Method", "Date", "Status", "Receipt"].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.type}</td>
                  <td className="px-4 py-3 font-semibold">{p.amount}</td>
                  <td className="px-4 py-3 text-gray-500">{p.method}</td>
                  <td className="px-4 py-3 text-gray-400">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "Paid" && (
                      <button className="text-xs text-blue-600 hover:underline">Download</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
