import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const docId = req.nextUrl.searchParams.get("id");
  const filePath = req.nextUrl.searchParams.get("path");

  let relativePath: string | null = null;

  if (filePath) {
    relativePath = filePath;
  } else if (docId) {
    const doc = await prisma.document.findUnique({ where: { id: parseInt(docId) } });
    if (!doc) return new NextResponse("File not found", { status: 404 });
    relativePath = doc.filePath;
  } else {
    return new NextResponse("Missing id or path", { status: 400 });
  }

  // If it's still an old http URL (legacy), redirect
  if (relativePath.startsWith("http")) {
    return NextResponse.redirect(relativePath);
  }

  // Serve local file from public/uploads
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  if (!fs.existsSync(absolutePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
  };
  const contentType = contentTypeMap[ext] ?? "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: { "Content-Type": contentType },
  });
}
