"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Super Admin",
  "/dashboard/association": "Association Admin",
  "/dashboard/taluka": "Taluka Admin",
  "/dashboard/admin/boxers": "All Boxers",
  "/dashboard/admin/coaches": "All Coaches",
  "/dashboard/coach": "Coach",
  "/dashboard/coach/boxers": "My Boxers",
  "/dashboard/academy": "Academy / Club",
  "/dashboard/school": "School / College",
  "/dashboard/medical": "Medical",
  "/dashboard/ranking": "Ranking",
  "/dashboard/tournament": "Tournament",
  "/dashboard/payment": "Payment",
  "/dashboard/certificates": "Certificates",
  "/dashboard/documents": "Document Verification",
  "/dashboard/public": "Public",
  "/dashboard/reports": "Reports",
};

type Me = { email: string; role: string };

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const label = titles[path] ?? "Dashboard";
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.email) setMe(d); })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const initial = me?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-bold text-lg">Mumbai Boxing Association</h1>

      <div className="flex items-center gap-3">
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{label}</span>

        {/* Avatar dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold hover:bg-red-700 transition-colors focus:outline-none"
          >
            {initial}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg py-1 z-50">
              {me && (
                <div className="px-4 py-3 border-b">
                  <p className="text-xs font-semibold text-gray-700 truncate">{me.email}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{me.role}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
