"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/superadmin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid Super Admin credentials.");
        return;
      }

      router.push("/dashboard/superadmin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F3F3F1] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071426] shadow-lg">
            <ShieldCheck
              size={30}
              className="text-white"
            />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#171717]">
            Super Admin Portal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Mumbai Boxing Association
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-[#E5E5E2] bg-white p-8 shadow-xl">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#171717]">
              Secure Sign In
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Authorized Super Admin access only.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="admin@mba.com"
                required
                className="w-full rounded-xl border border-[#D9D9D5] bg-[#FAFAF8] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#DC2626] focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[#D9D9D5] bg-[#FAFAF8] px-4 py-3 pr-12 text-sm text-[#171717] outline-none transition focus:border-[#DC2626] focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#071426] py-3.5 text-sm font-bold text-white transition hover:bg-[#10233d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign in as Super Admin"}
            </button>
          </form>
        </div>

        {/* BACK */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#DC2626]"
          >
            <ArrowLeft size={15} />
            Back to member login
          </Link>
        </div>

      </div>
    </main>
  );
}