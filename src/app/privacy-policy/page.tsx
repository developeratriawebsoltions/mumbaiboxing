import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
            Mumbai Boxing Association
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Last updated: September 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                1. Information We Collect
              </h2>

              <p>
                The Mumbai Boxing Association portal may collect information
                required for account creation, membership registration, boxer
                and coach records, academy affiliation, tournament
                participation, certificates, payments, notifications, and
                other association services.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                2. How We Use Information
              </h2>

              <p>
                Information is used to operate the association portal,
                process registrations and applications, maintain membership
                records, manage tournaments, verify submitted records,
                administer certificates, process applicable payments, and
                communicate important association information.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                3. Documents and Verification
              </h2>

              <p>
                Supporting documents submitted for registration, membership,
                or tournament history may be stored and reviewed for
                verification and administration of the relevant service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                4. Account Security
              </h2>

              <p>
                Users are responsible for keeping their account credentials
                confidential and should not share passwords or authentication
                information with other people.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                5. Payments
              </h2>

              <p>
                Payment-related information may be used to manage association
                fees and payment records. Users should only provide payment
                information through the designated payment process.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                6. Sharing of Information
              </h2>

              <p>
                Information may be accessed by authorized association
                personnel and service providers where necessary to operate
                association services, verify records, administer tournaments,
                process payments, or provide requested functionality.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                7. Data Accuracy
              </h2>

              <p>
                Users should provide accurate and current information and
                contact the association if submitted information needs to be
                corrected or updated.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                8. Contact
              </h2>

              <p>
                For privacy-related questions or concerns, contact the Mumbai
                Boxing Association at{" "}
                <a
                  href="mailto:info@mumbaiboxing.org"
                  className="font-medium text-red-600 hover:underline"
                >
                  info@mumbaiboxing.org
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}