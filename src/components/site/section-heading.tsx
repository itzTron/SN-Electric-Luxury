import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <div className={cn("mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground")}>
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-balance text-3xl font-bold leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {sub ? (
        <p className={cn("mt-5 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg", align === "center" && "mx-auto")}>
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
