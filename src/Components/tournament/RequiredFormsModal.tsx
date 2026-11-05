"use client";

import { X, ChevronRight, ChevronLeft, CheckCircle2, FileText, Upload, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

export type TournamentFormData = {
  // Age Estimation (Annexure-II)
  ageVerification: {
    // Photo
    photograph: string; // base64 data URL
    // A. Informed Consent
    consentGuardianName: string;
    consentCandidateName: string;
    consentSignature: string;
    consentWitnessSignature: string;
    // C. Preamble
    ageCategory: string;
    sportsDiscipline: string;
    eventsToParticipate: string;
    caseSerialNo: string;
    name: string;
    ageAsStated: string;
    sex: string;
    permanentAddress: string;
    correspondingAddress: string;
    schoolCollegeInstitute: string;
    telEmail: string;
    fathersName: string;
    mothersName: string;
    bloodGroup: string;
    accompanyingPersonName: string;
    dateTimeOfExamination: string;
    placeOfExamination: string;
    marksOfIdentification1: string;
    marksOfIdentification2: string;
    thumbImpression: string;
    signature: string;
    // D. General Physical Examination
    heightCm: string;
    weightKg: string;
    chestGirth: string;
    abdominalGirth: string;
    biacromialBreadth: string;
    biliospinaleBreadth: string;
    forearmCircumference: string;
    midThighCircumference: string;
    voice: string;
    // E. Dental Examination
    dentalTemporary: string;
    dentalPermanent: string;
    dentalThirdMolarSpace: string;
    dentalEruptionStatus: string;
    dentalXrayFindings: string;
    // F. Radiological Examination
    xrayShoulderAP: string;
    xrayElbowAPLateral: string;
    xrayHandWristAP: string;
    xrayPelvisHipAP: string;
    dateOfRadiologicalExam: string;
    nameOfRadiographer: string;
    radiologicalFindings: string;
    // G. Age Certificate
    biologicalAge: string;
    consistentWithBirthCert: string;
    ageCertDate: string;
    ageCertDoctorName: string;
    ageCertDesignation: string;
  };
  // BFI Medical Certificate
  medical: {
    // Boxer Info
    boxerName: string;
    dob: string;
    gender: string;
    stateUnit: string;
    boxerSignature: string;
    boxerSignatureDate: string;
    // Doctor Info
    doctorName: string;
    doctorTitle: string;
    doctorOrganisation: string;
    doctorAddress: string;
    doctorComments: string;
    fitnessDeclaration: string; // "fit" | "not_fit"
    // Table 3: Boxer's Health History
    h_medicalConditions: string;
    h_medicalConditionsDetails: string;
    h_surgery: string;
    h_surgeryDetails: string;
    h_hospital: string;
    h_hospitalDetails: string;
    h_suddenDeaths: string;
    h_suddenDeathsDetails: string;
    h_concussion: string;
    h_concussionDetails: string;
    h_seizure: string;
    h_seizureDetails: string;
    h_headaches: string;
    h_headachesDetails: string;
    h_eyeProblems: string;
    h_eyeProblemsDetails: string;
    h_bleeding: string;
    h_bleedingDetails: string;
    h_diabetes: string;
    h_diabetesDetails: string;
    h_hepatitis: string;
    h_hepatitisDetails: string;
    h_liverSpleen: string;
    h_liverSpleenDetails: string;
    h_hernia: string;
    h_herniaDetails: string;
    h_medications: string;
    h_medicationsDetails: string;
    h_allergies: string;
    h_allergiesDetails: string;
    // Table 4: Doctor's Evaluation
    e_concussionFollowUp: string;
    e_concussionFollowUpDetails: string;
    e_generalAppearance: string;
    e_generalAppearanceDetails: string;
    e_mentalStatus: string;
    e_mentalStatusDetails: string;
    e_neurological: string;
    e_neurologicalDetails: string;
    e_cranialNerves: string;
    e_cranialNervesDetails: string;
    e_mouthTeeth: string;
    e_mouthTeethDetails: string;
    e_ears: string;
    e_earsDetails: string;
    e_tmj: string;
    e_tmjDetails: string;
    e_neck: string;
    e_neckDetails: string;
    e_chest: string;
    e_chestDetails: string;
    e_cardiovascular: string;
    e_cardiovascularDetails: string;
    e_musculoskeletal: string;
    e_musculoskeletalDetails: string;
    e_abdominal: string;
    e_abdominalDetails: string;
    e_tues: string;
    e_tuesDetails: string;
  };
  // Non-Pregnancy Declaration (girls only)
  nonPregnancy?: {
    boxerName: string;
    dob: string;
    declarationDate: string;
    parentGuardianName: string;
    signature: string;
  };
};

type Props = {
  tournamentName: string;
  isGirl: boolean;
  boxerName?: string;
  boxerDob?: string;
  onClose: () => void;
  onSubmit: (data: TournamentFormData) => Promise<void>;
};

const STEPS = ["Age Verification", "Medical Certificate", "Declaration"];

export default function RequiredFormsModal({
  tournamentName,
  isGirl,
  boxerName = "",
  boxerDob = "",
  onClose,
  onSubmit,
}: Props) {
  const totalSteps = isGirl ? 3 : 2;
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [ageForm, setAgeForm] = useState({
    // Photo
    photograph: "",
    // A. Informed Consent
    consentGuardianName: "",
    consentCandidateName: boxerName,
    consentSignature: "",
    consentWitnessSignature: "",
    // C. Preamble
    ageCategory: "",
    sportsDiscipline: "Boxing",
    eventsToParticipate: "",
    caseSerialNo: "",
    name: boxerName,
    ageAsStated: "",
    sex: "",
    permanentAddress: "",
    correspondingAddress: "",
    schoolCollegeInstitute: "",
    telEmail: "",
    fathersName: "",
    mothersName: "",
    bloodGroup: "",
    accompanyingPersonName: "",
    dateTimeOfExamination: today,
    placeOfExamination: "",
    marksOfIdentification1: "",
    marksOfIdentification2: "",
    thumbImpression: "",
    signature: "",
    // D. General Physical Examination
    heightCm: "",
    weightKg: "",
    chestGirth: "",
    abdominalGirth: "",
    biacromialBreadth: "",
    biliospinaleBreadth: "",
    forearmCircumference: "",
    midThighCircumference: "",
    voice: "",
    // E. Dental Examination
    dentalTemporary: "",
    dentalPermanent: "",
    dentalThirdMolarSpace: "",
    dentalEruptionStatus: "",
    dentalXrayFindings: "",
    // F. Radiological Examination
    xrayShoulderAP: "",
    xrayElbowAPLateral: "",
    xrayHandWristAP: "",
    xrayPelvisHipAP: "",
    dateOfRadiologicalExam: today,
    nameOfRadiographer: "",
    radiologicalFindings: "",
    // G. Age Certificate
    biologicalAge: "",
    consistentWithBirthCert: "consistent",
    ageCertDate: today,
    ageCertDoctorName: "",
    ageCertDesignation: "",
  });

  const [medForm, setMedForm] = useState({
    // Boxer Info
    boxerName,
    dob: boxerDob,
    gender: "",
    stateUnit: "",
    boxerSignature: "",
    boxerSignatureDate: today,
    // Doctor Info
    doctorName: "",
    doctorTitle: "",
    doctorOrganisation: "",
    doctorAddress: "",
    doctorComments: "",
    fitnessDeclaration: "",
    // Table 3
    h_medicalConditions: "", h_medicalConditionsDetails: "",
    h_surgery: "", h_surgeryDetails: "",
    h_hospital: "", h_hospitalDetails: "",
    h_suddenDeaths: "", h_suddenDeathsDetails: "",
    h_concussion: "", h_concussionDetails: "",
    h_seizure: "", h_seizureDetails: "",
    h_headaches: "", h_headachesDetails: "",
    h_eyeProblems: "", h_eyeProblemsDetails: "",
    h_bleeding: "", h_bleedingDetails: "",
    h_diabetes: "", h_diabetesDetails: "",
    h_hepatitis: "", h_hepatitisDetails: "",
    h_liverSpleen: "", h_liverSpleenDetails: "",
    h_hernia: "", h_herniaDetails: "",
    h_medications: "", h_medicationsDetails: "",
    h_allergies: "", h_allergiesDetails: "",
    // Table 4
    e_concussionFollowUp: "", e_concussionFollowUpDetails: "",
    e_generalAppearance: "", e_generalAppearanceDetails: "",
    e_mentalStatus: "", e_mentalStatusDetails: "",
    e_neurological: "", e_neurologicalDetails: "",
    e_cranialNerves: "", e_cranialNervesDetails: "",
    e_mouthTeeth: "", e_mouthTeethDetails: "",
    e_ears: "", e_earsDetails: "",
    e_tmj: "", e_tmjDetails: "",
    e_neck: "", e_neckDetails: "",
    e_chest: "", e_chestDetails: "",
    e_cardiovascular: "", e_cardiovascularDetails: "",
    e_musculoskeletal: "", e_musculoskeletalDetails: "",
    e_abdominal: "", e_abdominalDetails: "",
    e_tues: "", e_tuesDetails: "",
  });

  const [nonPregForm, setNonPregForm] = useState({
    boxerName,
    dob: boxerDob,
    declarationDate: today,
    parentGuardianName: "",
    signature: "",
  });

  function validateStep() {
    if (step === 0) {
      if (!ageForm.name.trim()) return "Candidate name is required.";
      if (!ageForm.ageCategory.trim()) return "Age category is required.";
      if (!ageForm.permanentAddress.trim()) return "Permanent address is required.";
      if (!ageForm.fathersName.trim()) return "Father's name is required.";
      if (!ageForm.ageCertDoctorName.trim()) return "Doctor name (Age Certificate) is required.";
      if (!ageForm.biologicalAge.trim()) return "Biological age is required.";
    }
    if (step === 1) {
      if (!medForm.boxerName.trim()) return "Boxer name is required.";
      if (!medForm.dob.trim()) return "Date of birth is required.";
      if (!medForm.doctorName.trim()) return "Doctor name is required.";
      if (!medForm.fitnessDeclaration) return "Boxer fitness declaration is required.";
    }
    if (step === 2 && isGirl) {
      if (!nonPregForm.parentGuardianName.trim()) return "Parent/Guardian name is required.";
      if (!nonPregForm.signature.trim()) return "Signature (full name) is required.";
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        ageVerification: ageForm,
        medical: medForm,
        ...(isGirl ? { nonPregnancy: nonPregForm } : {}),
      });
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="bg-[#07172c] px-6 py-5 text-white flex items-start justify-between gap-3 shrink-0">
          <div>
            <h3 className="text-2xl font-black">Tournament Registration Forms</h3>
            <p className="mt-1 text-base text-slate-300">{tournamentName}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/20 p-1.5 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 border-b border-slate-100 bg-slate-50 px-6 py-3 shrink-0">
          {STEPS.slice(0, totalSteps).map((label, i) => (
            <div key={i} className="flex items-center gap-0 flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-[#ed1c24] text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-base font-semibold truncate ${i === step ? "text-[#07172c]" : "text-slate-400"}`}>{label}</span>
              </div>
              {i < totalSteps - 1 && <div className="mx-2 h-px flex-1 bg-slate-200" />}
            </div>
          ))}
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 0 && (
            <AgeVerificationForm data={ageForm} onChange={setAgeForm} />
          )}
          {step === 1 && (
            <MedicalCertificateForm data={medForm} onChange={setMedForm} />
          )}
          {step === 2 && isGirl && (
            <NonPregnancyForm data={nonPregForm} onChange={setNonPregForm} />
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base font-semibold text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={step === 0 ? onClose : () => { setError(""); setStep((s) => s - 1); }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={isLastStep ? () => void handleSubmit() : next}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ed1c24] py-3 text-base font-bold text-white hover:bg-[#c9151e] disabled:opacity-50"
          >
            {isLastStep
              ? submitting ? "Submitting..." : "Submit & Register"
              : <><span>Next</span><ChevronRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Age Estimation Form (Annexure-II) ─────────────────────────── */
function AgeVerificationForm({
  data,
  onChange,
}: {
  data: TournamentFormData["ageVerification"];
  onChange: (d: TournamentFormData["ageVerification"]) => void;
}) {
  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [k]: e.target.value });

  return (
    <div className="space-y-6">
      {/* Header row: title + photo box */}
      <div className="flex items-start justify-between gap-4">
        <FormSectionTitle icon={<FileText className="h-4 w-4" />} title="Age Estimation Format — Annexure-II" subtitle="No. F.32-18/2009-SP-III · Govt. of India, Ministry of Youth Affairs and Sports" />
        <PhotoUpload
          value={data.photograph}
          onChange={(v) => onChange({ ...data, photograph: v })}
        />
      </div>

      {/* A. Informed Consent */}
      <SectionHeading label="A. Informed Consent" />
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-base text-slate-600 leading-6">
        I voluntarily give my consent for complete medical examination for the purpose of age estimation. I understand that this examination may involve physical examination including genital examination, dental examination and radiography.
        <br /><span className="text-slate-400 mt-1 block">(Note: Consent by guardian is essential in respect of athletes below 12 years)</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="I (Guardian Name)">
          <input value={data.consentGuardianName} onChange={set("consentGuardianName")} placeholder="S/D/O or Guardian of" className={inputCls} />
        </Field>
        <Field label="Candidate Name">
          <input value={data.consentCandidateName} onChange={set("consentCandidateName")} className={inputCls} />
        </Field>
        <Field label="Signature of Candidate / Guardian">
          <input value={data.consentSignature} onChange={set("consentSignature")} placeholder="Type full name as signature" className={inputCls} />
        </Field>
        <Field label="Signature of Accompanying Person / Witness">
          <input value={data.consentWitnessSignature} onChange={set("consentWitnessSignature")} placeholder="Type full name as signature" className={inputCls} />
        </Field>
      </div>

      {/* C. Preamble */}
      <SectionHeading label="C. Preamble" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="1. Age Category *" required>
          <input value={data.ageCategory} onChange={set("ageCategory")} placeholder="e.g. Youth, Junior, Senior" className={inputCls} />
        </Field>
        <Field label="2. Sports Discipline">
          <input value={data.sportsDiscipline} onChange={set("sportsDiscipline")} className={inputCls} />
        </Field>
        <Field label="3. Events to be Participated">
          <input value={data.eventsToParticipate} onChange={set("eventsToParticipate")} placeholder="e.g. 60kg Boxing" className={inputCls} />
        </Field>
        <Field label="4. Case Serial No.">
          <input value={data.caseSerialNo} onChange={set("caseSerialNo")} className={inputCls} />
        </Field>
        <Field label="5. Name *" required>
          <input value={data.name} onChange={set("name")} className={inputCls} />
        </Field>
        <Field label="6. Age as Stated (documentary evidence)">
          <input value={data.ageAsStated} onChange={set("ageAsStated")} placeholder="e.g. 18 years (Birth Certificate)" className={inputCls} />
        </Field>
        <Field label="7. Sex">
          <select value={data.sex} onChange={set("sex")} className={inputCls}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </Field>
        <Field label="14. Blood Group">
          <input value={data.bloodGroup} onChange={set("bloodGroup")} placeholder="e.g. O+" className={inputCls} />
        </Field>
        <Field label="12. Father's Name *" required>
          <input value={data.fathersName} onChange={set("fathersName")} className={inputCls} />
        </Field>
        <Field label="13. Mother's Name">
          <input value={data.mothersName} onChange={set("mothersName")} className={inputCls} />
        </Field>
        <Field label="10. School / College / Institute">
          <input value={data.schoolCollegeInstitute} onChange={set("schoolCollegeInstitute")} className={inputCls} />
        </Field>
        <Field label="11. Tel. No. & Email">
          <input value={data.telEmail} onChange={set("telEmail")} placeholder="Phone / email" className={inputCls} />
        </Field>
        <Field label="15. Name of Accompanying Person">
          <input value={data.accompanyingPersonName} onChange={set("accompanyingPersonName")} className={inputCls} />
        </Field>
        <Field label="16. Date & Time of Examination">
          <input type="datetime-local" value={data.dateTimeOfExamination} onChange={set("dateTimeOfExamination")} className={inputCls} />
        </Field>
        <Field label="17. Place of Examination">
          <input value={data.placeOfExamination} onChange={set("placeOfExamination")} className={inputCls} />
        </Field>
      </div>
      <Field label="8. Permanent Address *" required>
        <textarea value={data.permanentAddress} onChange={set("permanentAddress")} rows={2} className={inputCls} />
      </Field>
      <Field label="9. Corresponding Address">
        <textarea value={data.correspondingAddress} onChange={set("correspondingAddress")} rows={2} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="18. Marks of Identification 1 (Scar/mole/deformity)">
          <input value={data.marksOfIdentification1} onChange={set("marksOfIdentification1")} className={inputCls} />
        </Field>
        <Field label="18. Marks of Identification 2">
          <input value={data.marksOfIdentification2} onChange={set("marksOfIdentification2")} className={inputCls} />
        </Field>
        <Field label="16. Thumb Impression (Right — Female / Left — Male)">
          <input value={data.thumbImpression} onChange={set("thumbImpression")} placeholder="Describe or note" className={inputCls} />
        </Field>
        <Field label="17. Signature">
          <input value={data.signature} onChange={set("signature")} placeholder="Type full name as signature" className={inputCls} />
        </Field>
      </div>

      {/* D. General Physical Examination */}
      <SectionHeading label="D. General Physical Examination" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="1. Height (cm)">
          <input value={data.heightCm} onChange={set("heightCm")} placeholder="e.g. 170" className={inputCls} />
        </Field>
        <Field label="2. Weight (kg)">
          <input value={data.weightKg} onChange={set("weightKg")} placeholder="e.g. 60" className={inputCls} />
        </Field>
        <Field label="3. Chest Girth at Nipple Level">
          <input value={data.chestGirth} onChange={set("chestGirth")} placeholder="cm" className={inputCls} />
        </Field>
        <Field label="4. Abdominal Girth at Naval Level">
          <input value={data.abdominalGirth} onChange={set("abdominalGirth")} placeholder="cm" className={inputCls} />
        </Field>
        <Field label="5-I. Biacromial Breadth (cm)">
          <input value={data.biacromialBreadth} onChange={set("biacromialBreadth")} className={inputCls} />
        </Field>
        <Field label="5-II. Biliospinale Breadth (cm)">
          <input value={data.biliospinaleBreadth} onChange={set("biliospinaleBreadth")} className={inputCls} />
        </Field>
        <Field label="5-III. Forearm Circumference (cm) — Males">
          <input value={data.forearmCircumference} onChange={set("forearmCircumference")} className={inputCls} />
        </Field>
        <Field label="5-IV. Mid Thigh Circumference (cm) — Females">
          <input value={data.midThighCircumference} onChange={set("midThighCircumference")} className={inputCls} />
        </Field>
        <Field label="6. Voice (Hoarseness)">
          <input value={data.voice} onChange={set("voice")} placeholder="Normal / Hoarse" className={inputCls} />
        </Field>
      </div>

      {/* E. Dental Examination */}
      <SectionHeading label="E. Dental Examination" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="a. Temporary Teeth">
          <input value={data.dentalTemporary} onChange={set("dentalTemporary")} className={inputCls} />
        </Field>
        <Field label="b. Permanent Teeth">
          <input value={data.dentalPermanent} onChange={set("dentalPermanent")} className={inputCls} />
        </Field>
        <Field label="c. Space for Third Molar">
          <input value={data.dentalThirdMolarSpace} onChange={set("dentalThirdMolarSpace")} className={inputCls} />
        </Field>
        <Field label="d. Partially / Completely Erupted">
          <input value={data.dentalEruptionStatus} onChange={set("dentalEruptionStatus")} className={inputCls} />
        </Field>
      </div>
      <Field label="iii. Dental X-ray (OPG) Findings">
        <textarea value={data.dentalXrayFindings} onChange={set("dentalXrayFindings")} rows={2} className={inputCls} />
      </Field>

      {/* F. Radiological Examination */}
      <SectionHeading label="F. Radiological Examination" />
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-base text-slate-500 leading-6">
        Note: A single film of hand and wrist is sufficient for age below 13 years.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="i. Shoulder Joint — AP View Findings">
          <input value={data.xrayShoulderAP} onChange={set("xrayShoulderAP")} className={inputCls} />
        </Field>
        <Field label="ii. Elbow Joint — AP & Lateral Findings">
          <input value={data.xrayElbowAPLateral} onChange={set("xrayElbowAPLateral")} className={inputCls} />
        </Field>
        <Field label="iii. Hand with Wrist — AP Findings">
          <input value={data.xrayHandWristAP} onChange={set("xrayHandWristAP")} className={inputCls} />
        </Field>
        <Field label="iv. Pelvis with Hip Joint — AP Findings">
          <input value={data.xrayPelvisHipAP} onChange={set("xrayPelvisHipAP")} className={inputCls} />
        </Field>
        <Field label="Date of Radiological Examination">
          <input type="date" value={data.dateOfRadiologicalExam} onChange={set("dateOfRadiologicalExam")} className={inputCls} />
        </Field>
        <Field label="Name of Radiographer">
          <input value={data.nameOfRadiographer} onChange={set("nameOfRadiographer")} className={inputCls} />
        </Field>
      </div>
      <Field label="Radiological Findings (S.No. / X-ray / Findings / Age Inference)">
        <textarea value={data.radiologicalFindings} onChange={set("radiologicalFindings")} rows={3} placeholder="Describe findings and age inference" className={inputCls} />
      </Field>

      {/* G. Age Certificate */}
      <SectionHeading label="G. Age Certificate" />
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-base text-blue-700 leading-6">
        After performing general physical, dental and radiological examination, we are of the considered opinion that the biological age of the person is about <strong>{data.biologicalAge || "___"}</strong> years which is <strong>{data.consistentWithBirthCert}</strong> with birth certificate / age document.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Biological Age (years) *" required>
          <input value={data.biologicalAge} onChange={set("biologicalAge")} placeholder="e.g. 18" className={inputCls} />
        </Field>
        <Field label="Consistent / Not Consistent with Birth Certificate">
          <select value={data.consistentWithBirthCert} onChange={set("consistentWithBirthCert")} className={inputCls}>
            <option value="consistent">Consistent</option>
            <option value="not consistent">Not Consistent</option>
          </select>
        </Field>
        <Field label="Date">
          <input type="date" value={data.ageCertDate} onChange={set("ageCertDate")} className={inputCls} />
        </Field>
        <Field label="Doctor Name *" required>
          <input value={data.ageCertDoctorName} onChange={set("ageCertDoctorName")} className={inputCls} />
        </Field>
        <Field label="Designation">
          <input value={data.ageCertDesignation} onChange={set("ageCertDesignation")} placeholder="e.g. MBBS, MS Ortho" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

/* ─── BFI Medical Certificate Form ──────────────────────────────── */
function MedicalCertificateForm({
  data,
  onChange,
}: {
  data: TournamentFormData["medical"];
  onChange: (d: TournamentFormData["medical"]) => void;
}) {
  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [k]: e.target.value });

  const yesNo = (
    <>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </>
  );

  const normalAbnormal = (
    <>
      <option value="">Select</option>
      <option value="Normal">Normal</option>
      <option value="Abnormal">Abnormal</option>
    </>
  );

  return (
    <div className="space-y-5">
      <FormSectionTitle icon={<FileText className="h-4 w-4" />} title="BFI Medical Certificate" subtitle="To be filled based on doctor's examination" />

      {/* Boxer Info */}
      <SectionHeading label="Boxer Information" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name *" required>
          <input value={data.boxerName} onChange={set("boxerName")} placeholder="Full name" className={inputCls} />
        </Field>
        <Field label="Date of Birth *" required>
          <input type="date" value={data.dob} onChange={set("dob")} className={inputCls} />
        </Field>
        <Field label="Gender">
          <select value={data.gender} onChange={set("gender")} className={inputCls}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>
        <Field label="State Unit / Board">
          <input value={data.stateUnit} onChange={set("stateUnit")} className={inputCls} />
        </Field>
        <Field label="Boxer's Signature (type full name)">
          <input value={data.boxerSignature} onChange={set("boxerSignature")} placeholder="Type full name" className={inputCls} />
        </Field>
        <Field label="Date of Signature">
          <input type="date" value={data.boxerSignatureDate} onChange={set("boxerSignatureDate")} className={inputCls} />
        </Field>
      </div>

      {/* Doctor Info */}
      <SectionHeading label="Table 2: Doctor's Information" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Doctor Full Name *" required>
          <input value={data.doctorName} onChange={set("doctorName")} placeholder="Dr. Full Name" className={inputCls} />
        </Field>
        <Field label="Title / Position">
          <input value={data.doctorTitle} onChange={set("doctorTitle")} placeholder="e.g. MBBS, MD" className={inputCls} />
        </Field>
        <Field label="Name of Organisation">
          <input value={data.doctorOrganisation} onChange={set("doctorOrganisation")} className={inputCls} />
        </Field>
      </div>
      <Field label="Work Address">
        <textarea value={data.doctorAddress} onChange={set("doctorAddress")} rows={2} placeholder="Clinic / hospital address" className={inputCls} />
      </Field>
      <Field label="Comments (if any)">
        <textarea value={data.doctorComments} onChange={set("doctorComments")} rows={2} className={inputCls} />
      </Field>
      <Field label="Boxer's Fitness to Box *" required>
        <select value={data.fitnessDeclaration} onChange={set("fitnessDeclaration")} className={inputCls}>
          <option value="">Select</option>
          <option value="fit">Fit to box</option>
          <option value="not_fit">Not fit to box</option>
        </select>
      </Field>

      {/* Table 3 */}
      <SectionHeading label="Table 3: Boxer's Health History" />
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-base text-slate-500">
        Must be answered by the boxer
      </div>
      {([
        ["h_medicalConditions", "h_medicalConditionsDetails", "Do you have any medical conditions?"],
        ["h_surgery", "h_surgeryDetails", "Have you ever had any surgery?"],
        ["h_hospital", "h_hospitalDetails", "Have you ever had to stay in a hospital?"],
        ["h_suddenDeaths", "h_suddenDeathsDetails", "Does your family have a history of sudden unexpected deaths?"],
        ["h_concussion", "h_concussionDetails", "Have you ever had a concussion or loss of consciousness?"],
        ["h_seizure", "h_seizureDetails", "Do you have any seizure activity in the past 3 years?"],
        ["h_headaches", "h_headachesDetails", "Have you had any headaches in the last two (2) weeks?"],
        ["h_eyeProblems", "h_eyeProblemsDetails", "Do you have any eye problems, such as retinal detachment?"],
        ["h_bleeding", "h_bleedingDetails", "Do you have any problems with bleeding or blood disorders?"],
        ["h_diabetes", "h_diabetesDetails", "Do you have any uncontrolled diabetes or thyroid disorders?"],
        ["h_hepatitis", "h_hepatitisDetails", "Do you have a history of hepatitis B, hepatitis C, or HIV infection?"],
        ["h_liverSpleen", "h_liverSpleenDetails", "Do you have an enlarged liver or spleen?"],
        ["h_hernia", "h_herniaDetails", "Do you have any hernia, or tumour?"],
        ["h_medications", "h_medicationsDetails", "Do you use any medications? (list names and dosages)"],
        ["h_allergies", "h_allergiesDetails", "Do you have any allergies?"],
      ] as [keyof typeof data, keyof typeof data, string][]).map(([yesKey, detailKey, question]) => (
        <div key={yesKey} className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-end border-b border-slate-100 pb-3">
          <Field label={question}>
            <select value={data[yesKey] as string} onChange={set(yesKey)} className={inputCls}>{yesNo}</select>
          </Field>
          <span />
          <Field label="If yes, provide details">
            <input value={data[detailKey] as string} onChange={set(detailKey)} placeholder="Details..." className={inputCls} />
          </Field>
        </div>
      ))}

      {/* Table 4 */}
      <SectionHeading label="Table 4: Doctor's Evaluation" />
      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-base text-slate-500">
        Must be answered by the doctor
      </div>
      {([
        ["e_concussionFollowUp", "e_concussionFollowUpDetails", "If boxer had a concussion within last 12 months, confirm medical exam following rest period was normal"],
        ["e_generalAppearance", "e_generalAppearanceDetails", "General appearance"],
        ["e_mentalStatus", "e_mentalStatusDetails", "Mental status / psychological state"],
        ["e_neurological", "e_neurologicalDetails", "Neurological system (Reflexes, balance, verbal & motor responses)"],
        ["e_cranialNerves", "e_cranialNervesDetails", "Cranial nerves, eyes, pupil size & reactivity, fundi, vision by chart"],
        ["e_mouthTeeth", "e_mouthTeethDetails", "Mouth, teeth, throat"],
        ["e_ears", "e_earsDetails", "Ears"],
        ["e_tmj", "e_tmjDetails", "Temporomandibular joint"],
        ["e_neck", "e_neckDetails", "Neck (Cervical spine, lymph nodes)"],
        ["e_chest", "e_chestDetails", "Chest (Breath sounds, crackles, wheezes, rib tenderness on compression)"],
        ["e_cardiovascular", "e_cardiovascularDetails", "Cardiovascular system (Pulse, blood pressure, heart sounds, murmurs, heaves, size, rhythm)"],
        ["e_musculoskeletal", "e_musculoskeletalDetails", "Musculoskeletal system (Upper & lower limbs)"],
        ["e_abdominal", "e_abdominalDetails", "Abdominal (Hernia, aneurysm)"],
      ] as [keyof typeof data, keyof typeof data, string][]).map(([assessKey, detailKey, label]) => (
        <div key={assessKey} className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-end border-b border-slate-100 pb-3">
          <Field label={label}>
            <select value={data[assessKey] as string} onChange={set(assessKey)} className={inputCls}>{normalAbnormal}</select>
          </Field>
          <span />
          <Field label="If abnormal, provide details">
            <input value={data[detailKey] as string} onChange={set(detailKey)} placeholder="Details..." className={inputCls} />
          </Field>
        </div>
      ))}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-end">
        <Field label="Has the boxer submitted any TUEs?">
          <select value={data.e_tues} onChange={set("e_tues")} className={inputCls}>{yesNo}</select>
        </Field>
        <span />
        <Field label="If yes, list TUEs">
          <input value={data.e_tuesDetails} onChange={set("e_tuesDetails")} placeholder="List TUEs..." className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

/* ─── Non-Pregnancy Declaration Form ────────────────────────────── */
function NonPregnancyForm({
  data,
  onChange,
}: {
  data: NonNullable<TournamentFormData["nonPregnancy"]>;
  onChange: (d: NonNullable<TournamentFormData["nonPregnancy"]>) => void;
}) {
  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [k]: e.target.value });

  return (
    <div className="space-y-5">
      <FormSectionTitle icon={<FileText className="h-4 w-4" />} title="Declaration of Non-Pregnancy" subtitle="Required for all girl boxers — BFI mandate" />

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-base text-amber-800 leading-6">
        As per BFI rules, all female boxers must submit a declaration confirming they are not pregnant at the time of the tournament.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Boxer Full Name *">
          <input value={data.boxerName} onChange={set("boxerName")} placeholder="Full name" className={inputCls} />
        </Field>
        <Field label="Date of Birth *">
          <input type="date" value={data.dob} onChange={set("dob")} className={inputCls} />
        </Field>
        <Field label="Parent / Guardian Name *">
          <input value={data.parentGuardianName} onChange={set("parentGuardianName")} placeholder="Full name" className={inputCls} />
        </Field>
        <Field label="Declaration Date *">
          <input type="date" value={data.declarationDate} onChange={set("declarationDate")} className={inputCls} />
        </Field>
      </div>

      <Field label="Signature (Type full name as signature) *">
        <input value={data.signature} onChange={set("signature")} placeholder="Type your full name" className={inputCls} />
      </Field>

      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-base text-slate-600 leading-6">
        I / We hereby solemnly declare that the above-named boxer is <strong>not pregnant</strong> at the time of this tournament and is fit to participate. This declaration is true to the best of my knowledge.
      </div>
    </div>
  );
}

/* ─── Photo Upload ───────────────────────────────────────────────── */
function PhotoUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="shrink-0">
      <p className="mb-1.5 text-center text-[10px] font-semibold text-slate-500 leading-4">
        Colour Photograph<br />
        <span className="text-slate-400">(attested by Gazetted Officer)</span>
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-28 w-24 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Photograph" className="h-full w-full object-cover" />
        ) : (
          <>
            <ImageIcon className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Upload photo</span>
          </>
        )}
        {value && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition">
            <Upload className="h-5 w-5 text-white" />
          </div>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-1 w-full text-center text-[10px] text-red-500 hover:underline"
        >
          Remove
        </button>
      )}
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-white";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-base font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function FormSectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
      <div>
        <p className="text-lg font-black text-[#07172c]">{title}</p>
        <p className="text-base text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <p className="text-base font-extrabold uppercase tracking-wider text-[#ed1c24] border-b border-red-100 pb-1">{label}</p>
  );
}
