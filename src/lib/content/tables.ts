/**
 * Client-safe descriptions of every editable collection. The generic admin
 * editor renders forms and tables from this config, and the server validates
 * the same fields with zod in `schema.ts`.
 */

export type FieldType = "text" | "textarea" | "number" | "switch" | "select" | "image" | "date";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  full?: boolean;
  inTable?: boolean;
};

export type CollectionConfig = {
  table: string;
  title: string;
  description: string;
  singular: string;
  orderColumn: string;
  fields: Field[];
  createDefaults: Record<string, unknown>;
};

export const ICON_OPTIONS = [
  "Home",
  "Building2",
  "Store",
  "Factory",
  "CircuitBoard",
  "Cable",
  "Wrench",
  "Zap",
  "Lightbulb",
  "Fan",
  "Shield",
  "Award",
  "HeartHandshake",
  "Sparkles",
].map((name) => ({ value: name, label: name }));

const sortField: Field = { key: "sort_order", label: "Sort order", type: "number" };
const publishedField: Field = { key: "published", label: "Published", type: "switch", inTable: true };

export const collections = {
  services: {
    table: "services",
    title: "Services",
    description: "The ten service lines shown on the home page and /services.",
    singular: "service",
    orderColumn: "sort_order",
    fields: [
      { key: "title_en", label: "Title (English)", type: "text", required: true, inTable: true },
      { key: "title_bn", label: "Title (Bengali)", type: "text", full: true },
      { key: "slug", label: "Slug", type: "text", required: true, help: "URL segment, lowercase letters and hyphens." },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, required: true },
      { key: "desc_en", label: "Description (English)", type: "textarea", required: true, full: true },
      { key: "desc_bn", label: "Description (Bengali)", type: "textarea", full: true },
      { key: "image_path", label: "Image", type: "image", full: true },
      sortField,
      publishedField,
    ],
    createDefaults: { icon: "Zap", published: true, sort_order: 0 },
  },
  projects: {
    table: "projects",
    title: "Projects",
    description: "Portfolio entries used on /projects and the home showcase.",
    singular: "project",
    orderColumn: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, inTable: true },
      { key: "slug", label: "Slug", type: "text", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        inTable: true,
        options: [
          { value: "residential", label: "Residential" },
          { value: "commercial", label: "Commercial" },
          { value: "industrial", label: "Industrial" },
        ],
      },
      { key: "location", label: "Location", type: "text" },
      { key: "year", label: "Year", type: "number" },
      { key: "cover_image_path", label: "Cover image", type: "image", full: true },
      { key: "summary", label: "Summary", type: "textarea", full: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "featured", label: "Featured", type: "switch" },
      sortField,
      publishedField,
    ],
    createDefaults: { category: "residential", published: true, featured: false, sort_order: 0 },
  },
  gallery_images: {
    table: "gallery_images",
    title: "Gallery",
    description: "Tiles on the /gallery page. Tall tiles span two rows.",
    singular: "image",
    orderColumn: "sort_order",
    fields: [
      { key: "path", label: "Image", type: "image", required: true, full: true, inTable: true },
      { key: "alt", label: "Alt text", type: "text", help: "Describe the image for screen readers and search engines." },
      { key: "caption", label: "Caption", type: "text" },
      { key: "tall", label: "Tall tile", type: "switch" },
      sortField,
      publishedField,
    ],
    createDefaults: { tall: false, published: true, alt: "", sort_order: 0 },
  },
  posts: {
    table: "posts",
    title: "Journal",
    description: "Blog posts shown on /blog and the home preview.",
    singular: "post",
    orderColumn: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, full: true, inTable: true },
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "category", label: "Category", type: "text", required: true, inTable: true },
      { key: "cover_image_path", label: "Cover image", type: "image", full: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true, full: true },
      { key: "body", label: "Body (markdown)", type: "textarea", full: true },
      { key: "published_at", label: "Publish date", type: "date" },
      { key: "reading_minutes", label: "Reading minutes", type: "number" },
      {
        key: "status",
        label: "Status",
        type: "select",
        inTable: true,
        options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ],
      },
      sortField,
    ],
    createDefaults: { status: "draft", sort_order: 0 },
  },
  testimonials: {
    table: "testimonials",
    title: "Testimonials",
    description: "Client reviews shown on /testimonials and the home carousel.",
    singular: "testimonial",
    orderColumn: "sort_order",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, inTable: true },
      { key: "role", label: "Role / company", type: "text" },
      { key: "rating", label: "Rating (1–5)", type: "number", required: true },
      { key: "quote", label: "Quote", type: "textarea", required: true, full: true },
      { key: "avatar_path", label: "Avatar", type: "image", full: true },
      sortField,
      publishedField,
    ],
    createDefaults: { rating: 5, published: true, sort_order: 0 },
  },
  faqs: {
    table: "faqs",
    title: "FAQs",
    description: "Questions grouped by category on /faq.",
    singular: "question",
    orderColumn: "sort_order",
    fields: [
      { key: "question", label: "Question", type: "text", required: true, full: true, inTable: true },
      { key: "answer", label: "Answer", type: "textarea", required: true, full: true },
      { key: "category", label: "Category", type: "text", inTable: true },
      sortField,
      publishedField,
    ],
    createDefaults: { category: "General", published: true, sort_order: 0 },
  },
  job_openings: {
    table: "job_openings",
    title: "Open roles",
    description: "Positions listed on /career.",
    singular: "role",
    orderColumn: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, inTable: true },
      { key: "location", label: "Location", type: "text", inTable: true },
      { key: "employment_type", label: "Employment type", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "is_open", label: "Open", type: "switch", inTable: true },
      sortField,
    ],
    createDefaults: { employment_type: "Full-time", is_open: true, sort_order: 0 },
  },
  job_perks: {
    table: "job_perks",
    title: "Perks",
    description: "Benefit cards on /career.",
    singular: "perk",
    orderColumn: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, inTable: true },
      { key: "description", label: "Description", type: "textarea", required: true, full: true },
      sortField,
    ],
    createDefaults: { sort_order: 0 },
  },
  about_values: {
    table: "about_values",
    title: "About values",
    description: "Value cards on /about.",
    singular: "value",
    orderColumn: "sort_order",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, inTable: true },
      { key: "description", label: "Description", type: "textarea", required: true, full: true },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, required: true },
      sortField,
    ],
    createDefaults: { icon: "Sparkles", sort_order: 0 },
  },
  about_timeline: {
    table: "about_timeline",
    title: "About timeline",
    description: "Milestones in the /about journey section.",
    singular: "milestone",
    orderColumn: "sort_order",
    fields: [
      { key: "year", label: "Year", type: "text", required: true, inTable: true },
      { key: "title", label: "Title", type: "text", required: true, inTable: true },
      { key: "description", label: "Description", type: "textarea", required: true, full: true },
      sortField,
    ],
    createDefaults: { sort_order: 0 },
  },
} satisfies Record<string, CollectionConfig>;

export type CollectionKey = keyof typeof collections;

export function isCollectionKey(value: string): value is CollectionKey {
  return Object.prototype.hasOwnProperty.call(collections, value);
}

export const collectionList = (Object.keys(collections) as CollectionKey[]).map((key) => ({
  key,
  ...collections[key],
}));
