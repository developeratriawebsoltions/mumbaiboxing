"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useState } from "react";

const docs = [
  { id: 1, name: "Rahul Sharma", role: "Boxer", docType: "Aadhaar Card", submitted: "10 Jan 2025", status: "Pending" },
  { id: 2, name: "Aman Singh", role: "Boxer", docType: "Birth Certificate", submitted: "09 Jan 2025", status: "Approved" },
  { id: 3, name: "Suresh Patil", role: "Coach", docType: "Coach Qualification", submitted: "08 Jan 2025", status: "Pending" },
  { id: 4, name: "Mumbai Boxing Academy", role: "Academy", docType: "Academy Documents", submitted: "07 Jan 2025", status: "Approved" },
  { id: 5, name: "Pooja Desai", role: "Boxer", docType: "Medical Certificate", submitted: "06 Jan 2025", status: "Rejected" },
  { id: 6, name: "Borivali High School", role: "School", docType: "School ID", submitted: "05 Jan 2025", status: "Pending" },
];

const docTypes = ["Aadhaar / Passport", "Birth Certificate", "School / College ID", "Medical Certificate", "Coach Qualification", "Academy Documents"];

export default function DocumentsDashboard() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? docs : docs.filter((d) => d.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Document Verification Dashboard</h2>
          <p className="text-gray-500 text-sm">Review, approve or reject submitted documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Submitted", value: docs.length, color: "text-gray-700" },
            { label: "Pending", value: docs.filter((d) => d.status === "Pending").length, color: "text-orange-500" },
            { label: "Approved", value: docs.filter((d) => d.status === "Approved").length, color: "text-green-600" },
            { label: "Rejected", value: docs.filter((d) => d.status === "Rejected").length, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Document Types Reference */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Accepted Document Types</h3>
          <div className="flex flex-wrap gap-2">
            {docTypes.map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
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

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {["Name", "Role", "Document Type", "Submitted", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.role}</td>
                  <td className="px-4 py-3">{d.docType}</td>
                  <td className="px-4 py-3 text-gray-400">{d.submitted}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      d.status === "Approved" ? "bg-green-100 text-green-700"
                      : d.status === "Rejected" ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-600"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {d.status === "Pending" && (
                      <>
                        <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">Approve</button>
                        <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200">Reject</button>
                      </>
                    )}
                    {d.status !== "Pending" && (
                      <button className="text-xs text-blue-600 hover:underline">View</button>
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
