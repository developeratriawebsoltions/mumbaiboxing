"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = { name: string; href: string };
type MenuSection = { group: string; items: MenuItem[] };

const MENUS: Record<string, MenuSection[]> = {
  superadmin: [
    { group: "Admin", items: [
      { name: "Super Admin", href: "/dashboard" },
      { name: "Association Admin", href: "/dashboard/association" },
      { name: "Taluka Admin", href: "/dashboard/taluka" },
    ]},
    { group: "Members", items: [
      { name: "Boxer", href: "/dashboard/boxer" },
      { name: "Coach", href: "/dashboard/coach" },
      { name: "Academy / Club", href: "/dashboard/academy" },
      { name: "School / College", href: "/dashboard/school" },
    ]},
    { group: "Operations", items: [
      { name: "Medical", href: "/dashboard/medical" },
      { name: "Ranking", href: "/dashboard/ranking" },
      { name: "Tournament", href: "/dashboard/tournament" },
      { name: "Payment", href: "/dashboard/payment" },
    ]},
    { group: "Records", items: [
      { name: "Certificates", href: "/dashboard/certificates" },
      { name: "Document Verification", href: "/dashboard/documents" },
      { name: "Public", href: "/dashboard/public" },
      { name: "Reports", href: "/dashboard/reports" },
    ]},
  ],
  association: [
    { group: "Association", items: [
      { name: "Dashboard", href: "/dashboard/association" },
      { name: "Boxers List", href: "/dashboard/boxer" },
      { name: "Coaches List", href: "/dashboard/coach" },
      { name: "Academies List", href: "/dashboard/academy" },
    ]},
    { group: "Operations", items: [
      { name: "Tournament", href: "/dashboard/tournament" },
      { name: "Ranking", href: "/dashboard/ranking" },
      { name: "Payment Reports", href: "/dashboard/payment" },
    ]},
    { group: "Records", items: [
      { name: "Approve Documents", href: "/dashboard/documents" },
      { name: "Reports", href: "/dashboard/reports" },
    ]},
  ],
  taluka: [
    { group: "Taluka", items: [
      { name: "Dashboard", href: "/dashboard/taluka" },
      { name: "Boxers", href: "/dashboard/boxer" },
      { name: "Coaches", href: "/dashboard/coach" },
      { name: "Schools", href: "/dashboard/school" },
    ]},
    { group: "Operations", items: [
      { name: "Tournament", href: "/dashboard/tournament" },
      { name: "Ranking", href: "/dashboard/ranking" },
    ]},
  ],
  boxer: [
    { group: "My Profile", items: [
      { name: "Dashboard", href: "/dashboard/boxer" },
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
      { name: "Certificates", href: "/dashboard/certificates" },
      { name: "Documents", href: "/dashboard/documents" },
    ]},
    { group: "Activity", items: [
      { name: "Tournaments", href: "/dashboard/tournament" },
      { name: "Rankings", href: "/dashboard/ranking" },
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
  school: [
    { group: "School", items: [
      { name: "Dashboard", href: "/dashboard/school" },
      { name: "Boxers", href: "/dashboard/boxer" },
      { name: "Tournaments", href: "/dashboard/tournament" },
    ]},
    { group: "Records", items: [
      { name: "Certificates", href: "/dashboard/certificates" },
      { name: "Documents", href: "/dashboard/documents" },
    ]},
  ],
};

export default function Sidebar({ role: propRole }: { role?: string }) {
  const path = usePathname();
  const [role, setRole] = useState(propRole ?? "superadmin");

  useEffect(() => {
    const saved = localStorage.getItem("mba_role");
    if (saved) setRole(saved);
  }, []);

  const menu = MENUS[role] ?? MENUS.superadmin;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold leading-tight">Mumbai Boxing</h2>
        <p className="text-xs text-slate-400 capitalize">{role === "superadmin" ? "Super Admin" : role} Portal</p>
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
    </aside>
  );
}
