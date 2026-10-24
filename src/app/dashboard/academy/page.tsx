
"use client";

import { useEffect, useState, type ReactNode } from "react";
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
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  Inbox,
  Activity,
  RefreshCw,
  UserPlus,
  UserMinus,
  Search,
  X,
} from "lucide-react";

import DashboardLayout from "@/Components/layout/DashboardLayout";

/* =====================================================
   TYPES
===================================================== */

type AcademyDocument = {
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

type ManageMember = {
  id: number;
  name: string;
  assigned: boolean;
  phone?: string | null;
  weight?: string | null;
  weightCategory?: string | null;
  ageGroup?: string | null;
  user: {
    email: string;
    registrationStatus: string;
    membershipId: string | null;
  };
};

type AcademyMembers = {
  academyId: number;
  boxers: ManageMember[];
  coaches: ManageMember[];
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
    documents: AcademyDocument[];
  };
  boxer?: Boxer[];
  boxers?: Boxer[];
  coach?: Coach[];
  coaches?: Coach[];
};

type Tab = "overview" | "boxers" | "coaches" | "members" | "documents";

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AcademyDashboard() {
  const [academy, setAcademy] = useState<Academy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [members, setMembers] = useState<AcademyMembers | null>(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");
  const [processingMember, setProcessingMember] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAcademy();
  }, []);

  useEffect(() => {
    if (activeTab === "members" && !members) {
      loadMembers();
    }
  }, [activeTab]);

  async function loadAcademy() {
    try {
      setError("");

      const response = await fetch("/api/academy", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load academy.");
      }

      setAcademy(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load academy."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMembers() {
    try {
      setMembersLoading(true);
      setMembersError("");

      const response = await fetch("/api/academy/members", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load members.");
      }

      setMembers(data);
    } catch (err) {
      setMembersError(
        err instanceof Error ? err.message : "Failed to load members."
      );
    } finally {
      setMembersLoading(false);
    }
  }

  async function handleAssignment(
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, id }),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Unable to update member.");
      }

      await Promise.all([loadMembers(), loadAcademy()]);
    } catch (err) {
      setMembersError(
        err instanceof Error ? err.message : "Unable to update member."
      );
    } finally {
      setProcessingMember("");
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="academy">
        <div className="flex min-h-[65vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-red-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading academy dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !academy) {
    return (
      <DashboardLayout role="academy">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="mx-auto h-9 w-9 text-red-600" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load academy
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {error || "Academy profile not found."}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              loadAcademy();
            }}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const boxers = academy.boxers ?? academy.boxer ?? [];
  const coaches = academy.coaches ?? academy.coach ?? [];
  const documents = academy.user?.documents ?? [];

  const expiry =
    academy.user.membershipExpiry || academy.membershipExpiry;

  const activeMembership =
    academy.user.registrationStatus === "ACTIVE" &&
    (!expiry || new Date(expiry) >= new Date());

  const medicalAlerts = boxers.filter(
    (boxer) =>
      boxer.medical?.eligible === false ||
      boxer.medical?.fitnessStatus === "Expired" ||
      boxer.medical?.fitnessStatus === "Expiring Soon"
  ).length;

  const academyId = `MBA-ACA-${String(academy.id).padStart(4, "0")}`;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "boxers", label: "Boxers", count: boxers.length },
    { id: "coaches", label: "Coaches", count: coaches.length },
    { id: "members", label: "Manage Members" },
    { id: "documents", label: "Documents", count: documents.length },
  ];

  const filteredBoxers = boxers.filter((boxer) =>
    boxer.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCoaches = coaches.filter((coach) =>
    coach.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="academy">
      <div className="min-w-0 space-y-6 pb-10">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Academy</span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="text-red-600">Dashboard</span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101828] sm:text-3xl">
              {academy.name}
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Manage your academy profile, members and documents.
            </p>
          </div>

          <button
            onClick={() => {
              loadAcademy();
              if (members) loadMembers();
            }}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Refresh Dashboard
          </button>
        </div>

        {/* ================= ACADEMY PROFILE ================= */}

        <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">

          <section className="relative overflow-hidden rounded-[22px] bg-[#071426] text-white shadow-sm">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-32 right-16 h-64 w-64 rounded-full bg-red-700/10 blur-[75px]" />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-600/20 text-red-400">
                  <Building2 size={30} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-red-400">
                    Academy Profile
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                    {academy.name}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">
                    Mumbai Boxing Association Affiliated Academy
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <DarkInfo
                  icon={<Building2 size={16} />}
                  label="Academy ID"
                  value={academyId}
                />
                <DarkInfo
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={academy.user.email}
                />
                <DarkInfo
                  icon={<Phone size={16} />}
                  label="Phone Number"
                  value={academy.phone || "Not provided"}
                />
                <DarkInfo
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={academy.address || "Not provided"}
                />
              </div>
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.035] px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck size={16} className="text-red-400" />
                Registered Academy
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Mumbai Boxing Association
              </span>
            </div>
          </section>

          {/* Affiliation */}
          <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    Affiliation Status
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Membership information
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                  activeMembership
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeMembership ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {activeMembership ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-7 space-y-4">
              <DetailRow
                label="Registration"
                value={academy.user.registrationStatus}
              />
              <DetailRow
                label="Membership ID"
                value={academy.user.membershipId || "—"}
              />
              <DetailRow
                label="Valid From"
                value={formatDate(academy.user.membershipValidFrom)}
              />
              <DetailRow
                label="Valid Until"
                value={formatDate(expiry)}
              />
            </div>

            <div
              className={`mt-6 flex items-start gap-2 rounded-xl p-3 text-xs leading-5 ${
                activeMembership
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {activeMembership ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              )}
              {activeMembership
                ? "Your academy affiliation is currently active."
                : "Your academy affiliation requires attention."}
            </div>
          </section>
        </div>

        {/* ================= STATISTICS ================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStat
            icon={<Users size={22} />}
            label="Registered Boxers"
            value={boxers.length}
            action="View Boxers"
            onClick={() => setActiveTab("boxers")}
          />
          <DashboardStat
            icon={<UserRound size={22} />}
            label="Registered Coaches"
            value={coaches.length}
            action="View Coaches"
            onClick={() => setActiveTab("coaches")}
          />
          <DashboardStat
            icon={<FileText size={22} />}
            label="Academy Documents"
            value={documents.length}
            action="View Documents"
            onClick={() => setActiveTab("documents")}
          />
          <DashboardStat
            icon={<HeartPulse size={22} />}
            label="Medical Alerts"
            value={medicalAlerts}
            action="Review Boxers"
            onClick={() => setActiveTab("boxers")}
          />
        </div>

        {/* ================= ALERTS ================= */}

        {medicalAlerts > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">
                Medical Attention Required
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-700">
                {medicalAlerts} boxer(s) have expired, expiring or
                ineligible medical records.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("boxers")}
              className="text-xs font-bold text-amber-800 underline"
            >
              Review
            </button>
          </div>
        )}

        {/* ================= TABS ================= */}

        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 pt-3 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearch("");
                  }}
                  className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-[3px] px-1 py-4 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        activeTab === tab.id
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ================= OVERVIEW ================= */}

          {activeTab === "overview" && (
            <div className="space-y-5 p-4 sm:p-6">

              <SectionHeading
                title="Academy Overview"
                description="Your academy's registered members and documents."
              />

              <div className="grid gap-4 lg:grid-cols-2">
                <OverviewPanel
                  icon={<Users size={22} />}
                  title="Registered Boxers"
                  description="Boxers currently registered under this academy."
                  count={boxers.length}
                  onClick={() => setActiveTab("boxers")}
                />

                <OverviewPanel
                  icon={<UserRound size={22} />}
                  title="Registered Coaches"
                  description="Coaches associated with this academy."
                  count={coaches.length}
                  onClick={() => setActiveTab("coaches")}
                />
              </div>

              <OverviewPanel
                icon={<FileText size={22} />}
                title="Academy Documents"
                description="Registration and verification documents."
                count={documents.length}
                onClick={() => setActiveTab("documents")}
              />

              <div className="flex flex-col gap-4 rounded-2xl bg-[#071426] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-400">
                    Academy Management
                  </p>
                  <h3 className="mt-2 text-lg font-extrabold">
                    Manage Your Members
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Assign or remove eligible boxers and coaches from your academy.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("members")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Manage Members
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ================= BOXERS ================= */}

          {activeTab === "boxers" && (
            <div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <SectionHeading
                  title="Registered Boxers"
                  description="View all boxers registered under your academy."
                />
                <button
                  onClick={() => setActiveTab("members")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  <UserPlus size={16} />
                  Assign Boxer
                </button>
              </div>

              {boxers.length > 0 && (
                <div className="px-5 pb-5 sm:px-6">
                  <SearchField value={search} onChange={setSearch} />
                </div>
              )}

              {filteredBoxers.length === 0 ? (
                <EmptyState
                  icon={<Users size={28} />}
                  title={search ? "No matching boxers" : "No Boxers Registered"}
                  message={
                    search
                      ? "Try searching with a different name."
                      : "No boxers are currently registered under this academy."
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "Boxer",
                          "Category",
                          "Weight",
                          "Age Group",
                          "Rank",
                          "Medical Status",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBoxers.map((boxer) => (
                        <tr
                          key={boxer.id}
                          className="border-t border-slate-100 transition hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={boxer.name} />
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {boxer.name}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {boxer.gender || "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {boxer.category || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {boxer.weightCategory || boxer.weight || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {boxer.ageGroup || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">
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
            </div>
          )}

          {/* ================= COACHES ================= */}

          {activeTab === "coaches" && (
            <div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <SectionHeading
                  title="Registered Coaches"
                  description="Coaches associated with your academy."
                />
                <button
                  onClick={() => setActiveTab("members")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  <UserPlus size={16} />
                  Assign Coach
                </button>
              </div>

              {coaches.length > 0 && (
                <div className="px-5 pb-5 sm:px-6">
                  <SearchField value={search} onChange={setSearch} />
                </div>
              )}

              {filteredCoaches.length === 0 ? (
                <EmptyState
                  icon={<UserRound size={28} />}
                  title={search ? "No matching coaches" : "No Coaches Registered"}
                  message={
                    search
                      ? "Try searching with a different name."
                      : "No coaches are currently registered under this academy."
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        {[
                          "Coach",
                          "Email",
                          "Phone",
                          "Membership ID",
                          "Status",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoaches.map((coach) => (
                        <tr
                          key={coach.id}
                          className="border-t border-slate-100 hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={coach.name} />
                              <span className="text-sm font-bold text-slate-900">
                                {coach.name}
                              </span>
                            </div>
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
                            <StatusBadge status={coach.user.registrationStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= MANAGE MEMBERS ================= */}

          {activeTab === "members" && (
            <div className="space-y-7 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SectionHeading
                  title="Manage Academy Members"
                  description="Assign active boxers and coaches to your academy."
                />

                <button
                  onClick={loadMembers}
                  disabled={membersLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={membersLoading ? "animate-spin" : ""}
                  />
                  Refresh Members
                </button>
              </div>

              {membersError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {membersError}
                </div>
              )}

              {membersLoading && !members ? (
                <div className="flex items-center justify-center gap-3 py-14 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                  Loading available members...
                </div>
              ) : members ? (
                <div className="space-y-8">
                  <AssignmentGroup
                    title="Available Boxers"
                    description="Only active boxer memberships can be assigned."
                    icon={<Users size={20} />}
                    members={members.boxers.filter(
                      (member) =>
                        member.user.registrationStatus === "ACTIVE"
                    )}
                    type="boxer"
                    processingMember={processingMember}
                    onAssignment={handleAssignment}
                  />

                  <AssignmentGroup
                    title="Available Coaches"
                    description="Only active coach memberships can be assigned."
                    icon={<UserRound size={20} />}
                    members={members.coaches.filter(
                      (member) =>
                        member.user.registrationStatus === "ACTIVE"
                    )}
                    type="coach"
                    processingMember={processingMember}
                    onAssignment={handleAssignment}
                  />
                </div>
              ) : (
                <EmptyState
                  icon={<Users size={28} />}
                  title="Members Unavailable"
                  message="Unable to display the academy member directory."
                />
              )}
            </div>
          )}

          {/* ================= DOCUMENTS ================= */}

          {activeTab === "documents" && (
            <div>
              <div className="p-5 sm:p-6">
                <SectionHeading
                  title="Academy Documents"
                  description="Registration and verification documents."
                />
              </div>

              {documents.length === 0 ? (
                <EmptyState
                  icon={<FileText size={28} />}
                  title="No Documents Uploaded"
                  message="No academy documents have been uploaded."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                          <FileText size={21} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {document.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {document.fileType} · {formatDate(document.createdAt)}
                          </p>
                          {document.rejectionReason && (
                            <p className="mt-2 text-xs text-red-600">
                              Reason: {document.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <StatusBadge status={document.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 py-3">
          <span className="h-px w-10 bg-slate-200" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Mumbai Boxing Association
          </span>
          <span className="h-px w-10 bg-slate-200" />
        </div>
      </div>
    </DashboardLayout>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function DarkInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 text-red-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="break-all text-right text-xs font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function DashboardStat({
  icon,
  label,
  value,
  action,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-[20px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          {icon}
        </div>
        <ArrowRight
          size={17}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-600"
        />
      </div>

      <p className="mt-5 text-[30px] font-black leading-none tracking-tight text-[#101828]">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-600">
        {label}
      </p>

      <p className="mt-4 flex items-center gap-2 text-xs font-bold text-red-600">
        {action}
        <ArrowRight size={14} />
      </p>
    </button>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
        {description}
      </p>
    </div>
  );
}

function OverviewPanel({
  icon,
  title,
  description,
  count,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-red-200 hover:bg-red-50/20"
    >
      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-red-50 p-3 text-red-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xl font-black text-slate-900">{count}</span>
        <ChevronRight
          size={18}
          className="text-slate-400 group-hover:text-red-600"
        />
      </div>
    </button>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-extrabold text-red-600">
      {initials || "MB"}
    </div>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative max-w-sm">
      <Search
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:bg-white"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        {icon}
      </div>
      <h3 className="mt-5 text-base font-extrabold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {message}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const style =
    ["active", "approved", "verified"].includes(normalized)
      ? "bg-emerald-50 text-emerald-700"
      : ["rejected", "expired", "inactive"].includes(normalized)
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[11px] font-bold ${style}`}
    >
      {status}
    </span>
  );
}

