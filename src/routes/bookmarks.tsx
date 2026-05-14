import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Bookmark } from "lucide-react";
import { readingLabel } from "@/lib/reading";

export const Route = createFileRoute("/bookmarks")({ component: () => <AppShell><Saved /></AppShell> });

function Saved() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("manuscript_id, created_at, manuscripts(id,title,synopsis,genre,cover_url,word_count,profiles(pen_name))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl flex items-center gap-2"><Bookmark className="h-6 w-6" /> Saved</h1>
      <p className="mt-1 text-sm text-muted-foreground">Books you've bookmarked to read later.</p>
      <div className="mt-7 space-y-5">
        {isLoading && <div className="h-24 paper-card animate-pulse" />}
        {!isLoading && items.length === 0 && (
          <div className="paper-card p-8 text-center text-sm text-muted-foreground">Nothing saved yet. Tap the bookmark icon on any book.</div>
        )}
        {items.map((b: any) => {
          const w = b.manuscripts; if (!w) return null;
          return (
            <Link key={b.manuscript_id} to="/read/$id" params={{ id: w.id }} className="block">
              <article className="paper-card flex gap-4 p-4">
                <div className="book-cover h-32 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted" style={{ width: 88 }}>
                  {w.cover_url ? <img src={w.cover_url} alt={w.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-serif text-xs px-2 text-center">{w.title}</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{w.genre || "Fiction"}</div>
                  <h3 className="font-serif text-lg leading-tight line-clamp-2">{w.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">by {w.profiles?.pen_name ?? "Anonymous"}</p>
                  <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{w.synopsis ?? ""}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{readingLabel(w.word_count)}</div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
