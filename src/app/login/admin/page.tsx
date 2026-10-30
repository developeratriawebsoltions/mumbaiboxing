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
import styles from "./admin-login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials.");
        return;
      }

      router.push(data.redirect || "/dashboard/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.adminPage}>
      <div className={styles.adminLayout}>
        <section className={styles.adminHero} aria-label="Admin portal">
          <div className={styles.heroArt} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />

          <Link className={styles.adminBrand} href="/" aria-label="MBA homepage">
            <span className={styles.adminBrandLogo}>
              M<span>B</span>A
            </span>
            <span className={styles.adminBrandDivider} />
            <span className={styles.adminBrandName}>
              MUMBAI
              <br />
              BOXING
              <br />
              ASSOCIATION
            </span>
          </Link>

          <div className={styles.adminHeroCopy}>
            <span className={styles.adminEyebrow}>ADMIN PORTAL</span>
            <h1>
              Manage{" "}
              <br />
              Today for a{" "}
              <br />
              <span>Stronger</span>{" "}
              <br />
              <span>Tomorrow</span>
            </h1>
            <div className={styles.adminHeroUnderline} />
            <p>
              Secure. Organized. Empowering
              <br className={styles.desktopOnly} />
              Mumbai’s Boxing Community.
            </p>
          </div>

          <div className={styles.heroBottomLabel}>
            <span className={styles.heroBottomDot} />
            SECURE ADMINISTRATION · STRONGER COMMUNITY
          </div>
        </section>

        <section className={styles.adminLoginArea} aria-label="Admin sign in">
          <div className={styles.adminLoginCard}>
            <div className={styles.securityWatermark} aria-hidden="true">
              <ShieldCheck />
            </div>

            <header className={styles.adminLoginHeader}>
              <div className={styles.adminSecurityIcon}>
                <ShieldCheck size={34} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h2>Admin Login</h2>
              <p>North Bombay District Amateur Boxing Association (NBDABA)</p>
            </header>

            <form onSubmit={handleSubmit}>
              <div className={styles.adminFormGroup}>
                <label htmlFor="admin-email">Admin Email</label>
                <div className={styles.adminInputWrap}>
                  <Mail
                    size={21}
                    className={styles.adminInputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
              </div>

              <div className={styles.adminFormGroup}>
                <label htmlFor="admin-password">Password</label>
                <div className={styles.adminInputWrap}>
                  <LockKeyhole
                    size={21}
                    className={styles.adminInputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    className={styles.adminPasswordToggle}
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff size={21} aria-hidden="true" />
                    ) : (
                      <Eye size={21} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.adminFormOptions}>
                <label className={styles.adminRemember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span className={styles.adminCheckbox} aria-hidden="true" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.adminForgot}>
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className={styles.adminError} role="alert">
                  {error}
                </p>
              )}

              <button
                className={styles.adminSubmit}
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Signing in..." : "Sign in as Admin"}</span>
                {!loading && <ArrowRight size={23} aria-hidden="true" />}
              </button>

              <div className={styles.adminOrDivider}>
                <span />
                <p>OR</p>
                <span />
              </div>

              <Link href="/login" className={styles.memberLoginLink}>
                <ArrowLeft size={22} aria-hidden="true" />
                <span>Back to member login</span>
              </Link>
            </form>
          </div>

          <footer className={styles.adminFooter}>
            © 2025 North Bombay District Amateur Boxing Association (NBDABA). All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}
