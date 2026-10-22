import { stat } from "fs/promises";
import path from "path";
import { isPrivateTournamentHistoryDocumentPath } from "@/lib/tournament-history-validation";

export async function privateTournamentHistoryDocumentExists(
  documentPath: unknown,
  userId: number
) {
  if (!isPrivateTournamentHistoryDocumentPath(documentPath, userId)) {
    return false;
  }

  const fileName = documentPath.split("/")[1];
  try {
    const file = await stat(
      path.join(
        process.cwd(),
        "private_uploads",
        "tournament-history",
        String(userId),
        fileName
      )
    );
    return file.isFile();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }
    throw error;
  }
}
