"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import {
  ArrowRight, Award, Bell, CalendarDays, CheckCircle2, ChevronRight,
  ClipboardList, FileCheck2, GraduationCap, Landmark, Medal, Search,
  ShieldCheck, Trophy, UserRound, Users, X,
} from "lucide-react";

const tabs = [
  { id: "Boxer Search", icon: UserRound, placeholder: "Search boxer name or membership ID" },
  { id: "Coach Search", icon: GraduationCap, placeholder: "Search coach name or membership ID" },
  { id: "Academy Search", icon: Landmark, placeholder: "Search academy name" },
  { id: "Rankings", icon: Trophy, placeholder: "Search rankings by boxer or academy" },
  { id: "Event Results", icon: Medal, placeholder: "Search tournament or event name" },
  { id: "Certificate Verify", icon: FileCheck2, placeholder: "Enter certificate ID (e.g. CERT-001)" },
  { id: "Notices", icon: Bell, placeholder: "Search official notices" },
] as const;

type TabName = (typeof tabs)[number]["id"];

// Sample notices from the original page. Replace with your notices API when available.
const notices = [
  { title: "Mumbai Open 2025 – Registration Open", date: "10 Jan 2025", type: "Event" },
  { title: "Annual Renewal Deadline – 31 Jan 2025", date: "05 Jan 2025", type: "Notice" },
  { title: "New Weight Category Rules – BFI Circular", date: "01 Jan 2025", type: "Circular" },
];

const tabDescriptions: Record<TabName, string> = {
  "Boxer Search": "Look up registered boxers by name or membership ID.",
  "Coach Search": "Find coaching profiles and credentials.",
  "Academy Search": "Discover registered boxing academies.",
  Rankings: "Explore official boxer rankings and standings.",
  "Event Results": "Find results from boxing events and tournaments.",
  "Certificate Verify": "Check the authenticity of an MBA certificate.",
  Notices: "Read association announcements, circulars and events.",
};

