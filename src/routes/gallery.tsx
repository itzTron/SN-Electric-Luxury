import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import residential from "@/assets/project-residential.jpg";
import commercial from "@/assets/project-commercial.jpg";
import industrial from "@/assets/project-industrial.jpg";
import lighting from "@/assets/service-lighting.jpg";
import db from "@/assets/service-db.jpg";
import wiring from "@/assets/service-wiring.jpg";
import maintenance from "@/assets/service-maintenance.jpg";
import hero from "@/assets/hero.jpg";
import why from "@/assets/why-choose.jpg";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery — ${site.name}` },
      { name: "description", content: "Photo gallery of completed electrical projects and workshop moments." },
      { property: "og:title", content: `Gallery — ${site.name}` },
      { property: "og:description", content: "Photo gallery of completed electrical projects." },
    ],
  }),
  component: GalleryPage,
});

const images = [
  { src: residential, span: "row-span-2" },
  { src: commercial, span: "" },
  { src: industrial, span: "" },
  { src: lighting, span: "row-span-2" },
  { src: db, span: "" },
  { src: wiring, span: "" },
  { src: maintenance, span: "" },
  { src: hero, span: "row-span-2" },
  { src: why, span: "" },
];

function GalleryPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero eyebrow="Gallery" title="Looking behind the wall." sub="A close-up look at completed installations, workshop moments, and craft in progress." />
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setOpen(img.src)}
              className={`group relative overflow-hidden rounded-2xl border border-border ${img.span}`}
            >
              <img src={img.src} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={open}
              alt=""
              className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain"
            />
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur"><X className="h-5 w-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
