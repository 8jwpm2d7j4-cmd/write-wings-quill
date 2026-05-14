import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, BookOpen, Globe, Lock, Bookmark, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsBell } from "@/components/NotificationsBell";
import { readingLabel } from "@/lib/reading";

export const Route = createFileRoute("/")({ component: LibraryPage });

function LibraryPage() {
  return (
    <AppShell>
      <Library />
    </AppShell>
  );
}

function Library() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_my_profile_settings").maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: manuscripts = [], isLoading } = useQuery({
    queryKey: ["manuscripts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manuscripts").select("*")
        .eq("author_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const createNew = async () => {
    const { data, error } = await supabase
      .from("manuscripts")
      .insert({ author_id: user!.id, title: "Untitled" })
      .select().single();
    if (error) { toast.error(error.message); return; }
    await supabase.from("chapters").insert({ manuscript_id: data.id, title: "Chapter 1", order: 0 });
    qc.invalidateQueries({ queryKey: ["manuscripts"] });
    navigate({ to: "/write/$id", params: { id: data.id } });
  };

  const { data: continueReading } = useQuery({
    queryKey: ["continue", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("reading_progress")
        .select("manuscript_id, scroll_pct, updated_at, manuscripts(id,title,cover_url,word_count,profiles(pen_name))")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="px-5 pt-12">
      <header className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 font-serif text-3xl truncate">{profile?.pen_name ?? "Writer"}</h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationsBell />
          <Link to="/bookmarks" className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent" title="Saved"><Bookmark className="h-5 w-5" /></Link>
          <Link to="/profile" className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground font-serif">
            {(profile?.pen_name ?? "?").slice(0, 1).toUpperCase()}
          </Link>
        </div>
      </header>

      {continueReading && continueReading.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-lg">Continue reading</h2>
          <div className="mt-3 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {continueReading.map((p: any) => p.manuscripts && (
              <Link key={p.manuscript_id} to="/read/$id" params={{ id: p.manuscript_id }} className="paper-card shrink-0 w-56 p-3 flex gap-3">
                <div className="book-cover h-20 w-14 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted">
                  {p.manuscripts.cover_url && <img src={p.manuscripts.cover_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-sm line-clamp-2">{p.manuscripts.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{readingLabel(p.manuscripts.word_count)}</div>
                  <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, p.scroll_pct || 0)}%` }} />
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary">Resume <ArrowRight className="h-3 w-3" /></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <button
        onClick={createNew}
        className="mt-8 group relative flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-cover"
      >
        <div className="text-left">
          <div className="font-serif text-lg">Start a new story</div>
          <div className="text-xs opacity-80">AI co-writer included · free forever</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/15 group-active:scale-95 transition-transform">
          <Plus className="h-5 w-5" />
        </div>
      </button>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-xl">Your manuscripts</h2>
          <span className="text-xs text-muted-foreground">{manuscripts.length} works</span>
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[0,1,2,3].map(i => <div key={i} className="aspect-[2/3] rounded-md bg-muted animate-pulse" />)}
          </div>
        ) : manuscripts.length === 0 ? (
          <EmptyLibrary onCreate={createNew} />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5">
            {manuscripts.map(m => (
              <Link key={m.id} to="/write/$id" params={{ id: m.id }} className="group">
                <div className="book-cover relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-secondary to-muted">
                  {m.cover_url ? (
                    <img src={m.cover_url} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col justify-between p-3">
                      <div className="font-serif text-sm leading-tight line-clamp-3">{m.title}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {m.genre || "Untitled"}
                      </div>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium">
                    {m.status === "published" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {m.status}
                  </span>
                </div>
                <div className="mt-2 px-0.5">
                  <div className="font-serif text-sm line-clamp-1">{m.title}</div>
                  <div className="text-[11px] text-muted-foreground">{m.word_count.toLocaleString()} words</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyLibrary({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-8 paper-card p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
        <BookOpen className="h-5 w-5" />
      </div>
      <p className="mt-4 font-serif text-lg">Your shelf is empty.</p>
      <p className="mt-1 text-sm text-muted-foreground">Every novel begins with a single sentence.</p>
      <Button onClick={onCreate} className="mt-5 rounded-full">
        <Sparkles className="mr-2 h-4 w-4" /> Begin your first chapter
      </Button>
    </div>
  );
}
