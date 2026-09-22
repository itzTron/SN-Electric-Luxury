import { Check, Award, Clock, Sparkles, ShieldCheck } from "lucide-react";
import { useT } from "@/components/providers/language-provider";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import whyImg from "@/assets/why-choose.jpg";

const features = [
  "Licensed & certified electricians",
  "Transparent, upfront pricing",
  "Same-day response, 24/7 emergency",
  "Latest testing & diagnostic equipment",
  "Workmanship warranty on every job",
  "Insured for residential & commercial",
];

export function WhyChoose() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <SectionHeading eyebrow="Why choose us" title={t.sections.whyTitle} sub={t.sections.whySub} />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f} delay={i * 0.05}>
                <li className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[color:var(--brand)] text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium">{f}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal direction="left" className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-border">
            <img src={whyImg} alt="Electrician installing distribution board" width={1400} height={1600} className="h-[540px] w-full object-cover sm:h-[620px]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          {/* Floating stat card */}
          <div className="absolute -bottom-6 left-6 right-6 sm:-left-8 sm:right-auto sm:w-72">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--accent-yellow)]">
                  <ShieldCheck className="h-5 w-5 text-[#111]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Certified</div>
                  <div className="text-sm font-semibold">Fully licensed team</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat icon={Award} label="Certs" value="12+" />
                <Stat icon={Clock} label="Uptime" value="99.9%" />
                <Stat icon={Sparkles} label="NPS" value="92" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <Icon className="mx-auto h-4 w-4 text-[color:var(--brand)]" />
      <div className="mt-1 text-base font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