export default function PublicDashboard() {
  const role = useRole();
  const [active, setActive] = useState<TabName>("Boxer Search");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const selectedTab = tabs.find((tab) => tab.id === active)!;
  const SelectedIcon = selectedTab.icon;
  const filteredNotices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return notices.filter((notice) =>
      `${notice.title} ${notice.date} ${notice.type}`.toLowerCase().includes(term)
    );
  }, [query]);

  const chooseTab = (tab: TabName) => {
    setActive(tab);
    setQuery("");
    setSubmitted("");
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <DashboardLayout role={role || undefined}>
      <main className="mx-auto w-full max-w-[1660px] space-y-6 pb-12 text-[#07172c]">
        <section className="relative isolate overflow-hidden rounded-[24px] bg-[#07172c] px-6 py-8 text-white shadow-[0_18px_45px_rgba(7,23,44,.13)] sm:px-9 lg:px-11 lg:py-11">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "38px 38px" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-red-600/20 blur-[90px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[24%] hidden h-[160%] w-12 rotate-[24deg] bg-[#ed1c24] lg:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-[19%] hidden h-[160%] w-5 rotate-[24deg] bg-red-500/40 lg:block" />
          <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> North Bombay District Amateur Boxing Association (NBDABA)
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-[44px]">Public Directory<span className="text-red-500">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Your gateway to boxing in Mumbai. Explore registered athletes, coaches, academies, rankings, event results and official notices.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold"><ShieldCheck className="h-4 w-4 text-red-400" /> Association Directory</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold"><Award className="h-4 w-4 text-red-400" /> Official Credentials</span>
              </div>
            </div>
            <div className="relative z-10 flex max-w-[270px] items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600"><Search className="h-6 w-6" /></div>
              <div><p className="text-sm font-extrabold">Explore the MBA</p><p className="mt-1 text-xs leading-5 text-slate-300">Seven public directory sections</p></div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Member Directory", detail: "Boxers, coaches and academies", icon: Users, target: "Boxer Search" as TabName },
            { label: "Competition Records", detail: "Rankings and event results", icon: Trophy, target: "Rankings" as TabName },
            { label: "Certificate Verification", detail: "Check issued credentials", icon: ShieldCheck, target: "Certificate Verify" as TabName },
          ].map((item) => {
            const Icon = item.icon;
            return <button key={item.label} type="button" onClick={() => chooseTab(item.target)} className="group flex items-center gap-4 rounded-[20px] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-extrabold text-[#07172c]">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p></div>
              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600" />
            </button>;
          })}
        </section>

        <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-6 sm:px-6">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><ClipboardList className="h-5 w-5" /></div><div><h2 className="text-lg font-extrabold">Explore Public Records</h2><p className="mt-1 text-xs text-slate-500">Choose a category to get started</p></div></div>
          </div>
          <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-wrap sm:px-6" role="tablist" aria-label="Public directory categories">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return <button key={tab.id} type="button" role="tab" aria-selected={active === tab.id} onClick={() => chooseTab(tab.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${active === tab.id ? "bg-[#07172c] text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600"}`}><Icon className="h-4 w-4" />{tab.id}</button>;
            })}
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#07172c] text-white"><SelectedIcon className="h-5 w-5" /></div><div><h3 className="text-lg font-extrabold">{active}</h3><p className="mt-1 text-xs text-slate-500">{tabDescriptions[active]}</p></div></div>

            {active === "Notices" ? (
              <>
                <div className="relative mt-6 max-w-lg"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices and circulars..." aria-label="Search notices" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="h-4 w-4" /></button>}</div>
                <p className="mt-4 text-xs text-amber-700">Sample notices from the existing page; connect a notices API for live announcements.</p>
                <div className="mt-4 space-y-3">{filteredNotices.length ? filteredNotices.map((notice) => (
                  <article key={notice.title} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Bell className="h-5 w-5" /></div><div><h4 className="text-sm font-bold text-[#07172c]">{notice.title}</h4><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{notice.date}</p></div></div><span className={`self-start rounded-full px-3 py-1.5 text-[11px] font-bold ${notice.type === "Event" ? "bg-blue-50 text-blue-700" : notice.type === "Notice" ? "bg-amber-50 text-amber-700" : "bg-purple-50 text-purple-700"}`}>{notice.type}</span></article>
                )) : <div className="rounded-xl bg-slate-50 p-10 text-center text-sm text-slate-500">No notices match your search.</div>}</div>
              </>
            ) : (
              <>
                <form onSubmit={submitSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" /><input required type="search" value={query} onChange={(e) => { setQuery(e.target.value); setSubmitted(""); }} placeholder={selectedTab.placeholder} aria-label={selectedTab.placeholder} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" /></div>
                  <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] px-6 text-sm font-bold text-white transition hover:bg-[#c9151e]">{active === "Certificate Verify" ? "Verify Certificate" : "Search Directory"}<ArrowRight className="h-4 w-4" /></button>
                </form>
                {submitted ? <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"><p className="text-sm font-bold text-amber-900">{active === "Certificate Verify" ? "Certificate verification is not connected yet" : "Directory search is not connected yet"}</p><p className="mt-1 text-xs leading-6 text-amber-800">You entered “{submitted}”. This interface needs a matching search or verification API before it can return authoritative results.</p></div> : <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm"><SelectedIcon className="h-7 w-7" /></div><p className="mt-4 text-sm font-extrabold text-slate-700">{active === "Certificate Verify" ? "Verify an official certificate" : `Explore ${active.toLowerCase()}`}</p><p className="mt-2 max-w-md text-xs leading-6 text-slate-500">{active === "Certificate Verify" ? "Enter a certificate ID above. Verification results require a connected backend service; you can also use the QR code on an issued certificate if its verification URL is configured." : "Enter a search term above. Live directory results will appear once this section is connected to the appropriate public API."}</p></div>}
              </>
            )}
          </div>
        </section>
        <div className="flex items-center gap-2 px-1 text-xs text-slate-500"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /><span>Designed for the North Bombay District Amateur Boxing Association (NBDABA) public directory. Only connected data sources can provide verified records.</span></div>
      </main>
    </DashboardLayout>
  );
}
