import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar } from "lucide-react";
import residential from "@/assets/project-residential.jpg";
import wiring from "@/assets/service-wiring.jpg";
import lighting from "@/assets/service-lighting.jpg";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/providers/language-provider";

const posts = [
  { slug: "electrical-safety-home", cat: "Electrical Safety", title: "10 electrical safety checks every homeowner should do this year", date: "Jun 12, 2026", img: residential },
  { slug: "led-savings", cat: "Energy Saving", title: "How switching to LED cut a client's bill by 42%", date: "May 30, 2026", img: lighting },
  { slug: "wiring-guide", cat: "Wiring Guide", title: "Copper vs aluminium wiring — a practical field guide", date: "May 08, 2026", img: wiring },
];

export function BlogPreview() {
  const { t } = useT();
  return (
    <section className="relative border-y border-border bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow="Journal" title={t.sections.blogTitle} />
          <Link to="/blog" className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--brand)] hover:gap-3 transition-all sm:inline-flex">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link to="/blog" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                    {p.cat}
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {p.date}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-[color:var(--brand)]">
                  {p.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
