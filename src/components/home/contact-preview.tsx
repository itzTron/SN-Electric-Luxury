import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { z } from "zod";
import { site } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/providers/language-provider";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(1000),
});

export function ContactPreview() {
  const { t } = useT();
  const [status, setStatus] = useState<null | "ok" | "err">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      setStatus("err");
      return;
    }
    setErrors({});
    setStatus("ok");
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <section className="relative py-24 sm:py-32" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Contact" title={t.sections.contactTitle} align="center" />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="glass flex h-full flex-col justify-between rounded-3xl p-8">
              <div className="space-y-6">
                <Row icon={Phone} label={t.common.callNow} value={site.phoneDisplay} href={`tel:${site.phone}`} />
                <Row icon={MessageCircle} label="WhatsApp" value={site.phoneDisplay} href={`https://wa.me/${site.whatsapp}`} />
                <Row icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
                <Row icon={MapPin} label="Hours" value={site.hours} />
              </div>
              <div className="mt-8 rounded-2xl border border-border p-4 text-center">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emergency line</div>
                <div className="mt-1 font-display text-xl font-bold text-[color:var(--brand)]">{site.phoneDisplay}</div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1} className="lg:col-span-3">
            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label={t.common.name} error={errors.name} />
                <Field name="email" label={t.common.email} type="email" error={errors.email} />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.common.message}</label>
                <textarea
                  name="message"
                  rows={5}
                  maxLength={1000}
                  className="w-full resize-none rounded-2xl border border-border bg-secondary/30 p-4 text-sm outline-none focus:border-[color:var(--brand)]"
                />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <div className="mt-6 flex items-center justify-between">
                {status === "ok" ? (
                  <p className="text-sm font-medium text-[color:var(--brand)]">Message received — we'll be in touch shortly.</p>
                ) : (
                  <p className="text-xs text-muted-foreground">We reply within one business hour.</p>
                )}
                <button className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition hover:brightness-110">
                  <Send className="h-4 w-4" /> {t.common.submit}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
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

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        maxLength={200}
        className="h-11 w-full rounded-full border border-border bg-secondary/30 px-4 text-sm outline-none focus:border-[color:var(--brand)]"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
