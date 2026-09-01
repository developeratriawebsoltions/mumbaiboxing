import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const docId = req.nextUrl.searchParams.get("id");
  const filePath = req.nextUrl.searchParams.get("path");

  // If direct Cloudinary URL passed, redirect
  if (filePath?.startsWith("http")) {
    return NextResponse.redirect(filePath);
  }

  // Lookup by document id
  if (docId) {
    const doc = await prisma.document.findUnique({ where: { id: parseInt(docId) } });
    if (!doc) return new NextResponse("File not found", { status: 404 });
    return NextResponse.redirect(doc.filePath);
  }

  return new NextResponse("Missing id or path", { status: 400 });
}
