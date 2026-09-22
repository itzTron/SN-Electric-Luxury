import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { site, services } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: `Get a free quote — ${site.name}` },
      { name: "description", content: "Request a free, no-obligation electrical quote. We reply within one business hour." },
      { property: "og:title", content: `Get a free quote — ${site.name}` },
      { property: "og:description", content: "Request a free, no-obligation electrical quote." },
    ],
  }),
  component: QuotePage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(30),
  address: z.string().trim().min(4).max(300),
  service: z.string(),
  budget: z.string(),
  date: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function QuotePage() {
  const [ok, setOk] = useState(false);
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
    setOk(true);
  };

  if (ok) {
    return (
      <>
        <PageHero eyebrow="Received" title="Thanks — your request is in." sub="A licensed electrician will contact you within one business hour. For urgent matters, please call our emergency line." />
        <section className="mx-auto max-w-md px-4 pb-32">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 12 }} className="glass mx-auto grid place-items-center rounded-3xl p-10 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--brand)] text-white"><CheckCircle2 className="h-8 w-8" /></div>
            <p className="mt-6 font-display text-2xl font-bold">Quote request sent</p>
            <p className="mt-2 text-sm text-muted-foreground">Reference #{Math.floor(100000 + Math.random() * 900000)}</p>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Free Quote" title="Tell us about your project." sub="A licensed electrician will reply within one business hour. All quotes are free and no-obligation." />
      <section className="mx-auto max-w-3xl px-4 pb-32 sm:px-6">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" error={errors.name} />
            <Field name="phone" label="Phone" error={errors.phone} />
            <Field name="email" label="Email" type="email" error={errors.email} />
            <Field name="address" label="Site address" error={errors.address} />
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Service</label>
              <select name="service" className="h-11 w-full rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]">
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estimated budget</label>
              <select name="budget" className="h-11 w-full rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]">
                <option>Under ₹10,000</option>
                <option>₹10,000 – ₹50,000</option>
                <option>₹50,000 – ₹2,00,000</option>
                <option>₹2,00,000+</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Preferred date</label>
              <input name="date" type="date" className="h-11 w-full rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea name="message" rows={4} maxLength={1000} className="w-full resize-none rounded-2xl border border-border bg-secondary/30 p-4 text-sm outline-none focus:border-[color:var(--brand)]" />
            </div>
            <label className="flex items-center gap-3 rounded-full border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm sm:col-span-2">
              <Paperclip className="h-4 w-4 text-[color:var(--brand)]" /> Attach a photo or plan (optional)
              <input type="file" className="hidden" />
            </label>
          </div>
          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)]">
            <Send className="h-4 w-4" /> Request my quote
          </button>
        </form>
      </section>
    </>
  );
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
