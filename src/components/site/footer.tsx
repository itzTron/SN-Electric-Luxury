import { Link } from "@tanstack/react-router";
import { Zap, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { site, services } from "@/lib/site-config";
import { useT } from "@/components/providers/language-provider";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-[color:var(--brand)] to-transparent" />
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--brand)] text-white">
                <Zap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { href: site.socials.facebook, Icon: Facebook, label: "Facebook" },
                { href: site.socials.instagram, Icon: Instagram, label: "Instagram" },
                { href: site.socials.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: site.socials.youtube, Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">{t.nav.about}</Link></li>
              <li><Link to="/projects" className="hover:text-foreground">{t.nav.projects}</Link></li>
              <li><Link to="/testimonials" className="hover:text-foreground">{t.nav.testimonials}</Link></li>
              <li><Link to="/career" className="hover:text-foreground">{t.nav.career}</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">{t.nav.blog}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-4 text-sm font-semibold">Services</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-foreground">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="mb-4 text-sm font-semibold">Get in touch</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <a href={`tel:${site.phone}`} className="hover:text-foreground">{site.phoneDisplay}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">{site.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <span>{site.hours}</span>
              </li>
            </ul>
            <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-full border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[color:var(--brand)]"
              />
              <button className="rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
