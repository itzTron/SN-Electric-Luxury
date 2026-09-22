import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Cable,
  CircuitBoard,
  Factory,
  Fan,
  Home,
  Lightbulb,
  Store,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/providers/language-provider";

const icons: Record<string, LucideIcon> = {
  Home, Building2, Store, Factory, CircuitBoard, Cable, Wrench, Zap, Lightbulb, Fan,
};

export function ServicesGrid() {
  const { t } = useT();
  return (
    <section className="relative py-24 sm:py-32" id="services">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Services"
          title={t.sections.servicesTitle}
          sub={t.sections.servicesSub}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon] ?? Zap;
            return (
              <Reveal key={s.slug} delay={i * 0.04}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-glow)]"
                >
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--brand)]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-secondary transition-colors group-hover:border-[color:var(--brand)] group-hover:bg-[color:var(--brand)] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-[color:var(--brand)] group-hover:text-[color:var(--brand)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-6 h-px w-full bg-border" />
                  <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                    Explore →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
