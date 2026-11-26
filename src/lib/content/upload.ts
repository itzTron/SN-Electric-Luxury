import { browserSupabase } from "@/lib/supabase/client";

import { createUploadTarget, recordMedia } from "./mutations";

const MAX_EDGE = 1920;
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

export type PreparedImage = {
  blob: Blob;
  mime: string;
  width: number;
  height: number;
};

/**
 * Downscale in the browser before uploading: a phone photo becomes a
 * ~200–350 KB WebP, which keeps the free storage tier small and LCP fast.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > MAX_SOURCE_BYTES) throw new Error("Image is larger than 20 MB.");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process this image in your browser.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob) throw new Error("Could not encode this image.");

  return { blob, mime: blob.type || "image/webp", width, height };
}

/** Upload directly to storage through a signed URL, then record the row. */
export async function uploadImage(file: File, folder = "general"): Promise<string> {
  const prepared = await prepareImage(file);
  const extension = prepared.mime === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { path: signedPath, token } = await createUploadTarget({ data: { path } });
  const supabase = browserSupabase();
  const { error } = await supabase.storage
    .from("media")
    .uploadToSignedUrl(signedPath, token, prepared.blob, {
      contentType: prepared.mime,
      upsert: false,
    });
  if (error) throw new Error(error.message);

  await recordMedia({
    data: {
      path: signedPath,
      mime: prepared.mime,
      size_bytes: prepared.blob.size,
      width: prepared.width,
      height: prepared.height,
      alt: "",
    },
  });

  return signedPath;
}
