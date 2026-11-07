import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { localUpload } from "@/lib/upload";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const payload = await verifyToken(req.cookies.get("mba_token")?.value ?? "").catch(() => null);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const urls: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File) || value.size === 0) continue;
    const buffer = Buffer.from(await value.arrayBuffer());
    const ext = value.type.startsWith("image/") ? (value.type === "image/png" ? "png" : value.type === "image/webp" ? "webp" : "jpg") : "pdf";
    const url = await localUpload(buffer, `mba/tournament-forms/${payload.id}`, `${key}-${randomUUID()}`, ext);
    urls[key] = url;
  }

  return NextResponse.json({ urls });
}
