"use client";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Super Admin",
  "/dashboard/association": "Association Admin",
  "/dashboard/taluka": "Taluka Admin",
  "/dashboard/boxer": "Boxer",
  "/dashboard/coach": "Coach",
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

export default function Header() {
  const path = usePathname();
  const label = titles[path] ?? "Dashboard";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-bold text-lg">Mumbai Boxing Association</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{label}</span>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">A</div>
      </div>
    </header>
  );
}
