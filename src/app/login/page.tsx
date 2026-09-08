"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  "Boxer",
  "Coach",
  "Academy",
  "Referee/Judge",
] as const;

type Role = (typeof ROLES)[number];

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("Boxer");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.push(data.redirect);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(220,38,38,0.055) 0%, transparent 70%)",
        }}
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative w-full max-w-[620px]">

        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#94A3B8]">
            Sign in to your MBA portal account
          </p>

        </div>

        {/* ===================================================
            LOGIN CARD — FLAT
        =================================================== */}

        <div
          className="rounded-[24px] bg-white p-6 sm:p-8"
          style={{
            border: "1px solid rgba(220,38,38,0.22)",
            boxShadow: "none",
          }}
        >

          {/* =================================================
              LOGIN AS
          ================================================= */}

          <div className="mb-7">

            <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#DC2626]">
              Login As
            </label>

            {/* FOUR ROLES — ONE ROW */}

            <div className="grid grid-cols-4 gap-2">

              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError("");
                  }}
                  className="min-w-0 rounded-full border px-2 py-3 text-[11px] font-semibold transition-colors duration-150 sm:text-xs"
                  style={
                    role === r
                      ? {
                          background: "#EF3038",
                          borderColor: "#EF3038",
                          color: "#FFFFFF",
                        }
                      : {
                          background: "#F1F5F9",
                          borderColor:
                            "rgba(220,38,38,0.14)",
                          color: "#64748B",
                        }
                  }
                >
                  {r}
                </button>
              ))}

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-[#94A3B8]">
                Email / Registration ID
              </label>

              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder={
                  role === "Boxer"
                    ? "e.g. boxer@mba.com"
                    : role === "Referee/Judge"
                      ? "e.g. referee@mba.com"
                      : "Enter your email"
                }
                className="w-full rounded-full bg-[#F1F5F9] px-5 py-3.5 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8]"
                style={{
                  border:
                    "1px solid rgba(220,38,38,0.25)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "#DC2626";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(220,38,38,0.25)";
                }}
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-[#94A3B8]">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPass ? "text" : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-full bg-[#F1F5F9] px-5 py-3.5 pr-20 text-sm text-[#1E293B] outline-none transition-colors placeholder:text-[#94A3B8]"
                  style={{
                    border:
                      "1px solid rgba(220,38,38,0.25)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "#DC2626";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(220,38,38,0.25)";
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#94A3B8] hover:text-[#DC2626]"
                >
                  {showPass ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* =================================================
                REMEMBER / FORGOT
            ================================================= */}

            <div className="flex items-center justify-between text-xs">

              <label className="flex cursor-pointer items-center gap-2 text-[#94A3B8]">

                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />

                Remember me

              </label>

              <Link
                href="/forgot-password"
                className="text-[#DC2626] hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-center text-xs"
                style={{
                  background:
                    "rgba(239,68,68,0.05)",
                  border:
                    "1px solid rgba(239,68,68,0.15)",
                  color: "#EF4444",
                }}
              >
                {error}
              </div>
            )}

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full py-3.5 text-sm font-bold text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "#EF2028",
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background =
                    "#DC2626";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background =
                    "#EF2028";
                }
              }}
            >
              {loading
                ? "Signing in..."
                : `Sign In as ${role}`}
            </button>

          </form>

          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="mt-6 text-center text-xs text-[#64748B]">

            New to MBA?{" "}

            <Link
              href="/register"
              className="font-semibold text-[#DC2626] hover:underline"
            >
              Register here
            </Link>

          </p>

        </div>

        {/* ===================================================
            COPYRIGHT
        =================================================== */}

        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          © 2025 Mumbai Boxing Association. All rights reserved.
        </p>

      </div>

    </main>
  );
}