"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Landmark,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import { Suspense } from "react";
import styles from "./login.module.css";

const ROLES = [
  { label: "Boxer", icon: Dumbbell },
  { label: "Coach", icon: UserRound },
  { label: "Academy", icon: Landmark },
  { label: "Referee/Judge", icon: Scale },
] as const;

type Role = (typeof ROLES)[number]["label"];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTournamentId = Number(searchParams.get("tournamentId"));
  const tournamentId =
    Number.isInteger(requestedTournamentId) && requestedTournamentId > 0
      ? requestedTournamentId
      : null;

  const [role, setRole] = useState<Role>("Boxer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          remember,
          ...(tournamentId ? { tournamentId } : {}),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.code === "PAYMENT_PENDING") {
          router.push(
            tournamentId
              ? `/complete-registration?tournamentId=${tournamentId}`
              : "/complete-registration"
          );
          return;
        }

        setError(data.error || "Login failed.");
        return;
      }

      router.push(
        tournamentId && data.role === "boxer"
          ? `/dashboard/tournament?tournamentId=${tournamentId}`
          : data.redirect
      );
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginShell}>
        <section className={styles.heroPanel} aria-label="North Bombay District Amateur Boxing Association (NBDABA)">
          <div className={styles.heroRings} aria-hidden="true" />

          <Link className={styles.brand} href="/" aria-label="MBA home">
            <span className={styles.brandLogo} aria-hidden="true">
              MBA
            </span>
            <span className={styles.brandDivider} />
            <span className={styles.brandName}>
              MUMBAI
              <br />
              BOXING
              <br />
              ASSOCIATION
            </span>
          </Link>

          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>
              <Trophy size={15} aria-hidden="true" />
              THE SPIRIT OF CHAMPIONS
            </span>
            <h1>
              More Than
              <br />
              <span>A Sport</span>
            </h1>
            <div className={styles.heroUnderline} />
            <p>
              Building Stronger
              <br />
              Athletes for a
              <br />
              Brighter Tomorrow.
            </p>
            <div className={styles.heroStats}>
              <div>
                <strong>01</strong>
                <span>ONE COMMUNITY</span>
              </div>
              <div>
                <strong>∞</strong>
                <span>LIMITLESS POTENTIAL</span>
              </div>
            </div>
          </div>

          <div className={styles.heroBottom}>
            <ShieldCheck size={17} aria-hidden="true" />
            <span>EMPOWERING THE NEXT GENERATION</span>
          </div>
        </section>

        <section className={styles.loginPanel} aria-label="Sign in">
          <div className={styles.loginCard}>
            <header className={styles.loginHeader}>
              <div className={styles.mobileBrand}>
                <span className={styles.mobileLogo}>MBA</span>
                <span>NORTH BOMBAY DISTRICT AMATEUR BOXING ASSOCIATION</span>
              </div>
              <div className={styles.welcomeMark} aria-hidden="true">
                <LockKeyhole size={20} />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to your MBA portal account</p>
              {!tournamentId && (
                <Link className={styles.tournamentLink} href="/events">
                  Browse tournaments
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </header>

            <div className={styles.formDivider} />

            {tournamentId && (
              <div className={styles.tournamentNotice}>
                <p className={styles.tournamentTitle}>
                  Continue your tournament entry
                </p>
                <p>
                  Sign in with the boxer account you want to register. After
                  sign-in, you’ll continue to the selected event.
                </p>
                <Link href={`/events/${tournamentId}`}>
                  Back to event details
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <span className={styles.sectionLabel}>LOGIN AS</span>

              {tournamentId ? (
                <div className={styles.tournamentRole}>Boxer account</div>
              ) : (
                <div className={styles.roleSelector}>
                  {ROLES.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setRole(label);
                        setError("");
                      }}
                      className={`${styles.roleOption} ${
                        role === label ? styles.roleActive : ""
                      }`}
                      aria-pressed={role === label}
                      disabled={loading}
                    >
                      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="login-email">Email / Registration ID</label>
                <div className={styles.inputWrap}>
                  <Mail
                    size={21}
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter email or registration ID"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="login-password">Password</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole
                    size={21}
                    className={styles.inputIcon}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
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
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden="true" />
                    ) : (
                      <Eye size={20} aria-hidden="true" />
                    )}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberOption}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span className={styles.customCheckbox} aria-hidden="true" />
                  <span>Remember me</span>
                </label>
                <Link
                  href={
                    tournamentId
                      ? `/forgot-password?tournamentId=${tournamentId}`
                      : "/forgot-password"
                  }
                  className={styles.forgotLink}
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className={styles.formMessage} role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                <span>
                  {loading ? "Signing in..." : `Sign In as ${role}`}
                </span>
                {!loading && <ArrowRight size={21} aria-hidden="true" />}
              </button>

              <div className={styles.registerPrompt}>
                <span aria-hidden="true" />
                <p>
                  New to MBA?{" "}
                  <Link
                    href={
                      tournamentId
                        ? `/register?tournamentId=${tournamentId}`
                        : "/register"
                    }
                  >
                    Register here
                  </Link>
                </p>
                <span aria-hidden="true" />
              </div>
            </form>
          </div>

          <footer className={styles.loginFooter}>
            © 2025 North Bombay District Amateur Boxing Association (NBDABA). All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className={styles.loginPage} />}>
      <LoginForm />
    </Suspense>
  );
}
