-- SN Electrical — content schema for the admin panel.
-- Run in the Supabase SQL editor, or `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Only members of admin_users may write content.
create table if not exists admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists site_settings (
  id              int primary key default 1 check (id = 1),
  name            text not null,
  short           text not null,
  tagline         text not null,
  description     text not null,
  phone           text not null,
  phone_display   text not null,
  whatsapp        text not null,
  email           text not null,
  address         text not null,
  hours           text not null,
  socials         jsonb not null default '{}'::jsonb,
  logo_path       text,
  hero_image_path text,
  about_image_path text,
  og_image_path   text,
  updated_at      timestamptz not null default now()
);

create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'media',
  path        text not null,
  mime        text not null,
  size_bytes  int  not null,
  width       int,
  height      int,
  alt         text not null default '',
  caption     text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists services (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title_en   text not null,
  title_bn   text,
  desc_en    text not null,
  desc_bn    text,
  icon       text not null default 'Zap',
  image_path text,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  location    text,
  category    text not null check (category in ('residential', 'commercial', 'industrial')),
  summary     text,
  description text,
  cover_image_path text,
  year        int,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists project_images (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  path       text not null,
  alt        text not null default '',
  sort_order int not null default 0
);

create table if not exists gallery_images (
  id         uuid primary key default gen_random_uuid(),
  path       text not null,
  alt        text not null default '',
  caption    text,
  tall       boolean not null default false,
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  category     text not null,
  excerpt      text not null,
  body         text,
  cover_image_path text,
  reading_minutes int,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  published_at date,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  rating     int not null default 5 check (rating between 1 and 5),
  quote      text not null,
  avatar_path text,
  published  boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  category   text,
  published  boolean not null default true,
  sort_order int not null default 0
);

create table if not exists job_openings (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  location        text,
  employment_type text not null,
  description     text,
  requirements    jsonb not null default '[]'::jsonb,
  is_open         boolean not null default true,
  sort_order      int not null default 0
);

create table if not exists job_perks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  sort_order  int not null default 0
);

create table if not exists about_values (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  description text not null,
  icon       text not null default 'Sparkles',
  sort_order int not null default 0
);

create table if not exists about_timeline (
  id         uuid primary key default gen_random_uuid(),
  year       text not null,
  title      text not null,
  description text not null,
  sort_order int not null default 0
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['services', 'projects', 'posts']
  loop
    execute format(
      'drop trigger if exists touch_%1$s on %1$s;
       create trigger touch_%1$s before update on %1$s
       for each row execute function touch_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array[
    'site_settings', 'media', 'services', 'projects', 'project_images',
    'gallery_images', 'posts', 'testimonials', 'faqs', 'job_openings',
    'job_perks', 'about_values', 'about_timeline', 'admin_users'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "admin write %1$s" on %1$s', t);
    execute format(
      'create policy "admin write %1$s" on %1$s for all to authenticated
       using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Public readers: published rows only.
do $$
declare t text;
begin
  foreach t in array array['services', 'projects', 'gallery_images', 'testimonials', 'faqs']
  loop
    execute format('drop policy if exists "public read %1$s" on %1$s', t);
    execute format(
      'create policy "public read %1$s" on %1$s for select to anon, authenticated
       using (published)', t);
  end loop;
end $$;

drop policy if exists "public read posts" on posts;
create policy "public read posts" on posts for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select to anon, authenticated using (true);

drop policy if exists "public read media" on media;
create policy "public read media" on media for select to anon, authenticated using (true);

drop policy if exists "public read project_images" on project_images;
create policy "public read project_images" on project_images for select to anon, authenticated using (true);

drop policy if exists "public read job_openings" on job_openings;
create policy "public read job_openings" on job_openings for select to anon, authenticated using (is_open);

drop policy if exists "public read job_perks" on job_perks;
create policy "public read job_perks" on job_perks for select to anon, authenticated using (true);

drop policy if exists "public read about_values" on about_values;
create policy "public read about_values" on about_values for select to anon, authenticated using (true);

drop policy if exists "public read about_timeline" on about_timeline;
create policy "public read about_timeline" on about_timeline for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 8388608,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

drop policy if exists "public read media objects" on storage.objects;
create policy "public read media objects" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "admin upload media objects" on storage.objects;
create policy "admin upload media objects" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and is_admin());

drop policy if exists "admin update media objects" on storage.objects;
create policy "admin update media objects" on storage.objects
  for update to authenticated using (bucket_id = 'media' and is_admin());

drop policy if exists "admin delete media objects" on storage.objects;
create policy "admin delete media objects" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and is_admin());

-- ---------------------------------------------------------------------------
-- Seed: today's hardcoded content (images use legacy asset filenames; the
-- `mediaUrl()` helper resolves those locally until real uploads replace them).
-- ---------------------------------------------------------------------------

insert into site_settings (
  id, name, short, tagline, description, phone, phone_display, whatsapp,
  email, address, hours, socials
) values (
  1, 'SN Electrical Services', 'SN Electrical',
  'Powering Your Home with Safety & Trust',
  'Certified residential, commercial and industrial electrical solutions. Licensed electricians, 24/7 emergency response, and a decade of trusted craftsmanship.',
  '6297962289', '+91 6297 962 289', '916297962289',
  'hello@snelectrical.com',
  'Service across the region — book on-site visits & emergency call-outs.',
  'Mon–Sat · 8:00 – 20:00 · 24/7 Emergency',
  '{"facebook":"https://facebook.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com","youtube":"https://youtube.com"}'::jsonb
) on conflict (id) do nothing;

insert into services (slug, title_en, desc_en, icon, sort_order) values
  ('house-wiring', 'House Wiring', 'Safe, code-compliant wiring for new builds & renovations.', 'Home', 0),
  ('building-wiring', 'Building Wiring', 'Full-scale wiring for apartments and multi-story buildings.', 'Building2', 1),
  ('commercial', 'Commercial Electrical', 'Turnkey commercial installations engineered for uptime.', 'Store', 2),
  ('industrial', 'Industrial Electrical', 'Heavy-duty industrial systems and control panels.', 'Factory', 3),
  ('db-mcb', 'DB & MCB Installation', 'Distribution boards and MCBs sized for load & safety.', 'CircuitBoard', 4),
  ('earthing', 'Earthing Solutions', 'Compliant earthing to protect people and equipment.', 'Cable', 5),
  ('maintenance', 'Electrical Maintenance', 'Scheduled AMC visits and preventive maintenance.', 'Wrench', 6),
  ('fault-finding', 'Fault Finding', 'Rapid diagnostics for shorts, trips, and outages.', 'Zap', 7),
  ('led-lighting', 'LED Lighting', 'Architectural, ambient and outdoor LED design.', 'Lightbulb', 8),
  ('fan-ac', 'Fan & AC Wiring', 'Ceiling fans, AC circuits, and dedicated power lines.', 'Fan', 9)
on conflict (slug) do nothing;

insert into projects (slug, title, location, category, summary, cover_image_path, sort_order) values
  ('luxury-villa-rewire', 'Luxury villa rewire', 'Riverside Estate', 'residential', 'Complete rewire of a 6,000 sq ft villa.', 'project-residential.jpg', 0),
  ('corporate-hq-fit-out', 'Corporate HQ fit-out', 'Central Business Park', 'commercial', 'Turnkey electrical fit-out for a corporate headquarters.', 'project-commercial.jpg', 1),
  ('factory-power-upgrade', 'Factory power upgrade', 'Industrial Zone', 'industrial', 'Heavy-duty supply upgrade with zero production downtime.', 'project-industrial.jpg', 2),
  ('ambient-lighting-design', 'Ambient lighting design', 'Boutique Hotel', 'commercial', 'Architectural lighting scheme for a boutique hotel.', 'service-lighting.jpg', 3),
  ('db-panel-modernization', 'DB panel modernization', 'Apartment Complex', 'residential', 'Distribution board replacement across 40 units.', 'service-db.jpg', 4),
  ('wiring-overhaul', 'Wiring overhaul', 'Coworking Space', 'commercial', 'Full wiring overhaul for a 200-seat coworking floor.', 'service-wiring.jpg', 5),
  ('preventive-maintenance-amc', 'Preventive maintenance AMC', 'Retail Chain', 'commercial', 'Quarterly maintenance across 12 retail outlets.', 'service-maintenance.jpg', 6),
  ('warehouse-led-retrofit', 'Warehouse LED retrofit', 'Logistics Hub', 'industrial', 'LED retrofit cutting lighting energy by 58%.', 'service-lighting.jpg', 7)
on conflict (slug) do nothing;

insert into gallery_images (path, alt, tall, sort_order) values
  ('project-residential.jpg', 'Residential villa wiring', true, 0),
  ('project-commercial.jpg', 'Commercial office fit-out', false, 1),
  ('project-industrial.jpg', 'Industrial power installation', false, 2),
  ('service-lighting.jpg', 'Ambient lighting detail', true, 3),
  ('service-db.jpg', 'Distribution board installation', false, 4),
  ('service-wiring.jpg', 'Neat cable routing', false, 5),
  ('service-maintenance.jpg', 'Preventive maintenance visit', false, 6),
  ('hero.jpg', 'Electrician at work', true, 7),
  ('why-choose.jpg', 'Team on site', false, 8);

insert into posts (slug, title, category, excerpt, cover_image_path, status, published_at, sort_order) values
  ('electrical-safety-home', '10 electrical safety checks every homeowner should do this year', 'Electrical Safety', 'A field-tested checklist you can run through in an afternoon — from outlets and DB panels to smoke alarms.', 'project-residential.jpg', 'published', '2026-06-12', 0),
  ('led-savings', 'How switching to LED cut a client''s bill by 42%', 'Energy Saving', 'The numbers, the fixtures used, and how to plan a retrofit that pays back in under 18 months.', 'service-lighting.jpg', 'published', '2026-05-30', 1),
  ('wiring-guide', 'Copper vs aluminium wiring — a practical field guide', 'Wiring Guide', 'When to use each, common failure modes we see on-site, and current code requirements.', 'service-wiring.jpg', 'published', '2026-05-08', 2),
  ('db-modernization', 'Signs your distribution board needs modernizing', 'Wiring Guide', 'Warm covers, nuisance trips, missing RCDs — the tell-tale symptoms and what to do about them.', 'service-db.jpg', 'published', '2026-04-22', 3),
  ('amc-value', 'What actually happens on a quarterly maintenance visit', 'Maintenance Tips', 'A behind-the-scenes look at our AMC service — the exact checks, tests and reporting you get.', 'service-maintenance.jpg', 'published', '2026-04-04', 4),
  ('industrial-planning', 'Planning an industrial power upgrade without downtime', 'Wiring Guide', 'Sequencing, temporary supplies, and coordination — what separates a good contractor from a great one.', 'project-industrial.jpg', 'published', '2026-03-18', 5)
on conflict (slug) do nothing;

insert into testimonials (name, role, rating, quote, sort_order) values
  ('Priya Sharma', 'Homeowner · Riverside', 5, 'SN Electrical rewired our entire villa in under a week. Immaculate work, transparent pricing, and a genuinely friendly team.', 0),
  ('Arjun Mehta', 'Ops Manager · TechPark', 5, 'Zero downtime, weekend install, perfect documentation. They understand commercial constraints.', 1),
  ('Nadia Rahman', 'Café Owner', 5, 'Beautiful ambient lighting design and the DB panel is a work of art.', 2),
  ('Kamal Iqbal', 'Facility Head · Textile Mill', 5, 'Complex industrial upgrade delivered on time and on budget.', 3),
  ('Sana Ahmed', 'Homeowner', 5, 'Emergency call at 11 pm, technician onsite by midnight, problem solved.', 4),
  ('Rohan Das', 'Property Manager', 5, 'Consistent quality across three buildings — the go-to team for our portfolio.', 5);

insert into faqs (question, answer, category, sort_order) values
  ('How quickly can you respond to an emergency?', 'Our on-call team dispatches within 60 minutes for emergencies in serviced areas, 24/7.', 'General', 0),
  ('Are your electricians licensed and insured?', 'Yes — every technician is fully licensed, certified, and covered by comprehensive liability insurance.', 'General', 1),
  ('Do you provide free quotes?', 'Absolutely. Site visits for quotes are free within our service area and include a written estimate.', 'Pricing', 2),
  ('How do you charge — hourly or fixed?', 'Most jobs are fixed-price after the site assessment; small maintenance jobs use an hourly rate.', 'Pricing', 3),
  ('What warranty do you offer?', 'All installation work is covered by a workmanship warranty ranging from 12 to 24 months, depending on service.', 'Warranty', 4),
  ('What if something fails after installation?', 'We return at no cost during the warranty period to diagnose and repair covered issues.', 'Warranty', 5),
  ('Can you handle commercial and industrial projects?', 'Yes, we deliver end-to-end electrical fit-outs for offices, factories, retail chains and industrial units.', 'Commercial', 6),
  ('Do you offer AMC?', 'We run monthly, quarterly, and annual maintenance contracts tailored to your site.', 'Commercial', 7);

insert into job_perks (title, description, sort_order) values
  ('Competitive pay', 'Above-market base plus performance bonuses.', 0),
  ('Training & certifications', 'Sponsored courses and paid certifications.', 1),
  ('Modern tools', 'Best-in-class equipment, no cutting corners.', 2),
  ('Safety-first culture', 'Zero tolerance for shortcuts on protective work.', 3);

insert into job_openings (title, location, employment_type, description, sort_order) values
  ('Senior Electrician', 'On-site', 'Full-time', 'Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience.', 0),
  ('Commercial Project Lead', 'On-site', 'Full-time', 'Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience.', 1),
  ('Apprentice Electrician', 'On-site', 'Apprenticeship', 'Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience.', 2),
  ('Estimator / Quantity Surveyor', 'Hybrid', 'Full-time', 'Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience.', 3);

insert into about_values (title, description, icon, sort_order) values
  ('Safety first', 'Every job starts with a risk assessment. Full stop.', 'Shield', 0),
  ('Craftsmanship', 'We take pride in the work behind the wall, not just the finish.', 'Award', 1),
  ('Honest pricing', 'Written quotes. No surprise line items. Ever.', 'HeartHandshake', 2),
  ('Modern tools', 'Thermal imaging, insulation testers, calibrated meters.', 'Sparkles', 3);

insert into about_timeline (year, title, description, sort_order) values
  ('2014', 'Founded', 'SN Electrical begins with a two-person crew and a promise: no shortcut wiring.', 0),
  ('2017', 'Commercial launch', 'First 10,000 sq ft office fit-out delivered on schedule.', 1),
  ('2020', '24/7 emergency', 'Round-the-clock dispatch launches across the region.', 2),
  ('2023', '500th project', 'Team crosses 500 completed installations with 5-star average.', 3),
  ('2026', 'New workshop', 'Modern workshop and training facility opens for apprentices.', 4);
