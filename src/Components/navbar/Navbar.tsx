
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Search,
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

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Governance",
    href: "/governance",
    children: [
      { label: "Executive Committee", href: "/governance#executive-committee" },
      { label: "Athletes Commission", href: "/governance#athletes-commission" },
      {
        label: "Internal Complaints Committee (POSH / ICC)",
        href: "/governance#icc",
      },
      { label: "Selection Committee", href: "/governance#selection-committee" },
      {
        label: "Technical & Officiating Commission",
        href: "/governance#technical-commission",
      },
      {
        label: "Grievance & Disciplinary Body",
        href: "/governance#grievance-committee",
      },
      {
        label: "Medical & Athlete Safety Commission",
        href: "/governance#medical-commission",
      },
    ],
  },
  { label: "Tournaments", href: "/events" },
  { label: "Rankings", href: "/rankings" },
  { label: "Academies", href: "/academies" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const governanceMenuRef = useRef<HTMLDivElement>(null);
  const mobileGovernanceMenuRef = useRef<HTMLDivElement>(null);

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
          if (!cancelled) setUser(null);
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          setUser(data?.user || data || null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function closeGovernanceMenu(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !governanceMenuRef.current?.contains(event.target) &&
        !mobileGovernanceMenuRef.current?.contains(event.target)
      ) {
        setGovernanceOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeGovernanceMenu);
    return () => {
      document.removeEventListener("pointerdown", closeGovernanceMenu);
    };
  }, []);

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
      // Continue with local logout.
    } finally {
      setUser(null);
      setMobileOpen(false);
      setLoggingOut(false);
      router.replace("/");
      router.refresh();
    }
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <header
      className="
        sticky top-0 z-[100]
        h-[76px] w-full
        border-b border-[#e8ebef]
        bg-white
        shadow-[0_3px_18px_rgba(0,0,0,0.045)]
      "
    >
      <div
        className="
          mx-auto flex h-full
          w-full max-w-[1920px]
          items-center justify-between
          gap-4 px-5
          md:px-8 lg:px-10
          xl:px-12 2xl:px-16
        "
      >
        {/* LOGO */}
        <Link
          href="/"
          className="
            group flex shrink-0
            items-center gap-3
          "
        >
          <div
            className="
              relative h-[54px] w-[54px]
              shrink-0 overflow-hidden
              rounded-full
              transition-transform duration-200
              group-hover:scale-105
            "
          >
            <Image
              src="/logo/download.webp"
              alt="Mumbai Boxing Association"
              fill
              priority
              sizes="54px"
              className="object-contain"
            />
          </div>

          <div className="leading-none">
            <div
              className="
                whitespace-nowrap
                text-[16px] font-black
                tracking-[0.015em]
                text-[#071015]
                xl:text-[19px]
              "
            >
              MUMBAI{" "}
              <span className="text-[#f50919]">
                BOXING
              </span>
            </div>

            <div
              className="
                mt-1.5 text-[9px]
                font-bold uppercase
                tracking-[0.30em]
                text-[#536174]
              "
            >
              ASSOCIATION
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="
            hidden h-full min-w-0
            items-center justify-center
            gap-2 lg:flex
            xl:gap-4 2xl:gap-6
          "
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);

            if (link.children) {
              return (
                <div
                  key={link.href}
                  ref={governanceMenuRef}
                  className="relative flex h-full shrink-0 items-center"
                >
                  <button
                    type="button"
                    aria-expanded={governanceOpen}
                    aria-controls="governance-desktop-menu"
                    onClick={() => setGovernanceOpen((open) => !open)}
                    className={`group relative flex h-full items-center gap-1 whitespace-nowrap text-[12px] font-medium tracking-[-0.01em] transition-colors duration-200 xl:text-[14px] ${
                      active || governanceOpen
                        ? "text-[#f50919]"
                        : "text-[#111827] hover:text-[#f50919]"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        governanceOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[#f50919] transition-all duration-200 ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }`}
                    />
                  </button>

                  <div
                    id="governance-desktop-menu"
                    className={`absolute left-1/2 top-full z-[110] w-[320px] -translate-x-1/2 rounded-xl border border-[#e8ebef] bg-white p-2 shadow-[0_20px_45px_rgba(0,0,0,0.16)] ${
                      governanceOpen ? "block" : "hidden"
                    }`}
                  >
                    <Link
                      href="/governance"
                      onClick={() => setGovernanceOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-bold text-[#101820] transition-colors hover:bg-red-50 hover:text-[#f50919]"
                    >
                      Governance overview
                    </Link>
                    <div className="my-1 border-t border-[#edf0f3]" />
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setGovernanceOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium leading-5 text-[#526174] transition-colors hover:bg-red-50 hover:text-[#f50919]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={`
                  group relative flex h-full
                  shrink-0 items-center
                  whitespace-nowrap
                  text-[12px] font-medium
                  tracking-[-0.01em]
                  transition-colors duration-200
                  xl:text-[14px]
                  ${
                    active
                      ? "!text-[#f50919]"
                      : "!text-[#111827] hover:!text-[#f50919]"
                  }
                `}
              >
                {link.label}

                <span
                  className={`
                    absolute bottom-0 left-0
                    h-[3px] rounded-full
                    bg-[#f50919]
                    transition-all duration-200
                    ${
                      active
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div
          className="
            hidden shrink-0 items-center
            justify-end gap-3
            lg:flex
          "
        >
          {/* Search icon */}
          <Link
            href="/search"
            aria-label="Search"
            className="
              flex h-[42px] w-[42px]
              shrink-0 items-center justify-center
              rounded-full
              border border-[#d8dde4]
              bg-white !text-[#101820]
              transition-all duration-200
              hover:border-[#f50919]
              hover:!text-[#f50919]
            "
          >
            <Search size={19} strokeWidth={2.2} />
          </Link>

          <div
            className="
              mx-1 h-[30px] w-px
              bg-[#e1e5ea]
            "
          />

          {loading ? (
            <div
              className="h-[42px] w-[195px]"
              aria-hidden="true"
            />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="
                  flex h-[42px] items-center
                  justify-center gap-2
                  whitespace-nowrap rounded-full
                  border border-[#aab3bf]
                  bg-white px-4
                  text-[13px] font-semibold
                  !text-[#101820]
                  transition-all
                  hover:border-[#f50919]
                  hover:!text-[#f50919]
                "
              >
                <Grid2X2 size={16} />
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  flex h-[42px] items-center
                  justify-center gap-2
                  whitespace-nowrap rounded-full
                  bg-[#f50919] px-5
                  text-[13px] font-bold
                  !text-white
                  transition-all duration-200
                  hover:bg-[#d50012]
                  disabled:opacity-60
                "
              >
                <LogOut size={16} />
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="
                  flex h-[42px] items-center
                  justify-center
                  rounded-full
                  border border-[#aab3bf]
                  bg-white px-5
                  text-[13px] font-semibold
                  !text-[#101820]
                  transition-all duration-200
                  hover:border-[#f50919]
                  hover:!text-[#f50919]
                "
              >
                Login
              </Link>

              <Link
                href="/register"
                className="
                  flex h-[42px] items-center
                  justify-center gap-3
                  whitespace-nowrap
                  rounded-full
                  bg-[#f50919] px-6
                  text-[13px] font-bold
                  !text-white
                  shadow-[0_5px_18px_rgba(245,9,25,0.18)]
                  transition-all duration-200
                  hover:bg-[#d50012]
                  hover:shadow-[0_7px_22px_rgba(245,9,25,0.28)]
                "
              >
                Register
                <ArrowRight size={17} />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen((prev) => !prev);
            setGovernanceOpen(false);
          }}
          aria-label={
            mobileOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mba-mobile-menu"
          className="
            flex h-10 w-10
            shrink-0 items-center justify-center
            rounded-lg
            border border-[#e1e5ea]
            bg-white !text-[#101820]
            transition-colors
            hover:border-[#f50919]
            lg:hidden
          "
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div
          id="mba-mobile-menu"
          className="
            absolute left-0 right-0
            top-full z-50
            max-h-[calc(100dvh-76px)]
            overflow-y-auto
            border-t border-[#e8ebef]
            bg-white
            shadow-[0_20px_40px_rgba(0,0,0,0.12)]
            lg:hidden
          "
        >
          <div className="mx-auto max-w-[1440px] px-6 py-5">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);

                if (link.children) {
                  return (
                    <div
                      key={link.href}
                      ref={mobileGovernanceMenuRef}
                      className="border-b border-[#edf0f3]"
                    >
                      <button
                        type="button"
                        aria-expanded={governanceOpen}
                        aria-controls="governance-mobile-menu"
                        onClick={() =>
                          setGovernanceOpen((open) => !open)
                        }
                        className={`flex w-full items-center justify-between py-3.5 text-left text-[14px] font-semibold transition-colors ${
                          active || governanceOpen
                            ? "text-[#f50919]"
                            : "text-[#101820] hover:text-[#f50919]"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={17}
                          className={`transition-transform ${
                            governanceOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {governanceOpen && (
                        <div
                          id="governance-mobile-menu"
                          className="mb-3 ml-3 border-l-2 border-red-100 pl-3"
                        >
                          <Link
                            href="/governance"
                            onClick={() => {
                              setMobileOpen(false);
                              setGovernanceOpen(false);
                            }}
                            className="block py-2 text-sm font-bold text-[#101820]"
                          >
                            Governance overview
                          </Link>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => {
                                setMobileOpen(false);
                                setGovernanceOpen(false);
                              }}
                              className="block py-2 text-sm text-[#526174] transition-colors hover:text-[#f50919]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setMobileOpen(false);
                      setGovernanceOpen(false);
                    }}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`
                      border-b border-[#edf0f3]
                      py-3.5 text-[14px]
                      font-semibold
                      transition-colors
                      ${
                        active
                          ? "!text-[#f50919]"
                          : "!text-[#101820] hover:!text-[#f50919]"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* MOBILE ACTIONS */}
            {!loading && (
              <div className="mt-6 flex gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="
                        flex h-11 flex-1
                        items-center justify-center gap-2
                        rounded-full
                        border border-[#b8c0ca]
                        text-sm font-semibold
                        !text-[#101820]
                      "
                    >
                      <Grid2X2 size={16} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="
                        flex h-11 flex-1
                        items-center justify-center gap-2
                        rounded-full bg-[#f50919]
                        text-sm font-bold
                        !text-white
                        disabled:opacity-60
                      "
                    >
                      <LogOut size={16} />
                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="
                        flex h-11 flex-1
                        items-center justify-center
                        rounded-full
                        border border-[#b8c0ca]
                        text-sm font-semibold
                        !text-[#101820]
                      "
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="
                        flex h-11 flex-1
                        items-center justify-center gap-2
                        rounded-full bg-[#f50919]
                        text-sm font-bold
                        !text-white
                      "
                    >
                      Register
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