function MedicalBadge({
  medical,
}: {
  medical: Boxer["medical"];
}) {
  if (!medical) {
    return <StatusBadge status="No Record" />;
  }

  if (
    medical.eligible === false ||
    medical.fitnessStatus === "Expired"
  ) {
    return <StatusBadge status="Not Eligible" />;
  }

  if (medical.fitnessStatus === "Expiring Soon") {
    return <StatusBadge status="Expiring Soon" />;
  }

  return <StatusBadge status={medical.fitnessStatus || "Valid"} />;
}

function AssignmentGroup({
  title,
  description,
  icon,
  members,
  type,
  processingMember,
  onAssignment,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  members: ManageMember[];
  type: "boxer" | "coach";
  processingMember: string;
  onAssignment: (
    type: "boxer" | "coach",
    id: number,
    assigned: boolean
  ) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {members.length}
        </span>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
          No active {type === "boxer" ? "boxers" : "coaches"} available.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {members.map((member) => {
            const key = `${type}-${member.id}`;
            const processing = processingMember === key;

            return (
              <div
                key={member.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={member.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {member.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {type === "boxer"
                        ? [
                            member.weightCategory || member.weight,
                            member.ageGroup,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "Boxer"
                        : member.phone || member.user.email}
                    </p>
                    {member.user.membershipId && (
                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {member.user.membershipId}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAssignment(type, member.id, member.assigned)
                  }
                  disabled={processing}
                  className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition disabled:opacity-50 ${
                    member.assigned
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {processing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : member.assigned ? (
                    <UserMinus size={15} />
                  ) : (
                    <UserPlus size={15} />
                  )}
                  {processing
                    ? "Updating..."
                    : member.assigned
                      ? "Remove"
                      : "Assign"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
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
