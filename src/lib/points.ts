export type TournamentType =
  | "DISTRICT"
  | "STATE"
  | "NATIONAL"
  | "INTERNATIONAL";

export type Medal =
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "NONE";

/**
 * North Bombay District Amateur Boxing Association (NBDABA)
 * Tournament Points Table
 */
export const POINTS_TABLE: Record<
  TournamentType,
  Record<Medal, number>
> = {
  DISTRICT: {
    GOLD: 20,
    SILVER: 12,
    BRONZE: 8,
    NONE: 0,
  },

  STATE: {
    GOLD: 40,
    SILVER: 25,
    BRONZE: 15,
    NONE: 0,
  },

  NATIONAL: {
    GOLD: 70,
    SILVER: 45,
    BRONZE: 30,
    NONE: 0,
  },

  INTERNATIONAL: {
    GOLD: 100,
    SILVER: 70,
    BRONZE: 50,
    NONE: 0,
  },
};

/**
 * Calculate points for an approved tournament result.
 *
 * Unknown tournament types or medals return 0.
 */
export function calculateTournamentPoints({
  tournamentType,
  medal,
}: {
  tournamentType: string | null | undefined;
  medal: string | null | undefined;
}): number {
  const normalizedType = String(tournamentType || "")
    .trim()
    .toUpperCase() as TournamentType;

  const normalizedMedal = String(medal || "")
    .trim()
    .toUpperCase() as Medal;

  const tournamentPoints = POINTS_TABLE[normalizedType];

  if (!tournamentPoints) {
    return 0;
  }

  return tournamentPoints[normalizedMedal] ?? 0;
}