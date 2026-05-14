import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/discover")({ component: () => <AppShell><Discover /></AppShell> });

function Discover() {
  const [q, setQ] = useState("");
  const { data: works = [], isLoading } = useQuery({
    queryKey: ["discover"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manuscripts")
        .select("id,title,synopsis,genre,cover_url,author_id,word_count,profiles(pen_name,avatar_url)")
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = q
    ? works.filter((w: any) =>
        [w.title, w.synopsis, w.genre, w.profiles?.pen_name].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase()))
    : works;

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl">Discover</h1>
      <p className="mt-1 text-sm text-muted-foreground">Stories shared by writers around the world.</p>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, genre, author…" className="pl-9 h-11 rounded-full" />
      </div>

      <div className="mt-7 space-y-5">
        {isLoading && [0,1,2].map(i => <div key={i} className="h-32 paper-card animate-pulse" />)}
        {!isLoading && filtered.length === 0 && (
          <div className="paper-card p-8 text-center text-sm text-muted-foreground">
            No stories yet. Be the first to publish from your library.
          </div>
        )}
        {filtered.map((w: any) => (
          <Link key={w.id} to="/read/$id" params={{ id: w.id }} className="block">
            <article className="paper-card flex gap-4 p-4">
              <div className="book-cover h-32 w-22 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted" style={{ width: 88 }}>
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
                  <span>{w.word_count.toLocaleString()} words</span>
                  <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> Read</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
