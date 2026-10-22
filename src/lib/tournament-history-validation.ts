export type TournamentHistorySubmission = {
  tournamentName: string;
  location: string | null;
  tournamentDate: Date;
  tournamentType: string | null;
  weightCategory: string | null;
  result: string;
  medal: "GOLD" | "SILVER" | "BRONZE" | "NONE";
  position: number | null;
  coachName: string | null;
  notes: string | null;
};

type ValidationResult =
  | { success: true; data: TournamentHistorySubmission }
  | { success: false; error: string };

const TOURNAMENT_TYPES = new Set([
  "DISTRICT",
  "STATE",
  "NATIONAL",
  "INTERNATIONAL",
]);

function optionalText(value: unknown, label: string) {
  if (value === null || value === undefined || value === "") {
    return { value: null, error: null };
  }

  if (typeof value !== "string") {
    return { value: null, error: `${label} must be text.` };
  }

  const normalized = value.trim();
  if (normalized.length > 190) {
    return { value: null, error: `${label} must be 190 characters or fewer.` };
  }

  return { value: normalized || null, error: null };
}

export function validateTournamentHistorySubmission(
  body: unknown
): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { success: false, error: "Invalid tournament record." };
  }

  const values = body as Record<string, unknown>;
  const tournamentName =
    typeof values.tournamentName === "string"
      ? values.tournamentName.trim()
      : "";

  if (!tournamentName) {
    return { success: false, error: "Tournament name is required." };
  }
  if (tournamentName.length > 190) {
    return {
      success: false,
      error: "Tournament name must be 190 characters or fewer.",
    };
  }

  const dateValue =
    typeof values.tournamentDate === "string"
      ? values.tournamentDate.trim()
      : "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return { success: false, error: "A valid tournament date is required." };
  }

  const tournamentDate = new Date(`${dateValue}T00:00:00.000Z`);
  if (
    Number.isNaN(tournamentDate.getTime()) ||
    tournamentDate.toISOString().slice(0, 10) !== dateValue
  ) {
    return { success: false, error: "A valid tournament date is required." };
  }

  if (dateValue >= new Date().toISOString().slice(0, 10)) {
    return {
      success: false,
      error: "Tournament date must be in the past.",
    };
  }

  const result = optionalText(values.result, "Result");
  const location = optionalText(values.location, "Location");
  const weightCategory = optionalText(
    values.weightCategory,
    "Weight category"
  );
  const coachName = optionalText(values.coachName, "Coach name");
  const notes = optionalText(values.notes, "Notes");
  const tournamentType = optionalText(
    values.tournamentType,
    "Tournament type"
  );
  const textFields = [
    result,
    location,
    weightCategory,
    coachName,
    notes,
    tournamentType,
  ];
  const invalidText = textFields.find((field) => field.error);
  if (invalidText?.error) {
    return { success: false, error: invalidText.error };
  }

  if (!result.value) {
    return {
      success: false,
      error: "Add a result, such as Participation or Finalist.",
    };
  }

  const rawMedal =
    typeof values.medal === "string"
      ? values.medal.trim().toUpperCase()
      : "NONE";
  if (!["GOLD", "SILVER", "BRONZE", "NONE"].includes(rawMedal)) {
    return { success: false, error: "Choose a valid medal result." };
  }
  const medal = rawMedal as TournamentHistorySubmission["medal"];

  let position: number | null = null;
  if (
    values.position !== undefined &&
    values.position !== null &&
    values.position !== ""
  ) {
    position = Number(values.position);
    if (!Number.isSafeInteger(position) || position <= 0) {
      return { success: false, error: "Position must be a positive whole number." };
    }
  }

  const medalPosition = {
    GOLD: 1,
    SILVER: 2,
    BRONZE: 3,
  } as const;

  if (position !== null && position <= 3) {
    const expectedMedal = ["", "GOLD", "SILVER", "BRONZE"][position];
    if (medal !== expectedMedal) {
      return {
        success: false,
        error: `Position ${position} must match the ${expectedMedal.toLowerCase()} medal.`,
      };
    }
  }

  if (medal !== "NONE" && position !== null && position !== medalPosition[medal]) {
    return {
      success: false,
      error: `${medal.charAt(0)}${medal.slice(1).toLowerCase()} medal must match position ${medalPosition[medal]}.`,
    };
  }

  if (medal !== "NONE") {
    const normalizedType = tournamentType.value?.toUpperCase();
    if (!normalizedType || !TOURNAMENT_TYPES.has(normalizedType)) {
      return {
        success: false,
        error: "Choose a tournament level to claim a medal and ranking points.",
      };
    }
  }

  return {
    success: true,
    data: {
      tournamentName,
      location: location.value,
      tournamentDate,
      tournamentType: tournamentType.value?.toUpperCase() ?? null,
      weightCategory: weightCategory.value,
      result: result.value,
      medal,
      position,
      coachName: coachName.value,
      notes: notes.value,
    },
  };
}

export function requiresTournamentHistoryProof(
  submission: Pick<TournamentHistorySubmission, "position"> & {
    medal: string | null;
  }
) {
  return submission.medal !== "NONE" || submission.position !== null;
}

export function isPrivateTournamentHistoryDocumentPath(
  value: unknown,
  userId: number
): value is string {
  if (typeof value !== "string") return false;
  return new RegExp(
    `^${userId}/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(pdf|jpg|png)$`,
    "i"
  ).test(value);
}
