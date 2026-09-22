import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import { useT } from "@/components/providers/language-provider";

const faqs = [
  { q: "How quickly can you respond to an emergency?", a: "Our on-call team dispatches within 60 minutes for emergencies in serviced areas, 24/7." },
  { q: "Are your electricians licensed and insured?", a: "Yes — every technician is fully licensed, certified, and covered by comprehensive liability insurance." },
  { q: "Do you provide free quotes?", a: "Absolutely. Site visits for quotes are free within our service area and include a written estimate." },
  { q: "What warranty do you offer?", a: "All installation work is covered by a workmanship warranty ranging from 12 to 24 months, depending on service." },
  { q: "Can you handle commercial and industrial projects?", a: "Yes, we deliver end-to-end electrical fit-outs for offices, factories, retail chains and industrial units." },
  { q: "Do you offer maintenance contracts (AMC)?", a: "We run monthly, quarterly, and annual maintenance contracts tailored to residential and commercial clients." },
];

export function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");
  const filtered = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title={t.sections.faqTitle} align="center" />

        <div className="relative mx-auto mt-10 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions…"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-[color:var(--brand)]"
          />
        </div>

        <div className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {filtered.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
