"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

type Medical = {
  fitnessStatus: string;
  expiryDate: string | null;
  injury: string | null;
  eligible: boolean;
  boxer?: {
    name: string;
  } | null;
};

export default function MedicalDashboard() {
  const role = useRole();
  const [data, setData] = useState<Medical | Medical[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/medical")
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load medical records."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const statusColor = (s: string) =>
    s === "Valid" ? "bg-green-100 text-green-700"
    : s === "Expired" ? "bg-red-100 text-red-600"
    : "bg-orange-100 text-orange-600";

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Medical Records</h2>
          <p className="text-gray-500 text-sm">Your fitness certificate & competition eligibility</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && !data && (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
            No medical record found. Please submit your fitness certificate.
          </div>
        )}

        {data && Array.isArray(data) ? (
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.fitnessStatus + item.expiryDate} className="bg-white border rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold">{item.boxer?.name ?? "Unknown Boxer"}</p>
                    <p className="text-sm text-gray-500">{item.injury || "No injury notes"}</p>
                  </div>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${statusColor(item.fitnessStatus)}`}>
                    {item.fitnessStatus}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Expiry</p>
                    <p className="font-semibold">{formatDate(item.expiryDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Eligible</p>
                    <p className="font-semibold">{item.eligible ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Injury</p>
                    <p className="font-semibold">{item.injury || "None"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fitness Status", value: data.fitnessStatus, color: data.fitnessStatus === "Valid" ? "text-green-600" : "text-red-600" },
                { label: "Expiry Date", value: formatDate(data.expiryDate), color: "text-gray-700" },
                { label: "Injury", value: data.injury || "None", color: "text-gray-700" },
                { label: "Eligible to Compete", value: data.eligible ? "Yes" : "No", color: data.eligible ? "text-green-600" : "text-red-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Medical Record Detail</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Fitness Certificate</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${statusColor(data.fitnessStatus)}`}>
                    {data.fitnessStatus}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400">Valid Until</p>
                  <p className="font-semibold">{formatDate(data.expiryDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Injury Notes</p>
                  <p className="font-semibold">{data.injury || "None"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Competition Eligible</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${data.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {data.eligible ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {data.fitnessStatus !== "Valid" && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-700 font-semibold text-sm">⚠️ Action Required</p>
                <p className="text-orange-600 text-sm mt-1">
                  Your fitness certificate is <strong>{data.fitnessStatus}</strong>. Please renew it to remain eligible for competitions.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
