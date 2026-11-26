import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { useT } from "@/components/providers/language-provider";
import { defaultProjects } from "@/lib/content/defaults";
import { mediaUrl } from "@/lib/content/media";
import { projectsQuery } from "@/lib/content/query-options";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "industrial", label: "Industrial" },
] as const;

export function ProjectsShowcase() {
  const { t } = useT();
  const { data } = useQuery(projectsQuery());
  const projects = (data ?? defaultProjects).slice(0, 6).map((project, index) => ({
    id: project.id || project.slug,
    title: project.title,
    location: project.location ?? "",
    tag: project.category,
    img: mediaUrl(project.cover_image_path),
    span: index === 0 || index === 5 ? "row-span-2" : "",
  }));
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = projects.filter((p) => filter === "all" || p.tag === filter);

  return (
    <section className="relative border-y border-border bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Selected work" title={t.sections.projectsTitle} sub={t.sections.projectsSub} />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
                  filter === f.id
                    ? "border-transparent bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-12 grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.a
                layout
                key={p.id}
                href="#"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-border",
                  p.span,
                )}
              >
                <img src={p.img} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{p.tag}</div>
                      <div className="mt-1 font-display text-lg font-semibold">{p.title}</div>
                      <div className="text-xs opacity-80">{p.location}</div>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
