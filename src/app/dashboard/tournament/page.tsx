"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
  createdAt: string;
  registered?: boolean;
  _count?: {
    entries: number;
  };
};

export default function TournamentDashboard() {
  const role = useRole();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tournaments", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load tournaments.");
        return;
      }

      if (!Array.isArray(data)) {
        setError("Invalid tournament data received.");
        return;
      }

      setTournaments(data);
    } catch {
      setError("Failed to load tournaments.");
    } finally {
      setLoading(false);
    }
  }

  function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  async function handleRegister(tournament: Tournament) {
    setPaying(tournament.id);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        alert(
          "Payment gateway failed to load. Please try again."
        );
        return;
      }

      const res = await fetch(
        "/api/tournaments/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            tournamentId: tournament.id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data?.error ||
            "Tournament registration failed."
        );
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: "INR",

        name: "Mumbai Boxing Association",

        description: `Entry Fee – ${data.tournamentName}`,

        order_id: data.orderId,

        handler: async (response: any) => {
          try {
            const verify = await fetch(
              "/api/tournaments/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  tournamentId: tournament.id,
                }),
              }
            );

            const vData = await verify.json();

            if (verify.ok && vData.success) {
              setSuccessId(tournament.id);

              await loadTournaments();
            } else {
              alert(
                vData?.error ||
                  "Payment verification failed."
              );
            }
          } catch {
            alert(
              "Payment verification failed. Please contact support if the amount was deducted."
            );
          } finally {
            setPaying(null);
          }
        },

        prefill: {},

        theme: {
          color: "#0f172a",
        },

        modal: {
          ondismiss: () => {
            setPaying(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch {
      alert(
        "Something went wrong. Please try again."
      );

      setPaying(null);
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "TBD";

    return new Date(d).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  function statusColor(status: string) {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";

      case "ongoing":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-gray-100 text-gray-600";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  const myEntries = tournaments.filter(
    (t) => t.registered
  );

  const upcoming = tournaments.filter(
    (t) => t.status.toLowerCase() !== "completed"
  );

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">
            Tournaments
          </h2>

          <p className="text-gray-500 text-sm">
            Upcoming events & your registrations
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">
              Loading tournaments...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-red-600 text-sm">
                {error}
              </p>

              <button
                onClick={loadTournaments}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Registration success */}
        {successId && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <p className="text-green-700 font-medium text-sm">
              ✅ Registration successful! Payment receipt
              saved to your dashboard.
            </p>

            <button
              onClick={() => setSuccessId(null)}
              className="text-green-600 text-sm hover:underline whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Events",
                  value: tournaments.length,
                },
                {
                  label: "My Registrations",
                  value: myEntries.length,
                },
                {
                  label: "Upcoming",
                  value: upcoming.length,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border rounded-xl p-5 shadow-sm text-center"
                >
                  <p className="text-3xl font-bold">
                    {stat.value}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {tournaments.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center">
                <p className="text-gray-400">
                  No tournaments found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Tournament information */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900">
                          {tournament.name}
                        </h4>

                        {tournament.registered && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            ✓ Registered
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(
                          tournament.startDate
                        )}

                        {tournament.endDate
                          ? ` – ${formatDate(
                              tournament.endDate
                            )}`
                          : ""}

                        {" · "}

                        {tournament.location ??
                          "Venue TBD"}
                      </p>

                      {tournament.weightClass && (
                        <p className="text-xs text-gray-400 mt-1">
                          Weight:{" "}
                          {tournament.weightClass}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        Entry Fee: ₹
                        {(
                          tournament.entryFee ?? 500
                        ).toLocaleString("en-IN")}
                      </p>

                      {tournament._count && (
                        <p className="text-xs text-gray-400 mt-1">
                          Registered Boxers:{" "}
                          {tournament._count.entries}
                        </p>
                      )}
                    </div>

                    {/* Status + action */}
                    <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
                      <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(
                          tournament.status
                        )}`}
                      >
                        {tournament.status}
                      </span>

                      {role === "boxer" &&
                        !tournament.registered &&
                        tournament.status.toLowerCase() !==
                          "completed" &&
                        tournament.status.toLowerCase() !==
                          "cancelled" && (
                          <button
                            onClick={() =>
                              handleRegister(
                                tournament
                              )
                            }
                            disabled={
                              paying ===
                              tournament.id
                            }
                            className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            {paying ===
                            tournament.id
                              ? "Processing..."
                              : "Register & Pay"}
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}