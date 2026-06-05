"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useState } from "react";

const talukas = ["Borivali", "Andheri", "Kurla"];

const talukaData: Record<string, { boxers: number; coaches: number; academies: number; events: number }> = {
  Borivali: { boxers: 340, coaches: 48, academies: 12, events: 3 },
  Andheri: { boxers: 510, coaches: 72, academies: 18, events: 5 },
  Kurla: { boxers: 390, coaches: 66, academies: 12, events: 2 },
};

export default function TalukaAdminDashboard() {
  const [active, setActive] = useState("Borivali");
  const d = talukaData[active];

  return (
    <DashboardLayout role="taluka">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Taluka Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage taluka-wise boxer, coach & event data</p>
        </div>

        {/* Taluka Tabs */}
        <div className="flex gap-2">
          {talukas.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                active === t ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t} Taluka
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Boxers", value: d.boxers },
            { label: "Coaches", value: d.coaches },
            { label: "Academies", value: d.academies },
            { label: "Events", value: d.events },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Boxer List */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{active} Taluka – Boxer List</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["#", "Name", "Age Group", "Weight", "Academy", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Rahul Sharma", age: "Senior", weight: "60 KG", academy: `${active} Boxing Club`, status: "Active" },
                  { name: "Pooja Desai", age: "Junior", weight: "52 KG", academy: `${active} Sports Academy`, status: "Active" },
                  { name: "Kiran More", age: "Youth", weight: "48 KG", academy: `${active} Boxing Club`, status: "Pending" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-gray-500">{row.age}</td>
                    <td className="px-4 py-3">{row.weight}</td>
                    <td className="px-4 py-3 text-gray-500">{row.academy}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${row.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Management */}
        <div>
          <h3 className="font-semibold text-lg mb-3">{active} Taluka – Upcoming Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: `${active} District Open 2025`, date: "20 Feb 2025", venue: `${active} Sports Complex`, entries: 45 },
              { name: `${active} Youth Championship`, date: "15 Mar 2025", venue: `${active} Indoor Stadium`, entries: 30 },
            ].map((ev, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold">{ev.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{ev.date} · {ev.venue}</p>
                <p className="text-sm mt-2">Entries: <span className="font-medium">{ev.entries}</span></p>
                <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">View Details →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
