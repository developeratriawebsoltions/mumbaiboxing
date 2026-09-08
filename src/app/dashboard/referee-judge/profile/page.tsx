"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  UserRound,
  Award,
} from "lucide-react";
import Link from "next/link";

import DashboardLayout from "@/Components/layout/DashboardLayout";

type RefereeJudge = {
  id: number;
  userId: number;
  name: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;

  designation: string | null;
  officiatingLevel: string | null;
  qualification: string | null;
  officiatingExperience: string | null;
  federationAffiliation: string | null;

  aadhaarPan: string | null;
  tournamentsOfficiated: string | null;
  achievements: string | null;

  address: string | null;

  membershipExpiry: string | null;
  createdAt: string;
  updatedAt: string;
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

  profile: RefereeJudge;
};

export default function RefereeJudgeProfilePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PROFILE
     ========================================================= */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/referee-judge", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              "Failed to load Referee / Judge profile."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =========================================================
     DATE HELPERS
     ========================================================= */

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* =========================================================
     MASK ID
     ========================================================= */

  const maskedIdNumber = useMemo(() => {
    const value = data?.profile?.aadhaarPan;

    if (!value) return "—";

    const clean = value.trim();

    if (clean.length <= 4) {
      return "••••";
    }

    return `${"•".repeat(
      Math.max(0, clean.length - 4)
    )}${clean.slice(-4)}`;
  }, [data]);

  /* =========================================================
     MEMBERSHIP STATUS
     ========================================================= */

  const membershipStatus = useMemo(() => {
    if (!data) {
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700",
      };
    }

    if (data.membership.active) {
      return {
        label: "ACTIVE",
        className:
          "bg-emerald-100 text-emerald-700",
      };
    }

    if (
      data.user.registrationStatus ===
      "PAYMENT_PENDING"
    ) {
      return {
        label: "PAYMENT PENDING",
        className:
          "bg-amber-100 text-amber-700",
      };
    }

    return {
      label:
        data.user.registrationStatus || "Pending",
      className:
        "bg-slate-100 text-slate-600",
    };
  }, [data]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div
              className="
                w-10
                h-10
                border-4
                border-slate-200
                border-t-red-600
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !data?.profile) {
    return (
      <DashboardLayout role="referee_judge">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              text-red-600
            "
          >
            {error || "Profile not found."}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const profile = data.profile;

  /* =========================================================
     MAIN
     ========================================================= */

  return (
    <DashboardLayout role="referee_judge">
      <div className="max-w-[1500px] mx-auto space-y-7 text-slate-900">

        {/* ==================================================
            PAGE HEADER
            ================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            justify-between
            gap-4
          "
        >
          <div>
            <Link
              href="/dashboard/referee-judge"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-500
                hover:text-red-600
                transition-colors
                mb-4
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1
              className="
                text-3xl
                sm:text-[38px]
                font-extrabold
                tracking-tight
                text-[#0b1729]
              "
            >
              My Profile
            </h1>

            <p className="mt-1 text-[16px] text-slate-500">
              View your Referee / Judge membership and
              official information
            </p>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-red-50
              px-4
              py-2
              text-sm
              font-semibold
              text-red-600
              w-fit
            "
          >
            <ShieldCheck size={17} />
            Referee / Judge
          </span>
        </div>

        {/* ==================================================
            PROFILE HERO
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-6
            sm:p-7
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              gap-6
            "
          >
            {/* Avatar */}

            <div
              className="
                w-28
                h-28
                sm:w-32
                sm:h-32
                rounded-full
                bg-red-50
                flex
                items-center
                justify-center
                text-red-600
                shrink-0
                border-4
                border-white
                shadow-md
                ring-1
                ring-slate-200
              "
            >
              <UserRound
                size={58}
                strokeWidth={1.5}
              />
            </div>

            {/* Identity */}

            <div className="flex-1 min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <h2
                  className="
                    text-3xl
                    sm:text-4xl
                    font-bold
                    text-[#0b1729]
                    break-words
                  "
                >
                  {profile.name}
                </h2>

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                    ${membershipStatus.className}
                  `}
                >
                  <CheckCircle2
                    size={15}
                    strokeWidth={2}
                  />

                  {membershipStatus.label}
                </span>
              </div>

              <p className="mt-2 text-base text-slate-500">
                {profile.designation ||
                  "Referee / Judge"}
              </p>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-4
                "
              >
                <MiniInfo
                  icon={<Mail size={16} />}
                  label="Email"
                  value={data.user.email}
                />

                <MiniInfo
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={profile.phone || "—"}
                />

                <MiniInfo
                  icon={<ShieldCheck size={16} />}
                  label="Membership ID"
                  value={data.membership.id || "—"}
                />

                <MiniInfo
                  icon={<CalendarDays size={16} />}
                  label="Membership Expiry"
                  value={formatDate(
                    data.membership.expiry
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            PERSONAL INFORMATION
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <SectionHeader
            icon={<UserRound size={21} />}
            title="Personal Information"
            description="Your basic registered information"
          />

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >
            <DetailCard
              label="Full Name"
              value={profile.name}
              icon={<UserRound size={18} />}
            />

            <DetailCard
              label="Date of Birth"
              value={formatDate(profile.dob)}
              icon={<CalendarDays size={18} />}
            />

            <DetailCard
              label="Gender"
              value={profile.gender || "—"}
              icon={<UserRound size={18} />}
            />

            <DetailCard
              label="Phone Number"
              value={profile.phone || "—"}
              icon={<Phone size={18} />}
            />

            <DetailCard
              label="Email Address"
              value={data.user.email}
              icon={<Mail size={18} />}
            />

            <DetailCard
              label="ID Number"
              value={maskedIdNumber}
              icon={<ShieldCheck size={18} />}
            />
          </div>

          <div className="mt-5">
            <DetailCard
              label="Address"
              value={profile.address || "—"}
              icon={<MapPin size={18} />}
            />
          </div>
        </section>

        {/* ==================================================
            OFFICIATING INFORMATION
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <SectionHeader
            icon={<ShieldCheck size={21} />}
            title="Officiating Information"
            description="Your official Referee / Judge credentials"
          />

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >
            <DetailCard
              label="Designation"
              value={
                profile.designation || "—"
              }
              icon={<BadgeCheck size={18} />}
            />

            <DetailCard
              label="Officiating Level"
              value={
                profile.officiatingLevel || "—"
              }
              icon={<ShieldCheck size={18} />}
            />

            <DetailCard
              label="Qualification"
              value={
                profile.qualification || "—"
              }
              icon={<Award size={18} />}
            />

            <DetailCard
              label="Officiating Experience"
              value={
                profile.officiatingExperience
                  ? `${profile.officiatingExperience} years`
                  : "—"
              }
              icon={<Clock3 size={18} />}
            />

            <DetailCard
              label="Federation Affiliation"
              value={
                profile.federationAffiliation ||
                "—"
              }
              icon={<ShieldCheck size={18} />}
            />

            <DetailCard
              label="Tournaments Officiated"
              value={
                profile.tournamentsOfficiated ||
                "—"
              }
              icon={<Trophy size={18} />}
            />
          </div>
        </section>

        {/* ==================================================
            ACHIEVEMENTS
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <SectionHeader
            icon={<Trophy size={21} />}
            title="Achievements"
            description="Your professional achievements and experience"
          />

          <div
            className="
              rounded-xl
              border
              border-slate-100
              bg-slate-50/70
              px-5
              py-5
              text-sm
              leading-7
              text-slate-700
              whitespace-pre-wrap
            "
          >
            {profile.achievements ||
              "No achievements added."}
          </div>
        </section>

        {/* ==================================================
            MEMBERSHIP
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            overflow-hidden
          "
        >
          <div
            className="
              bg-gradient-to-br
              from-[#ed1c24]
              to-[#c90f17]
              px-6
              py-6
              text-white
              relative
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                -right-6
                -top-8
                w-36
                h-36
                rounded-full
                bg-white/5
              "
            />

            <div className="relative">
              <p className="text-sm font-medium text-red-100">
                MBA MEMBERSHIP
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-tight
                  break-all
                "
              >
                {data.membership.id || "—"}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-5
              "
            >
              <DetailCard
                label="Status"
                value={
                  data.membership.active
                    ? "Active"
                    : data.user.registrationStatus
                }
                icon={<CheckCircle2 size={18} />}
              />

              <DetailCard
                label="Valid From"
                value={formatDate(
                  data.membership.validFrom
                )}
                icon={<CalendarDays size={18} />}
              />

              <DetailCard
                label="Valid Until"
                value={formatDate(
                  data.membership.expiry
                )}
                icon={<CalendarDays size={18} />}
              />

              <DetailCard
                label="Activated On"
                value={formatDate(
                  data.membership.activatedAt
                )}
                icon={<BadgeCheck size={18} />}
              />
            </div>
          </div>
        </section>

        {/* ==================================================
            ACCOUNT INFORMATION
            ================================================== */}

        <section
          className="
            bg-white
            rounded-2xl
            border
            border-slate-100
            shadow-sm
            p-5
            sm:p-6
          "
        >
          <SectionHeader
            icon={<BadgeCheck size={21} />}
            title="Account Information"
            description="Membership account status"
          />

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >
            <DetailCard
              label="Account ID"
              value={String(data.user.id)}
              icon={<BadgeCheck size={18} />}
            />

            <DetailCard
              label="Registration Status"
              value={
                data.user.registrationStatus
              }
              icon={<ShieldCheck size={18} />}
            />

            <DetailCard
              label="Member Since"
              value={formatDate(
                profile.createdAt
              )}
              icon={<CalendarDays size={18} />}
            />
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   SECTION HEADER
   ========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        mb-6
      "
    >
      <div
        className="
          w-10
          h-10
          rounded-xl
          bg-red-50
          text-red-600
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div>
        <h2
          className="
            text-2xl
            font-bold
            text-[#0b1729]
          "
        >
          {title}
        </h2>

        <p className="text-sm text-slate-500 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MINI INFO
   ========================================================= */

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/60
        p-3.5
        min-w-0
      "
    >
      <div className="flex items-center gap-2">
        <span className="text-red-600 shrink-0">
          {icon}
        </span>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-sm font-semibold text-slate-800 break-words">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL CARD
   ========================================================= */

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/50
        p-4
        flex
        items-start
        gap-3
        min-w-0
      "
    >
      <div
        className="
          w-10
          h-10
          shrink-0
          rounded-xl
          bg-white
          border
          border-slate-100
          text-red-600
          flex
          items-center
          justify-center
          shadow-sm
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}