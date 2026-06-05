"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = ["Boxer", "Coach", "Academy", "Association", "School", "Taluka"] as const;

const CREDENTIALS: Record<string, { email: string; password: string; redirect: string }> = {
  Boxer:       { email: "boxer@mba.com",       password: "boxer@123",   redirect: "/dashboard/boxer" },
  Coach:       { email: "coach@mba.com",       password: "coach@123",   redirect: "/dashboard/coach" },
  Academy:     { email: "academy@mba.com",     password: "academy@123", redirect: "/dashboard/academy" },
  Association: { email: "association@mba.com", password: "assoc@123",   redirect: "/dashboard/association" },
  School:      { email: "school@mba.com",      password: "school@123",  redirect: "/dashboard/school" },
  Taluka:      { email: "taluka@mba.com",      password: "taluka@123",  redirect: "/dashboard/taluka" },
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("Boxer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cred = CREDENTIALS[role];
    if (email === cred.email && password === cred.password) {
      localStorage.setItem("mba_role", role.toLowerCase());
      router.push(cred.redirect);
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0B1120" }}
    >
      {/* Background glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg,#D4A017,#F0C040)" }}
          >
            <span className="text-2xl font-black" style={{ color: "#0B1120" }}>MB</span>
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#F8F9FA" }}>
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
            background: "#111827",
            border: "1px solid rgba(212,160,23,0.2)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#D4A017" }}>
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
                      ? { background: "linear-gradient(135deg,#D4A017,#F0C040)", color: "#0B1120" }
                      : { background: "#1E2A3B", color: "#94A3B8", border: "1px solid rgba(212,160,23,0.12)" }
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
                  background: "#1E2A3B",
                  border: "1px solid rgba(212,160,23,0.18)",
                  color: "#F8F9FA",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4A017")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(212,160,23,0.18)")}
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
                    background: "#1E2A3B",
                    border: "1px solid rgba(212,160,23,0.18)",
                    color: "#F8F9FA",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4A017")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(212,160,23,0.18)")}
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
              <Link href="/forgot-password" className="rank-link hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: "#EF4444" }}>{error}</p>
            )}
            <button type="submit" className="btn-gold w-full rounded-xl py-3 text-sm mt-2">
              Sign In as {role}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#64748B" }}>
            New to MBA?{" "}
            <Link href="/register" className="rank-link font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#475569" }}>
          © 2025 Mumbai Boxing Association. All rights reserved.
        </p>
      </div>
    </div>
  );
}
