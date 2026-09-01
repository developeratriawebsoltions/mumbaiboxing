"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = { name: string; href: string };
type MenuSection = { group: string; items: MenuItem[] };

const MENUS: Record<string, MenuSection[]> = {
  superadmin: [
    { group: "Members", items: [
      { name: "All Boxers", href: "/dashboard/admin/boxers" },
      { name: "All Coaches", href: "/dashboard/admin/coaches" },
      { name: "All Academies", href: "/dashboard/admin/academies" },
    ]},
    { group: "Management", items: [
      { name: "Tournaments", href: "/dashboard/admin/tournaments" },
      { name: "Documents", href: "/dashboard/documents" },
    ]},
  ],

  boxer: [
    { group: "My Profile", items: [
      { name: "Dashboard", href: "/dashboard/boxer" },
      { name: "My Documents", href: "/dashboard/documents" },
      { name: "Medical Records", href: "/dashboard/medical" },
      { name: "Certificates", href: "/dashboard/certificates" },
    ]},
    { group: "Activity", items: [
      { name: "Tournaments", href: "/dashboard/tournament" },
      { name: "Rankings", href: "/dashboard/ranking" },
      { name: "Payment Receipts", href: "/dashboard/payment" },
    ]},
  ],
  coach: [
    { group: "My Profile", items: [
      { name: "Dashboard", href: "/dashboard/coach" },
      { name: "My Documents", href: "/dashboard/documents" },
      { name: "My Boxers", href: "/dashboard/coach/boxers" },
      { name: "Certificates", href: "/dashboard/certificates" },
    ]},
    { group: "Activity", items: [
      { name: "Tournaments", href: "/dashboard/tournament" },
      { name: "Rankings", href: "/dashboard/ranking" },
      { name: "Payment Receipts", href: "/dashboard/payment" },
    ]},
  ],
  academy: [
    { group: "Academy", items: [
      { name: "Dashboard", href: "/dashboard/academy" },
      { name: "Boxers", href: "/dashboard/boxer" },
      { name: "Coaches", href: "/dashboard/coach" },
    ]},
    { group: "Operations", items: [
      { name: "Tournament", href: "/dashboard/tournament" },
      { name: "Payment", href: "/dashboard/payment" },
      { name: "Documents", href: "/dashboard/documents" },
    ]},
  ],
};

export default function Sidebar({ role: propRole }: { role?: string }) {
  const path = usePathname();
  const router = useRouter();
  const [role, setRole] = useState(propRole ?? "");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (propRole) {
      setRole(propRole);
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.role) setRole(d.role);
        if (d.email) setEmail(d.email);
      })
      .catch(() => {});
  }, [propRole]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const normalizedRole = (role || "superadmin").toLowerCase();
  const menu = MENUS[normalizedRole] ?? MENUS.superadmin;
  const initial = email ? email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase() || "?";

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold leading-tight">Mumbai Boxing</h2>
        <p className="text-xs text-slate-400 capitalize">{normalizedRole === "superadmin" ? "Super Admin" : role} Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {menu.map((section) => (
          <div key={section.group}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-2 mb-1">
              {section.group}
            </p>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                  path === item.href
                    ? "bg-red-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User info + logout at bottom */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-300 truncate">{email || "—"}</p>
            <p className="text-xs text-slate-500 capitalize">{normalizedRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left rounded px-3 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
