import { createFileRoute, Link } from "@tanstack/react-router";
import { services, site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services — ${site.name}` },
      { name: "description", content: "Residential, commercial and industrial electrical services delivered by certified electricians." },
      { property: "og:title", content: `Services — ${site.name}` },
      { property: "og:description", content: "Residential, commercial and industrial electrical services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Ten specialist service lines, one licensed team." sub="From a single fan installation to full building fit-outs — engineered, warrantied, and cleanly delivered." />
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-glow)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.icon}</div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:rotate-45 group-hover:text-[color:var(--brand)]" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
