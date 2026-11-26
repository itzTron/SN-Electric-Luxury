# Admin Panel & Backend Integration Plan

**Project:** SN Electrical Services (`tanstack_start_ts`)
**Stack today:** TanStack Start (SSR) + React 19 + Vite 8 + Tailwind 4 + Radix/shadcn UI, deployed to Netlify (`NITRO_PRESET=netlify`), bilingual EN/BN UI.
**Goal:** a password-protected `/admin` area where the owner can upload images and edit all page content (services, projects, gallery, blog, testimonials, FAQ, careers, contact details, hero/about imagery), backed by a hosted database + auth + object storage.
**Recommended backend:** **Supabase** (Postgres + Auth + Storage). Firebase is documented as the fallback in [§12](#12-firebase-alternative).

---

## 1. Scope

### In scope
- Admin authentication (email + password, single role, no public sign-up).
- CRUD for every content collection that is currently hardcoded.
- Image upload to cloud storage, with library, alt text, delete and reorder.
- Public pages read from the database at request time (SSR) with a static fallback.
- Row Level Security so the public can only read published content.
- A seed migration that carries today's content into the database.

### Explicitly out of scope (phase 2 candidates)
- Quote/contact form submissions into the database (`/quote`, `/contact` are still client-side fakes).
- Multi-user roles (editor vs owner), revision history, scheduled publishing.
- Automatic image optimisation pipeline / CDN transforms (notes in §6).
- Migrating the bilingual UI dictionary (`src/i18n/dict.ts`) out of code.

---

## 2. Why Supabase for this project

| Requirement | Supabase | Firebase |
| --- | --- | --- |
| Content model | Relational Postgres — projects → images, posts → categories map cleanly; SQL constraints | Firestore documents/collections; joins and referential integrity are manual |
| Admin auth | Email/password, magic link, OAuth; sessions readable server-side | Email/password, OAuth; Admin SDK needed server-side |
| Image storage | S3-style buckets with SQL-driven storage policies, public CDN URLs | Cloud Storage rules in a separate DSL |
| SSR on Netlify | Plain REST/PostgREST over HTTPS works from server functions; RLS enforced by JWT | REST/Admin SDK works; rules are a second permission system |
| Permissions | One place: Postgres RLS covers API, dashboard and storage | Firestore rules + Storage rules, both hand-written |
| Migrations / backup | SQL migrations in git, `pg_dump`, PITR | Export/import tooling, no schema-as-SQL |
| Free tier | 500 MB database, 1 GB storage, 50k MAU — ample for a brochure site | 1 GB Firestore, 5 GB storage, similar |

The decisive point: content here is inherently relational and the public site is SSR'd, so a SQL schema with RLS plus a plain HTTP client is less code and fewer permission surfaces than Firebase's two rule languages. Supabase's free tier comfortably covers a single-admin marketing site.

**One-shot setup link:** https://supabase.com/dashboard — create a project, then use the migration SQL in §5 and the bucket in §6.

---

## 3. Current content inventory → target tables

Everything below is hardcoded today and must become editable.

| Where it lives now | What it is | Target table |
| --- | --- | --- |
| `src/lib/site-config.ts` → `site` | name, tagline, phone, email, address, hours, socials | `site_settings` (singleton row) |
| `src/lib/site-config.ts` → `services` | 10 services (slug, title, icon, desc) | `services` |
| `src/assets/*.jpg` (hero, about, why-choose, 7 service/project images) | images used across pages | `media` + `*_image_path` columns |
| `src/routes/projects.tsx` + `src/components/home/projects-showcase.tsx` | 8 project cards (title, location, tag, image) | `projects`, `project_images` |
| `src/routes/gallery.tsx` | 9 gallery tiles with layout spans | `gallery_images` |
| `src/routes/blog.tsx` + `src/components/home/blog-preview.tsx` | 6 posts (slug, category, title, date, excerpt, image) | `posts` |
| `src/routes/testimonials.tsx` + `src/components/home/testimonials.tsx` | 6 + 5 reviews (duplicated lists!) | `testimonials` |
| `src/components/home/faq.tsx`, `src/routes/faq.tsx` | 6 Q&A entries | `faqs` |
| `src/routes/career.tsx` | 4 perks + 4 open roles | `job_perks`, `job_openings` |
| `src/routes/about.tsx` | mission, 4 values, 5 timeline entries | `about_content` (JSONB) or `about_timeline` + `about_values` |

Note the duplication: testimonials and posts currently exist twice (home + full page) with different wording. Consolidating them into one table is a bug fix, not scope creep.

---

## 4. Architecture

```
Browser (public pages)
   │  SSR request
   ▼
TanStack Start server functions  ──►  Supabase PostgREST  ──►  Postgres (RLS)
   (publishable key, anon role)                                 │
                                                                │ public SELECT
                                                                │ where published = true
Browser (admin UI, authenticated)
   │  1. sign in with email/password
   │  2. upload file ──────────────► Supabase Storage bucket `media` (RLS: only admins)
   │  3. save row ──► server function ──► Postgres (service role, zod-validated)
```

Rules that keep it safe:

1. **Public reads** go through server functions using the publishable (anon) key, so RLS is always enforced. No `service_role` key in the browser bundle.
2. **Admin writes** go through server functions that verify the caller's session cookie *and* use the secret/service key only after verification. A route guard alone is never sufficient.
3. **Uploads** go browser → Storage directly (Netlify Functions cap request bodies at 6 MB, so proxying files through a server function is a trap). The admin's Supabase session authorises the write via storage RLS.
4. **Public pages never break** if Supabase is unconfigured or unreachable: every read falls back to the current static constants (`site`, `services`, local asset imports).

### Files to add

```
src/lib/supabase/
  client.ts            # browser client (publishable key)
  server.ts            # per-request server client + admin client
  auth.ts              # getAdminSession(), requireAdmin middleware
src/lib/content/
  queries.ts           # createServerFn readers used by public pages
  mutations.ts         # createServerFn writers (zod validated, admin-only)
  defaults.ts          # current hardcoded data, kept as SSR fallback
  media.ts             # mediaUrl(), upload/resize helpers
src/lib/content/schema.ts   # zod schemas shared by admin forms
src/components/admin/
  admin-shell.tsx, media-picker.tsx, image-uploader.tsx,
  content-table.tsx, sortable-list.tsx, publish-toggle.tsx, confirm-delete.tsx
src/routes/admin.tsx             # layout /admin (+ auth guard, shell)
src/routes/admin/login.tsx       # sign in
src/routes/admin/index.tsx       # overview
src/routes/admin/services.tsx
src/routes/admin/projects.tsx
src/routes/admin/gallery.tsx
src/routes/admin/blog.tsx
src/routes/admin/testimonials.tsx
src/routes/admin/faqs.tsx
src/routes/admin/careers.tsx
src/routes/admin/media.tsx
src/routes/admin/settings.tsx
supabase/migrations/*.sql
```

`src/routeTree.gen.ts` regenerates automatically after adding files; do not edit it.

---

## 5. Database schema

Use `uuid` primary keys (`gen_random_uuid()`), `created_at`/`updated_at timestamptz default now()`, and a shared `touch_updated_at()` trigger.

```sql
-- Admin membership: only rows here can write anything.
create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text not null,
  created_at timestamptz not null default now()
);

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- Singleton site-wide settings
create table site_settings (
  id            int primary key default 1 check (id = 1),
  name text not null, short text not null, tagline text not null,
  description text not null,
  phone text not null, phone_display text not null, whatsapp text not null,
  email text not null, address text not null, hours text not null,
  socials jsonb not null default '{}'::jsonb,
  logo_path text, hero_image_path text, about_image_path text, og_image_path text,
  updated_at timestamptz not null default now()
);

create table media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,                 -- storage object key, e.g. "gallery/abc.webp"
  mime text not null, size_bytes int not null,
  width int, height int,
  alt text not null default '',
  caption text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null, title_bn text,
  desc_en  text not null, desc_bn  text,
  icon text not null,                 -- lucide name, mapped in services-grid.tsx
  image_path text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text,
  category text not null check (category in ('residential','commercial','industrial')),
  summary text,
  description text,
  cover_image_path text,
  year int,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  path text not null,
  alt text not null default '',
  sort_order int not null default 0
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  alt text not null default '',
  caption text,
  tall boolean not null default false,   -- replaces the hardcoded row-span-2 values
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null,
  body text,                              -- markdown
  cover_image_path text,
  reading_minutes int,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null, role text,
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null,
  avatar_path text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null,
  category text,
  published boolean not null default true,
  sort_order int not null default 0
);

create table job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null, location text, employment_type text not null,
  description text, requirements jsonb not null default '[]'::jsonb,
  is_open boolean not null default true,
  sort_order int not null default 0
);

create table job_perks (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null,
  sort_order int not null default 0
);
```

### RLS policies (the core of the security model)

```sql
alter table services enable row level security;   -- repeat for every content table

-- Public site: read published rows only.
create policy "public read services" on services
  for select to anon, authenticated using (published);

-- Admin: full access.
create policy "admin write services" on services
  for all to authenticated using (is_admin()) with check (is_admin());

-- site_settings / media / project_images have no "published" column:
create policy "public read settings" on site_settings for select to anon, authenticated using (true);
create policy "admin write settings"  on site_settings for all to authenticated using (is_admin()) with check (is_admin());
```

Important detail: `media` rows should be publicly readable (to list/validate), but **writes** only for admins. Draft rows must remain invisible to anon — that is why public reads go through the anon key rather than the service key.

### Storage policy

```sql
-- bucket created as private=false, file size limit 8 MB, mime types image/*
create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

create policy "admin upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and is_admin());

create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and is_admin());

create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and is_admin());
```

### Seeding today's content

A single migration inserts the 10 services, 8 projects, 9 gallery rows, 6 posts, 6 testimonials, 6 FAQs, 4 roles, 4 perks and the `site_settings` singleton from `src/lib/site-config.ts` and the route files, pointing image columns at the existing asset names (`project-residential.jpg`, …). A one-off script (`.mjs`, run locally with the secret key) uploads `src/assets/*.jpg` into `media/seed/` and rewrites the rows to real storage paths. Until that script runs, `mediaUrl()` treats a bare filename as a legacy static asset and resolves it through Vite's `src/assets` map, so the site is never broken mid-migration.

---

## 6. Image upload pipeline

1. Admin drops a file into `ImageUploader`.
2. Browser-side pre-processing (no dependency needed, canvas): downscale the longest edge to 1920 px, re-encode to WebP at ~0.82 quality. A 4 MB phone photo becomes ~200–350 KB, which keeps the 1 GB free tier viable and keeps LCP fast.
3. Upload directly to Storage: `media/{collection}/{uuid}.webp` with `cacheControl: "31536000"`, `upsert: false`.
4. Insert a `media` row (path, mime, size, dimensions, alt, uploaded_by), then write the chosen `*_image_path` on the content row.
5. Public rendering: `mediaUrl(path)` builds `${VITE_SUPABASE_URL}/storage/v1/object/public/media/${path}`, `loading="lazy"`, explicit `width`/`height` from the `media` row to avoid layout shift. Hero image uses `fetchPriority="high"` and no lazy loading.
6. Deleting a media row warns when it is referenced by content; the DB could later enforce this with `on delete restrict` FKs if we add reference tracking.
7. Optional later: Supabase image transformations (`/storage/v1/render/image/public/...?width=800`) require the Pro plan — the client-side downscale means we do not need it on day one.

Constraints enforced in the uploader and the bucket: `image/jpeg|png|webp|avif`, ≤ 8 MB pre-processing, alt text required on save (accessibility + SEO).

---

## 7. Admin authentication

- **Provider:** Supabase Auth, email + password. Create the single admin user in the Supabase dashboard, then insert its `auth.users.id` into `admin_users`. Disable public sign-ups in Auth settings so no one can self-register.
- **Session:** cookie-based via `@supabase/ssr` (`createServerClient` with `getAll`/`setAll` reading and writing cookies through TanStack Start's server cookie helpers). Cookies are `httpOnly`, `Secure`, `SameSite=Lax`; the browser client uses `persistSession: false` because the server owns the session.
- **Sign-in flow:** `/admin/login` form → server function `signInAdmin({ email, password })` → `supabase.auth.signInWithPassword` → on success, verify `admin_users` contains the user → set cookies → return `{ ok: true }`; the client then calls `router.navigate({ to: "/admin" })`.
- **Guard:** `src/routes/admin.tsx` `beforeLoad` calls `getAdminSession()`; if absent, `throw redirect({ to: "/admin/login" })`. The login route is exempted by pathname check inside the same layout.
- **Defence in depth:** every mutation server function begins with `await requireAdmin()` which re-validates the user against Supabase Auth *and* `admin_users`. Never trust the route guard — server functions are independently reachable.
- **Sign-out + idle timeout:** sign-out server function clears cookies and calls `auth.signOut()`; sessions expire after 7 days (Supabase default refresh window). Optional: log `last_login_at`.

---

## 8. Server functions & data layer

Pattern for every collection (example: projects):

```ts
// src/lib/content/mutations.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin, adminClient } from "@/lib/supabase/server";

const projectInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(120),
  location: z.string().max(120).optional(),
  category: z.enum(["residential", "commercial", "industrial"]),
  summary: z.string().max(400).optional(),
  cover_image_path: z.string().max(300).optional(),
  year: z.number().int().min(1990).max(2100).optional(),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => projectInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = adminClient();
    const { error } = await supabase.from("projects").upsert(data);
    if (error) throw error;
    return { ok: true };
  });
```

Recommended function surface per collection: `listX` (public, published only), `listAllX` (admin), `getX(slug)`, `saveX`, `deleteX`, `reorderX(ids[])`, plus `saveSettings`, `createUploadTarget` (optional), `signOutAdmin`, `getAdminSession`.

Public pages consume them through `queryOptions`:

```ts
export const projectsQuery = () =>
  queryOptions({ queryKey: ["projects"], queryFn: () => listProjects(), staleTime: 60_000 });
// route loader: context.queryClient.ensureQueryData(projectsQuery())
```

After a successful admin mutation: `queryClient.invalidateQueries({ queryKey: [...] })` and `router.invalidate()` so the SSR cache and previews update. Cache headers: keep dynamic HTML short-lived (`s-maxage=60, stale-while-revalidate=300`) or rely on Netlify's default; content changes are infrequent, so a 60 s stale window is a good trade.

**Fallback behaviour:** each reader wraps the call in `try/catch`; on missing env vars or error it returns `defaults.ts` data and logs once. This makes local dev work before Supabase exists and keeps the site live if the backend hiccups.

---

## 9. Admin UI

Reuse what is already installed — Radix/shadcn `table`, `tabs`, `dialog`, `drawer`, `switch`, `select`, `textarea`, `form`, `sidebar`, `sonner`, plus `react-hook-form` + `@hookform/resolvers` + `zod`. No new UI dependencies required.

- **`/admin`** — counts (projects, posts, media), recent edits, "view site" link.
- **Collection list pages** — shadcn `Table`: thumbnail, title, status pill, sort order, edit/delete actions; "New …" button top right; drag handle or up/down buttons for `sort_order` (keep it simple: numeric up/down first).
- **Editor** — side `Sheet`/`Drawer` or a dedicated detail route with `react-hook-form`, zod schema from `schema.ts`, cover image via `MediaPicker`, publish `Switch`, save/cancel with unsaved-changes guard.
- **`/admin/media`** — grid of uploads, upload dropzone with progress, copy URL, edit alt text, delete (blocked if referenced).
- **`/admin/settings`** — singleton form for `site_settings` incl. phone, WhatsApp, socials and global images.
- **Shell** — sidebar navigation (no public `Nav`/`Footer`), sign-out, breadcrumb. Auth pages use `noindex`.
- **SEO guard** — add `robots: "noindex, nofollow"` meta to every `/admin` route and a `Disallow: /admin` rule in `public/robots.txt`.
- **i18n** — admin UI can stay English-only; content forms may expose EN and BN fields side by side (BN optional, falls back to EN via `?? ` at render).

---

## 10. Public site changes (ordered, low-risk)

1. Add `src/lib/content/media.ts` + `defaults.ts` (no behaviour change).
2. Switch `/projects`, `/gallery`, `/blog`, `/testimonials`, `/faq`, `/career`, `/about` route loaders to read from the DB, falling back to defaults.
3. Switch home components (`hero`, `projects-showcase`, `blog-preview`, `testimonials`, `faq`, `services-grid`, `why-choose`, `about-preview`, `trust-bar`) to receive props from the route loader or a shared query hook.
4. Move `site` from `site-config.ts` to a `getSiteSettings()` query; keep `site-config.ts` exporting the same shape sourced from defaults, so ~15 import sites do not all change at once.
5. Delete the duplicated testimonial/post arrays; render from the single source.
6. Add `width`/`height` and `fetchPriority` on the hero; verify CLS/LCP in the Netlify preview.

Path-based routing must remain the same throughout: no URL changes, so no redirects are needed.

---

## 11. Environment & deployment

Secrets live in Netlify → Site configuration → Environment variables (and `.env` locally, which is already gitignored). **Nothing secret may be `VITE_`-prefixed** — Vite inlines those into the client bundle.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client + server | project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client + server | anon/publishable key, RLS-bound |
| `SUPABASE_URL` | server only | same URL for server clients |
| `SUPABASE_SECRET_KEY` | **server only** | replaces legacy `SUPABASE_SERVICE_ROLE_KEY`; bypasses RLS |
| `ADMIN_EMAIL` | server only (optional) | allowlist check during sign-in |

Setup checklist:

1. Create the Supabase project; copy URL + publishable key + secret key.
2. Run migrations (`supabase db push` or paste into the SQL editor) including RLS policies.
3. Create the `media` bucket (public read, 8 MB limit, `image/*`) and its storage policies.
4. Auth → disable sign-ups, set site URL to the Netlify production URL, add localhost redirect.
5. Create the one admin user; insert into `admin_users`.
6. Run the seed script to upload `src/assets/*.jpg`.
7. Add env vars in Netlify for Production/Deploy previews; redeploy.
8. Verify: public page reads work with the anon key; admin sign-in works; anon write is rejected.

---

## 12. Firebase alternative

If Firebase is preferred, the same plan maps as follows:

| Plan element | Firebase equivalent |
| --- | --- |
| `services`/`projects`/… tables | Firestore collections `services`, `projects` (+ `images` subcollection), `gallery`, `posts`, `testimonials`, `faqs`, `jobOpenings`, `settings/site` |
| `published` filter | Query `where("published", "==", true)`; keep a published copy or mirror for pre-render |
| `admin_users` + `is_admin()` | Firebase Auth users + custom claim `admin: true`, set via Admin SDK script |
| RLS | Firestore Security Rules: `allow read: if resource.data.published == true; allow write: if request.auth.token.admin == true;` |
| Storage bucket + policies | Cloud Storage bucket `media`, rules mirroring the same conditions |
| Server functions | Firebase Admin SDK (`firebase-admin`) inside `createServerFn`; session via `createSessionCookie` and the same `requireAdmin()` middleware |
| Local emulation | Firebase Emulator Suite (nice for testing rules) |

Trade-offs to accept: no joins, no SQL constraints, Deno/Node Admin SDK credentials are a second secret to rotate, and the free tier's Firestore read/write quotas are irrelevant here but the two-rule-language setup is more to maintain. Choose Firebase only if the owner already has a Google Cloud/Firebase project.

---

## 13. Phased rollout

| Phase | Work | Output | Est. |
| --- | --- | --- | --- |
| 0 | Provider decision, account, bucket, env vars | Working project + keys | 0.5 d |
| 1 | Migrations, RLS, storage policies, seed script | Data model live, content imported | 1 d |
| 2 | Data layer + public pages reading DB with fallback | Site renders from DB, no visual change | 1.5 d |
| 3 | Admin auth, shell, guard, media library + uploader | Log in, upload, browse media | 1.5 d |
| 4 | CRUD screens: settings, services, projects, gallery, posts, testimonials, FAQs, careers | Owner can edit everything | 2.5 d |
| 5 | Hardening: RLS audit, noindex, previews, invalidations, Lighthouse, backup note | Verified release | 1 d |

Total ≈ 8 dev-days for one developer. Phases 1–2 are invisible but non-negotiable; 3–4 deliver the visible admin value.

---

## 14. Security checklist

- [ ] `SUPABASE_SECRET_KEY` never appears in client code, `VITE_*` vars, or git.
- [ ] DDL/table-level: RLS enabled on **every** table; `is_admin()` used in all write policies.
- [ ] Public `SELECT` policies filter `published = true` (or the table has no drafts).
- [ ] Storage bucket: public read, admin-only insert/update/delete; size + MIME restrictions at bucket level.
- [ ] Every mutation server function calls `requireAdmin()` before touching the DB.
- [ ] Zod validation on both form and server side; slugs unique and URL-safe.
- [ ] Sign-ups disabled; only `admin_users` members pass.
- [ ] `/admin/*` sends `noindex, nofollow` and is excluded in `robots.txt`.
- [ ] Admin forms use `react-hook-form`; no `dangerouslySetInnerHTML` for markdown body (render via a sanitising markdown component if post bodies are added).
- [ ] Uploaded filename never trusted: object keys are UUID-based, original name stored only in the `media` row.
- [ ] Rate limiting on `signInAdmin` (simple in-memory counter per IP is enough for a single admin).
- [ ] Enable Supabase PITR/backups (paid) or schedule a weekly `pg_dump`; document restore steps.
- [ ] Log `updated_by` on mutations for accountability.

---

## 15. Acceptance criteria

1. An unauthenticated visitor opening `/admin` is redirected to `/admin/login`; direct mutation calls without a session return 401.
2. Public pages show only `published` rows; anon key cannot insert, update or delete anything (verified with a throwaway script).
3. Uploading a 4 MB JPEG succeeds in one action, produces a WebP under ~400 KB, and the thumbnail/hero renders from the Supabase public URL with correct dimensions.
4. Adding a project in `/admin/projects` makes it appear on `/projects` and the home showcase after a refresh; unpublishing hides it everywhere.
5. Editing phone/WhatsApp/email in `/admin/settings` updates nav/footer/contact and the JSON-LD in `__root.tsx`.
6. With Supabase env vars removed, `vite build` still succeeds and the site renders the current static content (fallback path).
7. `npm run lint` and `vite build` pass; `/admin` routes are `noindex`.
8. Lighthouse mobile on `/` stays ≥ 90 performance after images move to storage.

---

## 16. Open questions for the owner

1. Content language: should copy be editable in both English and Bengali, or English only with Bengali handled in code? (Schema above allows optional `_bn` columns.)
2. Blog: should posts have full body pages (`/blog/$slug`) or remain cards linking nowhere? Currently cards link to `#`.
3. Who else needs admin access (office manager, designer)? Determines whether we need role granularity beyond `admin`.
4. Should quote/contact submissions also land in the database and be visible in `/admin`? (Natural phase 2; forms are currently non-functional.)
5. Domains: does the owner want `admin.snelectrical.com`-style separation, or is path-based `/admin` fine? Path-based is recommended (no extra deploy, shared session cookie).
