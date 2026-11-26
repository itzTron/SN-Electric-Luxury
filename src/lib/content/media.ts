import about from "@/assets/about.jpg";
import hero from "@/assets/hero.jpg";
import commercial from "@/assets/project-commercial.jpg";
import industrial from "@/assets/project-industrial.jpg";
import residential from "@/assets/project-residential.jpg";
import db from "@/assets/service-db.jpg";
import lighting from "@/assets/service-lighting.jpg";
import maintenance from "@/assets/service-maintenance.jpg";
import wiring from "@/assets/service-wiring.jpg";
import whyChoose from "@/assets/why-choose.jpg";

/**
 * Image paths stored in the database are either:
 *  - a legacy seed filename (`hero.jpg`) → resolved from the Vite asset bundle,
 *  - a full URL (already hosted elsewhere) → returned as-is,
 *  - a storage object key (`services/abc.webp`) → served from the Supabase
 *    public bucket URL.
 */
const legacyAssets: Record<string, string> = {
  "hero.jpg": hero,
  "about.jpg": about,
  "why-choose.jpg": whyChoose,
  "project-residential.jpg": residential,
  "project-commercial.jpg": commercial,
  "project-industrial.jpg": industrial,
  "service-db.jpg": db,
  "service-lighting.jpg": lighting,
  "service-maintenance.jpg": maintenance,
  "service-wiring.jpg": wiring,
};

export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  const clean = path.trim();
  if (!clean) return undefined;
  if (/^(https?:|data:|blob:|\/)/.test(clean)) return clean;
  if (legacyAssets[clean]) return legacyAssets[clean];

  const base = (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
  if (!base) return legacyAssets[clean] ?? undefined;
  return `${base}/storage/v1/object/public/media/${clean}`;
}

export function formatPostDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export const MEDIA_BUCKET = "media";
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
