import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset =
    direction === "up" ? { y: 24, x: 0 } :
    direction === "left" ? { y: 0, x: 24 } :
    direction === "right" ? { y: 0, x: -24 } : { y: 0, x: 0 };

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
