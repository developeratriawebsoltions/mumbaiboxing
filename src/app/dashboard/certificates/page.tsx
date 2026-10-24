
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileBadge2,
  FileText,
  Mail,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";

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

type EmailFeedback = {
  type: "success" | "error";
  message: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isVerified(status: string) {
  return status?.toLowerCase() === "verified";
}

function getEmailStatus(certificate: Certificate) {
  if (!certificate.membershipId) {
    return {
      label: "Not Available",
      color: "text-slate-500 bg-slate-100",
    };
  }

  if (certificate.membershipEmailSentAt) {
    return {
      label: "Email Sent",
      color: "text-emerald-700 bg-emerald-50",
    };
  }

  if (certificate.membershipEmailAttemptedAt) {
    return {
      label: "Email Failed",
      color: "text-red-700 bg-red-50",
    };
  }

  return {
    label: "Email Pending",
    color: "text-amber-700 bg-amber-50",
  };
}

function SummaryCard({
  label,
  value,
  subtitle,
  icon,
  color,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: "red" | "green" | "blue" | "amber";
}) {
  const colors = {
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-slate-500">
          {label}
        </p>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-[34px] font-black leading-none tracking-tight text-[#07172c]">
        {value}
      </p>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function VerificationBadge({ status }: { status: string }) {
  const verified = isVerified(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
        verified
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {verified ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Clock3 className="h-3.5 w-3.5" />
      )}

      {verified ? "Verified" : status || "Pending"}
    </span>
  );
}

export default function CertificateDashboard() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [role, setRole] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [emailingId, setEmailingId] = useState<number | null>(null);
  const [emailFeedback, setEmailFeedback] =
    useState<EmailFeedback | null>(null);

  const [search, setSearch] = useState("");

  async function loadCertificates(refresh = false) {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch("/api/certificates", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(
          data?.error || "Failed to load certificates."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Certificate service returned an unexpected response."
        );
      }

      setCerts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificates."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.role) setRole(data.role);

        if (data.registrationStatus) {
          setRegistrationStatus(data.registrationStatus);
        }
      })
      .catch(() => {});

    loadCertificates();
  }, []);

  const stats = useMemo(() => {
    return {
      total: certs.length,
      verified: certs.filter((cert) =>
        isVerified(cert.qrStatus)
      ).length,
      emailed: certs.filter(
        (cert) => Boolean(cert.membershipEmailSentAt)
      ).length,
      pending: certs.filter(
        (cert) => !isVerified(cert.qrStatus)
      ).length,
    };
  }, [certs]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return certs.filter((cert) => {
      return (
        cert.type.toLowerCase().includes(query) ||
        cert.event.toLowerCase().includes(query) ||
        String(cert.id).includes(query) ||
        (cert.membershipId || "").toLowerCase().includes(query)
      );
    });
  }, [certs, search]);

  async function resendCertificate(id: number) {
    setEmailingId(id);
    setEmailFeedback(null);

    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Could not email the certificate."
        );
      }

      setEmailFeedback({
        type: "success",
        message:
          result.message || "Certificate emailed successfully.",
      });

      setCerts((current) =>
        current.map((certificate) =>
          certificate.id === id
            ? {
                ...certificate,
                membershipEmailSentAt: new Date().toISOString(),
              }
            : certificate
        )
      );
    } catch (err) {
      setEmailFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not email the certificate.",
      });
    } finally {
      setEmailingId(null);
    }
  }

  return (
    <DashboardLayout role={role || undefined}>
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">

        {/* HERO HEADER */}
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,0.13)] sm:px-9 lg:px-11 lg:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-red-600/20 blur-[90px]" />

          <div className="pointer-events-none absolute -top-16 right-[24%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />

          <div className="pointer-events-none absolute -top-16 right-[19%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />

          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <a
                href={
                  role === "coach"
                    ? "/dashboard/coach"
                    : "/dashboard"
                }
                className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>

              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-300">
                  Mumbai Boxing Association
                </span>
              </div>

              <h1 className="text-[34px] font-black leading-tight tracking-tight sm:text-[44px]">
                My Certificates
                <span className="text-red-500">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                {role === "coach"
                  ? "Your official coaching certificates, qualifications and credentials."
                  : "Your achievements, membership certificates and verified credentials."}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Official Digital Credentials
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
                <Award className="h-6 w-6" />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-300">
                  Certificates Issued
                </p>

                <p className="mt-1 text-3xl font-black">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        {/* NOTIFICATIONS */}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadCertificates(true)}
              className="text-xs font-bold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {emailFeedback && (
          <div
            role={emailFeedback.type === "error" ? "alert" : "status"}
            className={`flex items-center justify-between gap-3 rounded-xl border px-5 py-4 ${
              emailFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {emailFeedback.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}

              <p className="text-sm font-medium">
                {emailFeedback.message}
              </p>
            </div>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setEmailFeedback(null)}
              className="rounded-md p-1 hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[20px] bg-slate-100"
                />
              ))}
            </div>

            <div className="h-72 animate-pulse rounded-[22px] bg-slate-100" />
          </div>
        ) : (
          <>
            {/* STATISTICS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total Certificates"
                value={stats.total}
                subtitle="Issued to your account"
                icon={<Award className="h-5 w-5" />}
                color="red"
              />

              <SummaryCard
                label="Verified"
                value={stats.verified}
                subtitle="QR verification complete"
                icon={<ShieldCheck className="h-5 w-5" />}
                color="green"
              />

              <SummaryCard
                label="Email Delivered"
                value={stats.emailed}
                subtitle="Email sent successfully"
                icon={<Mail className="h-5 w-5" />}
                color="blue"
              />

              <SummaryCard
                label="Pending Verification"
                value={stats.pending}
                subtitle="Awaiting QR verification"
                icon={<Clock3 className="h-5 w-5" />}
                color="amber"
              />
            </div>

            {/* EMPTY STATE */}
            {!error && certs.length === 0 && (
              <section className="rounded-[22px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-red-50 text-red-600">
                  <FileBadge2 className="h-10 w-10" />
                </div>

                <h2 className="mt-6 text-xl font-extrabold">
                  {registrationStatus.toUpperCase() === "ACTIVE"
                    ? "No certificate returned"
                    : "No certificates available yet"}
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  {registrationStatus.toUpperCase() === "ACTIVE"
                    ? "Your membership is active, but no certificate was returned. Refresh this page. If the certificate still does not appear, contact the association with your membership ID."
                    : "A membership certificate is issued after your membership payment is confirmed and your account is activated."}
                </p>

                <button
                  type="button"
                  onClick={() => loadCertificates(true)}
                  disabled={refreshing}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh Certificates"}
                </button>
              </section>
            )}

            {/* CERTIFICATE LIST */}
            {certs.length > 0 && (
              <>
                <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-lg font-extrabold tracking-tight">
                          Certificate Library
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Download and manage your official certificates
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => loadCertificates(true)}
                      disabled={refreshing}
                      className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>

                  {/* SEARCH */}
                  <div className="border-b border-slate-100 bg-slate-50/40 px-5 py-5 sm:px-6">
                    <div className="relative max-w-md">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                      <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search certificates, events or ID..."
                        aria-label="Search certificates"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      />

                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                      <Search className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-4 font-bold text-slate-700">
                        No matching certificates
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Try a different certificate name or event.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 p-5 lg:grid-cols-2 xl:grid-cols-3 sm:p-6">
                      {filtered.map((certificate) => {
                        const emailStatus =
                          getEmailStatus(certificate);

                        return (
                          <article
                            key={certificate.id}
                            className="group flex flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg"
                          >
                            {/* CERTIFICATE VISUAL */}
                            <div className="relative overflow-hidden bg-[#07172c] px-5 py-6 text-white">
                              <div className="pointer-events-none absolute -right-9 -top-12 h-48 w-12 rotate-[25deg] bg-red-600" />
                              <div className="pointer-events-none absolute right-9 top-0 h-40 w-4 rotate-[25deg] bg-red-500/30" />

                              <div className="relative flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                                  <Award className="h-6 w-6 text-red-400" />
                                </div>

                                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wider">
                                  CERT-
                                  {String(certificate.id).padStart(
                                    3,
                                    "0"
                                  )}
                                </span>
                              </div>

                              <div className="relative mt-8">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-300">
                                  Official Certificate
                                </p>

                                <h3 className="mt-2 min-h-[56px] break-words text-xl font-extrabold leading-7">
                                  {certificate.type}
                                </h3>

                                <p className="mt-2 line-clamp-2 text-xs text-slate-300">
                                  {certificate.event}
                                </p>
                              </div>
                            </div>

                            {/* DETAILS */}
                            <div className="flex flex-1 flex-col p-5">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <VerificationBadge
                                  status={certificate.qrStatus}
                                />

                                <span
                                  className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold ${emailStatus.color}`}
                                >
                                  {emailStatus.label}
                                </span>
                              </div>

                              <div className="mt-5 space-y-4">
                                <div className="flex items-center gap-3">
                                  <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                      Issued On
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                      {formatDate(certificate.issuedAt)}
                                    </p>
                                  </div>
                                </div>

                                {certificate.membershipId && (
                                  <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                    <div className="min-w-0">
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Membership ID
                                      </p>
                                      <p className="mt-1 break-all text-sm font-bold text-slate-800">
                                        {certificate.membershipId}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {certificate.membershipExpiresAt && (
                                  <div className="flex items-center gap-3">
                                    <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />

                                    <div>
                                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Membership Expires
                                      </p>
                                      <p className="mt-1 text-sm font-bold text-slate-800">
                                        {formatDate(
                                          certificate.membershipExpiresAt
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* ACTIONS */}
                              <div className="mt-auto grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                <a
                                  href={`/api/certificates/${certificate.id}`}
                                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#c9151e]"
                                >
                                  <Download className="h-4 w-4" />
                                  Download PDF
                                </a>

                                {certificate.membershipId ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void resendCertificate(
                                        certificate.id
                                      )
                                    }
                                    disabled={
                                      emailingId === certificate.id
                                    }
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {emailingId === certificate.id ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : certificate.membershipEmailSentAt ? (
                                      <Mail className="h-4 w-4" />
                                    ) : (
                                      <Send className="h-4 w-4" />
                                    )}

                                    {emailingId === certificate.id
                                      ? "Sending..."
                                      : certificate.membershipEmailSentAt
                                        ? "Email Again"
                                        : "Send Email"}
                                  </button>
                                ) : (
                                  <div className="flex min-h-11 items-center justify-center rounded-xl bg-slate-50 px-3 py-3 text-xs font-medium text-slate-400">
                                    Email Unavailable
                                  </div>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>

                <p className="px-1 text-xs leading-6 text-slate-500">
                  Your certificates are linked to your account.
                  Download the official PDF or request a copy at
                  your registered email address.
                </p>
              </>
            )}
          </>
        )}
      </main>
    </DashboardLayout>
  );
}
