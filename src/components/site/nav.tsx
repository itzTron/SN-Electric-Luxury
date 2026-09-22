import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, Zap, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "home" as const },
  { to: "/about", key: "about" as const },
  { to: "/services", key: "services" as const },
  { to: "/projects", key: "projects" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/blog", key: "blog" as const },
  { to: "/contact", key: "contact" as const },
];

export function Nav() {
  const { t, lang, setLang } = useT();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass-strong" : "glass",
          )}
        >
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--brand)] text-white shadow-[var(--shadow-glow)]">
              <Zap className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="hidden text-sm font-bold tracking-tight sm:inline">{site.short}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-secondary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  ) : null}
                  {t.nav[l.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              aria-label="Toggle language"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-border/60 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === "en" ? "EN" : "বাং"}
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground transition hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/quote"
              className="hidden rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition hover:brightness-110 sm:inline-flex"
            >
              {t.nav.quote}
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/60 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col gap-2 bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold">{site.short}</span>
                <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-border">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="border-b border-border/60 py-4 text-lg font-medium"
                  >
                    {t.nav[l.key]}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className="flex-1 rounded-full border border-border py-3 text-sm font-semibold"
                >
                  {lang === "en" ? "বাংলা" : "English"}
                </button>
                <Link to="/quote" className="flex-1 rounded-full bg-[color:var(--brand)] py-3 text-center text-sm font-semibold text-white">
                  {t.nav.quote}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
