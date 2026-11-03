"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

const videos = [
  {
    id: "facebook-boxing",
    title: "North Bombay Boxing Association",
    platform: "Facebook",
    thumbnail: "/videos/facebook-boxing.jpg",
    embedUrl:
      "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F100064920493973%2Fposts%2F1589462076561127%2F&show_text=false&width=500",
    allow:
      "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share",
  },
  {
    id: "youtube-boxing",
    title: "DSO District Level Boxing Championship 2026–27",
    platform: "YouTube",
    thumbnail: "/videos/youtube-boxing.jpg",
    embedUrl:
      "https://www.youtube-nocookie.com/embed/CzvMZEFaYF0?autoplay=1&rel=0",
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  },
];

const photos = [
  {
    src: "/videos/boxing-event-group-1.png",
    alt: "Boxers, coaches, and association members at a North Bombay boxing event",
  },
  {
    src: "/videos/boxing-event-group-2.png",
    alt: "Group photo of athletes and association members at the boxing venue",
  },
];

export default function VideoGallery({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const isDark = variant === "dark";

  return (
    <div className="space-y-12">
      <div>
        <h2
          className={`mb-5 text-xl font-black uppercase tracking-tight ${
            isDark ? "text-white" : "text-[#101827]"
          }`}
        >
          Videos
        </h2>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {videos.map((video) => (
            <article
              key={video.id}
              className={`overflow-hidden rounded-2xl border ${
                isDark
                  ? "border-white/10 bg-[#0b0f15]"
                  : "border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {playingVideo === video.id ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={video.embedUrl}
                    title={video.title}
                    allow={video.allow}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingVideo(video.id)}
                    aria-label={`Play ${video.title} on ${video.platform}`}
                    className="group absolute inset-0 h-full w-full cursor-pointer"
                  >
                    <Image
                      src={video.thumbnail}
                      alt={`${video.title} thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
                    <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform group-hover:scale-110">
                      <Play size={26} fill="currentColor" className="ml-1" />
                    </span>
                  </button>
                )}
              </div>
              <div className="px-5 py-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-600">
                  {video.platform}
                </p>
                <h3
                  className={`mt-1 text-base font-bold leading-snug ${
                    isDark ? "text-white" : "text-[#101827]"
                  }`}
                >
                  {video.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <h2
          className={`mb-5 text-xl font-black uppercase tracking-tight ${
            isDark ? "text-white" : "text-[#101827]"
          }`}
        >
          Event Photos
        </h2>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className={`overflow-hidden rounded-2xl border ${
                isDark
                  ? "border-white/10 bg-[#0b0f15]"
                  : "border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption
                className={`px-5 py-4 text-sm font-semibold ${
                  isDark ? "text-slate-200" : "text-[#101827]"
                }`}
              >
                North Bombay boxing event
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
