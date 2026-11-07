import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function localUpload(
  buffer: Buffer,
  folder: string,
  fileName: string,
  ext: string
): Promise<string> {
  const dir = path.join(UPLOAD_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });

  const safeName = `${fileName}.${ext}`;
  const filePath = path.join(dir, safeName);
  fs.writeFileSync(filePath, buffer);

  // Return public URL path
  return `/uploads/${folder}/${safeName}`;
}
