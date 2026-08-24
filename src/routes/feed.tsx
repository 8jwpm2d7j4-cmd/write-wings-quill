import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/feed")({
  component: () => (
    <AppShell>
      <Feed />
    </AppShell>
  ),
});

function Feed() {
  const { user } = useAuth();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["feed", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user!.id);
      const ids = (follows ?? []).map((follow) => follow.following_id);
      if (ids.length === 0) return [];
      const { data } = await supabase
        .from("manuscripts")
        .select("id,title,synopsis,cover_url,updated_at,author_id,profiles(pen_name)")
        .in("author_id", ids)
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl">Following</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        New chapters and releases from authors you follow.
      </p>

      <div className="mt-6 space-y-4">
        {isLoading && [0, 1].map((i) => <div key={i} className="h-28 paper-card animate-pulse" />)}
        {!isLoading && items.length === 0 && (
          <div className="paper-card p-8 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Your feed is empty.</p>
            <Link to="/discover" className="mt-3 inline-block text-sm text-primary underline">
              Find authors to follow →
            </Link>
          </div>
        )}
        {items.map((w) => (
          <Link key={w.id} to="/read/$id" params={{ id: w.id }} className="block paper-card p-4">
            <div className="flex gap-3">
              {w.cover_url && (
                <img
                  src={w.cover_url}
                  alt=""
                  className="h-20 w-14 object-cover rounded book-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">
                  {w.profiles?.pen_name} · {new Date(w.updated_at).toLocaleDateString()}
                </div>
                <h3 className="font-serif text-lg leading-tight line-clamp-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{w.synopsis}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
