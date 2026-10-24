import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinaryUpload } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const medicalIssueDates: Record<string, Date | undefined> = {};
    for (const [field, label] of [
      ["medicalCertIssueDate", "medical-fitness-certificate-by-mbbs-dr"],
      ["hivReportIssueDate", "hiv-hepatitis-b-c-test-report"],
    ]) {
      const value = String(formData.get(field) ?? "").trim();
      if (!value) continue;

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json({ error: `Invalid issue date for ${label}` }, { status: 400 });
      }
      medicalIssueDates[label] = date;
    }

    const saved: { label: string; filePath: string }[] = [];

    const failed: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "userId" || key in medicalIssueDates || !(value instanceof File)) continue;

      const file = value as File;
      if (file.size === 0) continue;

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type.startsWith("image/") ? "image" : "raw";
        const url = await cloudinaryUpload(buffer, `mba/${userId}`, key, fileType as "image" | "raw");

        await prisma.document.upsert({
          where: { userId_label: { userId: parseInt(userId), label: key } },
          update: {
            filePath: url,
            fileType: fileType === "image" ? "image" : "pdf",
            ...(medicalIssueDates[key] && { issueDate: medicalIssueDates[key] }),
          },
          create: {
            userId: parseInt(userId),
            label: key,
            filePath: url,
            fileType: fileType === "image" ? "image" : "pdf",
            issueDate: medicalIssueDates[key],
          },
        });

        saved.push({ label: key, filePath: url });
      } catch (fileErr) {
        console.error(`Failed to upload file "${key}":`, fileErr);
        failed.push(key);
      }
    }

    if (failed.length > 0 && saved.length === 0) {
      return NextResponse.json({ error: "Upload failed", failed }, { status: 500 });
    }

    return NextResponse.json({ saved, failed }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
