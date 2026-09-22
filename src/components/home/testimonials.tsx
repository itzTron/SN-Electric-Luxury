import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { useT } from "@/components/providers/language-provider";

const testimonials = [
  { name: "Priya Sharma", role: "Homeowner · Riverside", rating: 5, text: "SN Electrical rewired our entire villa in under a week. Immaculate work, transparent pricing, and a genuinely friendly team. Best trade experience we've had." },
  { name: "Arjun Mehta", role: "Ops Manager · TechPark", rating: 5, text: "Zero downtime, weekend install, perfect documentation. They understand commercial constraints better than any electrical contractor we've worked with." },
  { name: "Nadia Rahman", role: "Café Owner", rating: 5, text: "Beautiful ambient lighting design and the DB panel is a work of art. Customers keep asking who did the wiring — that never happens." },
  { name: "Kamal Iqbal", role: "Facility Head · Textile Mill", rating: 5, text: "Complex industrial upgrade delivered on time and on budget. Their safety protocols are next-level." },
  { name: "Sana Ahmed", role: "Homeowner", rating: 5, text: "Emergency call at 11 pm, technician onsite by midnight, problem solved. Life-savers." },
];

export function Testimonials() {
  const { t } = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const item = testimonials[i];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--brand)]/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Testimonials" title={t.sections.testimonialsTitle} align="center" />

        <div className="relative mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass mx-auto max-w-3xl rounded-3xl p-8 sm:p-12"
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: item.rating }).map((_, k) => (
                  <motion.span
                    key={k}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 + k * 0.08 }}
                  >
                    <Star className="h-5 w-5 fill-[color:var(--accent-yellow)] text-[color:var(--accent-yellow)]" />
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 text-balance text-center font-display text-xl leading-relaxed sm:text-2xl">
                “{item.text}”
              </p>
              <div className="mt-8 text-center">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setI((v) => (v - 1 + testimonials.length) % testimonials.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-[color:var(--brand)]"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Go to testimonial ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === k ? "w-8 bg-[color:var(--brand)]" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((v) => (v + 1) % testimonials.length)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition hover:border-[color:var(--brand)]"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
