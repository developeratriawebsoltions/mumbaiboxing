
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import VideoGallery from "@/Components/VideoGallery";

type VideoSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function VideoSection({
  eyebrow,
  title,
  description,
}: VideoSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-7 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-red-600 sm:w-12" />

            <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-red-600 sm:text-xs">
              {eyebrow}
            </p>

            <span className="h-[2px] w-8 bg-red-600 sm:w-12" />
          </div>

          <h2 className="text-3xl font-black uppercase leading-[1.1] tracking-[-0.045em] text-[#101827] sm:text-4xl lg:text-[52px]">
            {title}
          </h2>

          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-red-600" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
            {description}
          </p>
        </div>

        <VideoGallery />

        {/* CTA */}
        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/videos"
            aria-label="View more boxing videos and event photos"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-red-600 px-7 py-3.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#101827] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 sm:text-sm"
          >
            <Play size={19} fill="currentColor" aria-hidden="true" />
            View More
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
