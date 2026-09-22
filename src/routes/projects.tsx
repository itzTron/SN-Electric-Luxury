import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import residential from "@/assets/project-residential.jpg";
import commercial from "@/assets/project-commercial.jpg";
import industrial from "@/assets/project-industrial.jpg";
import lighting from "@/assets/service-lighting.jpg";
import db from "@/assets/service-db.jpg";
import wiring from "@/assets/service-wiring.jpg";
import maintenance from "@/assets/service-maintenance.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `Projects — ${site.name}` },
      { name: "description", content: "Residential, commercial and industrial electrical projects delivered by our licensed team." },
      { property: "og:title", content: `Projects — ${site.name}` },
      { property: "og:description", content: "Selected residential, commercial and industrial projects." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  { title: "Luxury villa rewire", location: "Riverside Estate", tag: "residential", img: residential },
  { title: "Corporate HQ fit-out", location: "Central Business Park", tag: "commercial", img: commercial },
  { title: "Factory power upgrade", location: "Industrial Zone", tag: "industrial", img: industrial },
  { title: "Ambient lighting design", location: "Boutique Hotel", tag: "commercial", img: lighting },
  { title: "DB panel modernization", location: "Apartment Complex", tag: "residential", img: db },
  { title: "Wiring overhaul", location: "Coworking Space", tag: "commercial", img: wiring },
  { title: "Preventive maintenance AMC", location: "Retail Chain", tag: "commercial", img: maintenance },
  { title: "Warehouse LED retrofit", location: "Logistics Hub", tag: "industrial", img: lighting },
];

const filters = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "industrial", label: "Industrial" },
] as const;

function ProjectsPage() {
  const [f, setF] = useState<(typeof filters)[number]["id"]>("all");
  const visible = projects.filter((p) => f === "all" || p.tag === f);

  return (
    <>
      <PageHero eyebrow="Projects" title="A decade of installations, delivered on time." sub="Filter by category to see selected work from our residential, commercial and industrial clients." />

      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((x) => (
            <button
              key={x.id}
              onClick={() => setF(x.id)}
              className={cn("rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
                f === x.id ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {x.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.a
                layout
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                href="#"
                className="group overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.tag}</div>
                  <div className="mt-1 font-display text-lg font-semibold">{p.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{p.location}</div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}
