import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search } from "lucide-react";
import { site } from "@/lib/site-config";
import { PageHero } from "@/components/site/page-hero";
import { defaultPosts } from "@/lib/content/defaults";
import { formatPostDate, mediaUrl } from "@/lib/content/media";
import { postsQuery } from "@/lib/content/query-options";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQuery());
  },
  head: () => ({
    meta: [
      { title: `Blog — ${site.name}` },
      { name: "description", content: "Electrical safety, energy saving and wiring guides written by working electricians." },
      { property: "og:title", content: `Blog — ${site.name}` },
      { property: "og:description", content: "Electrical safety, energy saving, and wiring guides." },
    ],
  }),
  component: BlogPage,
});

const cats = ["All", "Electrical Safety", "Energy Saving", "Wiring Guide", "Maintenance Tips"];

function BlogPage() {
  const { data } = useQuery(postsQuery());
  const posts = (data ?? defaultPosts).map((post) => ({
    slug: post.slug,
    cat: post.category,
    title: post.title,
    date: formatPostDate(post.published_at),
    img: mediaUrl(post.cover_image_path),
    excerpt: post.excerpt,
  }));
  const [c, setC] = useState("All");
  const [q, setQ] = useState("");
  const list = posts.filter((p) => (c === "All" || p.cat === c) && p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHero eyebrow="Journal" title="Notes from the workbench." sub="Practical, field-tested writing on electrical safety, energy saving and modern wiring — for homeowners and facility managers." />
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {cats.map((cat) => (
              <button
                key={cat}
                onClick={() => setC(cat)}
                className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition",
                  c === cat ? "border-transparent bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-[color:var(--brand)]" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <a key={p.slug} href="#" className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-[color:var(--brand)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--brand)]">{p.cat}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-[color:var(--brand)]">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
