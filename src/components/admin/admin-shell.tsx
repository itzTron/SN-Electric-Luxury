import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  Gift,
  HelpCircle,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Milestone,
  Newspaper,
  Settings,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { signOutAdmin } from "@/lib/content/mutations";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: LucideIcon; exact?: boolean };

const primary: Item[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/gallery_images", label: "Gallery", icon: Images },
  { to: "/admin/posts", label: "Journal", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/job_openings", label: "Open roles", icon: Briefcase },
  { to: "/admin/job_perks", label: "Perks", icon: Gift },
  { to: "/admin/about_values", label: "About values", icon: Sparkles },
  { to: "/admin/about_timeline", label: "Timeline", icon: Milestone },
];

const secondary: Item[] = [
  { to: "/admin/media", label: "Media library", icon: Images },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (item: Item) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);

  const link = (item: Item) => (
    <Link
      key={item.to}
      to={item.to}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive(item)
          ? "bg-[color:var(--brand)]/10 font-semibold text-[color:var(--brand)]"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutAdmin();
      await navigate({ to: "/admin/login" });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-6 md:flex">
        <Link to="/admin" className="mb-6 px-3">
          <div className="font-display text-lg font-bold">SN Admin</div>
          <div className="truncate text-xs text-muted-foreground">{email}</div>
        </Link>

        <div className="space-y-1">{primary.map(link)}</div>

        <div className="my-5 border-t border-border" />
        <div className="space-y-1">{secondary.map(link)}</div>

        <div className="mt-auto space-y-1 pt-6">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </a>
          <button
            onClick={onSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" /> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 overflow-x-auto border-b border-border bg-background px-4 py-3 md:hidden">
          {[...primary.slice(0, 6), secondary[0]].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold",
                isActive(item) ? "bg-foreground text-background" : "border border-border text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={onSignOut} className="whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            Sign out
          </button>
        </div>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
