'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Existing registration APIs are preserved:
// /api/auth/me, /api/otp/send, /api/otp/verify, /api/register,
// /api/upload, /api/payments/create-order, /api/payments/verify

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const ROLES = ['Boxer', 'Coach', 'Academy'] as const;
type Role = (typeof ROLES)[number];
type Step = 1 | 2 | 3 | 4;

const inputStyle = {
  background: '#F1F5F9',
  border: '1px solid rgba(220,38,38,0.25)',
  color: '#1E293B',
};

const steps = [
  { number: 1, title: 'Basic Details', short: 'Profile' },
  { number: 2, title: 'Additional Details', short: 'Details' },
  { number: 3, title: 'Verify & Documents', short: 'Verification' },
  { number: 4, title: 'Payment', short: 'Payment' },
] as const;

function Field({
  label,
  placeholder,
  type = 'text',
  required = true,
  name,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
        {label}
        {required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#DC2626')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(220,38,38,0.18)')}
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  required = true,
  name,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
        {label}
        {required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{ ...inputStyle, appearance: 'none' }}
        onFocus={(e) => (e.target.style.borderColor = '#DC2626')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(220,38,38,0.18)')}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
        {label}<span style={{ color: '#DC2626' }}> *</span>
      </label>
      <div className="flex gap-5">
        {['Male', 'Female'].map((gender) => (
          <label
            key={gender}
            className="flex cursor-pointer items-center gap-2 text-sm"
            style={{ color: '#94A3B8' }}
          >
            <input
              type="radio"
              name={name}
              value={gender}
              checked={value === gender}
              onChange={onChange}
              className="accent-red-600"
              required
            />
            {gender}
          </label>
        ))}
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  placeholder,
  required = true,
  name,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
        {label}
        {required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#DC2626')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(220,38,38,0.18)')}
      />
    </div>
  );
}

function FileField({
  label,
  onFileSelect,
  selectedFile,
}: {
  label: string;
  onFileSelect: (fieldName: string, file: File | null) => void;
  selectedFile?: File;
}) {
  const fieldName = label.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '').toLowerCase();

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
        {label}<span style={{ color: '#DC2626' }}> *</span>
      </label>
      <label
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl py-5 transition-all"
        style={{ ...inputStyle, borderStyle: 'dashed' }}
      >
        <span className="mb-1 max-w-full truncate px-3 text-center text-xs" style={{ color: '#64748B' }}>
          {selectedFile?.name || 'Click to upload · Max 10 MB'}
        </span>
        <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>
          {selectedFile ? 'Change file' : 'Browse file'}
        </span>
        <input
          type="file"
          name={fieldName}
          data-label={label}
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => onFileSelect(fieldName, e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold" style={{ color: '#1E293B' }}>
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs leading-5" style={{ color: '#64748B' }}>
          {description}
        </p>
      )}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="mb-7">
      <div className="flex items-start justify-between gap-1">
        {steps.map((item, index) => {
          const completed = step > item.number;
          const active = step === item.number;
          return (
            <div key={item.number} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all"
                  style={
                    active || completed
                      ? { background: 'linear-gradient(135deg,#DC2626,#EF4444)', color: '#FFFFFF' }
                      : { background: '#E2E8F0', color: '#64748B', border: '1px solid rgba(220,38,38,0.14)' }
                  }
                >
                  {completed ? '✓' : item.number}
                </div>
                <span
                  className="mt-2 hidden text-center text-[10px] font-semibold sm:block"
                  style={{ color: active ? '#1E293B' : '#64748B' }}
                >
                  {item.short}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="mt-[18px] h-px flex-1"
                  style={{ background: step > item.number ? '#DC2626' : 'rgba(148,163,184,0.15)' }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#94A3B8' }}>
        <span>Step {step} of 4</span>
        <span>{steps[step - 1].title}</span>
      </div>
    </div>
  );
}

function BasicDetails({
  role,
  formData,
  showPass,
  onChange,
  onTogglePassword,
}: {
  role: Role;
  formData: Record<string, string>;
  showPass: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle
        title={`${role} registration`}
        description="Start with your basic account information. You can complete the remaining details on the next step."
      />

      <Field
        label={role === 'Academy' ? 'Academy / Club Name' : role === 'Coach' ? 'Full Name of Coach' : 'Boxer Full Name'}
        placeholder={role === 'Academy' ? 'Official academy or club name' : 'Enter full name'}
        name="name"
        value={formData.name || ''}
        onChange={onChange}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={onChange}
        />
        <Field
          label="Mobile Number"
          placeholder="+91 XXXXX XXXXX"
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={onChange}
        />
      </div>

      {role !== 'Academy' && (
        <RadioField
          label="Gender"
          name={role === 'Boxer' ? 'boxerGender' : 'gender'}
          value={formData[role === 'Boxer' ? 'boxerGender' : 'gender'] || ''}
          onChange={onChange}
        />
      )}

      {role !== 'Academy' && (
        <Field
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob || ''}
          onChange={onChange}
        />
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
          Password<span style={{ color: '#DC2626' }}> *</span>
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            required
            minLength={8}
            value={formData.password || ''}
            onChange={onChange}
            className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#DC2626')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(220,38,38,0.18)')}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
            style={{ color: '#94A3B8' }}
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-xs leading-5" style={{ color: '#94A3B8' }}>
        <input type="checkbox" name="termsAccepted" className="mt-1 rounded" required />
        <span>
          I agree to the{' '}
          <Link href="/terms" style={{ color: '#DC2626' }} className="font-semibold hover:underline">
            Terms & Conditions
          </Link>
        </span>
      </label>
    </div>
  );
}

function BoxerAdditionalDetails({
  formData,
  files,
  onChange,
  onFileSelect,
}: {
  formData: Record<string, string>;
  files: Record<string, File>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileSelect: (fieldName: string, file: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Boxer details" description="Add your competition and academy information." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Competition Category" placeholder="e.g. Senior / Junior" name="ageGroup" value={formData.ageGroup || ''} onChange={onChange} />
        <Field label="Aadhaar Number" placeholder="Enter Aadhaar number" name="aadhaar" value={formData.aadhaar || ''} onChange={onChange} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Weight Category Boys"
          name="weight"
          required={false}
          value={formData.weight || ''}
          onChange={onChange}
          options={['47–50 kg', '50–55 kg', '55–60 kg', '60–65 kg', '65–70 kg', '70–75 kg', '75–80 kg', '80–85 kg', '85–90 kg', '+90 kg']}
        />
        <SelectField
          label="Weight Category Girls"
          name="weightGirls"
          required={false}
          value={formData.weightGirls || ''}
          onChange={onChange}
          options={['45–48 kg', '48–51 kg', '51–54 kg', '54–57 kg', '57–60 kg', '60–65 kg', '65–70 kg', '70–75 kg', '75–80 kg', '+80 kg']}
        />
      </div>
      <Field label="Academy / Club" placeholder="Academy name" name="academyName" value={formData.academyName || ''} onChange={onChange} />
      <p className="rounded-xl border px-3 py-2 text-[11px] leading-5" style={{ borderColor: 'rgba(220,38,38,0.12)', color: '#64748B', background: '#F8FAFC' }}>
        Select either the boys or girls weight category as applicable.
      </p>
      <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(220,38,38,0.18)', background: '#F8FAFC' }}>
        <p className="mb-3 text-sm font-semibold" style={{ color: '#1E293B' }}>Documents</p>
        <div className="space-y-3">
          <FileField label="Birth Certificate" selectedFile={files['birth-certificate']} onFileSelect={onFileSelect} />
          <FileField label="Aadhaar Card" selectedFile={files['aadhaar-card']} onFileSelect={onFileSelect} />
          <FileField label="Passport size Photo" selectedFile={files['passport-size-photo']} onFileSelect={onFileSelect} />
          <FileField label="Medical Fitness Certificate by (MBBS) Dr." selectedFile={files['medical-fitness-certificate-by-mbbs-dr-']} onFileSelect={onFileSelect} />
          <FileField label="HIV / Hepatitis B & C Test Report" selectedFile={files['hiv-hepatitis-b-c-test-report']} onFileSelect={onFileSelect} />
        </div>
      </div>
    </div>
  );
}

function CoachAdditionalDetails({
  formData,
  files,
  onChange,
  onFileSelect,
}: {
  formData: Record<string, string>;
  files: Record<string, File>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileSelect: (fieldName: string, file: File | null) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Coach details" description="Add your coaching background, qualifications and centre information." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Academy / Club / School Name" placeholder="Enter academy or club name" name="academyName" value={formData.academyName || ''} onChange={onChange} />
        <Field label="Training Location / Area" placeholder="e.g. Borivali, Mumbai" name="trainingLocation" value={formData.trainingLocation || ''} onChange={onChange} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Coaching Experience" placeholder="e.g. 5 years" name="coachingExperience" value={formData.coachingExperience || ''} onChange={onChange} />
        <Field label="Number of Boxers Training Under You" placeholder="e.g. 12" type="number" name="boxerCount" value={formData.boxerCount || ''} onChange={onChange} />
      </div>
      <TextAreaField
        label="Achievements as a Coach"
        placeholder="Describe your coaching achievements..."
        name="achievements"
        value={formData.achievements || ''}
        onChange={onChange}
      />
      <SelectField
        label="Coaching Qualification"
        name="coachingQualification"
        value={formData.coachingQualification || ''}
        onChange={onChange}
        options={['NIS Certified full diploma', 'NIS Certified 6 week', 'Former National Boxer', 'State Certified (CCCP)', 'Former State Boxer', 'Other']}
      />
      <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(220,38,38,0.18)', background: '#F8FAFC' }}>
        <p className="mb-3 text-sm font-semibold" style={{ color: '#1E293B' }}>Supporting documents</p>
        <div className="space-y-3">
          <FileField label="Upload any boxing certificate" selectedFile={files['upload-any-boxing-certificate']} onFileSelect={onFileSelect} />
          <FileField label="Upload centre photo" selectedFile={files['upload-centre-photo']} onFileSelect={onFileSelect} />
        </div>
      </div>
    </div>
  );
}

function AcademyAdditionalDetails({
  formData,
  onChange,
}: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionTitle title="Academy details" description="Provide the academy location and coach contact information." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="District Name" placeholder="Enter district name" name="district" value={formData.district || ''} onChange={onChange} />
        <SelectField label="Taluka" name="taluka" value={formData.taluka || ''} onChange={onChange} options={['BORIVALI', 'ANDHERI', 'KURLA']} />
      </div>
      <Field label="Coach Name" placeholder="Enter coach name" name="coachName" value={formData.coachName || ''} onChange={onChange} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Coach Mobile Number" placeholder="+91 XXXXX XXXXX" type="tel" name="coachPhone" value={formData.coachPhone || ''} onChange={onChange} />
        <Field label="Coach Email ID" placeholder="coach@example.com" type="email" name="coachEmail" value={formData.coachEmail || ''} onChange={onChange} />
      </div>
    </div>
  );
}

function Review({ role, formData, files }: { role: Role; formData: Record<string, string>; files: Record<string, File> }) {
  const entries = Object.entries(formData).filter(([key, value]) => {
    const hidden = ['password', 'termsAccepted', 'email'];
    return Boolean(value) && !hidden.includes(key);
  });

  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(220,38,38,0.18)', background: '#F8FAFC' }}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1E293B' }}>Review your registration</p>
          <p className="mt-1 text-xs" style={{ color: '#64748B' }}>Check your details before creating the account.</p>
        </div>
        <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(220,38,38,0.12)', color: '#EF4444' }}>
          {role}
        </span>
      </div>
      <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Email</p>
          <p className="mt-1 break-all text-sm" style={{ color: '#1E293B' }}>{formData.email}</p>
        </div>
        {entries.map(([key, value]) => (
          <div key={key}>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="mt-1 break-words text-sm" style={{ color: '#1E293B' }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4" style={{ borderColor: 'rgba(148,163,184,0.10)' }}>
        <p className="text-xs" style={{ color: '#64748B' }}>
          Files selected: <span className="font-semibold" style={{ color: '#1E293B' }}>{Object.keys(files).length}</span>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('Boxer');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [registeredUser, setRegisteredUser] = useState<{ id: number; role: string } | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d?.role) router.replace('/dashboard');
      })
      .catch(() => {});
  }, [router]);

  // Razorpay is loaded once, but payment is still opened only when the user reaches Step 4.
  useEffect(() => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Keep the shared Razorpay script in the document if another part of the app uses it.
    };
  }, []);

  const roleLabel = useMemo(() => `Register as ${role}`, [role]);

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setEmail(value);
  }

  function handleFileSelect(fieldName: string, file: File | null) {
    if (file && file.size > 10 * 1024 * 1024) {
      setError('Each file must be 10 MB or smaller.');
      return;
    }

    setError('');
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[fieldName] = file;
      else delete next[fieldName];
      return next;
    });
  }

  function changeRole(nextRole: Role) {
    if (step !== 1 || nextRole === role) return;
    setRole(nextRole);
    setFormData({});
    setFiles({});
    setEmail('');
    setOtp('');
    setOtpVerified(false);
    setError('');
  }

  function validateStep1(form: HTMLFormElement) {
    if (!form.reportValidity()) return false;
    const password = formData.password?.trim() || '';
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    return true;
  }

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!validateStep1(e.currentTarget)) return;

    const values = { ...formData, role };
    const emailValue = (formData.email ?? '').trim();

    if (!emailValue) {
      setError('Please provide an email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Unable to send OTP');
        return;
      }

      setEmail(emailValue);
      setFormData(values);
      setOtpVerified(false);
      setStep(2);

      if (json.devOtp) setOtp(json.devOtp);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAdditionalNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!e.currentTarget.reportValidity()) return;

    if (role === 'Boxer' && !formData.weight && !formData.weightGirls) {
      setError('Please select a weight category.');
      return;
    }

    setStep(3);
  }

  async function handleVerifyOtp() {
    setError('');
    const cleanOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: cleanOtp }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'OTP verification failed');
        return;
      }

      setOtpVerified(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function validateDocuments() {
    if (role !== 'Boxer') return true;

    const requiredDocuments = [
      'birth-certificate',
      'aadhaar-card',
      'passport-size-photo',
      'medical-fitness-certificate-by-mbbs-dr',
      'hiv-hepatitis-b-c-test-report',
    ];

    const missing = requiredDocuments.some((key) => !files[key]);
    if (missing) {
      setError('Please upload all required boxer documents.');
      return false;
    }

    return true;
  }

  async function handleSubmitRegistration() {
    setError('');

    if (!otpVerified) {
      setError('Please verify your email OTP first.');
      return;
    }

    if (!validateDocuments()) return;

    setLoading(true);

    try {
      const data: Record<string, string> = { ...formData, role };

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Registration failed');
        return;
      }

      const uploadFd = new FormData();
      uploadFd.append('userId', String(json.id));
      let hasFiles = false;

      Object.entries(files).forEach(([key, file]) => {
        if (file instanceof File && file.size > 0) {
          uploadFd.append(key, file);
          hasFiles = true;
        }
      });

      if (hasFiles) {
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFd });
        if (!uploadRes.ok) {
          setError('Registration was created, but some documents could not be uploaded. Please contact support.');
          return;
        }
      }

      setRegisteredUser({ id: json.id, role: json.role });
      setStep(4);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    if (!registeredUser) return;
    setError('');
    setLoading(true);

    try {
      if (!window.Razorpay) {
        setError('Payment gateway is still loading. Please try again.');
        return;
      }

      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: registeredUser.role, userId: registeredUser.id }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) {
        setError(order.error || 'Failed to create order');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: order.currency,
        name: 'Mumbai Boxing Association',
        description: `Annual Registration Fee – ${registeredUser.role}`,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                userId: registeredUser.id,
                role: registeredUser.role,
              }),
            });

            if (verifyRes.ok) {
              setPaymentDone(true);
              setTimeout(() => router.push('/login'), 2500);
            } else {
              setError('Payment verification failed. Contact support.');
            }
          } catch {
            setError('Payment verification failed. Contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: { email },
        theme: { color: '#DC2626' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  }

  const fee = registeredUser?.role === 'boxer' ? '100' : registeredUser?.role === 'coach' ? '1,000' : '1,500';

  return (
    <div className="relative flex h-screen flex-col overflow-y-auto overflow-x-hidden px-4 py-8" style={{ background: '#FFFFFF' }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full animate-glow-pulse"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto w-full max-w-xl animate-fade-up">
        <div className="mb-7 text-center sm:mb-8">
          <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: '#1E293B' }}>Create Account</h1>
          <p className="mt-1 text-sm" style={{ color: '#64748B' }}>Register with Mumbai Boxing Association</p>
        </div>

        <div
          className="rounded-3xl p-5 sm:p-8"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(220,38,38,0.2)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
          }}
        >
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest" style={{ color: '#DC2626' }}>
              Register As
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeRole(r)}
                  disabled={step !== 1}
                  className="rounded-xl py-2.5 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60"
                  style={
                    role === r
                      ? { background: 'linear-gradient(135deg,#DC2626,#EF4444)', color: '#FFFFFF' }
                      : { background: '#F1F5F9', color: '#64748B', border: '1px solid rgba(220,38,38,0.12)' }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Stepper step={step} />

          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <BasicDetails
                role={role}
                formData={formData}
                showPass={showPass}
                onChange={handleFieldChange}
                onTogglePassword={() => setShowPass((prev) => !prev)}
              />
              {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold mt-2 w-full rounded-xl py-3 text-sm font-semibold">
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-5" onSubmit={handleAdditionalNext}>
              {role === 'Boxer' && (
                <BoxerAdditionalDetails formData={formData} files={files} onChange={handleFieldChange} onFileSelect={handleFileSelect} />
              )}
              {role === 'Coach' && (
                <CoachAdditionalDetails formData={formData} files={files} onChange={handleFieldChange} onFileSelect={handleFileSelect} />
              )}
              {role === 'Academy' && <AcademyAdditionalDetails formData={formData} onChange={handleFieldChange} />}

              {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => { setError(''); setStep(1); }}
                  className="w-full rounded-xl py-3 text-sm font-semibold"
                  style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid rgba(220,38,38,0.12)' }}
                >
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn-gold w-full rounded-xl py-3 text-sm font-semibold">
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle
                title="Verify your email"
                description={`We sent a one-time password to ${email}. Verify it before creating your account.`}
              />

              <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(220,38,38,0.18)', background: '#F8FAFC' }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold" style={{ color: '#94A3B8' }}>
                      Enter 6-digit OTP<span style={{ color: '#DC2626' }}> *</span>
                    </label>
                    <input
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setOtpVerified(false);
                      }}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="w-full rounded-xl px-4 py-3 text-sm tracking-[0.3em] outline-none transition-all"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || otpVerified}
                    className="rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: otpVerified ? '#166534' : '#F1F5F9', color: otpVerified ? '#FFFFFF' : '#1E293B', border: '1px solid rgba(220,38,38,0.16)' }}
                  >
                    {otpVerified ? 'Verified ✓' : loading ? 'Checking...' : 'Verify OTP'}
                  </button>
                </div>
              </div>

              <Review role={role} formData={formData} files={files} />

              {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => { setError(''); setStep(2); }}
                  className="w-full rounded-xl py-3 text-sm font-semibold"
                  style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid rgba(220,38,38,0.12)' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRegistration}
                  disabled={loading || !otpVerified}
                  className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating Account...' : roleLabel}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              {paymentDone ? (
                <div className="space-y-3 py-6 text-center">
                  <div className="text-5xl">✅</div>
                  <p className="text-lg font-bold" style={{ color: '#4ADE80' }}>Payment Successful!</p>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>Registration complete. Redirecting to login...</p>
                </div>
              ) : (
                <>
                  <div className="py-2 text-center">
                    <div className="mb-2 text-4xl">🥊</div>
                    <p className="text-lg font-bold" style={{ color: '#1E293B' }}>1-Year Membership Fee</p>
                    <p className="mt-1 text-sm" style={{ color: '#94A3B8' }}>Pay once to activate your membership for 12 months.</p>
                  </div>

                  {/* Membership Card */}
                  <div
                    className="rounded-2xl p-5 space-y-4"
                    style={{ background: 'linear-gradient(135deg,#1E293B 0%,#0F172A 100%)', border: '1px solid rgba(220,38,38,0.3)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#DC2626' }}>Mumbai Boxing Association</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(220,38,38,0.2)', color: '#EF4444' }}
                      >
                        1 Year
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>Member</p>
                      <p className="text-base font-bold" style={{ color: '#F1F5F9' }}>{formData.name || email}</p>
                      <p className="text-xs capitalize mt-0.5" style={{ color: '#94A3B8' }}>{registeredUser?.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Valid From</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#F1F5F9' }}>
                          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Valid Until</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#4ADE80' }}>
                          {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>Membership Fee</p>
                        <p className="text-2xl font-extrabold mt-0.5" style={{ color: '#DC2626' }}>₹{fee}</p>
                      </div>
                      <p className="text-[10px]" style={{ color: '#475569' }}>{email}</p>
                    </div>
                  </div>

                  {/* What's included */}
                  <div className="rounded-xl border px-4 py-3 space-y-2" style={{ borderColor: 'rgba(220,38,38,0.12)', background: '#F8FAFC' }}>
                    <p className="text-xs font-semibold" style={{ color: '#1E293B' }}>Membership includes</p>
                    {(registeredUser?.role === 'boxer'
                      ? ['Official MBA membership card', 'Tournament participation eligibility', 'Rankings & performance tracking', 'Medical record management']
                      : registeredUser?.role === 'coach'
                      ? ['Official MBA coach certification', 'Access to coach dashboard', 'Manage boxer profiles', 'Tournament management access']
                      : ['Official MBA academy registration', 'List boxers & coaches under academy', 'Academy dashboard access', 'Tournament & event participation']
                    ).map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span style={{ color: '#DC2626' }}>✓</span>
                        <span className="text-xs" style={{ color: '#64748B' }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>}

                  <button onClick={handlePayment} disabled={loading} className="btn-gold w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60">
                    {loading ? 'Opening Payment...' : `Pay ₹${fee} & Activate Membership`}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="w-full rounded-xl py-3 text-sm"
                    style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid rgba(220,38,38,0.12)' }}
                  >
                    Skip for now (Pay later)
                  </button>
                </>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs" style={{ color: '#64748B' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#DC2626' }} className="font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: '#94A3B8' }}>
          © 2025 Mumbai Boxing Association. All rights reserved.
        </p>
      </div>
    </div>
  );
}
