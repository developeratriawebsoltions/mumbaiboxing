"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type Certificate = {
  id: number;
  type: string;
  event: string;
  issuedAt: string;
  qrStatus: string;
  membershipId: string | null;
  membershipExpiresAt: string | null;
  membershipEmailAttemptedAt: string | null;
  membershipEmailSentAt: string | null;
};

export default function CertificateDashboard() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailingId, setEmailingId] = useState<number | null>(null);
  const [emailMessage, setEmailMessage] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.role) setRole(d.role);
        if (d.registrationStatus) {
          setRegistrationStatus(d.registrationStatus);
        }
      })
      .catch(() => {});

    fetch("/api/certificates")
      .then((r) => r.json())
      .then((d) => {
        if (d?.error) setError(d.error);
        else if (Array.isArray(d)) setCerts(d);
        else setError("Certificate service returned an unexpected response.");
      })
      .catch(() => setError("Failed to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const resendCertificate = async (id: number) => {
    setEmailingId(id);
    setEmailMessage("");
    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Could not email the certificate.");
      }
      setEmailMessage(result.message || "Certificate emailed successfully.");
      setCerts((current) =>
        current.map((certificate) =>
          certificate.id === id
            ? { ...certificate, membershipEmailSentAt: new Date().toISOString() }
            : certificate
        )
      );
    } catch (err) {
      setEmailMessage(
        err instanceof Error ? err.message : "Could not email the certificate."
      );
    } finally {
      setEmailingId(null);
    }
  };

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
        {emailMessage && (
          <p role="status" className="text-sm text-slate-600">{emailMessage}</p>
        )}

        {!loading && !error && certs.length === 0 && (
          <div className="bg-white border rounded-xl p-8 text-center text-gray-400">
            <p className="font-semibold text-slate-700">
              {registrationStatus === "ACTIVE"
                ? "Your membership is active, but no certificate was returned."
                : "No certificate is available yet."}
            </p>
            <p className="mt-2 text-sm">
              {registrationStatus === "ACTIVE"
                ? "Refresh this page once. If the certificate still does not appear, contact the association with your membership ID."
                : "A membership certificate is issued after your membership payment is confirmed and your account is activated."}
            </p>
          </div>
        )}

        {certs.length > 0 && (
          <>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              Your certificates are linked to your account. Download a PDF or email a copy to your registered address.
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {["#", "Type", "Event", "Issued On", "QR Status", "Actions"].map((h) => (
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
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={`/api/certificates/${c.id}`}
                            className="font-semibold text-red-700 hover:underline"
                          >
                            Download PDF
                          </a>
                          {c.membershipId && (
                            <>
                              <span className="text-xs text-slate-500">
                                {c.membershipEmailSentAt
                                  ? "Emailed"
                                  : c.membershipEmailAttemptedAt
                                    ? "Email failed"
                                    : "Email pending"}
                              </span>
                              <button
                                type="button"
                                onClick={() => void resendCertificate(c.id)}
                                disabled={emailingId === c.id}
                                className="font-semibold text-slate-600 hover:underline disabled:opacity-50"
                              >
                                {emailingId === c.id
                                  ? "Sending..."
                                  : c.membershipEmailSentAt
                                    ? "Email again"
                                    : "Retry email"}
                              </button>
                            </>
                          )}
                        </div>
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
