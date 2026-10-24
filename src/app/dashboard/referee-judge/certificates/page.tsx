"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Award, BadgeCheck, CalendarDays, CheckCircle2,
  Clock3, Download, FileText, Mail, RefreshCw, Search, ShieldCheck,
  Trophy, XCircle,
} from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type CertificateItem = {
  id: number;
  type?: string | null;
  event?: string | null;
  membershipId?: string | null;
  memberName?: string | null;
  membershipRole?: string | null;
  membershipExpiresAt?: string | null;
  membershipEmailAttemptedAt?: string | null;
  membershipEmailSentAt?: string | null;
  certificateNumber?: string | null;
  title?: string | null;
  certificateType?: string | null;
  issueDate?: string | null;
  issuedAt?: string | null;
  status?: string | null;
  filePath?: string | null;
  fileUrl?: string | null;
  createdAt?: string | null;
};

type DashboardData = {
  success: boolean;
  user: { id: number; email: string; role: string; registrationStatus: string };
  membership: {
    id: string | null; validFrom: string | null; expiry: string | null;
    activatedAt: string | null; active: boolean;
  };
  certificates: CertificateItem[];
};

type Filter = "all" | "active" | "other";

const isActive = (status?: string | null) =>
  ["active", "issued", "verified"].includes((status || "").toLowerCase());

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const certificateName = (certificate: CertificateItem) =>
  certificate.type || certificate.title || certificate.certificateType || "MBA Certificate";

