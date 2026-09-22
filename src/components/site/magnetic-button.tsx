import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { forwardRef, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "yellow" | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "a" | "button";
  href?: string;
  variant?: Variant;
  children: ReactNode;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-[color:var(--brand)] text-[color:var(--brand-foreground)] hover:shadow-[var(--shadow-glow)]",
  yellow:
    "bg-[color:var(--accent-yellow)] text-[#111] hover:brightness-105",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary",
};

export const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  { className, variant = "primary", children, as = "button", href, ...rest },
  _ref,
) {
  const local = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !local.current) return;
    const rect = local.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const base = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300",
    "min-h-11 will-change-transform",
    styles[variant],
    className,
  );

  if (as === "a") {
    return (
      <motion.a
        ref={(el) => { local.current = el; }}
        href={href}
        style={{ x: sx, y: sy }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={base}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={(el) => { local.current = el; }}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={base}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
});
