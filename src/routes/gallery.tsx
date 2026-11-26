import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { defaultGallery } from "@/lib/content/defaults";
import { mediaUrl } from "@/lib/content/media";
import { galleryQuery } from "@/lib/content/query-options";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(galleryQuery());
  },
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

function GalleryPage() {
  const { data } = useQuery(galleryQuery());
  const images = (data ?? defaultGallery).map((row) => ({
    id: row.id || row.path,
    src: mediaUrl(row.path) ?? "",
    alt: row.alt || "Project photo",
    span: row.tall ? "row-span-2" : "",
  }));
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageHero eyebrow="Gallery" title="Looking behind the wall." sub="A close-up look at completed installations, workshop moments, and craft in progress." />
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setOpen(img.src)}
              className={`group relative overflow-hidden rounded-2xl border border-border ${img.span}`}
            >
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
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
