"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = ["Boxer", "Coach", "Academy",] as const;



export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("Boxer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }
      router.push(data.redirect);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FFFFFF" }}
    >
      {/* Background glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold" style={{ color: "#1E293B" }}>
            Welcome Back
          </h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
            Sign in to your MBA portal account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(220,38,38,0.2)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.1)",
          }}
        >
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#DC2626" }}>
              Login As
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="rounded-xl py-2 text-xs font-semibold transition-all duration-150"
                  style={
                    role === r
                      ? { background: "linear-gradient(135deg,#DC2626,#EF4444)", color: "#FFFFFF" }
                      : { background: "#F1F5F9", color: "#64748B", border: "1px solid rgba(220,38,38,0.12)" }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
                Email / Registration ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={role === "Boxer" ? "e.g. boxer@mba.com" : "Enter your email"}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "#F1F5F9",
                  border: "1px solid rgba(220,38,38,0.25)",
                  color: "#1E293B",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(220,38,38,0.18)")}
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
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid rgba(220,38,38,0.25)",
                    color: "#1E293B",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#DC2626")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(220,38,38,0.18)")}
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: "#94A3B8" }}>
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" style={{ color: "#DC2626" }} className="hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: "#EF4444" }}>{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-gold w-full rounded-xl py-3 text-sm mt-2 disabled:opacity-60">
              {loading ? "Signing in..." : `Sign In as ${role}`}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#64748B" }}>
            New to MBA?{" "}
            <Link href="/register" className="rank-link font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#94A3B8" }}>
          © 2025 Mumbai Boxing Association. All rights reserved.
        </p>
      </div>
    </div>
  );
}
