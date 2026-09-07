"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Tournaments", href: "/events" },
  { label: "Rankings", href: "/dashboard/ranking" },
  { label: "Academies", href: "#academies" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

type AuthUser = {
  email: string;
  role: string;
} | null;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.role) {
          setUser({
            email: d.email,
            role: d.role,
          });
        }
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    setOpen(false);

    router.push("/");
    router.refresh();
  }

  const dashboardHref =
    user?.role === "superadmin"
      ? "/dashboard/admin/boxers"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
        >
          {/* Logo Box */}
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-red-600 shadow-sm transition-all duration-300 group-hover:bg-red-700">
            <span className="text-[21px] text-white">🥊</span>

            {/* Small accent */}
            <span className="absolute bottom-0 left-0 h-[3px] w-full bg-red-800" />
          </div>

          {/* Brand */}
          <div className="leading-none">
            <div className="text-[15px] font-black uppercase tracking-[0.08em] text-slate-900 sm:text-[17px]">
              MUMBAI{" "}
              <span className="text-red-600">BOXING</span>
            </div>

            <div className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.28em] text-black">
              Association
            </div>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center md:flex">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group relative px-3.5 py-7
                text-[13px] font-bold text-black uppercase tracking-wide
                transition-colors duration-200
                ${
                  index === 0
                    ? "text-red-600"
                    : "text-slate-900 hover:text-red-600"
                }
              `}
            >
              {link.label}

              {/* Active / Hover Line */}
              <span
                className={`
                  absolute bottom-0 left-3.5 right-3.5 h-[2px]
                  bg-red-600 transition-transform duration-200
                  ${
                    index === 0
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }
                `}
              />
            </Link>
          ))}
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-3 md:flex">
          {!checked ? (
            <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <>
              {/* Dashboard */}
              <Link
                href={dashboardHref}
                className="
                  group flex items-center gap-2
                  rounded-lg border border-slate-300
                  bg-white px-4 py-2.5
                  text-[12px] font-bold uppercase tracking-wide
                  text-slate-900
                  transition-all duration-200
                  hover:border-red-600
                  hover:text-red-600
                "
              >
                <LayoutGrid
                  size={15}
                  strokeWidth={2.2}
                  className="text-red-600"
                />

                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                  rounded-lg bg-red-600
                  px-5 py-2.5
                  text-[12px] font-bold uppercase tracking-wide
                  text-white
                  shadow-sm
                  transition-all duration-200
                  hover:bg-red-700
                  hover:shadow-md
                "
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/register"
              className="
                rounded-lg bg-red-600
                px-5 py-2.5
                text-[12px] font-bold uppercase tracking-wide
                text-white
                shadow-sm
                transition-all duration-200
                hover:bg-red-700
                hover:shadow-md
              "
            >
              Register / Login
            </Link>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-lg border border-slate-200
            text-slate-900
            transition
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-600
            md:hidden
          "
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8">

            {/* Mobile Links */}
            <nav className="space-y-1">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center justify-between
                    rounded-lg px-4 py-3
                    text-sm font-bold uppercase tracking-wide
                    transition
                    ${
                      index === 0
                        ? "bg-red-50 text-red-600"
                        : "text-slate-700 hover:bg-red-50 hover:text-red-600"
                    }
                  `}
                >
                  {link.label}

                  {index === 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile User Actions */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              {user ? (
                <div className="space-y-2">

                  {/* User */}
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold uppercase text-white">
                      {user.email.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.email.split("@")[0]}
                      </p>

                      <p className="text-xs capitalize text-slate-500">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link
                    href={dashboardHref}
                    onClick={() => setOpen(false)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-lg border border-slate-300
                      px-5 py-3
                      text-sm font-bold uppercase tracking-wide
                      text-slate-800
                      transition
                      hover:border-red-600
                      hover:bg-red-50
                      hover:text-red-600
                    "
                  >
                    <LayoutGrid size={16} />
                    Go to Dashboard
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="
                      w-full rounded-lg bg-red-600
                      px-5 py-3
                      text-sm font-bold uppercase tracking-wide
                      text-white
                      transition
                      hover:bg-red-700
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-lg border border-slate-300
                      px-5 py-3
                      text-center text-sm font-bold uppercase tracking-wide
                      text-slate-800
                      transition
                      hover:border-red-600
                      hover:bg-red-50
                      hover:text-red-600
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="
                      rounded-lg bg-red-600
                      px-5 py-3
                      text-center text-sm font-bold uppercase tracking-wide
                      text-white
                      transition
                      hover:bg-red-700
                    "
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}