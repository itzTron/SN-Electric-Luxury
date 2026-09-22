import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Award, HeartHandshake, Shield, Sparkles } from "lucide-react";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${site.name}` },
      { name: "description", content: "Our story, mission and the team behind a decade of trusted electrical work." },
      { property: "og:title", content: `About — ${site.name}` },
      { property: "og:description", content: "Our story, mission and the team behind a decade of trusted electrical work." },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { y: "2014", t: "Founded", d: "SN Electrical begins with a two-person crew and a promise: no shortcut wiring." },
  { y: "2017", t: "Commercial launch", d: "First 10,000 sq ft office fit-out delivered on schedule." },
  { y: "2020", t: "24/7 emergency", d: "Round-the-clock dispatch launches across the region." },
  { y: "2023", t: "500th project", d: "Team crosses 500 completed installations with 5-star average." },
  { y: "2026", t: "New workshop", d: "Modern workshop and training facility opens for apprentices." },
];

const values = [
  { icon: Shield, t: "Safety first", d: "Every job starts with a risk assessment. Full stop." },
  { icon: Award, t: "Craftsmanship", d: "We take pride in the work behind the wall, not just the finish." },
  { icon: HeartHandshake, t: "Honest pricing", d: "Written quotes. No surprise line items. Ever." },
  { icon: Sparkles, t: "Modern tools", d: "Thermal imaging, insulation testers, calibrated meters." },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="A decade of powering safer homes and smarter workplaces." sub="Founded on a single principle — do electrical work the way you'd want it done in your own home." />
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border">
          <img src={aboutImg} alt="Our team" className="h-[400px] w-full object-cover sm:h-[560px]" loading="lazy" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="text-xs uppercase tracking-widest text-[color:var(--brand)]">Mission</div>
            <p className="mt-4 text-lg leading-relaxed">To deliver electrical work that's safer, cleaner and longer-lasting than the industry norm — for every home and business we touch.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8">
            <div className="text-xs uppercase tracking-widest text-[color:var(--accent-yellow)]">Vision</div>
            <p className="mt-4 text-lg leading-relaxed">To be the most trusted name in electrical services — known for craftsmanship, honesty, and modern engineering.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Our journey" title="From two-person crew to region-wide team." align="center" />
        <div className="relative mt-14">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border sm:left-1/2" />
          <div className="space-y-10">
            {timeline.map((it, i) => (
              <Reveal key={it.y} delay={i * 0.05}>
                <div className={`relative flex flex-col gap-4 pl-12 sm:flex-row sm:pl-0 ${i % 2 === 0 ? "sm:pr-1/2 sm:text-right" : "sm:pl-1/2"}`}>
                  <div className="absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-xs font-bold sm:left-1/2 sm:-translate-x-1/2">
                    <span className="h-2 w-2 rounded-full bg-[color:var(--brand)]" />
                  </div>
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"}`}>
                    <div className="font-display text-2xl font-bold text-[color:var(--brand)]">{it.y}</div>
                    <div className="mt-1 text-lg font-semibold">{it.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{it.d}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-32 sm:px-6">
        <SectionHeading eyebrow="Values" title="What we hold ourselves to." align="center" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.t} className="rounded-3xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--brand)]/10 text-[color:var(--brand)]">
                <v.icon className="h-5 w-5" />
              </span>
              <div className="mt-5 font-display text-lg font-semibold">{v.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
