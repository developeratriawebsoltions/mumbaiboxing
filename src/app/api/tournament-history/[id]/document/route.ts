import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

const PRIVATE_UPLOADS_ROOT = path.join(
  process.cwd(),
  "private_uploads",
  "tournament-history"
);

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("mba_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const historyId = Number(id);
    if (!Number.isSafeInteger(historyId) || historyId <= 0) {
      return NextResponse.json({ error: "Invalid document." }, { status: 400 });
    }

    const history = await prisma.boxer_tournament_history.findUnique({
      where: { id: historyId },
      select: {
        documentPath: true,
        documentName: true,
        boxer: { select: { userId: true } },
      },
    });
    if (!history?.documentPath || !history.documentName) {
      return NextResponse.json(
        { error: "Supporting document not found." },
        { status: 404 }
      );
    }

    const isOwner =
      payload.role === "boxer" && payload.id === history.boxer.userId;
    const isReviewer = payload.role === "superadmin";
    if (!isOwner && !isReviewer) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const expectedPrefix = `${history.boxer.userId}/`;
    if (!history.documentPath.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: "Supporting document is unavailable." },
        { status: 404 }
      );
    }

    const fileName = path.basename(history.documentPath);
    if (!/^[0-9a-f-]{36}\.(pdf|jpg|png)$/i.test(fileName)) {
      return NextResponse.json(
        { error: "Supporting document is unavailable." },
        { status: 404 }
      );
    }

    const extension = path.extname(fileName).toLowerCase();
    const contents = await readFile(
      path.join(PRIVATE_UPLOADS_ROOT, String(history.boxer.userId), fileName)
    );
    const downloadName = history.documentName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 190);

    return new NextResponse(new Uint8Array(contents), {
      headers: {
        "Content-Type": CONTENT_TYPES[extension],
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Content-Length": String(contents.byteLength),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return NextResponse.json(
        { error: "Supporting document not found." },
        { status: 404 }
      );
    }

    console.error("Tournament history document access failed:", error);
    return NextResponse.json(
      { error: "Unable to retrieve the supporting document." },
      { status: 500 }
    );
  }
}
