"use client";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useState } from "react";

const tabs = ["Age-wise", "Weight-wise", "Taluka-wise", "District", "Male", "Female"];

const rankings = [
  { rank: 1, name: "Rahul Sharma", weight: "60 KG", taluka: "Borivali", points: 120, gender: "Male" },
  { rank: 2, name: "Aman Singh", weight: "65 KG", taluka: "Andheri", points: 110, gender: "Male" },
  { rank: 3, name: "Vikas More", weight: "60 KG", taluka: "Kurla", points: 98, gender: "Male" },
  { rank: 4, name: "Pooja Desai", weight: "52 KG", taluka: "Andheri", points: 115, gender: "Female" },
  { rank: 5, name: "Sneha Kulkarni", weight: "46 KG", taluka: "Borivali", points: 102, gender: "Female" },
];

export default function RankingDashboard() {
  const [active, setActive] = useState("Age-wise");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ranking Dashboard</h2>
            <p className="text-gray-500 text-sm">View & update boxer rankings across categories</p>
          </div>
          <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Update Points</button>
        </div>

        {/* Filter Tabs */}
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

        {/* Rankings Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {["Rank", "Boxer", "Weight", "Taluka", "Gender", "Points", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rankings.map((r) => (
                <tr key={r.rank} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      r.rank === 1 ? "bg-yellow-100 text-yellow-700"
                      : r.rank === 2 ? "bg-gray-200 text-gray-700"
                      : r.rank === 3 ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-600"
                    }`}>
                      {r.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-gray-500">{r.weight}</td>
                  <td className="px-4 py-3 text-gray-500">{r.taluka}</td>
                  <td className="px-4 py-3 text-gray-500">{r.gender}</td>
                  <td className="px-4 py-3 font-bold">{r.points}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
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
