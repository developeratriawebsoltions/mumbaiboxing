import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { verifyToken } from "@/lib/jwt";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("mba_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "boxer") {
      return NextResponse.json(
        { success: false, message: "Boxer access required" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { success: false, message: "The selected file is empty" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File must be 5 MB or smaller" },
        { status: 400 }
      );
    }

    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, JPG, JPEG and PNG files are allowed",
        },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "tournament-history"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const safeBaseName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\.{2,}/g, ".")
      .slice(-100);

    const storedFileName = `${randomUUID()}-${safeBaseName || `document${extension}`}`;

    const filePath = path.join(
      uploadDirectory,
      storedFileName
    );

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const publicPath = `/uploads/tournament-history/${storedFileName}`;

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileName: file.name,
    });
  } catch (error) {
    console.error(
      "POST /api/boxer/tournament-history/upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload supporting document",
      },
      { status: 500 }
    );
  }
}
