import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Use
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Last updated: September 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                1. Acceptance of Terms
              </h2>

              <p>
                By accessing or using the Mumbai Boxing Association website
                and portal, you agree to use the services responsibly and in
                accordance with these Terms of Use.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                2. Registration and Accounts
              </h2>

              <p>
                Users must provide accurate information when creating or
                maintaining an account. Account credentials must be kept
                confidential. Submitted information may be reviewed before
                membership or applications are approved.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                3. Tournament and Membership Information
              </h2>

              <p>
                Tournament registrations, historical tournament records,
                membership details, and supporting documents must be accurate.
                Submitted records may be subject to association verification
                and approval.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                4. Payments
              </h2>

              <p>
                Applicable fees must be paid through the designated payment
                process. Payment records may be maintained by the association
                for administration and verification purposes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                5. Acceptable Use
              </h2>

              <p>
                Users must not misuse the portal, submit knowingly false
                information, attempt unauthorized access, interfere with
                services, or use another person's account or credentials.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                6. Submitted Information
              </h2>

              <p>
                Information and documents submitted through the portal may be
                used for the association service for which they were provided.
                Users are responsible for ensuring that submitted information
                and documents are accurate and legitimate.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                7. Service Availability
              </h2>

              <p>
                Online services may occasionally be unavailable due to
                maintenance, technical issues, or circumstances outside the
                association's control.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                8. Contact
              </h2>

              <p>
                Questions about these terms can be directed to{" "}
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