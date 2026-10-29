"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { tournamentUrl } from "@/lib/tournament-url";

export default function TournamentShareButton({
  tournament,
  className = "",
}: {
  tournament: { name: string };
  className?: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [shareError, setShareError] = useState(false);

  async function shareTournament() {
    const url = `${window.location.origin}${tournamentUrl(tournament)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: tournament.name,
          text: `View ${tournament.name}`,
          url,
        });
        setFeedback("Link shared.");
        setShareError(false);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy command was not successful.");
      }

      setFeedback("Link copied.");
      setShareError(false);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Could not share tournament link:", error);
      setFeedback("Could not share the link.");
      setShareError(true);
    }
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={() => void shareTournament()}
        aria-label={`Share ${tournament.name}`}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 ${className}`}
      >
        <Share2 size={15} aria-hidden="true" />
        Share link
      </button>
      {feedback && (
        <span
          role={shareError ? "alert" : "status"}
          className={`mt-1 text-[11px] ${shareError ? "text-red-600" : "text-emerald-700"}`}
        >
          {feedback}
        </span>
      )}
    </span>
  );
}
