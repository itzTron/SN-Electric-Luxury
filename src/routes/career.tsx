import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: `Careers — ${site.name}` },
      { name: "description", content: "Join a growing team of certified electricians. Open positions and how to apply." },
      { property: "og:title", content: `Careers — ${site.name}` },
      { property: "og:description", content: "Open positions and how to apply." },
    ],
  }),
  component: CareerPage,
});

const perks = [
  { t: "Competitive pay", d: "Above-market base plus performance bonuses." },
  { t: "Training & certifications", d: "Sponsored courses and paid certifications." },
  { t: "Modern tools", d: "Best-in-class equipment, no cutting corners." },
  { t: "Safety-first culture", d: "Zero tolerance for shortcuts on protective work." },
];

const roles = [
  { t: "Senior Electrician", loc: "On-site", type: "Full-time" },
  { t: "Commercial Project Lead", loc: "On-site", type: "Full-time" },
  { t: "Apprentice Electrician", loc: "On-site", type: "Apprenticeship" },
  { t: "Estimator / Quantity Surveyor", loc: "Hybrid", type: "Full-time" },
];

function CareerPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <PageHero eyebrow="Careers" title="Build a career where craft still matters." sub="We're growing our licensed team — apprentices to project leads. If you take pride in the work behind the wall, come talk to us." />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="rounded-3xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-widest text-[color:var(--brand)]">Perk</div>
              <div className="mt-2 font-display text-lg font-semibold">{p.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Open positions</h2>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {roles.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={r.t}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <div>
                    <div className="font-semibold">{r.t}</div>
                    <div className="text-xs text-muted-foreground">{r.loc} · {r.type}</div>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid h-8 w-8 place-items-center rounded-full border border-border"><Plus className="h-4 w-4" /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 text-sm text-muted-foreground">
                        Responsibilities include on-site delivery, client communication, and adherence to our safety protocols. Requires relevant licensing and 3+ years of experience for senior roles.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-32 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-8">
          <h3 className="font-display text-2xl font-bold">Apply now</h3>
          <p className="mt-1 text-sm text-muted-foreground">Send us your details and a CV — we'll be in touch within a week.</p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); alert("Application received."); }}>
            <input required maxLength={80} placeholder="Full name" className="h-11 rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            <input required type="email" maxLength={200} placeholder="Email" className="h-11 rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            <input required maxLength={30} placeholder="Phone" className="h-11 rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            <select className="h-11 rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]">
              {roles.map((r) => <option key={r.t}>{r.t}</option>)}
            </select>
            <textarea maxLength={1000} rows={4} placeholder="Tell us a bit about your experience" className="rounded-2xl border border-border bg-secondary/30 p-4 text-sm outline-none focus:border-[color:var(--brand)] sm:col-span-2" />
            <label className="flex items-center gap-3 rounded-full border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm sm:col-span-2">
              <Upload className="h-4 w-4 text-[color:var(--brand)]" /> Upload CV (PDF)
              <input type="file" accept=".pdf" className="hidden" />
            </label>
            <button className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] sm:col-span-2">Send application</button>
          </form>
        </div>
      </section>
    </>
  );
}
