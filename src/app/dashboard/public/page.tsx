"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { useState } from "react";

const tabs = ["Boxer Search", "Coach Search", "Academy Search", "Rankings", "Event Results", "Certificate Verify", "Notices"];

const notices = [
  { title: "Mumbai Open 2025 – Registration Open", date: "10 Jan 2025", type: "Event" },
  { title: "Annual Renewal Deadline – 31 Jan 2025", date: "05 Jan 2025", type: "Notice" },
  { title: "New Weight Category Rules – BFI Circular", date: "01 Jan 2025", type: "Circular" },
];

export default function PublicDashboard() {
  const role = useRole();
  const [active, setActive] = useState("Boxer Search");
  const [query, setQuery] = useState("");

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Public Dashboard</h2>
          <p className="text-gray-500 text-sm">Search boxers, coaches, academies & verify certificates</p>
        </div>

        {/* Search Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-red-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">Search the Mumbai Boxing Directory</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID or academy…"
              className="flex-1 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none"
            />
            <button className="bg-white text-red-700 font-semibold text-sm px-5 py-2 rounded-lg hover:bg-gray-100">Search</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
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

        {active === "Notices" && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Official Notices</h3>
            <div className="space-y-3">
              {notices.map((n, i) => (
                <div key={i} className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    n.type === "Event" ? "bg-blue-100 text-blue-700"
                    : n.type === "Notice" ? "bg-orange-100 text-orange-600"
                    : "bg-purple-100 text-purple-700"
                  }`}>
                    {n.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "Certificate Verify" && (
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Verify Certificate</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-001)…"
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700">Verify</button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Or scan the QR code on the certificate to verify instantly.</p>
          </div>
        )}

        {!["Notices", "Certificate Verify"].includes(active) && (
          <div className="bg-white border rounded-xl p-8 shadow-sm text-center text-gray-400">
            <p className="text-lg font-medium">{active}</p>
            <p className="text-sm mt-1">Enter a search query above to find results.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
