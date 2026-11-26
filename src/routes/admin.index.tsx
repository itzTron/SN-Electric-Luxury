import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverview } from "@/lib/content/queries";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — SN Electrical" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: OverviewPage,
});

const links = [
  { to: "/admin/projects", label: "Projects", key: "projects" as const },
  { to: "/admin/services", label: "Services", key: "services" as const },
  { to: "/admin/posts", label: "Published posts", key: "posts" as const },
  { to: "/admin/gallery_images", label: "Gallery images", key: "gallery" as const },
  { to: "/admin/media", label: "Media uploads", key: "media" as const },
  { to: "/admin/testimonials", label: "Testimonials", key: "testimonials" as const },
  { to: "/admin/faqs", label: "FAQs", key: "faqs" as const },
];

function OverviewPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "overview"], queryFn: () => getOverview() });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything the public site shows is editable here.</p>
      </div>

      {error ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base">The database is not reachable</CardTitle>
            <CardDescription>
              Apply <code className="rounded bg-secondary px-1 py-0.5">supabase/migrations/20261126000000_init.sql</code>{" "}
              and check the Supabase environment variables. The public site keeps serving the bundled content meanwhile.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="group">
            <Card className="h-full transition group-hover:border-[color:var(--brand)]">
              <CardHeader className="pb-2">
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="font-display text-3xl">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    (data?.[item.key] ?? 0)
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                Manage
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 group-hover:text-[color:var(--brand)]" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Site settings</CardTitle>
          <CardDescription>Phone, WhatsApp, email, social links and the global hero/about images.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            Edit site settings <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
