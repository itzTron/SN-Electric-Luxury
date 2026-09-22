export const site = {
  name: "SN Electrical Services",
  short: "SN Electrical",
  tagline: "Powering Your Home with Safety & Trust",
  description:
    "Certified residential, commercial and industrial electrical solutions. Licensed electricians, 24/7 emergency response, and a decade of trusted craftsmanship.",
  phone: "9876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@snelectrical.com",
  address: "Service across the region — book on-site visits & emergency call-outs.",
  hours: "Mon–Sat · 8:00 – 20:00 · 24/7 Emergency",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
};

export const services = [
  { slug: "house-wiring", title: "House Wiring", icon: "Home", desc: "Safe, code-compliant wiring for new builds & renovations." },
  { slug: "building-wiring", title: "Building Wiring", icon: "Building2", desc: "Full-scale wiring for apartments and multi-story buildings." },
  { slug: "commercial", title: "Commercial Electrical", icon: "Store", desc: "Turnkey commercial installations engineered for uptime." },
  { slug: "industrial", title: "Industrial Electrical", icon: "Factory", desc: "Heavy-duty industrial systems and control panels." },
  { slug: "db-mcb", title: "DB & MCB Installation", icon: "CircuitBoard", desc: "Distribution boards and MCBs sized for load & safety." },
  { slug: "earthing", title: "Earthing Solutions", icon: "Cable", desc: "Compliant earthing to protect people and equipment." },
  { slug: "maintenance", title: "Electrical Maintenance", icon: "Wrench", desc: "Scheduled AMC visits and preventive maintenance." },
  { slug: "fault-finding", title: "Fault Finding", icon: "Zap", desc: "Rapid diagnostics for shorts, trips, and outages." },
  { slug: "led-lighting", title: "LED Lighting", icon: "Lightbulb", desc: "Architectural, ambient and outdoor LED design." },
  { slug: "fan-ac", title: "Fan & AC Wiring", icon: "Fan", desc: "Ceiling fans, AC circuits, and dedicated power lines." },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];
