"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, CreditCard, Download, IndianRupee, ReceiptText, ShieldCheck, WalletCards, Search, RefreshCw, AlertCircle, Clock3, XCircle, Filter, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";

type PaymentItem = {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentGateway: string | null;
  transactionId: string | null;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
};

type DashboardData = {
  success: boolean;

  user: {
    id: number;
    email: string;
    role: string;
    registrationStatus: string;
  };

  membership: {
    id: string | null;
    validFrom: string | null;
    expiry: string | null;
    activatedAt: string | null;
    active: boolean;
  };

  payments: PaymentItem[];
};

const successful = (status: string) => ["paid", "success", "successful", "completed"].includes((status || "").toLowerCase());
const failed = (status: string) => ["failed", "failure", "cancelled", "canceled"].includes((status || "").toLowerCase());
const formatDate = (v: string | null | undefined) => { if (!v) return "—"; const d = new Date(v); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"}); };
const formatDateTime = (v: string | null | undefined) => { if (!v) return "—"; const d = new Date(v); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", {day:"numeric", month:"short", year:"numeric", hour:"numeric", minute:"2-digit"}); };
const money = (v: number | null | undefined) => `₹${Number(v || 0).toLocaleString("en-IN")}`;
const mask = (v: string | null | undefined) => !v ? "—" : v.length <= 8 ? v : `${v.slice(0,4)}••••${v.slice(-4)}`;

export default function RefereeJudgePaymentsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const load = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true); else setRefreshing(true);
      setError("");
      const response = await fetch("/api/referee-judge", { cache: "no-store" });
      const result: DashboardData & { error?: string } = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to load payment receipts.");
      setData(result);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load payment receipts."); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(true); }, [load]);
  useEffect(() => { setPage(1); }, [query, filter]);

  const payments = useMemo(() => data?.payments ?? [], [data]);
  const paid = useMemo(() => payments.filter(p => successful(p.status)), [payments]);
  const totalPaid = paid.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingCount = payments.filter(p => !successful(p.status) && !failed(p.status)).length;
  const filtered = useMemo(() => payments.filter(p => {
    const matchesStatus = filter === "all" || (filter === "paid" ? successful(p.status) : filter === "failed" ? failed(p.status) : !successful(p.status) && !failed(p.status));
    const text = [p.invoiceNumber, p.transactionId, p.razorpayPaymentId, p.razorpayOrderId, p.paymentMethod, p.paymentGateway, p.status, String(p.amount)].join(" ").toLowerCase();
    return matchesStatus && text.includes(query.trim().toLowerCase());
  }).sort((a,b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime()), [payments, filter, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const visible = filtered.slice((page-1)*6, page*6);

  return <DashboardLayout role="referee_judge">
    <main className="mx-auto max-w-[1500px] space-y-6 pb-12 text-[#07172c]">
      <section className="relative overflow-hidden rounded-[26px] bg-[#07172c] px-6 py-7 text-white sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-24 h-64 w-64 rounded-full border-[45px] border-white/[0.035]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-2/5 -skew-x-12 bg-[#ed1c24]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/dashboard/referee-judge" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white"><ArrowLeft size={15}/> Back to Dashboard</Link>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-red-300"><span className="h-1.5 w-1.5 rounded-full bg-[#ed1c24]"/> North Bombay District Amateur Boxing Association (NBDABA)</div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Payment Receipts<span className="text-[#ed1c24]">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Review membership transactions, track payment status and access your available invoices.</p>
          </div>
          <button onClick={() => void load()} disabled={loading || refreshing} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""}/> Refresh</button>
        </div>
      </section>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={18}/><div className="flex-1">{error}</div><button onClick={() => void load()} className="font-bold underline">Retry</button></div>}

      {loading ? <div className="space-y-5 animate-pulse"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-100" />)}</div><div className="h-44 rounded-2xl bg-slate-100"/><div className="h-72 rounded-2xl bg-slate-100"/></div> : data ? <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<IndianRupee size={21}/>} label="Total Paid" value={money(totalPaid)} hint="Successful transactions" tone="green" />
          <Stat icon={<CheckCircle2 size={21}/>} label="Successful Payments" value={String(paid.length)} hint="Confirmed payments" tone="blue" />
          <Stat icon={<ReceiptText size={21}/>} label="Payment Records" value={String(payments.length)} hint="All transactions" tone="red" />
          <Stat icon={<Clock3 size={21}/>} label="Pending Payments" value={String(pendingCount)} hint="Awaiting confirmation" tone="amber" />
        </div>

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed1c24]"><WalletCards size={21}/></div><div><h2 className="text-lg font-bold">Membership Overview</h2><p className="text-xs text-slate-500">Referee / Judge membership details</p></div></div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${data.membership.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><ShieldCheck size={14}/>{data.membership.active ? "Active Membership" : "Inactive Membership"}</span>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Membership ID" value={data.membership.id || "—"}/><Detail label="Valid From" value={formatDate(data.membership.validFrom)}/><Detail label="Valid Until" value={formatDate(data.membership.expiry)}/><Detail label="Activated On" value={formatDate(data.membership.activatedAt)}/>
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#07172c]"><ReceiptText size={21}/></div><div><h2 className="text-lg font-bold">Transaction History</h2><p className="text-xs text-slate-500">{filtered.length} matching record{filtered.length === 1 ? "" : "s"}</p></div></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Search transactions" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#ed1c24] sm:w-60"/></label>
              <label className="relative flex items-center"><Filter size={15} className="pointer-events-none absolute left-3 text-slate-400"/><select aria-label="Filter payment status" value={filter} onChange={e => setFilter(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-7 text-sm outline-none focus:border-[#ed1c24] sm:w-auto"><option value="all">All Statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option></select></label>
            </div>
          </div>
          {visible.length ? <div className="divide-y divide-slate-100">{visible.map(p => <PaymentRow key={p.id} payment={p}/>)}</div> : <div className="px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><ReceiptText size={28}/></div><h3 className="mt-4 font-bold">No payment records found</h3><p className="mt-2 text-sm text-slate-500">{payments.length ? "Try a different search or status filter." : "Your payment history will appear here when transactions are recorded."}</p></div>}
          {pageCount > 1 && <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4"><span className="text-xs text-slate-500">Page {page} of {pageCount}</span><div className="flex gap-2"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage(p => p-1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"><ChevronLeft size={17}/></button><button aria-label="Next page" disabled={page === pageCount} onClick={() => setPage(p => p+1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-30"><ChevronRight size={17}/></button></div></div>}
        </section>
        <Link href="/dashboard/referee-judge" className="inline-flex items-center gap-2 rounded-xl bg-[#ed1c24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#cf151c]">Back to Dashboard <ArrowRight size={16}/></Link>
      </> : null}
    </main>
  </DashboardLayout>;
}

function Stat({icon,label,value,hint,tone}:{icon:ReactNode;label:string;value:string;hint:string;tone:"green"|"blue"|"red"|"amber"}) {
 const colors={green:"bg-emerald-50 text-emerald-600",blue:"bg-blue-50 text-blue-600",red:"bg-red-50 text-[#ed1c24]",amber:"bg-amber-50 text-amber-600"};
 return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[tone]}`}>{icon}</span></div><p className="text-2xl font-extrabold tracking-tight break-words">{value}</p><p className="mt-1 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></div>;
}
function Detail({label,value}:{label:string;value:string}) { return <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 break-words text-sm font-bold text-slate-800">{value}</p></div>; }
function PaymentRow({payment:p}:{payment:PaymentItem}) {
 const isPaid=successful(p.status), isFailed=failed(p.status);
 const statusLabel=isPaid?"Paid":isFailed?"Failed":p.status||"Pending";
 return <article className="p-5 transition hover:bg-slate-50/60 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07172c] text-white"><CreditCard size={22}/></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">Membership Payment</h3><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${isPaid?"bg-emerald-50 text-emerald-700":isFailed?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`}>{isPaid?<CheckCircle2 size={13}/>:isFailed?<XCircle size={13}/>:<Clock3 size={13}/>} {statusLabel}</span></div><p className="mt-1 text-xs text-slate-500">{formatDateTime(p.paidAt || p.createdAt)}</p></div></div><div className="flex flex-wrap items-center gap-3 lg:justify-end"><span className="text-xl font-extrabold">{money(p.amount)}</span>{p.invoiceUrl && <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-red-300 hover:text-red-600"><Download size={15}/> Receipt <ExternalLink size={13}/></a>}</div></div>
 <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Detail label="Payment Method" value={p.paymentMethod || p.paymentGateway || "—"}/><Detail label="Invoice Number" value={p.invoiceNumber || "—"}/><Detail label="Transaction ID" value={mask(p.transactionId || p.razorpayPaymentId)}/><Detail label="Payment Date" value={formatDate(p.paidAt || p.createdAt)}/></div></article>;
}
