
# SN Electrical Services — v1 Plan

Premium marketing site inspired by Apple / Stripe / Linear. Full homepage build-out plus functional shells for every page in the spec. Frontend-only in v1 (no Cloud/backend); forms validate and show success states but don't submit anywhere yet.

> Reference image wasn't attached. I'll build to the written brief (glassmorphism, electric blue #0066FF + electric yellow #FFD400, luxury contrast). If you drop the image in the next message I'll re-tune hero composition and card treatment before we lock v1.

## Tech

- TanStack Start (existing stack) + Tailwind v4 + shadcn/ui
- Framer Motion for section reveals, hover lift, magnetic CTAs, counter animations
- next-themes-equivalent (class-based `.dark`) with system default + toggle
- Lightweight i18n via a React context + JSON dictionaries (`en`, `bn`) — no heavy lib needed for a marketing site
- Inter (via @fontsource) as body; SF-alt display font via @fontsource for headlines
- Generated hero + section imagery via imagegen

## Design tokens (added to `src/styles.css`)

```
--brand: #0066FF          (electric blue)
--brand-foreground: #fff
--accent: #FFD400         (electric yellow)
--surface-glass: rgba(255,255,255,0.6) / dark: rgba(20,24,33,0.5)
--border-glass: rgba(255,255,255,0.15)
--radius: 1.25rem  (rounded-2xl default on cards/buttons)
--shadow-glow: 0 20px 60px -20px rgba(0,102,255,.35)
```

Light background `#FFFFFF`, dark `#0D1117`, text `#111111` / `#F5F7FA`.

## Routes

```
/                 Home (full build)
/about
/services
/services/$slug   Detail template shared by all 10 services
/projects
/projects/$slug
/gallery
/testimonials
/faq
/blog
/blog/$slug
/career
/quote
/contact
```

Each route: own `head()` with unique title/description/og tags (leaf-only og:image), semantic H1, breadcrumbs where relevant. Sitemap route + robots.txt updated. LocalBusiness + Organization JSON-LD on root; Service schema on service pages; FAQPage schema on /faq; Article schema on blog posts.

## Homepage sections

1. **Hero** — full-viewport. Animated gradient orbs + subtle SVG circuit lines (parallax on mouse), noise texture, glass headline card. H1 "Powering Your Home with Safety & Trust". Three CTAs: Get Free Quote (primary), Call Now (tel:9876543210), WhatsApp (wa.me). Scroll indicator.
2. **Trust bar** — 6 animated counters (1000+ projects, 10+ yrs, 24/7, certified, 5★, emergency).
3. **Services preview** — 10 glass cards in a responsive grid (3 → 2 → 1 col). Each: icon, generated image, title, one-line, arrow hover.
4. **Why Choose Us** — 2-col: heading + checklist left, generated electrician-at-work image with floating glass stat card right.
5. **About preview** — image + mission/vision + "Learn More" → /about.
6. **Completed projects** — masonry with Residential/Commercial/Industrial filter chips (Framer Motion layout animation).
7. **Testimonials** — glass carousel, 5 sample reviews, star animation, Google badge.
8. **FAQ** — accordion, 6 top questions, search input.
9. **Blog preview** — 3 featured cards.
10. **Contact preview** — split: compact form + map placeholder + phone/WhatsApp/email/hours.
11. **Footer** — 4-col + newsletter + socials + legal.

## Other pages (shells with real layouts, lighter content)

- **About** — story, mission/vision, animated vertical timeline, values grid, certifications strip, team grid.
- **Services** — grid of 10 cards → detail template with banner, description, benefits, process steps, gallery, FAQ, related services, "Request quote" CTA.
- **Projects** — filterable grid → detail template (image gallery, before/after slider using a simple range input, meta, testimonial).
- **Gallery** — masonry with category filter + lightbox (shadcn Dialog) + lazy loading.
- **Testimonials** — full grid + overall rating hero.
- **FAQ** — searchable accordion grouped by category.
- **Blog** — index with search/category + post template.
- **Career** — culture, benefits, open positions accordion, application form with CV upload input (client-side only in v1).
- **Contact** — large map iframe placeholder, full form, contact rails.
- **Quote** — multi-field form with success animation.

## Global chrome

- Sticky glass nav: logo, links, language toggle (EN/বাংলা), dark-mode toggle, "Get Quote" CTA. Mobile drawer.
- Magnetic CTA buttons, page transitions, section reveal on scroll, cursor glow (desktop only).

## i18n

- `src/i18n/en.json`, `src/i18n/bn.json` with keyed strings for nav, hero, section titles, CTAs, footer, form labels, FAQ.
- `useT()` hook + `<LanguageProvider>` persisting choice in localStorage. Toggle re-renders instantly.
- Body class swaps font stack when `bn` is active (Noto Sans Bengali via @fontsource).

## Dark mode

- `.dark` class on `<html>`, toggle in nav, `prefers-color-scheme` default, pre-hydration `ScriptOnce` to avoid flash. All tokens defined for both.

## Assets

Generate ~10 images with imagegen (hero, why-choose, about, 4 service thumbs, 2 projects, blog cover). Others use tasteful gradients/SVG so v1 stays fast.

## Explicitly out of scope for v1 (say the word to add)

- Lovable Cloud (form submission, blog CMS, career applications, quote persistence, admin notifications)
- Real Google Maps (needs Google Maps connector — using an embed placeholder for now)
- WhatsApp API, reCAPTCHA, analytics, real Google Reviews feed
- Full translations of every blog/FAQ article (structure is bilingual; long-form copy is EN-only until you provide bn copy)
- Video reviews, real before/after imagery
- 90+ Lighthouse guarantee (we'll optimize, but I won't claim a number without measuring)

## Technical notes (for the engineer in you)

- All colors via semantic tokens in `src/styles.css` — no hardcoded hex in components.
- Framer Motion `useReducedMotion` respected everywhere.
- Images: `loading="lazy"`, explicit width/height, WebP via imagegen output.
- Each route file uses `createFileRoute` with proper `head()`; leaf-only `og:image` per rules.
- Shared components: `<GlassCard>`, `<SectionHeading>`, `<MagneticButton>`, `<Counter>`, `<Reveal>`, `<Nav>`, `<Footer>`, `<LanguageProvider>`, `<ThemeProvider>`.

Approve to start building, or drop the reference image first and I'll adjust hero + card composition before we begin.
