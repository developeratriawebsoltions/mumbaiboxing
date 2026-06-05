"use client";
import { useState } from "react";
import Link from "next/link";

const ROLES = ["Boxer", "Coach", "Academy", "Association", "School", "Taluka"] as const;
type Role = (typeof ROLES)[number];

const ROLE_FIELDS: Record<Role, { label: string; placeholder: string; type?: string }[]> = {
  Boxer: [
    { label: "Full Name", placeholder: "Enter full name" },
    { label: "Date of Birth", placeholder: "", type: "date" },
    { label: "Weight Category", placeholder: "e.g. 60 kg" },
    { label: "Academy / Club", placeholder: "Academy name" },
  ],
  Coach: [
    { label: "Full Name", placeholder: "Enter full name" },
    { label: "Coaching License No.", placeholder: "BFI-XXXXX" },
    { label: "Specialisation", placeholder: "e.g. Amateur, Youth" },
    { label: "Academy / Club", placeholder: "Academy name" },
  ],
  Academy: [
    { label: "Academy Name", placeholder: "Official academy name" },
    { label: "Head Coach", placeholder: "Head coach name" },
    { label: "Address", placeholder: "Full address" },
    { label: "Affiliation No.", placeholder: "MBA-XXXXX" },
  ],
  Association: [
    { label: "Association Name", placeholder: "Official name" },
    { label: "President Name", placeholder: "President's full name" },
    { label: "District", placeholder: "e.g. Mumbai Suburban" },
    { label: "Registration No.", placeholder: "Govt. reg. number" },
  ],
  School: [
    { label: "School Name", placeholder: "Official school name" },
    { label: "Principal Name", placeholder: "Principal's full name" },
    { label: "Address", placeholder: "School address" },
    { label: "UDISE Code", placeholder: "11-digit UDISE code" },
  ],
  Taluka: [
    { label: "Taluka Name", placeholder: "Taluka name" },
    { label: "District", placeholder: "District name" },
    { label: "Contact Person", placeholder: "Full name" },
    { label: "Office Address", placeholder: "Office address" },
  ],
};

const inputStyle = {
  background: "#1E2A3B",
  border: "1px solid rgba(212,160,23,0.18)",
  color: "#F8F9FA",
};

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#D4A017")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(212,160,23,0.18)")}
      />
    </div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("Boxer");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#0B1120" }}>
      {/* Background glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)",
          top: "5%", left: "50%", transform: "translateX(-50%)",
        }}
      />

      <div className="relative w-full max-w-lg animate-fade-up">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg,#D4A017,#F0C040)" }}
          >
            <span className="text-2xl font-black" style={{ color: "#0B1120" }}>MB</span>
          </div>
          <h1 className="text-3xl font-extrabold" style={{ color: "#F8F9FA" }}>Create Account</h1>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Register with Mumbai Boxing Association</p>
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
              Register As
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

          <form className="space-y-4">
            {/* Role-specific fields */}
            {ROLE_FIELDS[role].map((f) => (
              <Field key={f.label} {...f} />
            ))}

            {/* Common fields */}
            <Field label="Email Address" placeholder="you@example.com" type="email" />
            <Field label="Mobile Number" placeholder="+91 XXXXX XXXXX" type="tel" />

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all pr-11"
                  style={inputStyle}
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

            <label className="flex items-start gap-2 cursor-pointer text-xs" style={{ color: "#94A3B8" }}>
              <input type="checkbox" className="mt-0.5 rounded" />
              I agree to the{" "}
              <Link href="/terms" className="rank-link hover:underline">
                Terms & Conditions
              </Link>
            </label>

            <button type="submit" className="btn-gold w-full rounded-xl py-3 text-sm mt-2">
              Register as {role}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#64748B" }}>
            Already have an account?{" "}
            <Link href="/login" className="rank-link font-semibold hover:underline">
              Sign in here
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
