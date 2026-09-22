import { Award, Clock, HardHat, Star, Users, Zap } from "lucide-react";
import { Counter } from "@/components/site/counter";
import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/providers/language-provider";

export function TrustBar() {
  const { t } = useT();
  const items = [
    { icon: Users, to: 1000, suffix: "+", label: t.trust.projects },
    { icon: Award, to: 10, suffix: "+", label: t.trust.years },
    { icon: Clock, to: 24, suffix: "/7", label: t.trust.emergency },
    { icon: HardHat, to: 25, suffix: "+", label: t.trust.certified },
    { icon: Star, to: 5, suffix: "★", label: t.trust.rating },
    { icon: Zap, to: 60, suffix: "min", label: t.trust.response },
  ];
  return (
    <section className="relative border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.05} className="bg-background px-5 py-8 text-center transition hover:bg-secondary/50">
            <item.icon className="mx-auto h-5 w-5 text-[color:var(--brand)]" />
            <div className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              <Counter to={item.to} suffix={item.suffix} />
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
