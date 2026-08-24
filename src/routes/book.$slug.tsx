import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/book/$slug")({
  component: BookLanding,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Quill` },
      { name: "description", content: `Read this book on Quill.` },
      { property: "og:title", content: params.slug.replace(/-/g, " ") },
    ],
  }),
});

function BookLanding() {
  const { slug } = Route.useParams();
  const { data: m, isLoading } = useQuery({
    queryKey: ["book-slug", slug],
    queryFn: async () =>
      (
        await supabase
          .from("manuscripts")
          .select("*, profiles(pen_name,avatar_url)")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle()
      ).data,
  });

  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );
  if (!m) return <Navigate to="/discover" />;

  const author = m.profiles?.pen_name ?? "Anonymous";

  return (
    <div className="mx-auto max-w-md min-h-screen px-5 pt-12 pb-16">
      <div className="text-center">
        {m.cover_url && (
          <div className="book-cover mx-auto aspect-[2/3] w-44 overflow-hidden">
            <img src={m.cover_url} alt={m.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          {m.genre || "Fiction"}
        </div>
        <h1 className="mt-1 font-serif text-3xl">{m.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          by{" "}
          <Link to="/u/$penName" params={{ penName: author }} className="underline">
            {author}
          </Link>
        </p>
        {m.synopsis && <p className="mt-5 text-sm text-foreground/80 text-left">{m.synopsis}</p>}
        <div className="mt-3 text-xs text-muted-foreground">
          {m.word_count.toLocaleString()} words
        </div>

        <Link
          to="/read/$id"
          params={{ id: m.id }}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium"
        >
          Start reading <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: m.title,
            author: { "@type": "Person", name: author },
            description: m.synopsis,
            image: m.cover_url,
            genre: m.genre,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
