import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { Counter } from "@/components/site/counter";
import { defaultTestimonials } from "@/lib/content/defaults";
import { testimonialsQuery } from "@/lib/content/query-options";

export const Route = createFileRoute("/testimonials")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(testimonialsQuery());
  },
  head: () => ({
    meta: [
      { title: `Testimonials — ${site.name}` },
      { name: "description", content: "What homeowners, businesses and industrial clients say about SN Electrical." },
      { property: "og:title", content: `Testimonials — ${site.name}` },
      { property: "og:description", content: "Reviews from real clients." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { data } = useQuery(testimonialsQuery());
  const reviews = (data ?? defaultTestimonials).map((row) => ({
    id: row.id || row.name,
    name: row.name,
    role: row.role ?? "",
    rating: row.rating,
    text: row.quote,
  }));

  return (
    <>
      <PageHero eyebrow="Reviews" title="Loved by homeowners, operators, and industrial clients." sub="Every review below comes from a real, completed project. We're proud of every one of them." />
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <div className="glass mx-auto flex max-w-md items-center justify-between rounded-full px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Average rating</div>
            <div className="font-display text-3xl font-bold"><Counter to={5} suffix=".0" /> / 5</div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[color:var(--accent-yellow)] text-[color:var(--accent-yellow)]" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-3xl border border-border bg-card p-7">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[color:var(--accent-yellow)] text-[color:var(--accent-yellow)]" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">“{r.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--brand)] font-semibold text-white">{r.name[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
