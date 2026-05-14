import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ThemeProvider } from "@/lib/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-primary">404</h1>
        <h2 className="mt-4 font-serif text-2xl">Lost between chapters</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page hasn't been written yet.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Back to your library
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">A page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f5efe2" },
      { title: "Quill — Write, publish, and share your stories" },
      { name: "description", content: "The beautiful storytelling app for writers. Draft chapters with AI, design covers, publish to Kindle, build a reader following, and earn from tips and paid chapters." },
      { name: "keywords", content: "writing app, novel writing, book writing app, self publishing, AI writing assistant, story app, ebook creator, kindle publishing, author tools, fiction writing, chapter writer, book cover generator" },
      { name: "author", content: "Quill" },
      { name: "application-name", content: "Quill" },
      { name: "apple-mobile-web-app-title", content: "Quill" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "format-detection", content: "telephone=no" },

      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Quill" },
      { property: "og:title", content: "Quill — Write, publish, share your stories" },
      { property: "og:description", content: "Draft with AI. Design covers. Publish to Kindle. Earn from your readers." },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "1200" },
      { property: "og:locale", content: "en_US" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Quill — Write the book in you" },
      { name: "twitter:description", content: "AI co-writer, AI covers, EPUB export, Kindle-ready. Self-publish in days." },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", type: "image/png", href: "/app-icon.png" },
      { rel: "apple-touch-icon", href: "/app-icon.png" },
      { rel: "canonical", href: "https://quill.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Quill",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web, iOS, Android",
          description: "Write, publish, and share your stories. AI-powered book writing and self-publishing platform.",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "120" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <OnboardingGate />
          <Toaster richColors closeButton position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function OnboardingGate() {
  const { user } = useAuth();
  if (!user) return null;
  return <OnboardingModal />;
}
