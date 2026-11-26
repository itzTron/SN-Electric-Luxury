import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ScriptOnce,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import { defaultSiteSettings } from "@/lib/content/defaults";
import { mediaUrl } from "@/lib/content/media";
import { siteSettingsQuery } from "@/lib/content/query-options";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-semibold text-white">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => ({
    settings: await context.queryClient.ensureQueryData(siteSettingsQuery()),
  }),
  head: ({ loaderData }) => {
    const settings = loaderData?.settings ?? defaultSiteSettings;
    const image = mediaUrl(settings.og_image_path) ?? "/logo.png";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: `${settings.name} — ${settings.tagline}` },
        { name: "description", content: settings.description },
        { name: "author", content: settings.name },
        { property: "og:site_name", content: settings.name },
        { property: "og:title", content: `${settings.name} — ${settings.tagline}` },
        { property: "og:description", content: settings.description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${settings.name} — ${settings.tagline}` },
        { name: "twitter:description", content: settings.description },
        { name: "twitter:image", content: image },
        { name: "theme-color", content: "#0066FF" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/logo.png", type: "image/png" },
        { rel: "shortcut icon", href: "/logo.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/logo.png", type: "image/png" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: settings.name,
            description: settings.description,
            telephone: settings.phone_display,
            email: settings.email,
            areaServed: "IN",
            priceRange: "$$",
            openingHours: "Mo-Sa 08:00-20:00",
            logo: mediaUrl(settings.logo_path) ?? "/logo.png",
            image: mediaUrl(settings.hero_image_path) ?? "/logo.png",
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>
          {`try{var t=localStorage.getItem('sn-theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');var l=localStorage.getItem('sn-lang');if(l==='bn')document.body.classList.add('lang-bn');}catch(e){}`}
        </ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          {isAdmin ? (
            <>
              <Outlet />
              <Toaster position="top-right" richColors />
            </>
          ) : (
            <div className="flex min-h-screen flex-col">
              <Nav />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
              <Toaster position="top-right" richColors />
            </div>
          )}
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
