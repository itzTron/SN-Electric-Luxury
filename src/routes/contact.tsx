import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${site.name}` },
      { name: "description", content: "Get in touch with SN Electrical — phone, email, WhatsApp and 24/7 emergency line." },
      { property: "og:title", content: `Contact — ${site.name}` },
      { property: "og:description", content: "Reach us by phone, email or WhatsApp." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk." sub="Call us, message us on WhatsApp, or book a site visit. Emergencies answered 24/7." />

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card icon={Phone} label="Call" value={site.phoneDisplay} href={`tel:${site.phone}`} accent />
          <Card icon={MessageCircle} label="WhatsApp" value={site.phoneDisplay} href={`https://wa.me/${site.whatsapp}`} />
          <Card icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
          <Card icon={MapPin} label="Hours" value={site.hours} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-32 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col justify-center rounded-3xl border border-border bg-card p-8">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emergency line</div>
            <a
              href={`tel:${site.phone}`}
              className="mt-1 font-display text-2xl font-bold text-[color:var(--brand)]"
            >
              {site.phoneDisplay}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {site.address}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition hover:brightness-110"
              >
                <Phone className="h-4 w-4" /> Call now
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
            <Link to="/quote" className="mt-4 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Prefer a detailed quote? Request one here →
            </Link>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="h-full min-h-[420px] overflow-hidden rounded-3xl border border-border bg-secondary/40">
            <iframe title="Map" src="https://maps.google.com/maps?q=india&t=&z=5&ie=UTF8&iwloc=&output=embed" className="h-full w-full" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ icon: Icon, label, value, href, accent }: { icon: any; label: string; value: string; href?: string; accent?: boolean }) {
  const inner = (
    <div className={`h-full rounded-3xl border p-6 transition ${accent ? "border-transparent bg-[color:var(--brand)] text-white" : "border-border bg-card hover:border-[color:var(--brand)]"}`}>
      <Icon className="h-5 w-5" />
      <div className="mt-4 text-[10px] uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}
