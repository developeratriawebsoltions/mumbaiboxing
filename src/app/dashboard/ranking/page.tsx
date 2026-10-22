"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

type RankedBoxer = {
  rank: number;
  boxerId: number;
  name: string;
  membershipId?: string | null;
  gender?: string | null;
  category?: string | null;
  weight?: string | null;
  weightCategory?: string | null;
  ageGroup?: string | null;
  academy?: {
    id?: number;
    name: string;
  } | null;
  points?: number;
  tournaments?: number;
  medals?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  latestTournamentDate?: string | null;
  isMe?: boolean;
};

type RankingsResponse = {
  success?: boolean;
  season?: number | string;
  rankingType?: string;
  count?: number;
  rankings?: RankedBoxer[];
  error?: string;
};

export default function RankingDashboard() {
  const role = useRole();

  const [rankings, setRankings] = useState<RankedBoxer[]>([]);
  const [season, setSeason] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadRankings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/rankings", {
          method: "GET",
          cache: "no-store",
        });

        const data: RankingsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load rankings.");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (!Array.isArray(data?.rankings)) {
          throw new Error("Invalid rankings response.");
        }

        if (!mounted) return;

        setRankings(data.rankings);
        setSeason(data.season ?? null);
      } catch (err) {
        if (!mounted) return;

        setRankings([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load rankings."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRankings();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * The rankings API returns:
   *
   * {
   *   success: true,
   *   season: 2026,
   *   rankingType: "SEASON",
   *   rankings: [...]
   * }
   *
   * Therefore we use data.rankings above rather than the
   * complete API response as the rankings array.
   */
  const me = rankings.find((r) => r.isMe);

  const rankStyle = (rank: number) =>
    rank === 1
      ? "bg-yellow-100 text-yellow-700"
      : rank === 2
      ? "bg-gray-200 text-gray-700"
      : rank === 3
      ? "bg-orange-100 text-orange-600"
      : "bg-slate-100 text-slate-600";

  const formatPoints = (points: number | undefined) => {
    return (points ?? 0).toLocaleString();
  };

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Rankings</h2>

          <p className="text-gray-500 text-sm">
            Current boxer rankings
            {season !== null ? ` · Season ${season}` : ""}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">
              Loading rankings...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* My Ranking */}
            {me && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">

                <span
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold ${rankStyle(
                    me.rank
                  )}`}
                >
                  #{me.rank}
                </span>

                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    Your Current Rank
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {me.weight ?? "—"} ·{" "}
                    {me.ageGroup ?? "—"} ·{" "}
                    {me.academy?.name ?? "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-blue-700">
                    {formatPoints(me.points)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Points
                  </p>
                </div>
              </div>
            )}

            {/* Empty */}
            {rankings.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center">
                <p className="text-gray-400 text-sm">
                  No rankings available yet.
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  Rankings will appear once verified tournament
                  records have been awarded points.
                </p>
              </div>
            ) : (
              /* Rankings Table */
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

                {/* Desktop table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">

                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="text-left px-4 py-3">
                          Rank
                        </th>

                        <th className="text-left px-4 py-3">
                          Boxer
                        </th>

                        <th className="text-left px-4 py-3">
                          Weight
                        </th>

                        <th className="text-left px-4 py-3">
                          Age Group
                        </th>

                        <th className="text-left px-4 py-3">
                          Academy
                        </th>

                        <th className="text-right px-4 py-3">
                          Points
                        </th>

                        <th className="text-right px-4 py-3">
                          Tournaments
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {rankings.map((r) => (
                        <tr
                          key={r.boxerId}
                          className={`hover:bg-gray-50 ${
                            r.isMe ? "bg-blue-50" : ""
                          }`}
                        >
                          {/* Rank */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${rankStyle(
                                r.rank
                              )}`}
                            >
                              {r.rank}
                            </span>
                          </td>

                          {/* Boxer */}
                          <td className="px-4 py-3 font-medium">
                            <div>
                              <span>
                                {r.name}
                              </span>

                              {r.isMe && (
                                <span className="text-xs text-blue-600 ml-1">
                                  (You)
                                </span>
                              )}

                              {r.membershipId && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {r.membershipId}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Weight */}
                          <td className="px-4 py-3 text-gray-500">
                            {r.weight ?? "—"}
                          </td>

                          {/* Age Group */}
                          <td className="px-4 py-3 text-gray-500">
                            {r.ageGroup ?? "—"}
                          </td>

                          {/* Academy */}
                          <td className="px-4 py-3 text-gray-500">
                            {r.academy?.name ?? "—"}
                          </td>

                          {/* Points */}
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-slate-800">
                              {formatPoints(r.points)}
                            </span>
                          </td>

                          {/* Tournaments */}
                          <td className="px-4 py-3 text-right text-gray-500">
                            {r.tournaments ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

              </div>
            )}

            {/* Medal Summary */}
            {rankings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="bg-white border rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase">
                    Gold Medals
                  </p>

                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {rankings.reduce(
                      (total, r) =>
                        total + (r.medals?.gold ?? 0),
                      0
                    )}
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase">
                    Silver Medals
                  </p>

                  <p className="text-2xl font-bold text-gray-500 mt-1">
                    {rankings.reduce(
                      (total, r) =>
                        total + (r.medals?.silver ?? 0),
                      0
                    )}
                  </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase">
                    Bronze Medals
                  </p>

                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {rankings.reduce(
                      (total, r) =>
                        total + (r.medals?.bronze ?? 0),
                      0
                    )}
                  </p>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}