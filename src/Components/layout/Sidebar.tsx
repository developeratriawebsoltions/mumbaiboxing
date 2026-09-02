"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  UserRound,
  FolderOpen,
  HeartPulse,
  Award,
  Trophy,
  BarChart3,
  CreditCard,
  Users,
  Building2,
  FileText,
  LogOut,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type MenuSection = {
  group: string;
  items: MenuItem[];
};

/* =========================================================
   MENU CONFIGURATION
   ========================================================= */

const MENUS: Record<string, MenuSection[]> = {
  /* =======================================================
     SUPER ADMIN
     ======================================================= */

  superadmin: [
    {
      group: "Members",
      items: [
        {
          name: "All Boxers",
          href: "/dashboard/admin/boxers",
          icon: Users,
        },
        {
          name: "All Coaches",
          href: "/dashboard/admin/coaches",
          icon: UserRound,
        },
        {
          name: "All Academies",
          href: "/dashboard/admin/academies",
          icon: Building2,
        },
      ],
    },

    {
      group: "Management",
      items: [
        {
          name: "Tournaments",
          href: "/dashboard/admin/tournaments",
          icon: Trophy,
        },
        {
          name: "Documents",
          href: "/dashboard/documents",
          icon: FileText,
        },
      ],
    },
  ],

  /* =======================================================
     BOXER
     ======================================================= */

  boxer: [
    {
      group: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/boxer",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      group: "My Account",
      items: [
        {
          name: "My Profile",
          href: "/dashboard/boxer",
          icon: UserRound,
        },
        {
          name: "My Documents",
          href: "/dashboard/documents",
          icon: FolderOpen,
        },
        {
          name: "Medical Records",
          href: "/dashboard/medical",
          icon: HeartPulse,
        },
        {
          name: "Certificates",
          href: "/dashboard/certificates",
          icon: Award,
        },
      ],
    },

    {
      group: "Activity",
      items: [
        {
          name: "Tournaments",
          href: "/dashboard/tournament",
          icon: Trophy,
        },
        {
          name: "Rankings",
          href: "/dashboard/ranking",
          icon: BarChart3,
        },
        {
          name: "Payment Receipts",
          href: "/dashboard/payment",
          icon: CreditCard,
        },
      ],
    },
  ],

  /* =======================================================
     COACH
     ======================================================= */

  coach: [
    {
      group: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/coach",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      group: "My Account",
      items: [
        {
          name: "My Profile",
          href: "/dashboard/coach",
          icon: UserRound,
        },
        {
          name: "My Documents",
          href: "/dashboard/documents",
          icon: FolderOpen,
        },
        {
          name: "My Boxers",
          href: "/dashboard/coach/boxers",
          icon: Users,
        },
        {
          name: "Certificates",
          href: "/dashboard/certificates",
          icon: Award,
        },
      ],
    },

    {
      group: "Activity",
      items: [
        {
          name: "Tournaments",
          href: "/dashboard/tournament",
          icon: Trophy,
        },
        {
          name: "Rankings",
          href: "/dashboard/ranking",
          icon: BarChart3,
        },
        {
          name: "Payment Receipts",
          href: "/dashboard/payment",
          icon: CreditCard,
        },
      ],
    },
  ],

  /* =======================================================
     ACADEMY
     ======================================================= */

  academy: [
    {
      group: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/academy",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      group: "Academy",
      items: [
        {
          name: "Boxers",
          href: "/dashboard/boxer",
          icon: Users,
        },
        {
          name: "Coaches",
          href: "/dashboard/coach",
          icon: UserRound,
        },
      ],
    },

    {
      group: "Operations",
      items: [
        {
          name: "Tournament",
          href: "/dashboard/tournament",
          icon: Trophy,
        },
        {
          name: "Payment",
          href: "/dashboard/payment",
          icon: CreditCard,
        },
        {
          name: "Documents",
          href: "/dashboard/documents",
          icon: FileText,
        },
      ],
    },
  ],
};

/* =========================================================
   SIDEBAR
   ========================================================= */

