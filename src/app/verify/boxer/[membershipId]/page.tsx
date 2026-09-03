"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

interface VerificationResponse {
  verified: boolean;
  status: string;
  error?: string;
  member?: {
    name: string;
    membershipId: string;
    category: string | null;
    weightCategory: string | null;
    academy: string | null;
    validFrom: string | null;
    validUntil: string | null;
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE MEMBER";
    case "EXPIRED":
      return "MEMBERSHIP EXPIRED";
    case "NOT_YET_ACTIVE":
      return "NOT YET ACTIVE";
    case "INACTIVE":
      return "MEMBERSHIP INACTIVE";
    default:
      return "NOT VERIFIED";
  }
}

export default function BoxerVerificationPage({
  params,
}: {
  params: Promise<{ membershipId: string }>;
}) {
  const [data, setData] =
    useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        const { membershipId } = await params;

        const response = await fetch(
          `/api/verify/boxer/${encodeURIComponent(
            membershipId
          )}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (mounted) {
          setData(result);
        }
      } catch {
        if (mounted) {
          setData({
            verified: false,
            status: "ERROR",
            error:
              "Unable to verify membership right now.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Verifying membership...
          </p>
        </div>
      </main>
    );
  }

  const verified = data?.verified === true;
  const member = data?.member;

  return (
    <main className="min-h-screen bg-[#f3f3f1] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-gradient-to-br from-[#ed1c24] to-[#c90f17] px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-white text-sm font-extrabold text-red-600">
                MBA
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-red-100">
                  MUMBAI BOXING ASSOCIATION
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Membership Verification
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div
              className={`rounded-2xl border p-5 ${
                verified
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    verified
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {verified ? (
                    <CheckCircle2 size={26} />
                  ) : (
                    <XCircle size={26} />
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold tracking-wide ${
                      verified
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {statusLabel(data?.status || "")}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      verified
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {verified
                      ? "This membership is currently valid and verified by Mumbai Boxing Association."
                      : data?.error ||
                        "This membership is not currently valid."
                    }
                  </p>
                </div>
              </div>
            </div>

            {member ? (
              <div className="mt-7 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <UserRound size={28} strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Member Name
                    </p>
                    <h2 className="mt-1 break-words text-2xl font-extrabold text-slate-900">
                      {member.name}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <VerificationInfo
                    label="Membership ID"
                    value={member.membershipId}
                  />
                  <VerificationInfo
                    label="Category"
                    value={member.category || "Boxer"}
                  />
                  <VerificationInfo
                    label="Weight Category"
                    value={member.weightCategory || "—"}
                  />
                  <VerificationInfo
                    label="Academy"
                    value={member.academy || "—"}
                  />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <CalendarDays
                      size={18}
                      className="text-slate-500"
                    />
                    <h3 className="font-bold text-slate-900">
                      Membership Validity
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <VerificationInfo
                      label="Valid From"
                      value={formatDate(member.validFrom)}
                    />
                    <VerificationInfo
                      label="Valid Until"
                      value={formatDate(member.validUntil)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                <AlertCircle
                  size={36}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-4 font-semibold text-slate-700">
                  Membership details unavailable
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck size={15} />
              Official MBA membership verification
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function VerificationInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
