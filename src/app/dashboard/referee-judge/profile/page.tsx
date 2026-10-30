"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft, Award, BadgeCheck, CalendarDays, CheckCircle2, Clock3,
  Mail, MapPin, Phone, RefreshCw, ShieldCheck, Trophy, UserRound,
  AlertCircle, IdCard, ArrowUpRight, Fingerprint,
} from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type RefereeJudge = {
  id: number; userId: number; name: string; phone: string | null;
  dob: string | null; gender: string | null; designation: string | null;
  officiatingLevel: string | null; qualification: string | null;
  officiatingExperience: string | null; federationAffiliation: string | null;
  aadhaarPan: string | null; tournamentsOfficiated: string | null;
  achievements: string | null; address: string | null;
  membershipExpiry: string | null; createdAt: string; updatedAt: string;
};
type DashboardData = {
  success: boolean;
  user: { id: number; email: string; role: string; registrationStatus: string };
  membership: { id: string | null; validFrom: string | null; expiry: string | null; activatedAt: string | null; active: boolean };
  profile: RefereeJudge;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function StatusBadge({ active, status }: { active: boolean; status: string }) {
  const pending = status === "PAYMENT_PENDING";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${active ? "bg-emerald-50 text-emerald-700" : pending ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
      {active ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
      {active ? "ACTIVE MEMBER" : pending ? "PAYMENT PENDING" : status.replaceAll("_", " ") || "PENDING"}
    </span>
  );
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-[#fafbfd] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-[#ed1c24]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#07172c]">{value || "—"}</p>
      </div>
    </div>
  );
}

function Section({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]">{icon}</span>
        <div><h2 className="text-lg font-extrabold text-[#07172c] sm:text-xl">{title}</h2><p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{description}</p></div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function RefereeJudgeProfilePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/referee-judge", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Failed to load Referee / Judge profile.");
      if (!result?.profile || !result?.user || !result?.membership) throw new Error("Incomplete profile data received.");
      setData(result as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  const maskedId = useMemo(() => {
    const value = data?.profile?.aadhaarPan?.trim();
    if (!value) return "—";
    if (value.length <= 4) return "••••";
    return `${"•".repeat(value.length - 4)}${value.slice(-4)}`;
  }, [data]);

  const profile = data?.profile;
  const membership = data?.membership;
  const user = data?.user;

  return (
    <DashboardLayout role="referee_judge">
      <div className="mx-auto max-w-[1450px] space-y-6 pb-10 text-slate-900">
        <section className="relative overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-7 text-white sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[45px] border-white/[0.035]" />
          <div className="pointer-events-none absolute bottom-0 right-16 h-28 w-3 -skew-x-[28deg] bg-[#ed1c24]/80" />
          <div className="pointer-events-none absolute bottom-0 right-28 h-20 w-3 -skew-x-[28deg] bg-[#ed1c24]/40" />
          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div>
              <Link href="/dashboard/referee-judge" className="inline-flex items-center gap-2 text-xs font-semibold text-white/65 transition hover:text-white"><ArrowLeft size={15} /> Back to Dashboard</Link>
              <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff6670]">North Bombay District Amateur Boxing Association (NBDABA) / Member Portal</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">My Profile<span className="text-[#ed1c24]">.</span></h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Your registered identity, officiating credentials and membership information in one place.</p>
            </div>
            <button onClick={() => void loadProfile(true)} disabled={refreshing || loading} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50">
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh Profile
            </button>
          </div>
        </section>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span className="inline-flex items-center gap-2"><AlertCircle size={18} /> {error}</span>
            <button className="font-bold underline" onClick={() => void loadProfile(true)}>Try again</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-5 animate-pulse" aria-label="Loading profile">
            <div className="h-60 rounded-2xl bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-28 rounded-2xl bg-slate-200" />)}</div>
          </div>
        ) : !profile || !membership || !user ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center"><UserRound className="mx-auto text-slate-300" size={40} /><h2 className="mt-4 font-bold text-slate-800">Profile unavailable</h2><p className="mt-1 text-sm text-slate-500">Your profile information could not be displayed.</p></div>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-2 bg-[#ed1c24]" />
              <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#07172c] text-5xl font-black text-white shadow-lg sm:h-32 sm:w-32">
                  {profile.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound size={48} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3"><h2 className="break-words text-2xl font-black text-[#07172c] sm:text-3xl">{profile.name}</h2><StatusBadge active={membership.active} status={user.registrationStatus} /></div>
                  <p className="mt-1 text-sm font-medium text-slate-500">{profile.designation || "Referee / Judge"} · North Bombay District Amateur Boxing Association (NBDABA)</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><Mail size={15} className="text-[#ed1c24]" /> <span className="break-all">{user.email}</span></span><span className="inline-flex items-center gap-2"><Phone size={15} className="text-[#ed1c24]" /> {profile.phone || "—"}</span></div>
                </div>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-5 lg:w-64">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Membership ID</p>
                  <p className="mt-2 break-all text-lg font-black text-[#07172c]">{membership.id || "Not issued"}</p>
                  <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">Valid until <span className="font-bold text-slate-800">{formatDate(membership.expiry)}</span></div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Membership Status", value: membership.active ? "Active" : user.registrationStatus.replaceAll("_", " "), icon: <ShieldCheck size={21} /> },
                { label: "Officiating Level", value: profile.officiatingLevel || "—", icon: <BadgeCheck size={21} /> },
                { label: "Qualification", value: profile.qualification || "—", icon: <Award size={21} /> },
                { label: "Tournaments Officiated", value: profile.tournamentsOfficiated || "—", icon: <Trophy size={21} /> },
              ].map((stat) => <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]">{stat.icon}</span><p className="mt-4 break-words text-xl font-black text-[#07172c]">{stat.value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{stat.label}</p></div>)}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <Section icon={<UserRound size={21} />} title="Personal Information" description="Details provided during registration">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail icon={<UserRound size={18} />} label="Full Name" value={profile.name} />
                  <Detail icon={<CalendarDays size={18} />} label="Date of Birth" value={formatDate(profile.dob)} />
                  <Detail icon={<UserRound size={18} />} label="Gender" value={profile.gender || "—"} />
                  <Detail icon={<Phone size={18} />} label="Phone Number" value={profile.phone || "—"} />
                  <Detail icon={<Mail size={18} />} label="Email Address" value={user.email} />
                  <Detail icon={<Fingerprint size={18} />} label="ID Number" value={maskedId} />
                  <div className="sm:col-span-2"><Detail icon={<MapPin size={18} />} label="Address" value={profile.address || "—"} /></div>
                </div>
              </Section>
              <Section icon={<IdCard size={21} />} title="Membership Details" description="Current membership validity and activation">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#07172c] px-5 py-5 text-white"><div><p className="text-[11px] uppercase tracking-wider text-white/60">MBA Membership</p><p className="mt-1 break-all text-lg font-black">{membership.id || "Not issued"}</p></div><ShieldCheck className="text-[#ff5962]" size={30} /></div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <Detail icon={<CalendarDays size={18} />} label="Valid From" value={formatDate(membership.validFrom)} />
                  <Detail icon={<CalendarDays size={18} />} label="Valid Until" value={formatDate(membership.expiry)} />
                  <Detail icon={<CheckCircle2 size={18} />} label="Activated On" value={formatDate(membership.activatedAt)} />
                  <Detail icon={<ShieldCheck size={18} />} label="Registration Status" value={user.registrationStatus.replaceAll("_", " ")} />
                </div>
              </Section>
            </div>

            <Section icon={<ShieldCheck size={21} />} title="Officiating Credentials" description="Your qualifications, affiliations and officiating experience">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Detail icon={<BadgeCheck size={18} />} label="Designation" value={profile.designation || "—"} />
                <Detail icon={<ShieldCheck size={18} />} label="Officiating Level" value={profile.officiatingLevel || "—"} />
                <Detail icon={<Award size={18} />} label="Qualification" value={profile.qualification || "—"} />
                <Detail icon={<Clock3 size={18} />} label="Officiating Experience" value={profile.officiatingExperience ? `${profile.officiatingExperience} years` : "—"} />
                <Detail icon={<BadgeCheck size={18} />} label="Federation Affiliation" value={profile.federationAffiliation || "—"} />
                <Detail icon={<Trophy size={18} />} label="Tournaments Officiated" value={profile.tournamentsOfficiated || "—"} />
              </div>
            </Section>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Section icon={<Trophy size={21} />} title="Achievements" description="Professional milestones and recognition"><p className="min-h-24 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">{profile.achievements || "No achievements added yet."}</p></Section>
              <Section icon={<BadgeCheck size={21} />} title="Account Information" description="Account and registration records"><div className="space-y-3"><Detail icon={<IdCard size={18} />} label="Account ID" value={String(user.id)} /><Detail icon={<CalendarDays size={18} />} label="Member Since" value={formatDate(profile.createdAt)} /><Detail icon={<Clock3 size={18} />} label="Last Updated" value={formatDate(profile.updatedAt)} /></div></Section>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/referee-judge" className="inline-flex items-center gap-2 rounded-xl bg-[#ed1c24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d71920]"><ArrowLeft size={17} /> Back to Dashboard</Link>
              <Link href="/dashboard/referee-judge/tournaments" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#07172c] transition hover:border-[#ed1c24]"><Trophy size={17} /> My Tournaments <ArrowUpRight size={16} /></Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
