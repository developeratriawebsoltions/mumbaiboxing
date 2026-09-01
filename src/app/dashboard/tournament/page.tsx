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
  registered: boolean;
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

  function loadTournaments() {
    setLoading(true);
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((d) => { if (d?.error) setError(d.error); else setTournaments(d); })
      .catch(() => setError("Failed to load tournaments."))
      .finally(() => setLoading(false));
  }

  function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleRegister(tournament: Tournament) {
    setPaying(tournament.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { alert("Payment gateway failed to load. Try again."); return; }

      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId: tournament.id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Registration failed"); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Mumbai Boxing Association",
        description: `Entry Fee – ${data.tournamentName}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          const verify = await fetch("/api/tournaments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tournamentId: tournament.id,
            }),
          });
          const vData = await verify.json();
          if (verify.ok && vData.success) {
            setSuccessId(tournament.id);
            loadTournaments();
          } else {
            alert(vData.error || "Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#0f172a" },
        modal: { ondismiss: () => setPaying(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setPaying(null);
    }
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";

  const statusColor = (s: string) =>
    s === "open" ? "bg-green-100 text-green-700"
    : s === "ongoing" ? "bg-blue-100 text-blue-700"
    : s === "completed" ? "bg-gray-100 text-gray-600"
    : "bg-yellow-100 text-yellow-700";

  const myEntries = tournaments.filter((t) => t.registered);
  const upcoming = tournaments.filter((t) => t.status !== "completed");

  return (
    <DashboardLayout role={role || undefined}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Tournaments</h2>
          <p className="text-gray-500 text-sm">Upcoming events & your registrations</p>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {successId && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <p className="text-green-700 font-medium">✅ Registration successful! Payment receipt saved to your dashboard.</p>
            <button onClick={() => setSuccessId(null)} className="text-green-500 text-sm hover:underline">Dismiss</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Total Events", value: tournaments.length },
                { label: "My Registrations", value: myEntries.length },
                { label: "Upcoming", value: upcoming.length },
              ].map((s) => (
                <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {tournaments.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-400">No tournaments found.</div>
            ) : (
              <div className="space-y-4">
                {tournaments.map((t) => (
                  <div key={t.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{t.name}</h4>
                        {t.registered && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Registered</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(t.startDate)}{t.endDate ? ` – ${formatDate(t.endDate)}` : ""} · {t.location ?? "Venue TBD"}
                      </p>
                      {t.weightClass && <p className="text-xs text-gray-400 mt-0.5">Weight: {t.weightClass}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">Entry Fee: ₹{(t.entryFee ?? 500).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3 self-start md:self-auto">
                      <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(t.status)}`}>
                        {t.status}
                      </span>
                      {role === "boxer" && !t.registered && t.status !== "completed" && (
                        <button
                          onClick={() => handleRegister(t)}
                          disabled={paying === t.id}
                          className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                          {paying === t.id ? "Processing..." : "Register & Pay"}
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
