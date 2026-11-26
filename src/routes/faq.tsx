import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { defaultFaqs } from "@/lib/content/defaults";
import { faqsQuery } from "@/lib/content/query-options";

export const Route = createFileRoute("/faq")({
  loader: async ({ context }) => ({
    faqs: await context.queryClient.ensureQueryData(faqsQuery()),
  }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `FAQ — ${site.name}` },
      { name: "description", content: "Answers to the most common questions about our electrical services, pricing and warranties." },
      { property: "og:title", content: `FAQ — ${site.name}` },
      { property: "og:description", content: "Common questions about our electrical services." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faqs ?? defaultFaqs).map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const { data } = useQuery(faqsQuery());
  const faqs = (data ?? defaultFaqs).map((row) => ({
    id: row.id || row.question,
    cat: row.category ?? "General",
    q: row.question,
    a: row.answer,
  }));
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()));
  const grouped = filtered.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.cat] ||= []).push(f);
    return acc;
  }, {});

  return (
    <>
      <PageHero eyebrow="FAQ" title="Everything you might want to ask." sub="Can't find an answer? Send us a note — we usually reply within one business hour." />
      <section className="mx-auto max-w-3xl px-4 pb-32 sm:px-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-[color:var(--brand)]"
          />
        </div>

        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat} className="mt-10">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{cat}</div>
            <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {list.map((f) => {
                const idx = faqs.indexOf(f);
                const isOpen = open === idx;
                return (
                  <div key={f.q}>
                    <button onClick={() => setOpen(isOpen ? null : idx)} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
                      <span className="font-medium">{f.q}</span>
                      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border">
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
