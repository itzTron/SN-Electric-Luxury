import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${site.name}` },
      { name: "description", content: "Get in touch with SN Electrical — phone, email, WhatsApp and 24/7 emergency line." },
      { property: "og:title", content: `Contact — ${site.name}` },
      { property: "og:description", content: "Reach us by phone, email, WhatsApp or in-form." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(200),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(1000),
});

function ContactPage() {
  const [status, setStatus] = useState<null | "ok">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as string] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("ok");
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk." sub="Send a message, book a site visit, or call us directly. Emergencies answered 24/7." />

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card icon={Phone} label="Call" value={site.phoneDisplay} href={`tel:${site.phone}`} accent />
          <Card icon={MessageCircle} label="WhatsApp" value={site.phoneDisplay} href={`https://wa.me/${site.whatsapp}`} />
          <Card icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
          <Card icon={MapPin} label="Hours" value={site.hours} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-32 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Name" error={errors.name} />
              <Field name="phone" label="Phone" error={errors.phone} />
              <Field name="email" label="Email" type="email" error={errors.email} />
              <Field name="address" label="Address" error={errors.address} />
            </div>
            <label className="mt-4 mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea name="message" rows={5} maxLength={1000} className="w-full resize-none rounded-2xl border border-border bg-secondary/30 p-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            <div className="mt-6 flex items-center justify-between">
              {status === "ok" ? <p className="text-sm font-medium text-[color:var(--brand)]">Thanks — we'll be in touch shortly.</p> : <p className="text-xs text-muted-foreground">We reply within one business hour.</p>}
              <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)]"><Send className="h-4 w-4" /> Send message</button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-2">
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

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input name={name} type={type} maxLength={300} className="h-11 w-full rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
