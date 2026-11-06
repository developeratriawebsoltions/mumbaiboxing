"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { AlertCircle, RefreshCw, Scale, Search } from "lucide-react";

type Referee = {
  id: number;
  name: string;
  phone: string | null;
  designation: string | null;
  officiatingLevel: string | null;
  qualification: string | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
    registrationStatus: string;
    membershipId: string | null;
  };
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

async function fetchReferees() {
      const response = await fetch("/api/admin/referees", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to load referees and judges.");
      }
      if (!Array.isArray(data)) {
        throw new Error("Invalid referees response.");
      }

      return data as Referee[];
}

export default function AdminRefereesPage() {
  const role = useRole();
  const [referees, setReferees] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadReferees = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setError("");
    }

    try {
      setReferees(await fetchReferees());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load referees and judges."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchReferees()
      .then((data) => {
        if (active) setReferees(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load referees and judges."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return referees;

    return referees.filter((referee) =>
      [
        referee.name,
        referee.phone,
        referee.user.email,
        referee.designation,
        referee.officiatingLevel,
        referee.user.membershipId,
      ].some((value) => value?.toLowerCase().includes(query))
    );
  }, [referees, search]);

  return (
    <DashboardLayout role={role || undefined}>
      <main className="min-h-screen bg-[#F6F7F9] px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                <Scale size={16} />
                Administration / Referees &amp; Judges
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Referees &amp; Judges
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                View registered officials and their membership details.
              </p>
            </div>
            <button
              type="button"
              disabled={refreshing || loading}
              onClick={() => void loadReferees(true)}
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </header>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => void loadReferees(true)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="font-bold text-slate-900">Officials directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Loading officials..."
                    : `${filtered.length} of ${referees.length} officials`}
                </p>
              </div>
              <label className="relative block w-full sm:max-w-sm">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or designation"
                  aria-label="Search referees and judges"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </label>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading referees and judges...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Officials could not be loaded.
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                {referees.length
                  ? "No officials match your search."
                  : "No referees or judges are registered yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Name</th>
                      <th className="px-5 py-3 font-semibold">Contact</th>
                      <th className="px-5 py-3 font-semibold">Designation</th>
                      <th className="px-5 py-3 font-semibold">Level</th>
                      <th className="px-5 py-3 font-semibold">Membership</th>
                      <th className="px-5 py-3 font-semibold">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((referee) => (
                      <tr key={referee.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{referee.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {referee.user.email}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {referee.phone || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {referee.designation || referee.qualification || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {referee.officiatingLevel || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-700">
                            {referee.user.membershipId || "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {referee.user.registrationStatus.replace(/_/g, " ")}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(referee.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
