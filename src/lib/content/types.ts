export type SiteSettings = {
  id: number;
  name: string;
  short: string;
  tagline: string;
  description: string;
  phone: string;
  phone_display: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  socials: Record<string, string>;
  logo_path: string | null;
  hero_image_path: string | null;
  about_image_path: string | null;
  og_image_path: string | null;
};

export type Service = {
  id: string;
  slug: string;
  title_en: string;
  title_bn: string | null;
  desc_en: string;
  desc_bn: string | null;
  icon: string;
  image_path: string | null;
  sort_order: number;
  published: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  category: "residential" | "commercial" | "industrial";
  summary: string | null;
  description: string | null;
  cover_image_path: string | null;
  year: number | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type GalleryImage = {
  id: string;
  path: string;
  alt: string;
  caption: string | null;
  tall: boolean;
  sort_order: number;
  published: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string | null;
  cover_image_path: string | null;
  reading_minutes: number | null;
  status: "draft" | "published";
  published_at: string | null;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  quote: string;
  avatar_path: string | null;
  published: boolean;
  sort_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  published: boolean;
  sort_order: number;
};

export type JobPerk = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
};

export type JobOpening = {
  id: string;
  title: string;
  location: string | null;
  employment_type: string;
  description: string | null;
  is_open: boolean;
  sort_order: number;
};

export type AboutValue = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
};

export type AboutTimelineEntry = {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
};

export type MediaRow = {
  id: string;
  bucket: string;
  path: string;
  mime: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string | null;
  created_at: string;
};

/** Shape returned by admin server functions (must be serializable). */
export type AdminRow = { id: string } & Record<string, string | number | boolean | null>;
