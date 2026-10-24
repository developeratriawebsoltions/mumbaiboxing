"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserRound,
  MapPin,
  ShieldCheck,
  FileText,
  HeartPulse,
  AlertTriangle,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type Document = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};

type Boxer = {
  id: number;
  name: string;
  gender: string | null;
  weight: string | null;
  weightCategory: string | null;
  ageGroup: string | null;
  category: string | null;
  rank: number | null;
  membershipExpiry: string | null;
  medical: {
    fitnessStatus: string;
    expiryDate: string | null;
    eligible: boolean;
  } | null;
};

type Coach = {
  id: number;
  name: string;
  phone: string | null;
  membershipExpiry: string | null;
  user: {
    email: string;
    registrationStatus: string;
    membershipId: string | null;
  };
};

type Academy = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  membershipExpiry: string | null;
  user: {
    email: string;
    registrationStatus: string;
    membershipId: string | null;
    membershipValidFrom: string | null;
    membershipExpiry: string | null;
    membershipActivatedAt: string | null;
    documents: Document[];
  };
  boxer?: Boxer[];
  boxers?: Boxer[];
  coach?: Coach[];
  coaches?: Coach[];
};

export default function AcademyDashboard() {
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAcademy() {
      try {
        const response = await fetch("/api/academy", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || data?.error) {
          setError(data?.error || "Failed to load academy profile.");
          return;
        }
        setAcademy(data);
      } catch {
        setError("Failed to load academy profile.");
      } finally {
        setLoading(false);
      }
    }
    loadAcademy();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="academy">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading academy dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !academy) {
    return (
      <DashboardLayout role="academy">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <h2 className="font-semibold text-red-900">Unable to load academy</h2>
                <p className="mt-1 text-sm text-red-700">{error || "Academy profile not found."}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const boxers = academy.boxers ?? academy.boxer ?? [];
  const coaches = academy.coaches ?? academy.coach ?? [];
  const documents = academy.user?.documents ?? [];

  const activeMembership =
    academy.user?.registrationStatus === "ACTIVE" &&
    (!academy.user?.membershipExpiry ||
      new Date(academy.user.membershipExpiry) >= new Date());

  const medicalAlerts = boxers.filter(
    (b) =>
      b.medical?.fitnessStatus === "Expired" ||
      b.medical?.fitnessStatus === "Expiring Soon" ||
      b.medical?.eligible === false
  ).length;

  const academyId = `MBA-ACA-${String(academy.id).padStart(4, "0")}`;

  return (
    <DashboardLayout role="academy">
      <div className="space-y-6">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-red-600">Academy / Club</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{academy.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Academy registration, affiliation and member overview</p>
        </div>

        {/* Profile + Status */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <Building2 className="h-7 w-7 text-red-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-950">Academy Profile</h2>
                <p className="mt-1 text-sm text-slate-500">Registered Mumbai Boxing Association academy</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoItem icon={<Building2 className="h-4 w-4" />} label="Academy ID" value={academyId} />
              <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={academy.user.email} />
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={academy.phone || "—"} />
              <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address" value={academy.address || "—"} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Affiliation Status</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{activeMembership ? "Active" : "Inactive"}</h2>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${activeMembership ? "bg-green-50" : "bg-red-50"}`}>
                <ShieldCheck className={`h-6 w-6 ${activeMembership ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <StatusRow label="Registration" value={academy.user.registrationStatus} />
              <StatusRow label="Membership ID" value={academy.user.membershipId || "—"} />
              <StatusRow label="Valid From" value={formatDate(academy.user.membershipValidFrom)} />
              <StatusRow label="Valid Until" value={formatDate(academy.user.membershipExpiry || academy.membershipExpiry)} />
            </div>
          </section>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Registered Boxers" value={boxers.length} />
          <StatCard icon={<UserRound className="h-5 w-5" />} label="Registered Coaches" value={coaches.length} />
          <StatCard icon={<FileText className="h-5 w-5" />} label="Documents" value={documents.length} />
          <StatCard icon={<HeartPulse className="h-5 w-5" />} label="Medical Alerts" value={medicalAlerts} />
        </div>

        {/* Boxers */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Registered Boxers</h2>
              <p className="mt-1 text-sm text-slate-500">Boxers currently registered under this academy</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{boxers.length}</span>
          </div>

          {boxers.length === 0 ? (
            <EmptyState message="No boxers are currently registered under this academy." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Boxer", "Category", "Weight", "Age Group", "Rank", "Medical"].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {boxers.map((boxer) => (
                    <tr key={boxer.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{boxer.name}</p>
                        <p className="text-xs text-slate-500">{boxer.gender || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{boxer.category || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{boxer.weightCategory || boxer.weight || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{boxer.ageGroup || "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{boxer.rank ?? "—"}</td>
                      <td className="px-6 py-4"><MedicalBadge medical={boxer.medical} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Coaches */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Registered Coaches</h2>
              <p className="mt-1 text-sm text-slate-500">Coaches associated with this academy</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{coaches.length}</span>
          </div>

          {coaches.length === 0 ? (
            <EmptyState message="No coaches are currently registered under this academy." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Coach", "Email", "Phone", "Membership", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4 font-medium text-slate-900">{coach.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{coach.user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{coach.phone || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{coach.user.membershipId || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${coach.user.registrationStatus === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                          {coach.user.registrationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-950">Academy Documents</h2>
            <p className="mt-1 text-sm text-slate-500">Registration and verification documents</p>
          </div>

          {documents.length === 0 ? (
            <EmptyState message="No academy documents have been uploaded." />
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.label}</p>
                      <p className="text-xs text-slate-500">{doc.fileType} • {formatDate(doc.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${doc.status === "Approved" || doc.status === "Verified" ? "bg-green-50 text-green-700" : doc.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
        <span className="text-2xl font-bold text-slate-950">{value}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function MedicalBadge({ medical }: { medical: Boxer["medical"] }) {
  if (!medical) return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">No Record</span>;
  if (medical.eligible === false || medical.fitnessStatus === "Expired") return <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Not Eligible</span>;
  if (medical.fitnessStatus === "Expiring Soon") return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Expiring Soon</span>;
  return <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">{medical.fitnessStatus || "Valid"}</span>;
}

function EmptyState({ message }: { message: string }) {
  return <div className="p-10 text-center"><p className="text-sm text-slate-500">{message}</p></div>;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
