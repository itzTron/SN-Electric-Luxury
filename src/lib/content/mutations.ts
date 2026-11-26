import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookies } from "@tanstack/react-start/server";
import { z } from "zod";

import { adminClient, createSupabaseServerClient, isSupabaseConfigured, requireAdmin } from "@/lib/supabase/server";
import { collectionSchemas, mediaMetaSchema, settingsSchema, signInSchema } from "./schema";
import { isCollectionKey, type CollectionKey } from "./tables";
import type { AdminRow } from "./types";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export const signInAdmin = createServerFn({ method: "POST" })
  .validator((input: unknown) => signInSchema.parse(input))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      return { ok: false as const, error: "Supabase is not configured yet. Add the environment variables first." };
    }
    if (rateLimited(data.email.toLowerCase())) {
      return { ok: false as const, error: "Too many attempts. Wait ten minutes and try again." };
    }

    const supabase = createSupabaseServerClient();
    const { data: auth, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error || !auth.user) {
      return { ok: false as const, error: "Wrong email or password." };
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      return { ok: false as const, error: "This account is not an administrator." };
    }

    attempts.delete(data.email.toLowerCase());
    return { ok: true as const };
  });

export const signOutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Fall through to clearing the cookies.
  }
  for (const name of Object.keys(getCookies())) {
    if (name.startsWith("sb-")) deleteCookie(name, { path: "/" });
  }
  return { ok: true as const };
});

// ---------------------------------------------------------------------------
// Collection rows
// ---------------------------------------------------------------------------

const saveRowInput = z.object({
  table: z.string().refine(isCollectionKey, "Unknown collection"),
  id: z.string().uuid().optional(),
  values: z.unknown(),
});

export const saveRow = createServerFn({ method: "POST" })
  .validator((input: unknown) => saveRowInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const table = data.table as CollectionKey;
    const parsed = collectionSchemas[table].parse(data.values) as Record<string, unknown>;

    if (table === "job_openings" && !("requirements" in parsed)) {
      // keep the jsonb column valid on insert
      parsed.requirements = [];
    }

    const payload = data.id ? { id: data.id, ...parsed } : parsed;
    const { data: row, error } = await adminClient()
      .from(table)
      .upsert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as unknown as AdminRow;
  });

export const deleteRow = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ table: z.string(), id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!isCollectionKey(data.table)) throw new Error("Unknown collection");
    const { error } = await adminClient().from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const reorderRows = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ table: z.string(), ids: z.array(z.string().uuid()) }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!isCollectionKey(data.table)) throw new Error("Unknown collection");
    const supabase = adminClient();
    for (let i = 0; i < data.ids.length; i += 1) {
      const { error } = await supabase.from(data.table).update({ sort_order: i }).eq("id", data.ids[i]);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const saveSettings = createServerFn({ method: "POST" })
  .validator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await adminClient()
      .from("site_settings")
      .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

const uploadTargetInput = z.object({
  path: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-zA-Z0-9/_.-]+$/, "Invalid storage path"),
});

export const createUploadTarget = createServerFn({ method: "POST" })
  .validator((input: unknown) => uploadTargetInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { data: signed, error } = await adminClient().storage.from("media").createSignedUploadUrl(data.path);
    if (error) throw new Error(error.message);
    return { path: signed.path, token: signed.token };
  });

const recordMediaInput = z.object({
  path: z.string().trim().min(3).max(200),
  mime: z.string().trim().min(3).max(100),
  size_bytes: z.number().int().min(1).max(20 * 1024 * 1024),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
  alt: z.string().trim().max(300).default(""),
});

export const recordMedia = createServerFn({ method: "POST" })
  .validator((input: unknown) => recordMediaInput.parse(input))
  .handler(async ({ data }) => {
    const session = await requireAdmin();
    const { data: row, error } = await adminClient()
      .from("media")
      .upsert({ ...data, bucket: "media", caption: null, uploaded_by: session.userId }, { onConflict: "bucket,path" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as unknown as AdminRow;
  });

export const updateMediaMeta = createServerFn({ method: "POST" })
  .validator((input: unknown) => mediaMetaSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { error } = await adminClient().from("media").update({ alt: data.alt, caption: data.caption }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = adminClient();
    const { data: row, error } = await supabase.from("media").select("path").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (row?.path) await supabase.storage.from("media").remove([row.path]);
    const { error: deleteError } = await supabase.from("media").delete().eq("id", data.id);
    if (deleteError) throw new Error(deleteError.message);
    return { ok: true as const };
  });
