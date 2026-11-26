import type {
  AboutTimelineEntry,
  AboutValue,
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

/**
 * The content that ships with the repo. Public pages fall back to this when
 * Supabase is not configured or unreachable, so the site never breaks.
 */

export const defaultSiteSettings: SiteSettings = {
  id: 1,
  name: "SN Electrical Services",
  short: "SN Electrical",
  tagline: "Powering Your Home with Safety & Trust",
  description:
    "Certified residential, commercial and industrial electrical solutions. Licensed electricians, 24/7 emergency response, and a decade of trusted craftsmanship.",
  phone: "6297962289",
  phone_display: "+91 6297 962 289",
  whatsapp: "916297962289",
  email: "hello@snelectrical.com",
  address: "Service across the region — book on-site visits & emergency call-outs.",
  hours: "Mon–Sat · 8:00 – 20:00 · 24/7 Emergency",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  logo_path: "logo.png",
  hero_image_path: "hero.jpg",
  about_image_path: "about.jpg",
  og_image_path: null,
};

export const defaultServices: Service[] = [
  { slug: "house-wiring", title_en: "House Wiring", desc_en: "Safe, code-compliant wiring for new builds & renovations.", icon: "Home" },
  { slug: "building-wiring", title_en: "Building Wiring", desc_en: "Full-scale wiring for apartments and multi-story buildings.", icon: "Building2" },
  { slug: "commercial", title_en: "Commercial Electrical", desc_en: "Turnkey commercial installations engineered for uptime.", icon: "Store" },
  { slug: "industrial", title_en: "Industrial Electrical", desc_en: "Heavy-duty industrial systems and control panels.", icon: "Factory" },
  { slug: "db-mcb", title_en: "DB & MCB Installation", desc_en: "Distribution boards and MCBs sized for load & safety.", icon: "CircuitBoard" },
  { slug: "earthing", title_en: "Earthing Solutions", desc_en: "Compliant earthing to protect people and equipment.", icon: "Cable" },
  { slug: "maintenance", title_en: "Electrical Maintenance", desc_en: "Scheduled AMC visits and preventive maintenance.", icon: "Wrench" },
  { slug: "fault-finding", title_en: "Fault Finding", desc_en: "Rapid diagnostics for shorts, trips, and outages.", icon: "Zap" },
  { slug: "led-lighting", title_en: "LED Lighting", desc_en: "Architectural, ambient and outdoor LED design.", icon: "Lightbulb" },
  { slug: "fan-ac", title_en: "Fan & AC Wiring", desc_en: "Ceiling fans, AC circuits, and dedicated power lines.", icon: "Fan" },
].map((s, i) => ({
  id: `seed-service-${i}`,
  slug: s.slug,
  title_en: s.title_en,
  title_bn: null,
  desc_en: s.desc_en,
  desc_bn: null,
  icon: s.icon,
  image_path: null,
  sort_order: i,
  published: true,
}));

export const defaultProjects: Project[] = [
  { slug: "luxury-villa-rewire", title: "Luxury villa rewire", location: "Riverside Estate", category: "residential", image: "project-residential.jpg" },
  { slug: "corporate-hq-fit-out", title: "Corporate HQ fit-out", location: "Central Business Park", category: "commercial", image: "project-commercial.jpg" },
  { slug: "factory-power-upgrade", title: "Factory power upgrade", location: "Industrial Zone", category: "industrial", image: "project-industrial.jpg" },
  { slug: "ambient-lighting-design", title: "Ambient lighting design", location: "Boutique Hotel", category: "commercial", image: "service-lighting.jpg" },
  { slug: "db-panel-modernization", title: "DB panel modernization", location: "Apartment Complex", category: "residential", image: "service-db.jpg" },
  { slug: "wiring-overhaul", title: "Wiring overhaul", location: "Coworking Space", category: "commercial", image: "service-wiring.jpg" },
  { slug: "preventive-maintenance-amc", title: "Preventive maintenance AMC", location: "Retail Chain", category: "commercial", image: "service-maintenance.jpg" },
  { slug: "warehouse-led-retrofit", title: "Warehouse LED retrofit", location: "Logistics Hub", category: "industrial", image: "service-lighting.jpg" },
].map((p, i) => ({
  id: `seed-project-${i}`,
  slug: p.slug,
  title: p.title,
  location: p.location,
  category: p.category as Project["category"],
  summary: null,
  description: null,
  cover_image_path: p.image,
  year: null,
  featured: i < 6,
  sort_order: i,
  published: true,
}));

export const defaultGallery: GalleryImage[] = [
  { path: "project-residential.jpg", tall: true },
  { path: "project-commercial.jpg", tall: false },
  { path: "project-industrial.jpg", tall: false },
  { path: "service-lighting.jpg", tall: true },
  { path: "service-db.jpg", tall: false },
  { path: "service-wiring.jpg", tall: false },
  { path: "service-maintenance.jpg", tall: false },
  { path: "hero.jpg", tall: true },
  { path: "why-choose.jpg", tall: false },
].map((g, i) => ({
  id: `seed-gallery-${i}`,
  path: g.path,
  alt: "",
  caption: null,
  tall: g.tall,
  sort_order: i,
  published: true,
}));

export const defaultPosts: Post[] = [
  { slug: "electrical-safety-home", category: "Electrical Safety", title: "10 electrical safety checks every homeowner should do this year", date: "2026-06-12", img: "project-residential.jpg", excerpt: "A field-tested checklist you can run through in an afternoon — from outlets and DB panels to smoke alarms." },
  { slug: "led-savings", category: "Energy Saving", title: "How switching to LED cut a client's bill by 42%", date: "2026-05-30", img: "service-lighting.jpg", excerpt: "The numbers, the fixtures used, and how to plan a retrofit that pays back in under 18 months." },
  { slug: "wiring-guide", category: "Wiring Guide", title: "Copper vs aluminium wiring — a practical field guide", date: "2026-05-08", img: "service-wiring.jpg", excerpt: "When to use each, common failure modes we see on-site, and current code requirements." },
  { slug: "db-modernization", category: "Wiring Guide", title: "Signs your distribution board needs modernizing", date: "2026-04-22", img: "service-db.jpg", excerpt: "Warm covers, nuisance trips, missing RCDs — the tell-tale symptoms and what to do about them." },
  { slug: "amc-value", category: "Maintenance Tips", title: "What actually happens on a quarterly maintenance visit", date: "2026-04-04", img: "service-maintenance.jpg", excerpt: "A behind-the-scenes look at our AMC service — the exact checks, tests and reporting you get." },
  { slug: "industrial-planning", category: "Wiring Guide", title: "Planning an industrial power upgrade without downtime", date: "2026-03-18", img: "project-industrial.jpg", excerpt: "Sequencing, temporary supplies, and coordination — what separates a good contractor from a great one." },
].map((p, i) => ({
  id: `seed-post-${i}`,
  slug: p.slug,
  title: p.title,
  category: p.category,
  excerpt: p.excerpt,
  body: null,
  cover_image_path: p.img,
  reading_minutes: 4,
  status: "published" as const,
  published_at: p.date,
  sort_order: i,
}));

export const defaultTestimonials: Testimonial[] = [
  { name: "Priya Sharma", role: "Homeowner · Riverside", quote: "SN Electrical rewired our entire villa in under a week. Immaculate work, transparent pricing, and a genuinely friendly team." },
  { name: "Arjun Mehta", role: "Ops Manager · TechPark", quote: "Zero downtime, weekend install, perfect documentation. They understand commercial constraints." },
  { name: "Nadia Rahman", role: "Café Owner", quote: "Beautiful ambient lighting design and the DB panel is a work of art." },
  { name: "Kamal Iqbal", role: "Facility Head · Textile Mill", quote: "Complex industrial upgrade delivered on time and on budget." },
  { name: "Sana Ahmed", role: "Homeowner", quote: "Emergency call at 11 pm, technician onsite by midnight, problem solved." },
  { name: "Rohan Das", role: "Property Manager", quote: "Consistent quality across three buildings — the go-to team for our portfolio." },
].map((t, i) => ({
  id: `seed-testimonial-${i}`,
  name: t.name,
  role: t.role,
  rating: 5,
  quote: t.quote,
  avatar_path: null,
  published: true,
  sort_order: i,
}));

export const defaultFaqs: Faq[] = [
  { question: "How quickly can you respond to an emergency?", answer: "Our on-call team dispatches within 60 minutes for emergencies in serviced areas, 24/7.", category: "General" },
  { question: "Are your electricians licensed and insured?", answer: "Yes — every technician is fully licensed, certified, and covered by comprehensive liability insurance.", category: "General" },
  { question: "Do you provide free quotes?", answer: "Absolutely. Site visits for quotes are free within our service area and include a written estimate.", category: "Pricing" },
  { question: "How do you charge — hourly or fixed?", answer: "Most jobs are fixed-price after the site assessment; small maintenance jobs use an hourly rate.", category: "Pricing" },
  { question: "What warranty do you offer?", answer: "All installation work is covered by a workmanship warranty ranging from 12 to 24 months, depending on service.", category: "Warranty" },
  { question: "What if something fails after installation?", answer: "We return at no cost during the warranty period to diagnose and repair covered issues.", category: "Warranty" },
  { question: "Can you handle commercial and industrial projects?", answer: "Yes, we deliver end-to-end electrical fit-outs for offices, factories, retail chains and industrial units.", category: "Commercial" },
  { question: "Do you offer AMC?", answer: "We run monthly, quarterly, and annual maintenance contracts tailored to your site.", category: "Commercial" },
].map((f, i) => ({ id: `seed-faq-${i}`, ...f, published: true, sort_order: i }));

export const defaultJobPerks: JobPerk[] = [
  { title: "Competitive pay", description: "Above-market base plus performance bonuses." },
  { title: "Training & certifications", description: "Sponsored courses and paid certifications." },
  { title: "Modern tools", description: "Best-in-class equipment, no cutting corners." },
  { title: "Safety-first culture", description: "Zero tolerance for shortcuts on protective work." },
].map((p, i) => ({ id: `seed-perk-${i}`, ...p, sort_order: i }));

export const defaultJobOpenings: JobOpening[] = [
  { title: "Senior Electrician", location: "On-site", employment_type: "Full-time" },
  { title: "Commercial Project Lead", location: "On-site", employment_type: "Full-time" },
  { title: "Apprentice Electrician", location: "On-site", employment_type: "Apprenticeship" },
  { title: "Estimator / Quantity Surveyor", location: "Hybrid", employment_type: "Full-time" },
].map((j, i) => ({
  id: `seed-role-${i}`,
  ...j,
  description:
    "Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience for senior roles.",
  is_open: true,
  sort_order: i,
}));

export const defaultAboutValues: AboutValue[] = [
  { title: "Safety first", description: "Every job starts with a risk assessment. Full stop.", icon: "Shield" },
  { title: "Craftsmanship", description: "We take pride in the work behind the wall, not just the finish.", icon: "Award" },
  { title: "Honest pricing", description: "Written quotes. No surprise line items. Ever.", icon: "HeartHandshake" },
  { title: "Modern tools", description: "Thermal imaging, insulation testers, calibrated meters.", icon: "Sparkles" },
].map((v, i) => ({ id: `seed-value-${i}`, ...v, sort_order: i }));

export const defaultAboutTimeline: AboutTimelineEntry[] = [
  { year: "2014", title: "Founded", description: "SN Electrical begins with a two-person crew and a promise: no shortcut wiring." },
  { year: "2017", title: "Commercial launch", description: "First 10,000 sq ft office fit-out delivered on schedule." },
  { year: "2020", title: "24/7 emergency", description: "Round-the-clock dispatch launches across the region." },
  { year: "2023", title: "500th project", description: "Team crosses 500 completed installations with 5-star average." },
  { year: "2026", title: "New workshop", description: "Modern workshop and training facility opens for apprentices." },
].map((t, i) => ({ id: `seed-timeline-${i}`, ...t, sort_order: i }));
