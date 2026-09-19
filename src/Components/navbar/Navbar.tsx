"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Grid2X2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /*
   * ------------------------------------------------------------
   * AUTH
   * ------------------------------------------------------------
   *
   * Fetch once when the navbar mounts.
   * The navbar keeps its layout stable while this request runs.
   */
  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
          }
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          setUser(data?.user || data || null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * CLOSE MOBILE MENU ON PAGE CHANGE
   * ------------------------------------------------------------
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /*
   * ------------------------------------------------------------
   * LOGOUT
   * ------------------------------------------------------------
   */
  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // Continue to home even if the request fails.
    } finally {
      setUser(null);
      setMobileOpen(false);
      setLoggingOut(false);

      router.replace("/");
      router.refresh();
    }
  }

  /*
   * ------------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------------
   */
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Tournaments", href: "/events" },
    { label: "Rankings", href: "/rankings" },
    { label: "Academies", href: "/academies" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/about") {
      return pathname === "/about" || pathname.startsWith("/about/");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */
  return (
    <header
      className="
        sticky
        top-0
        z-[100]
        w-full
        h-[76px]
        shrink-0
        border-b
        border-white/[0.08]
        bg-[#05070a]/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          max-w-[1440px]
          items-center
          justify-between
          px-6
          lg:px-10
        "
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
        >
          {/* Logo mark */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-red-500/20
              bg-red-600
              text-sm
              font-black
              text-white
              shadow-[0_0_25px_rgba(220,38,38,0.18)]
              transition-all
              duration-200
              group-hover:bg-red-500
              group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]
            "
          >
            MB
          </div>

          {/* Brand */}

          <div className="leading-none">
            <div className="text-[16px] font-extrabold tracking-[0.08em] text-white">
              MUMBAI{" "}
              <span className="text-red-500">
                BOXING
              </span>
            </div>

            <div className="mt-1 text-[8px] font-semibold tracking-[0.28em] text-slate-600">
              ASSOCIATION
            </div>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="hidden h-full items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  group
                  relative
                  flex
                  h-full
                  items-center
                  text-[13px]
                  font-medium
                  transition-colors
                  duration-200
                  ${
                    active
                      ? "!text-red-500"
                      : "!text-slate-400 hover:!text-white"
                  }
                `}
              >
                {link.label}

                {/* Active indicator */}

                <span
                  className={`
                    absolute
                    bottom-0
                    left-1/2
                    h-[2px]
                    -translate-x-1/2
                    rounded-full
                    bg-red-500
                    shadow-[0_0_8px_rgba(239,68,68,0.5)]
                    transition-all
                    duration-200
                    ${
                      active
                        ? "w-8 opacity-100"
                        : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-100"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>

       {/* =====================================================
    DESKTOP ACTIONS
    Stable layout — prevents auth state jumping
===================================================== */}

<div
  className="
    hidden
    h-10
    w-[230px]
    shrink-0
    items-center
    justify-end
    lg:flex
  "
>
  {/* Keep the container mounted at all times.
      Only its contents change. */}

  {loading ? (
    <div
      className="
        h-10
        w-[190px]
        shrink-0
      "
      aria-hidden="true"
    />
  ) : user ? (
    <div
      className="
        flex
        h-10
        shrink-0
        items-center
        justify-end
      "
    >
      {/* Dashboard */}

      <Link
        href="/dashboard"
        className="
          flex
          h-10
          shrink-0
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.03]
          px-5
          text-sm
          font-medium
          !text-slate-300
          transition-all
          duration-200
          hover:border-white/20
          hover:bg-white/[0.06]
          hover:!text-white
        "
      >
        <Grid2X2 size={15} />

        Dashboard
      </Link>

      {/* Logout */}

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="
          ml-3
          flex
          h-10
          shrink-0
          items-center
          gap-2
          rounded-full
          bg-red-600
          px-5
          text-sm
          font-semibold
          !text-white
          shadow-[0_5px_20px_rgba(220,38,38,0.16)]
          transition-all
          duration-200
          hover:bg-red-500
          hover:shadow-[0_8px_25px_rgba(220,38,38,0.25)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <LogOut size={15} />

        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  ) : (
    <div
      className="
        flex
        h-10
        shrink-0
        items-center
        justify-end
      "
    >
      {/* Login */}

      <Link
        href="/login"
        className="
          flex
          h-10
          shrink-0
          items-center
          rounded-full
          px-4
          text-sm
          font-medium
          !text-slate-400
          transition-colors
          hover:!text-white
        "
      >
        Login
      </Link>

      {/* Register */}

      <Link
        href="/register"
        className="
          ml-1
          flex
          h-10
          shrink-0
          items-center
          gap-2
          rounded-full
          bg-red-600
          px-5
          text-sm
          font-semibold
          !text-white
          shadow-[0_5px_20px_rgba(220,38,38,0.16)]
          transition-all
          duration-200
          hover:bg-red-500
          hover:shadow-[0_8px_25px_rgba(220,38,38,0.25)]
        "
      >
        Register

        <ArrowRight size={15} />
      </Link>
    </div>
  )}
</div>
        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/10
            bg-white/[0.03]
            !text-slate-300
            transition-all
            duration-200
            hover:border-white/20
            hover:bg-white/[0.06]
            hover:!text-white
            lg:hidden
          "
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
        <div
          className="
            absolute
            left-0
            right-0
            top-[76px]
            border-t
            border-white/[0.07]
            bg-[#07090d]
            shadow-[0_20px_40px_rgba(0,0,0,0.35)]
            lg:hidden
          "
        >
          <div className="mx-auto max-w-[1440px] px-6 py-5">
            {/* Navigation */}

            <nav className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      border-b
                      border-white/[0.06]
                      py-3.5
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        active
                          ? "!text-red-500"
                          : "!text-slate-400 hover:!text-white"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            {!loading && user ? (
              <div className="mt-5 flex gap-3">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-white/10
                    bg-white/[0.03]
                    py-3
                    text-sm
                    font-medium
                    !text-slate-300
                    transition-all
                    hover:bg-white/[0.06]
                    hover:!text-white
                  "
                >
                  <Grid2X2 size={15} />

                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    py-3
                    text-sm
                    font-semibold
                    !text-white
                    transition-all
                    hover:bg-red-500
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <LogOut size={15} />

                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : !loading ? (
              <div className="mt-5 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/10
                    bg-white/[0.03]
                    py-3
                    text-sm
                    font-medium
                    !text-slate-300
                    transition-all
                    hover:bg-white/[0.06]
                    hover:!text-white
                  "
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-red-600
                    py-3
                    text-sm
                    font-semibold
                    !text-white
                    transition-all
                    hover:bg-red-500
                  "
                >
                  Register

                  <ArrowRight size={15} />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}