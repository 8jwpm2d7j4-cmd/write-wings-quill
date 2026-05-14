import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { readingLabel } from "@/lib/reading";

const GENRES = ["All", "Fiction", "Romance", "Sci-Fi", "Fantasy", "Mystery", "Thriller", "Memoir", "Poetry", "Non-fiction"];

export const Route = createFileRoute("/discover")({
  component: () => <AppShell><Discover /></AppShell>,
  head: () => ({
    meta: [
      { title: "Discover stories from indie writers — Quill" },
      { name: "description", content: "Browse new books and chapters from indie writers around the world. Filter by genre and find your next favorite story on Quill." },
      { property: "og:title", content: "Discover stories on Quill" },
      { property: "og:description", content: "New books and chapters from indie writers around the world." },
      { property: "og:url", content: "https://write-wings-quill.lovable.app/discover" },
    ],
    links: [
      { rel: "canonical", href: "https://write-wings-quill.lovable.app/discover" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Discover stories on Quill",
          description: "Browse new books and chapters from indie writers around the world.",
          url: "https://write-wings-quill.lovable.app/discover",
        }),
      },
    ],
  }),
});

function Discover() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const { data: works = [], isLoading } = useQuery({
    queryKey: ["discover"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manuscripts")
        .select("id,title,synopsis,genre,cover_url,author_id,word_count,updated_at,profiles(pen_name,avatar_url),likes(user_id)")
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .limit(80);
      if (error) throw error;
      return data ?? [];
    },
  });

  const trending = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    return [...works]
      .map((w: any) => ({ ...w, _likes: (w.likes ?? []).length }))
      .filter((w) => new Date(w.updated_at).getTime() > weekAgo || w._likes > 0)
      .sort((a, b) => b._likes - a._likes)
      .slice(0, 6);
  }, [works]);

  const filtered = (works as any[])
    .filter((w) => genre === "All" || (w.genre || "").toLowerCase() === genre.toLowerCase())
    .filter((w) =>
      !q ? true : [w.title, w.synopsis, w.genre, w.profiles?.pen_name].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()),
    );

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl">Discover</h1>
      <p className="mt-1 text-sm text-muted-foreground">Stories shared by writers around the world.</p>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, genre, author…" className="pl-9 h-11 rounded-full" />
      </div>

      <div className="mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${genre === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {g}
          </button>
        ))}
      </div>

      {trending.length > 0 && (
        <section className="mt-7">
          <h2 className="font-serif text-lg flex items-center gap-2"><Flame className="h-4 w-4 text-primary" /> Trending this week</h2>
          <div className="mt-3 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {trending.map((w: any) => (
              <Link key={w.id} to="/read/$id" params={{ id: w.id }} className="shrink-0 w-32">
                <div className="book-cover aspect-[2/3] overflow-hidden bg-gradient-to-br from-secondary to-muted">
                  {w.cover_url ? <img src={w.cover_url} alt={w.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-serif text-xs px-2 text-center">{w.title}</div>}
                </div>
                <div className="mt-2 font-serif text-sm leading-tight line-clamp-2">{w.title}</div>
                <div className="text-[11px] text-muted-foreground">{w._likes} likes</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-7 space-y-5">
        {isLoading && [0, 1, 2].map((i) => <div key={i} className="h-32 paper-card animate-pulse" />)}
        {!isLoading && filtered.length === 0 && (
          <div className="paper-card p-8 text-center text-sm text-muted-foreground">No stories match your filter.</div>
        )}
        {filtered.map((w: any) => (
          <Link key={w.id} to="/read/$id" params={{ id: w.id }} className="block">
            <article className="paper-card flex gap-4 p-4">
              <div className="book-cover h-32 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted" style={{ width: 88 }}>
                {w.cover_url ? (
                  <img src={w.cover_url} alt={w.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center font-serif text-xs px-2 text-center">{w.title}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{w.genre || "Fiction"}</div>
                <h3 className="font-serif text-lg leading-tight line-clamp-2">{w.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">by {w.profiles?.pen_name ?? "Anonymous"}</p>
                <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{w.synopsis ?? "No synopsis yet."}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{readingLabel(w.word_count)}</span>
                  <span>·</span>
                  <span>{(w.likes ?? []).length} likes</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
