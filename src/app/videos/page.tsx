import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VideoGallery from "@/Components/VideoGallery";

export const metadata: Metadata = {
  title: "Videos | North Bombay District Amateur Boxing Association",
  description:
    "Watch videos from the North Bombay District Amateur Boxing Association.",
  alternates: {
    canonical: "/videos",
  },
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-[#070b10] px-5 py-14 text-white sm:px-7 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Home
        </Link>

        <header className="mx-auto mb-12 mt-10 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            North Bombay District Amateur Boxing Association
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl">
            Boxing Videos
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Watch highlights and stories from our boxing community.
          </p>
        </header>

        <VideoGallery variant="dark" />
      </div>
    </main>
  );
}
