import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { anonClient, adminClient, getAdminSession, requireAdmin } from "@/lib/supabase/server";
import {
  defaultAboutTimeline,
  defaultAboutValues,
  defaultFaqs,
  defaultGallery,
  defaultJobOpenings,
  defaultJobPerks,
  defaultPosts,
  defaultProjects,
  defaultServices,
  defaultSiteSettings,
  defaultTestimonials,
} from "./defaults";
import { isCollectionKey, type CollectionKey } from "./tables";
import type {
  AboutTimelineEntry,
  AboutValue,
  AdminRow,
  Faq,
  GalleryImage,
  JobOpening,
  JobPerk,
  Post,
  Project,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

const tableSchema = z.object({
  table: z.string().refine(isCollectionKey, "Unknown collection"),
});

/**
 * Public readers. They use the publishable key, so RLS filters drafts, and they
 * always fall back to the bundled content when Supabase is missing or down.
 */
async function readOrFallback<T>(table: string, fallback: T[], published?: boolean): Promise<T[]> {
  try {
    let query = anonClient().from(table).select("*");
    if (published !== undefined) query = query.eq("published", published);
    if (table === "posts") query = query.eq("status", "published");
    const { data, error } = await query.order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as T[];
  } catch (error) {
    console.warn(`[content] ${table}: using bundled fallback —`, (error as Error)?.message);
    return fallback;
  }
}

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await anonClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return (data as SiteSettings | null) ?? defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
});

export const listServices = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<Service>("services", defaultServices, true),
);

export const listProjects = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<Project>("projects", defaultProjects, true),
);

export const listGallery = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<GalleryImage>("gallery_images", defaultGallery, true),
);

export const listPosts = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<Post>("posts", defaultPosts),
);

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<Testimonial>("testimonials", defaultTestimonials, true),
);

export const listFaqs = createServerFn({ method: "GET" }).handler(async () =>
  readOrFallback<Faq>("faqs", defaultFaqs, true),
);

export const listJobPerks = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await anonClient().from("job_perks").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as JobPerk[];
  } catch {
    return defaultJobPerks;
  }
});

export const listJobOpenings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await anonClient().from("job_openings").select("*").order("sort_order");
    if (error) throw error;
    return (data ?? []) as JobOpening[];
  } catch {
    return defaultJobOpenings;
  }
});

export const listAbout = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = anonClient();
    const [values, timeline] = await Promise.all([
      supabase.from("about_values").select("*").order("sort_order"),
      supabase.from("about_timeline").select("*").order("sort_order"),
    ]);
    if (values.error || timeline.error) throw values.error ?? timeline.error;
    return {
      values: (values.data ?? []) as AboutValue[],
      timeline: (timeline.data ?? []) as AboutTimelineEntry[],
    };
  } catch {
    return { values: defaultAboutValues, timeline: defaultAboutTimeline };
  }
});

// ---------------------------------------------------------------------------
// Admin readers
// ---------------------------------------------------------------------------

export const fetchAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return session ? { signedIn: true as const, email: session.email } : { signedIn: false as const };
});

export const listCollection = createServerFn({ method: "GET" })
  .validator((input: unknown) => tableSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const table = data.table as CollectionKey;
    const supabase = adminClient();
    const orderColumn = table === "posts" ? "sort_order" : "sort_order";
    const { data: rows, error } = await supabase.from(table).select("*").order(orderColumn, { ascending: true });
    if (error) throw error;
    return (rows ?? []) as unknown as AdminRow[];
  });

export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { data, error } = await adminClient()
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
});

export const getAdminSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { data, error } = await adminClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return (data as SiteSettings | null) ?? defaultSiteSettings;
});

export const getOverview = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = adminClient();
  const count = async (table: string, filter?: { column: string; value: string }) => {
    let query = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) query = query.eq(filter.column, filter.value);
    const { count: total } = await query;
    return total ?? 0;
  };
  const [projects, services, posts, gallery, media, testimonials, faqs] = await Promise.all([
    count("projects"),
    count("services"),
    count("posts", { column: "status", value: "published" }),
    count("gallery_images"),
    count("media"),
    count("testimonials"),
    count("faqs"),
  ]);
  return { projects, services, posts, gallery, media, testimonials, faqs };
});
