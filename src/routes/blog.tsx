import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import residential from "@/assets/project-residential.jpg";
import wiring from "@/assets/service-wiring.jpg";
import lighting from "@/assets/service-lighting.jpg";
import db from "@/assets/service-db.jpg";
import maintenance from "@/assets/service-maintenance.jpg";
import industrial from "@/assets/project-industrial.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `Blog — ${site.name}` },
      { name: "description", content: "Electrical safety, energy saving and wiring guides written by working electricians." },
      { property: "og:title", content: `Blog — ${site.name}` },
      { property: "og:description", content: "Electrical safety, energy saving, and wiring guides." },
    ],
  }),
  component: BlogPage,
});

const posts = [
  { slug: "electrical-safety-home", cat: "Electrical Safety", title: "10 electrical safety checks every homeowner should do this year", date: "Jun 12, 2026", img: residential, excerpt: "A field-tested checklist you can run through in an afternoon — from outlets and DB panels to smoke alarms." },
  { slug: "led-savings", cat: "Energy Saving", title: "How switching to LED cut a client's bill by 42%", date: "May 30, 2026", img: lighting, excerpt: "The numbers, the fixtures used, and how to plan a retrofit that pays back in under 18 months." },
  { slug: "wiring-guide", cat: "Wiring Guide", title: "Copper vs aluminium wiring — a practical field guide", date: "May 08, 2026", img: wiring, excerpt: "When to use each, common failure modes we see on-site, and current code requirements." },
  { slug: "db-modernization", cat: "Wiring Guide", title: "Signs your distribution board needs modernizing", date: "Apr 22, 2026", img: db, excerpt: "Warm covers, nuisance trips, missing RCDs — the tell-tale symptoms and what to do about them." },
  { slug: "amc-value", cat: "Maintenance Tips", title: "What actually happens on a quarterly maintenance visit", date: "Apr 04, 2026", img: maintenance, excerpt: "A behind-the-scenes look at our AMC service — the exact checks, tests and reporting you get." },
  { slug: "industrial-planning", cat: "Wiring Guide", title: "Planning an industrial power upgrade without downtime", date: "Mar 18, 2026", img: industrial, excerpt: "Sequencing, temporary supplies, and coordination — what separates a good contractor from a great one." },
];

const cats = ["All", "Electrical Safety", "Energy Saving", "Wiring Guide", "Maintenance Tips"];

function BlogPage() {
  const [c, setC] = useState("All");
  const [q, setQ] = useState("");
  const list = posts.filter((p) => (c === "All" || p.cat === c) && p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHero eyebrow="Journal" title="Notes from the workbench." sub="Practical, field-tested writing on electrical safety, energy saving and modern wiring — for homeowners and facility managers." />
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setC(cat)}
                className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition",
                  c === cat ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-[color:var(--brand)]" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <a key={p.slug} href="#" className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-[color:var(--brand)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--brand)]">{p.cat}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-[color:var(--brand)]">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
