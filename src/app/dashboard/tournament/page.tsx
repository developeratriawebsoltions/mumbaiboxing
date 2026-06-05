"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useState } from "react";

const tabs = ["Registration", "Weigh-in", "Medical List", "Draw Sheet", "Bout Schedule", "Results", "Medal Tally"];

const events = [
  { name: "Mumbai Open Boxing Championship 2025", date: "20 Feb 2025", venue: "Andheri Sports Complex", entries: 128, status: "Open" },
  { name: "Borivali Taluka Boxing Trials", date: "15 Mar 2025", venue: "Borivali Indoor Stadium", entries: 64, status: "Open" },
  { name: "District Under-19 Championship", date: "10 Apr 2025", venue: "Kurla Sports Hall", entries: 0, status: "Upcoming" },
];

const bouts = [
  { no: 1, time: "09:00 AM", boxer1: "Rahul Sharma", boxer2: "Aman Singh", weight: "60 KG", result: "Rahul W" },
  { no: 2, time: "09:30 AM", boxer1: "Pooja Desai", boxer2: "Sneha Kulkarni", weight: "52 KG", result: "-" },
  { no: 3, time: "10:00 AM", boxer1: "Vikas More", boxer2: "Kiran Patil", weight: "48 KG", result: "-" },
];

export default function TournamentDashboard() {
  const [active, setActive] = useState("Registration");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tournament Dashboard</h2>
            <p className="text-gray-500 text-sm">Manage events, entries, bouts, results & medal tally</p>
          </div>
          <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">+ Create Event</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Events", value: "2" },
            { label: "Total Entries", value: "192" },
            { label: "Bouts Scheduled", value: "96" },
            { label: "Medals Awarded", value: "48" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active === t ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {active === "Registration" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Upcoming Events</h3>
            {events.map((ev, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold">{ev.name}</h4>
                  <p className="text-sm text-gray-500">{ev.date} · {ev.venue}</p>
                  <p className="text-sm mt-1">Entries: <span className="font-medium">{ev.entries}</span></p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${ev.status === "Open" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {ev.status}
                  </span>
                  <button className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700">Register Entries</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "Bout Schedule" && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Bout Schedule – Mumbai Open 2025</h3>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["Bout #", "Time", "Boxer 1", "Boxer 2", "Weight", "Result"].map((h) => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bouts.map((b) => (
                    <tr key={b.no} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold">{b.no}</td>
                      <td className="px-4 py-3 text-gray-500">{b.time}</td>
                      <td className="px-4 py-3 font-medium">{b.boxer1}</td>
                      <td className="px-4 py-3 font-medium">{b.boxer2}</td>
                      <td className="px-4 py-3 text-gray-500">{b.weight}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{b.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!["Registration", "Bout Schedule"].includes(active) && (
          <div className="bg-white border rounded-xl p-8 shadow-sm text-center text-gray-400">
            <p className="text-lg font-medium">{active}</p>
            <p className="text-sm mt-1">This section will display {active.toLowerCase()} data.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
