"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, BadgeCheck, CalendarDays, CheckCircle2,
  Clock3, FileCheck2, FileText, FolderOpen, Image as ImageIcon,
  RefreshCw, Search, ShieldAlert, UploadCloud, UserRound, XCircle,
} from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type DocumentItem = {
  id: number;
  label: string;
  filePath: string;
  fileType: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
};
type DashboardData = {
  success: boolean;
  user: { id: number; email: string; role: string; registrationStatus: string };
  membership: { id: string | null; validFrom: string | null; expiry: string | null; activatedAt: string | null; active: boolean };
  documents: DocumentItem[];
};
const REQUIRED_DOCUMENTS: { key: string; title: string; description: string; icon: ElementType }[] = [
  { key: "referee-judge-passport-size-photo", title: "Passport Size Photo", description: "Your registration photograph", icon: UserRound },
  { key: "referee-judge-id-proof", title: "ID Proof", description: "Government-issued identity proof", icon: FileCheck2 },
  { key: "referee-judge-certificate", title: "Referee / Judge Certificate", description: "Your officiating certification", icon: BadgeCheck },
  { key: "referee-judge-experience-proof", title: "Experience Proof", description: "Supporting officiating experience", icon: FileText },
];
const normalize = (s?: string | null) => (s || "").trim().toLowerCase();
const statusOf = (doc?: DocumentItem | null) => !doc ? "missing" : normalize(doc.status) === "approved" ? "approved" : normalize(doc.status) === "rejected" ? "rejected" : "pending";
const statusMeta = {
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  pending: { label: "Pending review", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock3 },
  missing: { label: "Not uploaded", cls: "bg-slate-100 text-slate-600 border-slate-200", icon: UploadCloud },
} as const;
type Status = keyof typeof statusMeta;
const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const fileUrl = (doc: DocumentItem) => `/api/file?path=${encodeURIComponent(doc.filePath)}`;

export default function RefereeJudgeDocumentsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/referee-judge", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || result?.success === false) throw new Error(result?.error || "Unable to load documents.");
      setData(result as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load documents.");
    } finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const entries = useMemo(() => {
    const documents = data?.documents ?? [];
    const required = REQUIRED_DOCUMENTS.map((item) => ({
      key: item.key, title: item.title, description: item.description, icon: item.icon,
      doc: documents.find((d) => normalize(d.label) === item.key) ?? null, required: true,
    }));
    const extras = documents.filter((doc) => !REQUIRED_DOCUMENTS.some((r) => r.key === normalize(doc.label)))
      .map((doc) => ({ key: `extra-${doc.id}`, title: doc.label.replace(/-/g, " "), description: "Additional account document", icon: FileText, doc, required: false }));
    return [...required, ...extras];
  }, [data]);
  const required = entries.filter((entry) => entry.required);
  const uploaded = required.filter((entry) => !!entry.doc).length;
  const approved = required.filter((entry) => statusOf(entry.doc) === "approved").length;
  const pending = required.filter((entry) => statusOf(entry.doc) === "pending").length;
  const rejected = required.filter((entry) => statusOf(entry.doc) === "rejected").length;
  const visible = entries.filter((entry) => (filter === "all" || statusOf(entry.doc) === filter) && `${entry.title} ${entry.description} ${entry.doc?.label || ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardLayout role="referee_judge">
      <main className="mx-auto max-w-[1440px] space-y-6 pb-12 text-[#07172c]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#07172c] px-6 py-7 text-white sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-12 -top-28 h-72 w-72 rounded-full border-[45px] border-white/[0.04]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-2 w-1/3 skew-x-[-30deg] bg-[#ed1c24]" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Link href="/dashboard/referee-judge" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"><ArrowLeft size={16} /> Back to dashboard</Link>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white/85"><ShieldAlert size={13} /> Referee / Judge Portal</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Documents<span className="text-[#ed1c24]">.</span></h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Track your registration documents, verification progress and reviewer feedback in one place.</p>
            </div>
            <button type="button" onClick={() => void load(true)} disabled={refreshing || loading} className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-50"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh documents</button>
          </div>
        </div>

        {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700"><span>{error}</span><button type="button" onClick={() => void load(true)} className="font-bold underline">Try again</button></div>}
        {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />)}</div> : !data ? null : <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon={FolderOpen} label="Uploaded" value={`${uploaded}/${REQUIRED_DOCUMENTS.length}`} caption="Required documents submitted" />
            <Stat icon={CheckCircle2} label="Approved" value={approved} caption="Verified and accepted" />
            <Stat icon={Clock3} label="Pending review" value={pending} caption="Awaiting verification" />
            <Stat icon={ShieldAlert} label="Rejected" value={rejected} caption="Need your attention" />
          </div>
          <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#ed1c24]">Verification progress</p><h2 className="mt-1 text-xl font-extrabold">Registration checklist</h2></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{approved} of {REQUIRED_DOCUMENTS.length} approved</span></div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#ed1c24] transition-all" style={{ width: `${(approved / REQUIRED_DOCUMENTS.length) * 100}%` }} /></div>
              <p className="mt-3 text-sm text-slate-500">{approved === REQUIRED_DOCUMENTS.length ? "All required documents have been approved." : `${REQUIRED_DOCUMENTS.length - approved} required document${REQUIRED_DOCUMENTS.length - approved === 1 ? "" : "s"} not yet approved.`}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]"><FileCheck2 size={22} /></div><div><h2 className="font-extrabold">Membership details</h2><p className="text-xs text-slate-500">Referee / Judge account</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><SmallDetail label="Membership ID" value={data.membership.id || "—"} /><SmallDetail label="Valid until" value={formatDate(data.membership.expiry)} /></div></div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><h2 className="text-xl font-extrabold">Registration Documents</h2><p className="mt-1 text-sm text-slate-500">Select a document to view the uploaded file and its review status.</p></div><div className="relative w-full lg:w-72"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search documents" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#ed1c24] focus:ring-2 focus:ring-red-100" /></div></div>
              <div className="mt-5 flex flex-wrap gap-2">{(["all", "approved", "pending", "rejected", "missing"] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${filter === value ? "bg-[#07172c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{value === "all" ? "All documents" : statusMeta[value].label}</button>)}</div>
            </div>
            {visible.length ? <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">{visible.map((entry) => <DocumentCard key={entry.key} title={entry.title} description={entry.description} icon={entry.icon} doc={entry.doc} />)}</div> : <div className="px-5 py-16 text-center"><Search className="mx-auto text-slate-300" size={30} /><h3 className="mt-3 font-bold">No matching documents</h3><p className="mt-1 text-sm text-slate-500">Try a different search or status filter.</p><button onClick={() => { setFilter("all"); setQuery(""); }} className="mt-4 text-sm font-bold text-[#ed1c24]">Clear filters</button></div>}
          </section>
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600"><ShieldAlert size={19} className="mt-0.5 shrink-0 text-[#ed1c24]" /><p>Documents are reviewed by the Mumbai Boxing Association. Rejected documents display the reviewer's reason. This page is read-only; submitting replacements requires an existing upload workflow.</p></div>
        </>}
      </main>
    </DashboardLayout>
  );
}
function Stat({ icon: Icon, label, value, caption }: { icon: ElementType; label: string; value: ReactNode; caption: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]"><Icon size={20} /></div></div><p className="mt-2 text-3xl font-black tracking-tight text-[#07172c]">{value}</p><p className="mt-1 text-xs text-slate-500">{caption}</p></div>; }
function SmallDetail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-all text-sm font-bold text-[#07172c]">{value}</p></div>; }
function DocumentCard({ title, description, icon: Icon, doc }: { title: string; description: string; icon: ElementType; doc: DocumentItem | null }) {
  const status = statusOf(doc);
  const meta = statusMeta[status];
  const StatusIcon = meta.icon;
  const isImage = doc && (normalize(doc.fileType) === "image" || /\.(png|jpe?g|webp|gif)$/i.test(doc.filePath));
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#f5f7fb]">
      {doc && isImage ? <img src={fileUrl(doc)} alt={title} className="h-full w-full object-contain p-2" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#ed1c24] shadow-sm">{doc ? <FileText size={30} /> : <UploadCloud size={30} className="text-slate-300" />}</div>}
      <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.cls}`}><StatusIcon size={13} />{meta.label}</span>
    </div>
    <div className="p-4 sm:p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]"><Icon size={20} /></div><div className="min-w-0"><h3 className="font-extrabold leading-6 text-[#07172c]">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
      {doc ? <><div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} /> Uploaded {formatDate(doc.createdAt)}</div>{status === "rejected" && doc.rejectionReason && <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50 p-3"><p className="text-xs font-bold text-rose-700">Rejection reason</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-rose-600">{doc.rejectionReason}</p></div>}<a href={fileUrl(doc)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#ed1c24] hover:underline">View document <ArrowUpRight size={16} /></a></> : <p className="mt-4 text-xs font-medium text-slate-400">No file submitted during registration</p>}
    </div>
  </article>;
}
