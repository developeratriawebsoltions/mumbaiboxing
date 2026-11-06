"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ArrowLeft, Download, Upload, CheckCircle2, X, FileText } from "lucide-react";
import DashboardLayout from "@/Components/layout/DashboardLayout";
import { useRole } from "@/hooks/useRole";

type UploadedFiles = {
  ageVerification: File | null;
  medicalCertificate: File | null;
  nonPregnancy: File | null;
};

const REQUIRED_FORMS = [
  {
    key: "ageVerification" as const,
    label: "Age Verification Form",
    filename: "age-verification-form.pdf",
    path: "/forms/age-verification-form.pdf",
  },
  {
    key: "medicalCertificate" as const,
    label: "BFI Medical Certificate",
    filename: "bfi-medical-certificate.pdf",
    path: "/forms/bfi-medical-certificate.pdf",
  },
];

const GIRL_FORM = {
  key: "nonPregnancy" as const,
  label: "Declaration of Non-Pregnancy",
  filename: "non-pregnancy-declaration.pdf",
  path: "/forms/non-pregnancy-declaration.pdf",
};

export default function TournamentRegisterPage() {
  const params = useParams<{ tournamentId: string }>();
  const router = useRouter();
  const role = useRole();

  const tournamentId = Number(params.tournamentId);

  const [tournament, setTournament] = useState<{ id: number; name: string; entryFee: number | null; customQuestions?: string | null } | null>(null);
  const [boxerProfile, setBoxerProfile] = useState<{ name: string; dob: string; gender: string } | null>(null);
  const [mode, setMode] = useState<"cash" | "free">("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [questionsModal, setQuestionsModal] = useState<{ questions: string[]; answers: string[] } | null>(null);

  const [files, setFiles] = useState<UploadedFiles>({
    ageVerification: null,
    medicalCertificate: null,
    nonPregnancy: null,
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch("/api/tournaments", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { id: number; name: string; entryFee: number | null; customQuestions?: string | null }[]) => {
        const t = data.find((x) => x.id === tournamentId);
        if (t) {
          setTournament(t);
          setMode(t.entryFee === 0 ? "free" : "cash");
        }
      })
      .catch(() => {});
  }, [tournamentId]);

  useEffect(() => {
    if (role !== "boxer") return;
    fetch("/api/boxer", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { name?: string; dob?: string; gender?: string }) => {
        if (d?.name) {
          setBoxerProfile({ name: d.name, dob: d.dob ? d.dob.split("T")[0] : "", gender: d.gender ?? "" });
        }
      })
      .catch(() => {});
  }, [role]);

  const isGirl = boxerProfile?.gender?.toLowerCase() === "female";
  const forms = isGirl ? [...REQUIRED_FORMS, GIRL_FORM] : REQUIRED_FORMS;

  function parseQuestions(raw: string | null | undefined): string[] {
    if (!raw) return [];
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }

  function validate() {
    for (const form of forms) {
      if (!files[form.key]) return `Please upload the ${form.label}.`;
    }
    return null;
  }

  async function uploadAllFiles(): Promise<Record<string, string>> {
    const fd = new FormData();
    for (const form of forms) {
      const file = files[form.key];
      if (file) fd.append(form.key, file);
    }
    const res = await fetch("/api/tournaments/upload-forms", { method: "POST", body: fd, credentials: "include" });
    const data = await res.json() as { urls?: Record<string, string>; error?: string };
    if (!res.ok) throw new Error(data.error || "Failed to upload documents");
    return data.urls ?? {};
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");

    const qs = parseQuestions(tournament?.customQuestions);
    if (qs.length > 0) {
      setQuestionsModal({ questions: qs, answers: qs.map(() => "") });
      return;
    }
    await submit(null);
  }

  async function submit(answers: string[] | null) {
    if (!tournament) return;
    setSubmitting(true);
    try {
      const uploadedUrls = await uploadAllFiles();

      const payload = { tournamentId: tournament.id, answers, tournamentForms: uploadedUrls };

      if (mode === "cash") {
        const res = await fetch("/api/tournaments/offline-request", {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { error?: string };
        if (!res.ok) throw new Error(data?.error || "Could not request cash payment.");
        router.push("/dashboard/tournament?registered=cash");
        return;
      }

      // Online pay disabled — free tournament direct register
      if (mode === "free") {
        const res = await fetch("/api/tournaments/register", {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { error?: string };
        if (!res.ok) throw new Error(data?.error || "Registration failed.");
        router.push("/dashboard/tournament?registered=free");
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout role={role || undefined}>
      <div className="mx-auto max-w-2xl pb-16">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button type="button" onClick={() => router.push("/dashboard/tournament")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div>
            <h1 className="text-xl font-black text-[#07172c]">Tournament Registration</h1>
            {tournament && <p className="text-sm text-slate-500">{tournament.name}</p>}
          </div>
        </div>

        {/* Mode selector — online pay disabled, cash only */}

        {/* Required Forms Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-black text-[#07172c]">Required Documents</h2>
            <p className="mt-1 text-sm text-slate-500">
              Download each form, fill it out, and upload the completed copy.
            </p>
          </div>

          <div className="space-y-4">
            {forms.map((form) => {
              const uploaded = files[form.key];
              return (
                <div key={form.key} className="rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#07172c]">{form.label}</p>
                      {uploaded && (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" /> {uploaded.name}
                        </p>
                      )}
                    </div>
                    {uploaded && (
                      <button type="button"
                        onClick={() => setFiles((f) => ({ ...f, [form.key]: null }))}
                        className="text-slate-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <a href={form.path} download={form.filename}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                      <Download className="h-4 w-4" /> Download
                    </a>
                    <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:border-red-400 hover:bg-red-50 hover:text-red-600">
                      <Upload className="h-4 w-4" />
                      {uploaded ? "Replace" : "Upload"}
                      <input type="file" accept=".pdf,image/*" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFiles((f) => ({ ...f, [form.key]: file }));
                          e.target.value = "";
                        }} />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
          )}

          <div className="flex gap-3 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => router.push("/dashboard/tournament")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="button" disabled={submitting} onClick={() => void handleSubmit()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] py-3 text-sm font-bold text-white hover:bg-[#c9151e] disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit & Register"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Questions Modal */}
      {mounted && questionsModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Registration Questions</h3>
                <p className="mt-1 text-sm text-slate-500">{tournament?.name}</p>
              </div>
              <button type="button" onClick={() => setQuestionsModal(null)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              {questionsModal.questions.map((q, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{i + 1}. {q}</label>
                  <input value={questionsModal.answers[i]}
                    onChange={(e) => { const updated = [...questionsModal.answers]; updated[i] = e.target.value; setQuestionsModal({ ...questionsModal, answers: updated }); }}
                    placeholder="Your answer"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setQuestionsModal(null)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="button"
                disabled={questionsModal.answers.some((a) => !a.trim())}
                onClick={async () => { const { answers } = questionsModal; setQuestionsModal(null); await submit(answers); }}
                className="flex-1 rounded-xl bg-[#ed1c24] py-3 text-sm font-bold text-white hover:bg-[#c9151e] disabled:opacity-50">
                Continue
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}
