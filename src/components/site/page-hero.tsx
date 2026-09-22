import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, sub, children }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div aria-hidden className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[color:var(--brand)]/15 blur-3xl" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-full grid-bg opacity-60" />
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        {eyebrow ? (
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
            {eyebrow}
          </div>
        ) : null}
        <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {sub ? <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">{sub}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
