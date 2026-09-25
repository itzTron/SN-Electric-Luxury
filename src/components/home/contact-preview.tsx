import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/providers/language-provider";

export function ContactPreview() {
  const { t } = useT();

  return (
    <section className="relative py-24 sm:py-32" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Contact" title={t.sections.contactTitle} align="center" />

        <Reveal className="mx-auto mt-14 max-w-4xl">
          <div className="glass rounded-3xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <Row icon={Phone} label={t.common.callNow} value={site.phoneDisplay} href={`tel:${site.phone}`} />
              <Row icon={MessageCircle} label={t.common.whatsapp} value={site.phoneDisplay} href={`https://wa.me/${site.whatsapp}`} />
              <Row icon={Mail} label={t.common.email} value={site.email} href={`mailto:${site.email}`} />
              <Row icon={MapPin} label="Hours" value={site.hours} />
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emergency line</div>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-1 block font-display text-xl font-bold text-[color:var(--brand)]"
                >
                  {site.phoneDisplay}
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition hover:brightness-110"
                >
                  <Phone className="h-4 w-4" /> {t.common.callNow}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                >
                  <MessageCircle className="h-4 w-4" /> {t.common.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--brand)]/10 text-[color:var(--brand)]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}
