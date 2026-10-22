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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isPdf =
      extension === ".pdf" &&
      buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    const isJpeg =
      extension === ".jpg" &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;
    const isPng =
      extension === ".png" &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      );

    if (!isPdf && !isJpeg && !isPng) {
      return NextResponse.json(
        { success: false, message: "The selected file does not match its file type." },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "private_uploads",
      "tournament-history",
      String(payload.id)
    );

    await mkdir(uploadDirectory, { recursive: true });

    const storedFileName = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, storedFileName);

    await writeFile(filePath, buffer, { flag: "wx" });

    const documentPath = `${payload.id}/${storedFileName}`;

    return NextResponse.json({
      success: true,
      filePath: documentPath,
      fileName: file.name.trim().slice(0, 190),
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
