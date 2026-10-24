"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import styles from "./superadmin-login.module.css";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid Super Admin credentials.");
        return;
      }

      router.push(data.redirect || "/dashboard/superadmin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.superAdminPage}>
      <div className={styles.superAdminLayout}>
        <div className={styles.boxingArt} aria-hidden="true" />
        <div className={styles.boxingArtOverlay} aria-hidden="true" />

        <Link href="/" className={styles.superAdminBrand} aria-label="MBA home">
          <span className={styles.superAdminLogo}>
            M<span>B</span>A
          </span>
          <span className={styles.superAdminBrandDivider} />
          <span className={styles.superAdminBrandName}>
            MUMBAI
            <br />
            BOXING
            <br />
            ASSOCIATION
          </span>
        </Link>

        <div className={styles.superAdminWatermark} aria-hidden="true">
          <ShieldCheck />
        </div>

        <section className={styles.superAdminContent} aria-label="Super Admin sign in">
          <header className={styles.superAdminHeader}>
            <div className={styles.superAdminShield}>
              <ShieldCheck size={31} strokeWidth={1.9} aria-hidden="true" />
            </div>
            <h1>
              Super Admin <span>Portal</span>
            </h1>
            <p>Mumbai Boxing Association</p>
          </header>

          <div className={styles.superAdminCard}>
            <div className={styles.superAdminCardHeading}>
              <h2>Secure Sign In</h2>
              <p>Authorized Super Admin access only.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.superAdminField}>
                <label htmlFor="super-admin-email">Email</label>
                <div className={styles.superAdminInputWrap}>
                  <Mail
                    size={21}
                    className={styles.superAdminInputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="super-admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
              </div>

              <div className={styles.superAdminField}>
                <label htmlFor="super-admin-password">Password</label>
                <div className={styles.superAdminInputWrap}>
                  <LockKeyhole
                    size={21}
                    className={styles.superAdminInputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="super-admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    className={styles.superAdminEye}
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className={styles.superAdminError} role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={styles.superAdminSubmit}
                disabled={loading}
              >
                <span>
                  {loading ? "Signing in..." : "Sign in as Super Admin"}
                </span>
                {!loading && <ArrowRight size={21} aria-hidden="true" />}
              </button>
            </form>
          </div>

          <Link href="/login" className={styles.superAdminBack}>
            <ArrowLeft size={19} aria-hidden="true" />
            <span>Back to member login</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
