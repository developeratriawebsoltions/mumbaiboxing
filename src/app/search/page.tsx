"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Newspaper, Search, X } from "lucide-react";

import { news } from "@/data/news";

type SearchResult = {
  title: string;
  href: string;
  category: string;
  description: string;
  keywords: string[];
};

const pageResults: SearchResult[] = [
  {
    title: "Home",
    href: "/",
    category: "Page",
    description:
      "Welcome to the Mumbai Boxing Association. Find association updates, tournaments, rankings and more.",
    keywords: ["MBA", "Mumbai", "boxing", "champions"],
  },
  {
    title: "About the Association",
    href: "/about",
    category: "Page",
    description:
      "Learn about the Mumbai Boxing Association and its work to develop boxing across Mumbai.",
    keywords: ["mission", "history", "athletes", "clubs"],
  },
  {
    title: "Boxing Academies",
    href: "/academies",
    category: "Directory",
    description:
      "Explore affiliated boxing academies, clubs and their locations.",
    keywords: ["club", "training", "academy", "location"],
  },
  {
    title: "Events & Tournaments",
    href: "/events",
    category: "Events",
    description:
      "Browse boxing tournaments, event dates, venues and registration information.",
    keywords: ["competition", "register", "upcoming", "schedule"],
  },
  {
    title: "News & Announcements",
    href: "/news",
    category: "News",
    description:
      "Read official Mumbai Boxing Association news, notices and updates.",
    keywords: ["latest", "updates", "circular", "notice"],
  },
  {
    title: "Boxer Rankings",
    href: "/rankings",
    category: "Rankings",
    description:
      "View boxer rankings, weight categories, points and tournament results.",
    keywords: ["athlete", "rank", "points", "medals"],
  },
  {
    title: "Governance & Committees",
    href: "/governance",
    category: "Page",
    description:
      "Find association governance information and committee details.",
    keywords: ["committee", "officials", "administration"],
  },
  {
    title: "Grievance Cell",
    href: "/grievance",
    category: "Support",
    description:
      "Find information about submitting a grievance to the association.",
    keywords: ["complaint", "support", "help"],
  },
  {
    title: "Contact Us",
    href: "/contact",
    category: "Support",
    description: "Get in touch with the Mumbai Boxing Association.",
    keywords: ["email", "phone", "address", "location"],
  },
  {
    title: "Join the Association",
    href: "/register",
    category: "Membership",
    description:
      "Register as a boxer, coach, academy or referee/judge.",
    keywords: ["membership", "sign up", "registration", "apply"],
  },
  {
    title: "Member Login",
    href: "/login",
    category: "Membership",
    description:
      "Sign in to access your Mumbai Boxing Association member dashboard.",
    keywords: ["account", "dashboard", "sign in"],
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    category: "Information",
    description:
      "Read how the association handles personal information.",
    keywords: ["privacy", "data", "personal"],
  },
  {
    title: "Terms of Use",
    href: "/terms",
    category: "Information",
    description:
      "Review the terms for using the association website and services.",
    keywords: ["terms", "conditions", "website"],
  },
];

const searchResults: SearchResult[] = [
  ...pageResults,
  ...news.map((item) => ({
    title: item.title,
    href: "/news",
    category: item.category,
    description: item.summary,
    keywords: [item.location, ...item.content],
  })),
];

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f8fa]" aria-busy="true" />
      }
    >
      <SearchPageQuery />
    </Suspense>
  );
}

function SearchPageQuery() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <SearchPageContent
      key={searchParams.toString()}
      initialQuery={query}
    />
  );
}

function SearchPageContent({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    const terms = normalizedQuery.split(/\s+/);

    return searchResults.filter((result) => {
      const searchableText = [
        result.title,
        result.category,
        result.description,
        ...result.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return terms.every((term) => searchableText.includes(term));
    });
  }, [normalizedQuery]);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f50919]">
            Mumbai Boxing Association
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Search the site
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Find news, tournaments, rankings, academies and association
            information.
          </p>

          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-[#f50919] focus-within:ring-4 focus-within:ring-red-100"
          >
            <Search
              aria-hidden="true"
              size={21}
              className="ml-3 shrink-0 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tournaments, boxers, academies..."
              aria-label="Search the Mumbai Boxing Association website"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="mr-2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>
      </section>

      <section
        aria-live="polite"
        className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12"
      >
        {!normalizedQuery ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Search
              aria-hidden="true"
              size={30}
              className="mx-auto text-slate-400"
            />
            <h2 className="mt-4 text-lg font-bold">What are you looking for?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter a name or topic above to find related pages and updates.
            </p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="mb-5 text-sm text-slate-600">
              {results.length} {results.length === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-slate-900">
                &ldquo;{query.trim()}&rdquo;
              </span>
            </p>
            <ul className="space-y-3">
              {results.map((result, index) => (
                <li key={`${result.href}-${result.title}-${index}`}>
                  <Link
                    href={result.href}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md sm:p-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#f50919]">
                      {result.href === "/news" ? (
                        <Newspaper size={20} aria-hidden="true" />
                      ) : (
                        <Search size={20} aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-bold text-slate-900 transition group-hover:text-[#f50919]">
                          {result.title}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {result.category}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-600">
                        {result.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-slate-400 transition group-hover:text-[#f50919]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <Newspaper
              aria-hidden="true"
              size={30}
              className="mx-auto text-slate-400"
            />
            <h2 className="mt-4 text-lg font-bold">No matches found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try different keywords, such as “tournament”, “academy” or
              “rankings”.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
