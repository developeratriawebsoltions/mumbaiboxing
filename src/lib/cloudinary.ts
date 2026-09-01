import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL!);

export async function cloudinaryUpload(
  buffer: Buffer,
  folder: string,
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, public_id: publicId, resource_type: resourceType, overwrite: true }, (err, result) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}