export default function Sidebar({
  role: propRole,
}: {
  role?: string;
}) {
  const path = usePathname();
  const router = useRouter();

  const [role, setRole] = useState(propRole ?? "");
  const [email, setEmail] = useState("");

  /* =======================================================
     LOAD CURRENT USER
     ======================================================= */

  useEffect(() => {
    if (propRole) {
      setRole(propRole);
    }

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.role) {
          setRole(data.role);
        }

        if (data.email) {
          setEmail(data.email);
        }
      })
      .catch(() => {});
  }, [propRole]);

  /* =======================================================
     LOGOUT
     ======================================================= */

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Continue redirect even if request fails
    } finally {
      router.push("/login");
    }
  }

  /* =======================================================
     ROLE
     ======================================================= */

  const normalizedRole = (
    role || "superadmin"
  ).toLowerCase();

  const menu =
    MENUS[normalizedRole] ??
    MENUS.superadmin;

  /* =======================================================
     USER INITIAL
     ======================================================= */

  const initial =
    email?.charAt(0).toUpperCase() ||
    role?.charAt(0).toUpperCase() ||
    "S";

  /* =======================================================
     DISPLAY ROLE
     ======================================================= */

  const displayRole =
    normalizedRole === "superadmin"
      ? "Super Admin"
      : normalizedRole.charAt(0).toUpperCase() +
        normalizedRole.slice(1);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <aside
      className="
        hidden
        lg:flex
        w-[270px]
        min-h-screen
        bg-[#071426]
        text-white
        flex-col
        shrink-0
      "
    >
      {/* ===================================================
          BRAND
          =================================================== */}

      <div className="px-6 pt-8 pb-7">
        <Link
          href={
            normalizedRole === "boxer"
              ? "/dashboard/boxer"
              : "/dashboard"
          }
          className="block"
        >
          <h1
            className="
              text-[25px]
              leading-[1.08]
              font-extrabold
              tracking-tight
              text-white
            "
          >
            MUMBAI
            <br />
            BOXING
            <br />
            ASSOCIATION
          </h1>
        </Link>

        <div className="mt-7 h-px bg-white/10" />
      </div>

      {/* ===================================================
          NAVIGATION
          =================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        {menu.map((section) => (
          <div
            key={section.group}
            className="mb-7"
          >
            {/* Section title */}

            <p
              className="
                px-3
                mb-3
                text-[12px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-slate-400
              "
            >
              {section.group}
            </p>

            {/* Menu items */}

            <div className="space-y-1">
              {section.items.map((item) => {
                /*
                 * Exact route match.
                 */

                const isActive =
                  path === item.href;

                /*
                 * Lucide component.
                 */

                const Icon = item.icon;

                return (
                  <Link
                    key={`${item.href}-${item.name}`}
                    href={item.href}
                    className={[
                      "group",
                      "flex",
                      "items-center",
                      "gap-4",
                      "rounded-xl",
                      "px-3",
                      "py-3",
                      "text-[15px]",
                      "font-medium",
                      "transition-all",
                      "duration-200",

                      isActive
                        ? [
                            "bg-[#ed1c24]",
                            "text-white",
                            "shadow-lg",
                            "shadow-red-900/20",
                          ].join(" ")
                        : [
                            "text-slate-200",
                            "hover:bg-white/5",
                            "hover:text-white",
                          ].join(" "),
                    ].join(" ")}
                  >
                    {/* Icon */}

                    <span
                      className={[
                        "w-6",
                        "h-6",
                        "shrink-0",
                        "flex",
                        "items-center",
                        "justify-center",
                        "transition-colors",

                        isActive
                          ? "text-white"
                          : "text-slate-300 group-hover:text-white",
                      ].join(" ")}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.9}
                      />
                    </span>

                    {/* Text */}

                    <span className="truncate">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ===================================================
          USER AREA
          =================================================== */}

      <div className="px-3 pb-4">
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-3
          "
        >
          <div className="flex items-center gap-3">

            {/* Avatar */}

            <div
              className="
                w-11
                h-11
                rounded-full
                bg-[#ed1c24]
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-base
                shrink-0
              "
            >
              {initial}
            </div>

            {/* User details */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-sm
                  font-semibold
                  text-white
                  truncate
                "
              >
                {email || "Member"}
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-0.5
                  capitalize
                "
              >
                {displayRole}
              </p>
            </div>

            {/* Chevron */}

            <ChevronDown
              size={18}
              strokeWidth={1.8}
              className="text-slate-400 shrink-0"
            />
          </div>
        </div>

        {/* =================================================
            SIGN OUT
            ================================================= */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-white/10
            px-4
            py-3
            text-left
            text-sm
            font-medium
            text-red-400
            hover:bg-red-500/10
            hover:text-red-300
            transition-colors
            flex
            items-center
          "
        >
          <LogOut
            size={17}
            strokeWidth={1.9}
            className="mr-3 shrink-0"
          />

          Sign out
        </button>
      </div>
    </aside>
  );
}