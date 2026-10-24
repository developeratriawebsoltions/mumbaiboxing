export function tournamentSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tournamentUrl(tournament: { name: string }) {
  const slug = tournamentSlug(tournament.name);
  return `/events/${encodeURIComponent(slug)}`;
}