function StatusPill({ status }: { status?: string | null }) {
  const label = status || "Not specified";
  const active = isActive(status);
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {active ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, hint, tone }: {
  icon: typeof Award; label: string; value: string | number; hint: string;
  tone: "red" | "green" | "blue" | "slate";
}) {
  const tones = {
    red: "bg-red-50 text-[#ed1c24]", green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600", slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-[#07172c]">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={21} /></span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function CertificateCard({ certificate }: { certificate: CertificateItem }) {
  const [emailing, setEmailing] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const fileUrl = `/api/certificates/${certificate.id}`;
  const issueDate = certificate.issueDate || certificate.issuedAt || certificate.createdAt;

  const resendCertificate = async () => {
    if (emailing) return;
    setEmailing(true);
    setEmailMessage("");
    setEmailError(false);
    try {
      const response = await fetch(fileUrl, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Could not email the certificate.");
      setEmailMessage(result?.message || "Certificate email request completed.");
    } catch (error) {
      setEmailError(true);
      setEmailMessage(error instanceof Error ? error.message : "Could not email the certificate.");
    } finally {
      setEmailing(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="h-1 bg-[#ed1c24]" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-[#ed1c24]">
            <Award size={32} strokeWidth={1.6} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="break-words text-lg font-extrabold text-[#07172c] sm:text-xl">{certificateName(certificate)}</h3>
              <StatusPill status={certificate.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">Mumbai Boxing Association · Referee / Judge</p>
            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
              <Info icon={FileText} label="Certificate number" value={certificate.certificateNumber || "Not provided"} />
              <Info icon={CalendarDays} label="Issue date" value={formatDate(issueDate)} />
              <Info icon={Trophy} label="Event" value={certificate.event || "Not specified"} />
              {certificate.membershipId && <Info icon={ShieldCheck} label="Membership ID" value={certificate.membershipId} />}
              {certificate.memberName && <Info icon={BadgeCheck} label="Member" value={certificate.memberName} />}
              {certificate.membershipExpiresAt && <Info icon={CalendarDays} label="Membership expiry" value={formatDate(certificate.membershipExpiresAt)} />}
            </div>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 lg:w-48">
            <a href={fileUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#cc161d]">
              <Download size={17} /> Download PDF
            </a>
            {certificate.membershipId && (
              <>
                <button type="button" disabled={emailing} onClick={() => void resendCertificate()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#07172c] transition-colors hover:border-red-200 hover:text-[#ed1c24] disabled:cursor-not-allowed disabled:opacity-50">
                  <Mail size={16} /> {emailing ? "Sending..." : certificate.membershipEmailSentAt ? "Email again" : "Retry email"}
                </button>
                <p className="text-center text-xs text-slate-500">
                  {certificate.membershipEmailSentAt ? "Previously emailed" : certificate.membershipEmailAttemptedAt ? "Previous email attempt" : "Email not yet sent"}
                </p>
              </>
            )}
            {emailMessage && <p role="status" className={`break-words rounded-lg p-2 text-xs ${emailError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{emailMessage}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon size={17} className="mt-0.5 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function RefereeJudgeCertificatesPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const loadCertificates = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/referee-judge", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Failed to load your certificates.");
      setData(result as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load certificates.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadCertificates(); }, [loadCertificates]);

  const certificates = useMemo(() => data?.certificates ?? [], [data]);
  const activeCount = certificates.filter((c) => isActive(c.status)).length;
  const emailedCount = certificates.filter((c) => Boolean(c.membershipEmailSentAt)).length;
  const filtered = useMemo(() => certificates.filter((certificate) => {
    if (filter === "active" && !isActive(certificate.status)) return false;
    if (filter === "other" && isActive(certificate.status)) return false;
    const searchable = [certificateName(certificate), certificate.certificateNumber, certificate.event, certificate.membershipId].filter(Boolean).join(" ").toLowerCase();
    return searchable.includes(query.trim().toLowerCase());
  }), [certificates, filter, query]);

  return (
    <DashboardLayout role="referee_judge">
      <div className="mx-auto max-w-[1480px] space-y-6 pb-10 text-slate-900">
        <Link href="/dashboard/referee-judge" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#ed1c24]">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <header className="relative overflow-hidden rounded-[26px] bg-[#07172c] px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[45px] border-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-32 right-28 h-60 w-60 rounded-full bg-[#ed1c24]/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white/80">
                <ShieldCheck size={14} className="text-red-400" /> OFFICIAL MEMBERSHIP RECORDS
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My Certificates<span className="text-[#ed1c24]">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Access certificates issued to your Referee / Judge account, review their details and download copies.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white sm:h-20 sm:w-20"><Award size={36} strokeWidth={1.5} /></div>
              <button type="button" onClick={() => void loadCertificates(true)} disabled={loading || refreshing}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-50">
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ed1c24]" />
            <p className="text-sm text-slate-500">Loading your certificates...</p>
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-2 font-bold text-red-700"><XCircle size={19} /> Unable to load certificates</div>
            <p className="mt-2 text-sm text-red-700">{error || "Please try again."}</p>
            <button type="button" onClick={() => void loadCertificates()} className="mt-4 rounded-lg bg-[#ed1c24] px-4 py-2 text-sm font-bold text-white">Try again</button>
          </div>
        ) : (
          <>
            {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Could not refresh data: {error}. Showing previously loaded certificates.</p>}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Award} label="Total Certificates" value={certificates.length} hint="Linked to your account" tone="red" />
              <StatCard icon={BadgeCheck} label="Active / Verified" value={activeCount} hint="Based on certificate status" tone="green" />
              <StatCard icon={Mail} label="Email Sent" value={emailedCount} hint="Certificates with email records" tone="blue" />
              <StatCard icon={ShieldCheck} label="Membership" value={data.membership.active ? "Active" : "Inactive"} hint={data.membership.expiry ? `Expires ${formatDate(data.membership.expiry)}` : "Membership status"} tone="slate" />
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
              <ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={21} />
              <div>
                <p className="font-bold text-[#07172c]">Your official certificate library</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Only certificates returned for your account are shown here. Downloads and email requests use the existing certificate endpoint.</p>
              </div>
            </div>

            <section className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#07172c] sm:text-2xl">Certificate Library</h2>
                  <p className="mt-1 text-sm text-slate-500">Browse and manage your issued certificates</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block min-w-0 sm:w-64">
                    <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <span className="sr-only">Search certificates</span>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search certificates..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#ed1c24] focus:ring-2 focus:ring-red-100" />
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Filter certificates">
                    {(["all", "active", "other"] as const).map((item) => (
                      <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item}
                        className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition-colors ${filter === item ? "bg-white text-[#07172c] shadow-sm" : "text-slate-500 hover:text-[#07172c]"}`}>
                        {item === "other" ? "Other" : item === "active" ? "Active" : "All"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                {filtered.length ? (
                  <div className="space-y-4">{filtered.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} />)}</div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm"><Award size={31} /></div>
                    <h3 className="mt-4 text-lg font-extrabold text-[#07172c]">{certificates.length === 0 ? "No certificates issued yet" : "No matching certificates"}</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{certificates.length === 0 ? "Certificates will appear here when they are issued by the Mumbai Boxing Association." : "Try a different search or change the status filter."}</p>
                    {certificates.length > 0 && <button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mt-4 text-sm font-bold text-[#ed1c24]">Clear filters</button>}
                  </div>
                )}
              </div>
              <p className="mt-5 text-xs text-slate-400">Showing {filtered.length} of {certificates.length} certificates</p>
            </section>
            <Link href="/dashboard/referee-judge" className="inline-flex items-center gap-2 rounded-xl bg-[#ed1c24] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#cc161d]">Back to Dashboard <ArrowRight size={17} /></Link>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
