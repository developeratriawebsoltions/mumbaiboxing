"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy, Plus, Search, CalendarDays, MapPin, Users, Pencil, Trash2, ArrowUpRight, Star, RefreshCw, X, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { tournamentSlug } from "@/lib/tournament-url";
import { tournamentUrl } from "@/lib/tournament-url";

type Tournament = {
  id: number;
  name: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  weightClass: string | null;
  status: string;
  entryFee: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  createdAt: string;
  _count: { entries: number };
};

type TournamentForm = {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  weightClass: string;
  status: string;
  entryFee: string;
  isFeatured: boolean;
};

const EMPTY: TournamentForm = {
  name: "",
  location: "",
  startDate: "",
  endDate: "",
  weightClass: "",
  status: "upcoming",
  entryFee: "500",
  isFeatured: false,
};

const STATUSES = [
  "upcoming",
  "open",
  "ongoing",
  "completed",
];

const STATUS_COLOR: Record<string, string> = {
  upcoming: "bg-yellow-100 text-yellow-700",
  open: "bg-green-100 text-green-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
};

const FEE_TABLE = [
  {
    category: "🏢 Club / Academy Registration",
    fee: "₹1,500",
  },
  {
    category: "🥊 Coach Registration",
    fee: "₹1,000",
  },
  {
    category: "🥊 Boxer Registration",
    fee: "₹100",
  },
  {
    category: "🧑⚖️ Referee & Judge Registration",
    fee: "₹1,500",
  },
  {
    category: "🏆 District Championship Fee",
    fee: "₹500 per boxer",
  },
  {
    category: "🏆 State Championship Entry Fee",
    fee: "₹500 per boxer",
  },
  {
    category: "📋 MBA Registration Fee (when applicable)",
    fee: "₹500 per boxer",
  },
];

async function readApiResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text();
  if (!responseText) {
    throw new Error(
      response.ok
        ? "The server returned an empty response. Please retry."
        : `The request failed (${response.status}). Please retry.`,
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an invalid response. Please retry."
        : `The request failed (${response.status}). Please retry.`,
    );
  }

  return data as T;
}

