import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinaryUpload } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const saved: { label: string; filePath: string }[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "userId" || !(value instanceof File)) continue;

      const file = value as File;
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileType = file.type.startsWith("image/") ? "image" : "raw";
      const url = await cloudinaryUpload(buffer, `mba/${userId}`, key, fileType as "image" | "raw");

      await prisma.document.upsert({
        where: { userId_label: { userId: parseInt(userId), label: key } },
        update: { filePath: url, fileType: fileType === "image" ? "image" : "pdf" },
        create: { userId: parseInt(userId), label: key, filePath: url, fileType: fileType === "image" ? "image" : "pdf" },
      });

      saved.push({ label: key, filePath: url });
    }

    return NextResponse.json({ saved }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
