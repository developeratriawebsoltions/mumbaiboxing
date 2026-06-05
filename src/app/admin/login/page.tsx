"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin@mba.com" && password === "superadmin@123") {
      localStorage.setItem("mba_role", "superadmin");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B1120" }}>
      {/* Background glow — red tint to distinguish from public login */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)",
        }}
      />

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg,#EF4444,#B91C1C)" }}
          >
            <span className="text-2xl font-black" style={{ color: "#fff" }}>SA</span>
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#F8F9FA" }}>Super Admin</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Restricted access — authorised personnel only</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "#111827",
            border: "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@mba.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "#1E2A3B", border: "1px solid rgba(239,68,68,0.2)", color: "#F8F9FA" }}
                onFocus={(e) => (e.target.style.borderColor = "#EF4444")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.2)")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all pr-11"
                  style={{ background: "#1E2A3B", border: "1px solid rgba(239,68,68,0.2)", color: "#F8F9FA" }}
                  onFocus={(e) => (e.target.style.borderColor = "#EF4444")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(239,68,68,0.2)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "#94A3B8" }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: "#EF4444" }}>{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold mt-2 transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#EF4444,#B91C1C)", color: "#fff" }}
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
            Not an admin?{" "}
            <Link href="/login" className="rank-link font-semibold hover:underline">
              Go to public login
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          © 2025 Mumbai Boxing Association. All rights reserved.
        </p>
      </div>
    </div>
  );
}