export default function AdminTournamentsPage() {
  const router = useRouter();
  const role = useRole();

  const [tournaments, setTournaments] = useState<Tournament[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] =
    useState<TournamentForm>(EMPTY);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imagePreviewUrlRef = useRef<string | null>(null);

  const [editId, setEditId] = useState<number | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(
    null
  );

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shareFeedback, setShareFeedback] = useState<{
    tournamentId: number;
    message: string;
    isError: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "tournaments" | "registration" | "fees"
  >("tournaments");

  useEffect(
    () => () => {
      if (imagePreviewUrlRef.current) {
        URL.revokeObjectURL(imagePreviewUrlRef.current);
      }
    },
    [],
  );

  function setTournamentImage(file: File | null) {
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
    }

    imagePreviewUrlRef.current = file ? URL.createObjectURL(file) : null;
    setImagePreviewUrl(imagePreviewUrlRef.current);
    setSelectedImage(file);
  }

  function load() {
    fetch("/api/admin/tournaments", {
      credentials: "include",
    })
      .then(async (r) => {
        const data = await readApiResponse<{ error?: string } | Tournament[]>(r);

        if (!r.ok) {
          throw new Error(
            !Array.isArray(data) && data?.error
              ? data.error
              : "Failed to load tournaments."
          );
        }

        return data;
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          setTournaments([]);
          setError("Invalid tournament data received.");
          return;
        }

        setError("");
        setTournaments(data);
      })
      .catch((err) => {
        setError(
          err?.message || "Failed to load tournaments."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "TBD";

  const toInputDate = (d: string | null) =>
    d
      ? new Date(d).toISOString().split("T")[0]
      : "";

  function openCreate() {
    setForm({ ...EMPTY });
    setTournamentImage(null);
    setExistingImageUrl(null);
    setEditId(null);
    setError("");
    setShowForm(true);
  }

  function openEdit(t: Tournament) {
    setForm({
      name: t.name,
      location: t.location ?? "",
      startDate: toInputDate(t.startDate),
      endDate: toInputDate(t.endDate),
      weightClass: t.weightClass ?? "",
      status: t.status,
      entryFee:
        t.entryFee != null
          ? String(t.entryFee)
          : "",
      isFeatured: t.isFeatured ?? false,
    });

    setTournamentImage(null);
    setExistingImageUrl(t.imageUrl);
    setEditId(t.id);
    setError("");
    setShowForm(true);
  }

  async function shareTournament(tournament: Tournament) {
    const url = `${window.location.origin}${tournamentUrl(tournament)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: tournament.name,
          text: `View ${tournament.name}`,
          url,
        });
        setShareFeedback({
          tournamentId: tournament.id,
          message: "Tournament link shared.",
          isError: false,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy command was not available.");
      }

      setShareFeedback({
        tournamentId: tournament.id,
        message: "Link copied to clipboard.",
        isError: false,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Could not share tournament link:", error);
      setShareFeedback({
        tournamentId: tournament.id,
        message: "Could not share the link. Please try again.",
        isError: true,
      });
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Tournament name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editId ? "PUT" : "POST";

      const body = editId
        ? {
            ...form,
            id: editId,
          }
        : form;

      const requestBody = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        requestBody.append(key, String(value));
      });
      if (selectedImage) requestBody.append("image", selectedImage);

      const res = await fetch(
        "/api/admin/tournaments",
        {
          method,
          credentials: "include",
          body: requestBody,
        }
      );

      const data = await readApiResponse<{ error?: string }>(res);

      if (!res.ok) {
        setError(
          data?.error || "Failed to save tournament."
        );
        return;
      }

      setShowForm(false);
      setEditId(null);
      setForm({ ...EMPTY });
      setTournamentImage(null);
      setExistingImageUrl(null);

      load();
    } catch {
      setError("Failed to save tournament.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(
        `/api/admin/tournaments?id=${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await readApiResponse<{ error?: string }>(res);

      if (res.ok) {
        setDeleteId(null);
        load();
      } else {
        setError(
          data?.error || "Failed to delete tournament."
        );
      }
    } catch {
      setError("Failed to delete tournament.");
    } finally {
      setDeletingId(null);
    }
  }

  const upcoming = tournaments.filter(
    (t) => t.status !== "completed"
  );

  const completed = tournaments.filter(
    (t) => t.status === "completed"
  );

  const featuredTournament = tournaments.find(
    (t) => t.isFeatured
  );

  const filteredTournaments = tournaments.filter((t) => {
    const term = query.trim().toLowerCase();
    return (statusFilter === "all" || t.status === statusFilter) &&
      (!term || [t.name, t.location ?? "", t.weightClass ?? ""].some((v) => v.toLowerCase().includes(term)));
  });

  return (
    <DashboardLayout role={role || undefined}>
      <main className="mx-auto max-w-[1560px] space-y-6 pb-12 text-slate-900">
        <section className="relative overflow-hidden rounded-[26px] bg-[#141922] p-6 text-white sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_35%,rgba(220,38,38,.38),transparent_42%)]" />
          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-red-400">North Bombay District Amateur Boxing Association</p>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Tournament Management<span className="text-red-500">.</span></h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">Create championships, manage boxer entries and keep your event calendar organised in one place.</p>
              <button onClick={openCreate} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"><Plus size={18}/> Create Tournament</button>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:gap-8">
              {[["Events",tournaments.length],["Open",tournaments.filter(t=>t.status === "open").length],["Boxer Entries",tournaments.reduce((n,t)=>n+(t._count?.entries ?? 0),0)]].map(([label,value])=><div key={String(label)}><p className="text-2xl font-black sm:text-3xl">{value}</p><p className="mt-1 text-[11px] text-slate-300">{label}</p></div>)}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {label:"Total Tournaments",value:tournaments.length,accent:"text-slate-900",icon:<Trophy size={20}/>},
            {label:"Upcoming",value:upcoming.length,accent:"text-amber-600",icon:<CalendarDays size={20}/>},
            {label:"Open / Ongoing",value:tournaments.filter(t=>["open","ongoing"].includes(t.status)).length,accent:"text-emerald-600",icon:<Users size={20}/>},
            {label:"Completed",value:completed.length,accent:"text-red-600",icon:<Star size={20}/>},
          ].map(s=><div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between text-slate-400"><span className="text-xs font-semibold">{s.label}</span>{s.icon}</div><p className={`mt-3 text-3xl font-black ${s.accent}`}>{s.value}</p></div>)}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {(["tournaments","registration","fees"] as const).map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeTab===tab?"bg-red-600 text-white":"bg-white text-slate-600 hover:bg-slate-100"}`}>{tab==="tournaments"?"Tournaments":tab==="registration"?"Registration Form":"Fee Structure"}</button>)}
        </div>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button onClick={()=>{setError("");setLoading(true);load();}} className="ml-3 font-bold underline">Retry</button></div>}
        {activeTab === "tournaments" && <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><h2 className="text-xl font-black">All Tournaments</h2><p className="mt-1 text-xs text-slate-500">Manage published and upcoming boxing events</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Search tournaments" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tournaments..." className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-red-400 sm:w-64"/></div>
              <select aria-label="Filter status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">{["all",...STATUSES].map(x=><option key={x} value={x}>{x==="all"?"All Statuses":x[0].toUpperCase()+x.slice(1)}</option>)}</select>
              <button onClick={()=>{setLoading(true);load();}} aria-label="Refresh tournaments" className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 hover:bg-slate-50"><RefreshCw size={17}/></button>
            </div>
          </div>
          {loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(x=><div key={x} className="h-80 animate-pulse rounded-2xl bg-slate-100"/>)}</div> : filteredTournaments.length===0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Trophy className="mx-auto text-slate-300" size={40}/><h3 className="mt-4 font-bold">No tournaments found</h3><p className="mt-2 text-sm text-slate-500">Try another search or create your first tournament.</p><button onClick={openCreate} className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Add Tournament</button></div> :
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map(t=><article key={t.id} className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-44 overflow-hidden bg-[#171c26]">
                {t.imageUrl ? <Image src={t.imageUrl} alt={t.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105"/> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_70%_30%,#5c1b24,#151923_65%)]"><Trophy size={64} className="text-white/20"/></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                <div className="absolute left-4 top-4 flex gap-2">{t.isFeatured&&<span className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-extrabold text-white">★ Featured</span>}</div>
                <span className={`absolute right-4 top-4 rounded-lg px-3 py-1 text-[11px] font-bold capitalize ${STATUS_COLOR[t.status]??"bg-slate-100 text-slate-700"}`}>{t.status}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="min-h-14 text-lg font-extrabold leading-7">{t.name}</h3>
                <div className="mt-3 space-y-3 text-sm text-slate-500">
                  <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-red-500"/>{t.location||"Venue to be announced"}</p>
                  <p className="flex items-start gap-2"><CalendarDays size={16} className="mt-0.5 shrink-0 text-red-500"/>{formatDate(t.startDate)}{t.endDate?` – ${formatDate(t.endDate)}`:""}</p>
                  <p className="flex items-start gap-2"><Trophy size={16} className="mt-0.5 shrink-0 text-red-500"/>{t.weightClass||"All weight classes"}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5"><span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Users size={16}/>{t._count?.entries??0} entries</span><span className="text-lg font-black">{t.entryFee==null?"Fee TBD":`₹${t.entryFee.toLocaleString("en-IN")}`}</span></div>
                <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] gap-2"><button onClick={()=>router.push(`/dashboard/admin/tournaments/${encodeURIComponent(tournamentSlug(t.name))}`)} className="flex items-center justify-center gap-1 rounded-xl bg-red-600 px-3 py-3 text-xs font-bold text-white hover:bg-red-700">View Entries <ArrowUpRight size={15}/></button><button onClick={()=>void shareTournament(t)} aria-label={`Share ${t.name}`} className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-50"><Share2 size={14}/>Share</button><button onClick={()=>openEdit(t)} aria-label={`Edit ${t.name}`} className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-50"><Pencil size={14}/>Edit</button><button onClick={()=>setDeleteId(t.id)} aria-label={`Delete ${t.name}`} className="flex items-center gap-1 rounded-xl border border-red-100 px-3 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 size={14}/>Delete</button></div>
                {shareFeedback?.tournamentId === t.id && (
                  <p
                    role={shareFeedback.isError ? "alert" : "status"}
                    className={`mt-2 text-xs ${shareFeedback.isError ? "text-red-600" : "text-emerald-700"}`}
                  >
                    {shareFeedback.message}
                  </p>
                )}
              </div>
            </article>)}
          </div>}
        </section>}

        {/* REGISTRATION FORM TAB */}
        {activeTab === "registration" && (
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">North Bombay District Amateur Boxing Association</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Boxer Annual Registration Form</h2>
                  <p className="mt-1 text-sm text-slate-500">Registration requirements for the 2026 calendar year</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-md bg-slate-100 px-3 py-2 text-slate-700">1 Jan – 31 Dec 2026</span>
                  <span className="rounded-md bg-red-50 px-3 py-2 font-semibold text-red-700">Registration fee: ₹100</span>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">Review the information and supporting documents required for annual boxer registration. Fields marked <span className="font-semibold text-red-600">*</span> are mandatory.</p>
              <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {[
              {
                section:
                  "SECTION 1 — BOXER BASIC DETAILS",
                fields: [
                  "Full Name of Boxer *",
                  "Father's Name *",
                  "Mother's Name",
                  "Date of Birth *",
                  "Gender * (Male / Female)",
                  "Aadhaar Number *",
                  "Mobile Number *",
                  "Email ID",
                  "Blood Group",
                  "Residential Address *",
                  "City / Area *",
                ],
              },
              {
                section:
                  "SECTION 2 — BOXING DETAILS",
                fields: [
                  "Current Weight (kg) *",
                  "Current Weight Category *",
                  "Year Started Boxing *",
                  "Boxing Experience (Beginner / District / Divisional / State / National / International)",
                  "Major Boxing Achievements",
                  "BFI Registration Number (if available)",
                  "NSRS ID (if available)",
                  "Previous District Registration Number (if applicable)",
                ],
              },
              {
                section:
                  "SECTION 3 — CURRENT CLUB / ACADEMY & COACH",
                fields: [
                  "Current Club / Academy Name *",
                  "Club / Academy Registration Number",
                  "Current Coach Name *",
                  "Coach Registration Number",
                  "Coach Mobile Number *",
                  "Training Centre Address *",
                  "Date/Year Joined Current Club / Academy *",
                ],
              },
              {
                section:
                  "SECTION 4 — BOXER'S FIRST / ORIGINAL BOXING ACADEMY",
                fields: [
                  "Name of Academy/Club where Boxer Started Boxing *",
                  "First Boxing Coach Name",
                  "Year Started Boxing at First Academy",
                  "Has the Boxer ever transferred from another Club/Academy? * (No / Yes)",
                  "If YES: Previous Club/Academy Name, Previous Coach Name, Reason for Transfer, Date/Year of Transfer",
                  "NOC obtained from Previous Club? (Yes / No / Not Applicable)",
                  "Upload NOC / Transfer Document (if applicable)",
                ],
              },
              {
                section:
                  "SECTION 5 — PARENT / GUARDIAN DETAILS",
                fields: [
                  "Parent / Guardian Full Name *",
                  "Relationship with Boxer *",
                  "Parent / Guardian Mobile Number *",
                  "Parent / Guardian Email ID",
                  "Parent / Guardian Address",
                ],
              },
              {
                section:
                  "SECTION 6 — EMERGENCY & MEDICAL DETAILS",
                fields: [
                  "Emergency Contact Name *",
                  "Relationship with Boxer *",
                  "Emergency Contact Number *",
                  "Any injury/medical condition affecting boxing participation? (No / Yes – Please specify)",
                  "Medical/Fitness Certificate (if applicable)",
                ],
              },
              {
                section:
                  "SECTION 7 — DOCUMENT UPLOAD",
                fields: [
                  "Aadhaar Card *",
                  "Birth Certificate / Age Proof *",
                  "Recent Passport-size Photograph *",
                  "Medical/Fitness Certificate (if applicable)",
                  "BFI/NSRS Registration Proof (if available)",
                  "Previous Boxing Certificate / Achievement Certificate (if applicable)",
                  "NOC / Transfer Certificate (if applicable)",
                ],
              },
              {
                section:
                  "SECTION 8 — REGISTRATION FEE",
                fields: [
                  "Annual Boxer Registration Fee: ₹100",
                  "Payment Status * (Paid / Pending)",
                  "Payment Mode (UPI / GPay / Bank Transfer / Cash)",
                  "Transaction ID / UTR Number",
                  "Upload Payment Screenshot",
                ],
              },
              {
                section:
                  "SECTION 9 — DECLARATION",
                fields: [
                  "I hereby declare that the information provided is true and correct.",
                  "Declaration checkbox *",
                  "Name of Boxer / Parent / Guardian *",
                  "Date of Submission *",
                ],
              },
            ].map(({ section, fields }, index) => (
                  <div key={section} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">{index + 1}</span>
                      <h3 className="pt-1 text-sm font-bold leading-5 text-slate-900">{section.replace(/^SECTION \d+ — /, "")}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {fields.map((field) => (
                        <li key={field} className="flex items-start gap-2 text-sm leading-5 text-slate-600">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span>{field}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Register • Train • Compete • Represent North Bombay</div>
            </div>
          </section>
        )}

        {/* FEE STRUCTURE TAB */}
        {activeTab === "fees" && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">North Bombay District Amateur Boxing Association</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Registration & Participation Fees</h2>
                <p className="mt-1 text-sm text-slate-500">Official fee structure for the 2026 calendar year</p>
              </div>
              <span className="self-start rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">1 Jan – 31 Dec 2026</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th scope="col" className="px-4 py-3 sm:px-5">Category</th><th scope="col" className="whitespace-nowrap px-4 py-3 text-right sm:px-5">Fee</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FEE_TABLE.map(({ category, fee }) => (
                    <tr key={category} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium leading-6 text-slate-800 sm:px-5">{category}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-red-600 sm:px-5">{fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <strong>Important:</strong> All Clubs/Academies, Coaches, Boxers and Referees & Judges are requested to complete their annual registration for the 2026 calendar year.
            </div>
          </section>
        )}
</main>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">
                  {editId
                    ? "Edit Tournament"
                    : "Add Tournament"}
                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  Tournament information
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Tournament Name */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Tournament Name *
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. North Bombay District Championship 2026"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Location / Venue
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g. Kandivali Sports Complex, Mumbai"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Tournament Image */}
              <div>
                <label
                  htmlFor="tournament-image"
                  className="text-xs font-medium text-gray-600 block mb-1"
                >
                  Tournament Image
                </label>
                <input
                  id="tournament-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    setTournamentImage(e.target.files?.[0] ?? null)
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-red-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-red-700"
                />
                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG, or WebP; maximum size 5 MB.
                </p>
                {(imagePreviewUrl || existingImageUrl) && (
                  <Image
                    src={imagePreviewUrl ?? existingImageUrl ?? ""}
                    alt="Tournament preview"
                    width={640}
                    height={144}
                    unoptimized
                    className="mt-3 h-36 w-full rounded-lg border object-cover"
                  />
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Weight Class */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Weight Class
                </label>

                <input
                  value={form.weightClass}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      weightClass: e.target.value,
                    })
                  }
                  placeholder="e.g. All categories / 60kg / 75kg"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Fee + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Entry Fee (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.entryFee}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        entryFee: e.target.value,
                      })
                    }
                    placeholder="e.g. 500"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {STATUSES.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HOMEPAGE HERO */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 mt-2">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="mt-1 h-4 w-4 accent-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Show on Homepage Hero
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Display this tournament in the
                      public homepage Hero section with
                      its live countdown.
                    </p>

                    <p className="mt-2 text-xs font-medium text-red-600">
                      Only one tournament can be featured
                      at a time.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={
                  saving || !form.name.trim()
                }
                className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editId
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => {
            if (deletingId === null) setDeleteId(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-4xl">🗑️</p>

            <p className="font-semibold">
              Delete &quot;
              {tournaments.find((tournament) => tournament.id === deleteId)?.name}
              &quot;?
            </p>

            <p className="text-sm text-gray-500">
              All boxer entries for this tournament will
              also be removed. This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deletingId !== null}
                className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleDelete(deleteId)
                }
                disabled={deletingId === deleteId}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === deleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}