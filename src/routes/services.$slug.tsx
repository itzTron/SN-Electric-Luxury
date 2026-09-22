import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { services, site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import serviceImg from "@/assets/service-db.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const svc = services.find((s) => s.slug === params.slug);
    if (!svc) throw notFound();
    return svc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Service"} — ${site.name}` },
      { name: "description", content: loaderData?.desc },
      { property: "og:title", content: `${loaderData?.title} — ${site.name}` },
      { property: "og:description", content: loaderData?.desc },
    ],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const svc = Route.useLoaderData();

  const benefits = [
    "Licensed & warrantied workmanship",
    "Free on-site assessment & quotation",
    "Compliant with the latest safety codes",
    "Clean-up included, no mess left behind",
    "Same-day availability in most areas",
    "Financing options for larger projects",
  ];
  const process = [
    { n: "01", t: "Consult", d: "Free assessment and transparent quote within 24 hours." },
    { n: "02", t: "Plan", d: "Detailed scope, timeline, materials list — no surprises." },
    { n: "03", t: "Install", d: "Certified electricians deliver the work to spec." },
    { n: "04", t: "Handover", d: "Testing, documentation, warranty and after-care." },
  ];

  return (
    <>
      <PageHero eyebrow="Service" title={svc.title} sub={svc.desc}>
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border">
          <img src={serviceImg} alt={svc.title} className="h-[360px] w-full object-cover sm:h-[480px]" loading="lazy" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="What's included" title="Comprehensive service, delivered end-to-end." />
          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading eyebrow="Our process" title="A clean, four-step delivery." />
          <div className="mt-8 space-y-4">
            {process.map((p) => (
              <Reveal key={p.n}>
                <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-5">
                  <div className="font-display text-3xl font-bold text-[color:var(--brand)]">{p.n}</div>
                  <div>
                    <div className="font-semibold">{p.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="glass overflow-hidden rounded-[2rem] p-8 text-center sm:p-14">
          <h3 className="font-display text-3xl font-bold sm:text-4xl">Ready to get started?</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Book a free on-site assessment and receive a transparent quote within 24 hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/quote" className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)]">Request a quote</Link>
            <a href={`tel:${site.phone}`} className="rounded-full border border-border px-6 py-3 text-sm font-semibold">{site.phoneDisplay}</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Related" title="Other services you may need" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter((s) => s.slug !== svc.slug).slice(0, 3).map((s) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-[color:var(--brand)]">
              <h4 className="font-display text-lg font-semibold">{s.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
