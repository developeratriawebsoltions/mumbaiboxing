import Link from "next/link";
import { ArrowLeft, Mail, Phone, ShieldCheck } from "lucide-react";

export default function GrievancePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ShieldCheck size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                Mumbai Boxing Association
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Grievance Cell
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                A dedicated channel for members and visitors to raise
                concerns regarding association services and the online portal.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                How to raise a grievance
              </h2>

              <p>
                If you have a concern regarding registration, membership,
                tournaments, certificates, payments, academy affiliation,
                account access, or any association service, please contact the
                Mumbai Boxing Association with the relevant details.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Information to include
              </h2>

              <ul className="list-disc space-y-2 pl-5">
                <li>Your name and membership details, if applicable.</li>
                <li>A clear description of your concern.</li>
                <li>Relevant registration, tournament, or payment details.</li>
                <li>Supporting documents or screenshots, where applicable.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Contact the Association
              </h2>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <a
                  href="mailto:info@mumbaiboxing.org"
                  className="flex items-center gap-3 hover:text-red-600"
                >
                  <Mail size={18} />
                  info@mumbaiboxing.org
                </a>

                <a
                  href="tel:+912212345678"
                  className="flex items-center gap-3 hover:text-red-600"
                >
                  <Phone size={18} />
                  +91 22 1234 5678
                </a>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Review process
              </h2>

              <p>
                Grievances will be reviewed based on the information provided.
                Additional information may be requested where necessary.
                Please do not submit passwords, card details, or other
                unnecessary sensitive information through a grievance request.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}