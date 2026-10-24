"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";

type Tournament = { id: number; name: string; location: string | null; startDate: string | null; status: string; weightClass: string | null };
type Ranking = { boxerId: number; rank: number; name: string; points: number; academy: { name: string } | null; weightCategory: string | null };

function useListing<T>(url: string, select: (data: unknown) => T[]) {
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then(async response => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(data => { if (!controller.signal.aborted) { setItems(select(data)); setStatus("ready"); } })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [url, select, attempt]);
  return { items, status, retry: () => { setStatus("loading"); setAttempt(value => value + 1); } };
}
function selectTournaments(data: unknown): Tournament[] {
  if (!Array.isArray(data)) throw new Error("Invalid response");
  return (data as Tournament[]).filter(item => ["open", "upcoming", "ongoing"].includes(item.status.toLowerCase())).sort((a, b) => (Date.parse(a.startDate || "") || Infinity) - (Date.parse(b.startDate || "") || Infinity)).slice(0, 3);
}
function selectRankings(data: unknown): Ranking[] {
  const result = data as { success?: boolean; rankings?: Ranking[] };
  if (!result.success || !Array.isArray(result.rankings)) throw new Error("Invalid response");
  return result.rankings;
}
function ListingStatus({ status, empty, retry }: { status: string; empty: string; retry: () => void }) {
  return <div className="mba-listing-status" role="status">{status === "loading" ? "Loading the latest information…" : status === "error" ? <>Information is temporarily unavailable. <button type="button" className="mba-text-button" onClick={retry}>Try again</button></> : empty}</div>;
}
export default function HomeListings() {
  const tournaments = useListing("/api/tournaments", selectTournaments);
  const rankings = useListing("/api/rankings?limit=5", selectRankings);
  return <>
    <section className="mba-section mba-wrap" aria-labelledby="tournaments-title">
      <div className="mba-section-heading"><div><p className="mba-eyebrow">The competition calendar</p><h2 id="tournaments-title">Next in the ring</h2></div><Link href="/events" className="mba-text-link">All tournaments <ArrowRight size={17} /></Link></div>
      <div className="mba-events">{tournaments.status !== "ready" || !tournaments.items.length ? <ListingStatus status={tournaments.status} retry={tournaments.retry} empty="New tournament dates will be announced here. Check back for the next competition." /> : tournaments.items.map(item => {
        const date = item.startDate ? new Date(item.startDate) : null;
        const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
        return <Link href={`/events/${item.id}`} className="mba-event" key={item.id}>
          <div className="mba-event-date"><strong>{validDate ? validDate.toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" }) : "—"}</strong><span>{validDate ? validDate.toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "Date TBA"}</span></div>
          <div className="mba-event-detail"><span className="mba-event-status">{item.status.toLowerCase() === "open" ? "Registration open" : item.status.toLowerCase() === "ongoing" ? "In progress" : "Upcoming tournament"}</span><h3>{item.name}</h3><p><MapPin size={14} /> {item.location || "Venue to be announced"}{item.weightClass && <span> · {item.weightClass}</span>}</p></div><span className="mba-event-link">Event details <ArrowUpRight size={19} /></span>
        </Link>;
      })}</div>
    </section>
    <section className="mba-rankings"><div className="mba-wrap mba-rankings-grid">
      <div><p className="mba-eyebrow">Season standings</p><h2>Earned.<br />Round by round.</h2><p>Follow Mumbai’s boxers through the season. Rankings reflect approved tournament results.</p><Link href="/rankings" className="mba-text-link">Full rankings & filters <ArrowRight size={17} /></Link></div>
      <div className="mba-ranking-panel">{rankings.status !== "ready" || !rankings.items.length ? <ListingStatus status={rankings.status} retry={rankings.retry} empty="Season rankings will appear once tournament results are approved." /> : <div className="mba-table-scroll" tabIndex={0} role="region" aria-label="Season rankings"><table><caption>Leading boxers · current season</caption><thead><tr><th scope="col">Rank</th><th scope="col">Boxer / Academy</th><th scope="col">Weight</th><th scope="col">Points</th></tr></thead><tbody>{rankings.items.map(item => <tr key={item.boxerId}><td className="mba-rank-number">{String(item.rank).padStart(2, "0")}</td><td><strong>{item.name}</strong><small>{item.academy?.name || "Independent"}</small></td><td>{item.weightCategory || "—"}</td><td className="mba-points">{item.points}</td></tr>)}</tbody></table></div>}</div>
    </div></section>
  </>;
}
