"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Grid2X2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Tournaments", href: "/events" },
    { label: "Rankings", href: "#rankings" },
    { label: "Academies", href: "#academies" },
    { label: "News", href: "#news" },
    { label: "Contact", href: "#contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("#")) {
      return false;
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="relative z-[100] w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-10">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white shadow-sm">
            MB
          </div>

          <div className="leading-none">
            <div className="text-[16px] font-extrabold tracking-[0.08em] text-slate-950">
              MUMBAI{" "}
              <span className="text-red-600">
                BOXING
              </span>
            </div>

            <div className="mt-1 text-[8px] font-semibold tracking-[0.28em] text-slate-500">
              ASSOCIATION
            </div>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative flex h-[76px] items-center text-[13px] font-medium transition-colors duration-200 ${
                  active
                    ? "!text-red-600"
                    : "!text-slate-600 hover:!text-red-600"
                }`}
              >
                {link.label}

                {/* Active + Hover underline */}
                <span
                  className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-red-600 transition-all duration-200 ${
                    active
                      ? "w-8 opacity-100"
                      : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ===================================================== */}
        <div className="hidden items-center gap-3 lg:flex">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-medium !text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
              >
                <Grid2X2 size={15} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                href="/login"
                className="flex h-10 items-center rounded-full px-4 text-sm font-medium !text-slate-600 transition-colors hover:!text-red-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
              >
                Register
                <ArrowRight size={15} />
              </Link>
            </>
          ) : null}
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 !text-slate-700 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* =======================================================
          MOBILE MENU
      ======================================================= */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-[1440px] px-6 py-5">

            <nav className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`border-b border-slate-100 py-3.5 text-sm font-medium transition-colors ${
                      active
                        ? "!text-red-600"
                        : "!text-slate-600 hover:!text-red-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            {!loading && user ? (
              <div className="mt-5 flex gap-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-medium !text-slate-700"
                >
                  <Grid2X2 size={15} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold !text-white"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : !loading ? (
              <div className="mt-5 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 py-3 text-sm font-medium !text-slate-700"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center justify-center rounded-lg bg-red-600 py-3 text-sm font-semibold !text-white"
                >
                  Register
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}