import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { useT } from "@/components/providers/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export function AboutPreview() {
  const { t } = useT();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-border">
            <img src={aboutImg} alt="SN Electrical team" width={1600} height={1200} className="h-[440px] w-full object-cover sm:h-[520px]" loading="lazy" />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="About us" title={t.sections.aboutTitle} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-widest text-[color:var(--brand)]">Mission</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Deliver electrical work that's safer, cleaner and longer-lasting than the industry norm — for every home and business we touch.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-widest text-[color:var(--accent-yellow)]">Vision</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To be the most trusted name in electrical services — known for craftsmanship, honesty, and modern engineering.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand)] hover:gap-3 transition-all"
          >
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
