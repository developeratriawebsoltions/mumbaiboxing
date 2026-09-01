"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Certificate = {
  id: number;
  type: string;
  event: string;
  issuedAt: string;
  qrStatus: string;
};

const BOXER_TYPES = ["Participation", "Merit - Gold", "Merit - Silver", "Merit - Bronze"];
const COACH_TYPES = ["Coach Certificate", "NIS Diploma", "Appreciation", "Participation"];

export default function CertificateDashboard() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.role) setRole(d.role); })
      .catch(() => {});

    fetch("/api/certificates")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setCerts(d); })
      .catch(() => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const certTypes = role === "coach" ? COACH_TYPES : BOXER_TYPES;

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Certificates</h2>
          <p className="text-gray-500 text-sm">
            {role === "coach" ? "Coaching certificates & qualifications issued to you" : "All certificates issued to you"}
          </p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && certs.length === 0 && (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
            No certificates issued yet.
          </div>
        )}

        {certs.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certTypes.map((type) => (
                <div key={type} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className="text-3xl font-bold">{certs.filter((c) => c.type === type).length}</p>
                  <p className="text-xs text-gray-500 mt-1">{type}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["#", "Type", "Event", "Issued On", "QR Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {certs.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">CERT-{String(c.id).padStart(3, "0")}</td>
                      <td className="px-4 py-3 font-medium">{c.type}</td>
                      <td className="px-4 py-3 text-gray-500">{c.event}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(c.issuedAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${c.qrStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {c.qrStatus === "verified" ? "✓ Verified" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
