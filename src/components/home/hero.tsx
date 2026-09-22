import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Phone, MessageCircle, ArrowRight, ChevronDown, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import heroImg from "@/assets/hero.jpg";
import { useT } from "@/components/providers/language-provider";
import { MagneticButton } from "@/components/site/magnetic-button";
import { site } from "@/lib/site-config";

export function Hero() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 sm:pt-32">
      {/* Background image */}
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-40 dark:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </motion.div>

      {/* Floating orbs */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-[8%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, #0066FF 0%, transparent 70%)" }}
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-[5%] h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FFD400 0%, transparent 70%)" }}
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* SVG circuit lines */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="l1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[120, 260, 400, 560, 700].map((y, i) => (
          <motion.path
            key={i}
            d={`M0 ${y} L400 ${y} L440 ${y - 40} L800 ${y - 40} L840 ${y} L1200 ${y}`}
            stroke="url(#l1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: i * 0.3, ease: "easeOut" }}
          />
        ))}
      </svg>

      <motion.div style={reduce ? undefined : { opacity }} className="relative mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pb-32 sm:pt-16 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          <span className="grid h-4 w-4 place-items-center rounded-full bg-[color:var(--brand)] text-white">
            <ShieldCheck className="h-2.5 w-2.5" />
          </span>
          {t.hero.eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-5xl text-balance text-center font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.98] tracking-tight"
        >
          {t.hero.title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {word === "Safety" || word === "নিরাপত্তা" ? (
                <span className="bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--accent-yellow)] bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
              {"\u00A0"}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link to="/quote">
            <MagneticButton>
              <Zap className="h-4 w-4" /> {t.common.getQuote}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </Link>
          <MagneticButton as="a" href={`tel:${site.phone}`} variant="outline">
            <Phone className="h-4 w-4" /> {t.common.callNow}
          </MagneticButton>
          <MagneticButton as="a" href={`https://wa.me/${site.whatsapp}`} variant="yellow">
            <MessageCircle className="h-4 w-4" /> {t.common.whatsapp}
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <span>Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
