import { z } from "zod";

import type { CollectionKey } from "./tables";

const slug = z
  .string()
  .trim()
  .min(2, "Slug is too short")
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only");

const text = (max = 500) => z.string().trim().max(max);
const requiredText = (max = 500) => z.string().trim().min(1, "Required").max(max);
const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value ? value : null));
const integer = z.number().int();
const optionalInteger = integer.nullish().transform((value) => value ?? null);
const bool = z.boolean().default(false);

const path = z
  .string()
  .trim()
  .max(400)
  .nullish()
  .transform((value) => (value ? value : null));

const time = z.string().trim().max(200);

export const collectionSchemas = {
  services: z.object({
    slug,
    title_en: requiredText(160),
    title_bn: optionalText(160),
    desc_en: requiredText(600),
    desc_bn: optionalText(600),
    icon: requiredText(60),
    image_path: path,
    sort_order: integer.default(0),
    published: bool,
  }),
  projects: z.object({
    slug,
    title: requiredText(160),
    location: optionalText(160),
    category: z.enum(["residential", "commercial", "industrial"]),
    summary: optionalText(600),
    description: optionalText(4000),
    cover_image_path: path,
    year: optionalInteger,
    featured: bool,
    sort_order: integer.default(0),
    published: bool,
  }),
  gallery_images: z.object({
    path: requiredText(400),
    alt: text(300).default(""),
    caption: optionalText(300),
    tall: bool,
    sort_order: integer.default(0),
    published: bool,
  }),
  posts: z.object({
    slug,
    title: requiredText(200),
    category: requiredText(80),
    excerpt: requiredText(600),
    body: optionalText(40000),
    cover_image_path: path,
    reading_minutes: optionalInteger,
    status: z.enum(["draft", "published"]).default("draft"),
    published_at: optionalText(20),
    sort_order: integer.default(0),
  }),
  testimonials: z.object({
    name: requiredText(120),
    role: optionalText(160),
    rating: z.number().int().min(1).max(5).default(5),
    quote: requiredText(1000),
    avatar_path: path,
    published: bool,
    sort_order: integer.default(0),
  }),
  faqs: z.object({
    question: requiredText(300),
    answer: requiredText(2000),
    category: optionalText(80),
    published: bool,
    sort_order: integer.default(0),
  }),
  job_openings: z.object({
    title: requiredText(160),
    location: optionalText(160),
    employment_type: requiredText(80),
    description: optionalText(3000),
    is_open: bool,
    sort_order: integer.default(0),
  }),
  job_perks: z.object({
    title: requiredText(160),
    description: requiredText(600),
    sort_order: integer.default(0),
  }),
  about_values: z.object({
    title: requiredText(160),
    description: requiredText(600),
    icon: requiredText(60),
    sort_order: integer.default(0),
  }),
  about_timeline: z.object({
    year: requiredText(20),
    title: requiredText(160),
    description: requiredText(600),
    sort_order: integer.default(0),
  }),
} satisfies Record<CollectionKey, z.ZodTypeAny>;

export const settingsSchema = z.object({
  name: requiredText(120),
  short: requiredText(60),
  tagline: requiredText(200),
  description: text(1000),
  phone: requiredText(40),
  phone_display: requiredText(60),
  whatsapp: requiredText(40),
  email: z.string().trim().email("Enter a valid email"),
  address: requiredText(400),
  hours: time,
  socials: z.record(z.string()).default({}),
  logo_path: path,
  hero_image_path: path,
  about_image_path: path,
  og_image_path: path,
});

export const mediaMetaSchema = z.object({
  id: z.string().uuid(),
  alt: text(300).default(""),
  caption: optionalText(300),
});

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Enter your password").max(200),
});

export type CollectionInput<T extends CollectionKey> = z.input<(typeof collectionSchemas)[T]>;
