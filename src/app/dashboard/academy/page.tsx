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
  UserPlus,
  UserMinus,
  CheckCircle2,
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


type ManageBoxer = {
  id: number;
  name: string;
  gender: string | null;
  weight: string | null;
  weightCategory: string | null;
  ageGroup: string | null;
  category: string | null;
  academyId: number | null;
  assigned: boolean;
  user: {
    email: string;
    registrationStatus: string;
    membershipId: string | null;
  };
};

type ManageCoach = {
  id: number;
  name: string;
  phone: string | null;
  academyId: number | null;
  assigned: boolean;
  user: {
    email: string;
    registrationStatus: string;
    membershipId: string | null;
  };
};

type AcademyMembers = {
  academyId: number;
  boxers: ManageBoxer[];
  coaches: ManageCoach[];
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

  boxer: Boxer[];
  coach: Coach[];
};

export default function AcademyDashboard() {
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<AcademyMembers | null>(null);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState("");
  const [processingMember, setProcessingMember] = useState("");

  useEffect(() => {
    async function loadAcademy() {
      try {
        const response = await fetch("/api/academy", {
          cache: "no-store",
        });

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

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setMembersError("");

      const response = await fetch("/api/academy/members", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        setMembersError(data?.error || "Failed to load members.");
        return;
      }

      setMembers(data);
    } catch {
      setMembersError("Failed to load academy members.");
    } finally {
      setMembersLoading(false);
    }
  }

  async function reloadAcademy() {
    try {
      const response = await fetch("/api/academy", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && !data?.error) {
        setAcademy(data);
      }
    } catch {
      // Keep the existing dashboard data if the refresh fails.
    }
  }

  async function handleMemberAssignment(
    type: "boxer" | "coach",
    id: number,
    assigned: boolean
  ) {
    const key = `${type}-${id}`;

    try {
      setProcessingMember(key);
      setMembersError("");

      const response = await fetch("/api/academy/members", {
        method: assigned ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, id }),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        setMembersError(data?.error || "Failed to update member.");
        return;
      }

      await Promise.all([loadMembers(), reloadAcademy()]);
    } catch {
      setMembersError("Failed to update member. Please try again.");
    } finally {
      setProcessingMember("");
    }
  }

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

  if (error) {
    return (
      <DashboardLayout role="academy">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-900">
                  Unable to load academy
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!academy) {
    return (
      <DashboardLayout role="academy">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-slate-500">
            Academy profile not found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const boxers = academy.boxer ?? [];
  const coaches = academy.coach ?? [];
  const documents = academy.user?.documents ?? [];

  const activeMembership =
    academy.user?.registrationStatus === "ACTIVE" &&
    (!academy.user?.membershipExpiry ||
      new Date(academy.user.membershipExpiry) >= new Date());

  const medicalAlerts = boxers.filter(
    (boxer) =>
      boxer.medical?.fitnessStatus === "Expired" ||
      boxer.medical?.fitnessStatus === "Expiring Soon" ||
      boxer.medical?.eligible === false
  ).length;

  const academyId = `MBA-ACA-${String(academy.id).padStart(4, "0")}`;

  return (
    <DashboardLayout role="academy">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-red-600">
            Academy / Club
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            {academy.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Academy registration, affiliation and member overview
          </p>
        </div>

        {/* Profile + Status */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <Building2 className="h-7 w-7 text-red-600" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-950">
                  Academy Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registered Mumbai Boxing Association academy
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={<Building2 className="h-4 w-4" />}
                label="Academy ID"
                value={academyId}
              />

              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={academy.user.email}
              />

              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={academy.phone || "—"}
              />

              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={academy.address || "—"}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Affiliation Status
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {activeMembership ? "Active" : "Inactive"}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  activeMembership ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <ShieldCheck
                  className={`h-6 w-6 ${
                    activeMembership
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <StatusRow
                label="Registration"
                value={academy.user.registrationStatus}
              />

              <StatusRow
                label="Membership ID"
                value={academy.user.membershipId || "—"}
              />

              <StatusRow
                label="Valid From"
                value={formatDate(
                  academy.user.membershipValidFrom
                )}
              />

              <StatusRow
                label="Valid Until"
                value={formatDate(
                  academy.user.membershipExpiry ||
                    academy.membershipExpiry
                )}
              />
            </div>
          </section>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Registered Boxers"
            value={boxers.length}
          />

          <StatCard
            icon={<UserRound className="h-5 w-5" />}
            label="Registered Coaches"
            value={coaches.length}
          />

          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Documents"
            value={documents.length}
          />

          <StatCard
            icon={<HeartPulse className="h-5 w-5" />}
            label="Medical Alerts"
            value={medicalAlerts}
          />
        </div>

        {/* Registered Boxers */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Registered Boxers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Boxers currently registered under this academy
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {boxers.length}
              </div>
            </div>
          </div>

          {boxers.length === 0 ? (
            <EmptyState message="No boxers are currently registered under this academy." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Boxer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Weight
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Age Group
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rank
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Medical
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {boxers.map((boxer) => (
                    <tr
                      key={boxer.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {boxer.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {boxer.gender || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {boxer.category || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {boxer.weightCategory ||
                          boxer.weight ||
                          "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {boxer.ageGroup || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {boxer.rank ?? "—"}
                      </td>

                      <td className="px-6 py-4">
                        <MedicalBadge medical={boxer.medical} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Coaches */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Registered Coaches
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Coaches associated with this academy
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {coaches.length}
              </div>
            </div>
          </div>

          {coaches.length === 0 ? (
            <EmptyState message="No coaches are currently registered under this academy." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Coach
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Membership
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {coaches.map((coach) => (
                    <tr
                      key={coach.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {coach.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {coach.user.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {coach.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {coach.user.membershipId || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            coach.user.registrationStatus ===
                            "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
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


        {/* Manage Members */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Manage Academy Members
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Assign active boxers and coaches to your academy
                </p>
              </div>

              <button
                type="button"
                onClick={loadMembers}
                disabled={membersLoading}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Loader2
                  className={`h-4 w-4 ${membersLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {membersError ? (
            <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {membersError}
            </div>
          ) : null}

          {membersLoading && !members ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading available members...
            </div>
          ) : members ? (
            <div className="space-y-8 p-6">
              {/* Available Boxers */}
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Boxers
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Only active boxer memberships can be assigned.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {members.boxers.filter(
                      (boxer) => boxer.user.registrationStatus === "ACTIVE"
                    ).length}
                  </span>
                </div>

                {members.boxers.filter(
                  (boxer) => boxer.user.registrationStatus === "ACTIVE"
                ).length === 0 ? (
                  <EmptyState message="No active boxers are available for assignment." />
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {members.boxers
                      .filter(
                        (boxer) => boxer.user.registrationStatus === "ACTIVE"
                      )
                      .map((boxer) => {
                        const key = `boxer-${boxer.id}`;
                        const processing = processingMember === key;

                        return (
                          <MemberAssignmentCard
                            key={boxer.id}
                            name={boxer.name}
                            subtitle={[
                              boxer.weightCategory || boxer.weight,
                              boxer.ageGroup,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                            membershipId={boxer.user.membershipId}
                            assigned={boxer.assigned}
                            processing={processing}
                            onClick={() =>
                              handleMemberAssignment(
                                "boxer",
                                boxer.id,
                                boxer.assigned
                              )
                            }
                          />
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Available Coaches */}
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Coaches
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Only active coach memberships can be assigned.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {members.coaches.filter(
                      (coach) => coach.user.registrationStatus === "ACTIVE"
                    ).length}
                  </span>
                </div>

                {members.coaches.filter(
                  (coach) => coach.user.registrationStatus === "ACTIVE"
                ).length === 0 ? (
                  <EmptyState message="No active coaches are available for assignment." />
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {members.coaches
                      .filter(
                        (coach) => coach.user.registrationStatus === "ACTIVE"
                      )
                      .map((coach) => {
                        const key = `coach-${coach.id}`;
                        const processing = processingMember === key;

                        return (
                          <MemberAssignmentCard
                            key={coach.id}
                            name={coach.name}
                            subtitle={coach.phone || coach.user.email}
                            membershipId={coach.user.membershipId}
                            assigned={coach.assigned}
                            processing={processing}
                            onClick={() =>
                              handleMemberAssignment(
                                "coach",
                                coach.id,
                                coach.assigned
                              )
                            }
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {/* Documents */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-950">
              Academy Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registration and verification documents
            </p>
          </div>

          {documents.length === 0 ? (
            <EmptyState message="No academy documents have been uploaded." />
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {document.label}
                      </p>

                      <p className="text-xs text-slate-500">
                        {document.fileType} •{" "}
                        {formatDate(document.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      document.status === "Approved" ||
                      document.status === "Verified"
                        ? "bg-green-50 text-green-700"
                        : document.status === "Rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {document.status}
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

/* ---------------- Helpers ---------------- */



function MemberAssignmentCard({
  name,
  subtitle,
  membershipId,
  assigned,
  processing,
  onClick,
}: {
  name: string;
  subtitle: string;
  membershipId: string | null;
  assigned: boolean;
  processing: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            assigned ? "bg-green-50 text-green-600" : "bg-white text-slate-500"
          }`}
        >
          {assigned ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Users className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {subtitle || "Member"}
          </p>
          {membershipId ? (
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              {membershipId}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={processing}
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          assigned
            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {processing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : assigned ? (
          <UserMinus className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {processing ? "Updating..." : assigned ? "Remove" : "Assign"}
      </button>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

function MedicalBadge({
  medical,
}: {
  medical: Boxer["medical"];
}) {
  if (!medical) {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        No Record
      </span>
    );
  }

  if (
    medical.eligible === false ||
    medical.fitnessStatus === "Expired"
  ) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        Not Eligible
      </span>
    );
  }

  if (medical.fitnessStatus === "Expiring Soon") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Expiring Soon
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
      {medical.fitnessStatus || "Valid"}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}