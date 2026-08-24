import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/embed/$id")({
  component: Embed,
  head: ({ params }) => ({
    meta: [{ title: "Quill — book preview" }, { name: "robots", content: "noindex" }],
  }),
});

function Embed() {
  const { id } = Route.useParams();
  const { data: m } = useQuery({
    queryKey: ["embed", id],
    queryFn: async () =>
      (
        await supabase
          .from("manuscripts")
          .select("id,title,synopsis,cover_url,genre,word_count,author_id,profiles(pen_name)")
          .eq("id", id)
          .maybeSingle()
      ).data,
  });

  if (!m) {
    return (
      <div className="grid min-h-[200px] place-items-center text-xs text-muted-foreground">
        Loading…
      </div>
    );
  }
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/read/${m.id}` : `/read/${m.id}`;

  return (
    <div className="font-sans bg-paper text-foreground p-3">
      <a href={url} target="_blank" rel="noopener" className="block">
        <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 hover:shadow-elegant transition">
          {m.cover_url ? (
            <img
              src={m.cover_url}
              alt={m.title}
              className="h-28 w-20 flex-shrink-0 rounded-md object-cover shadow-cover"
            />
          ) : (
            <div className="h-28 w-20 flex-shrink-0 rounded-md bg-accent grid place-items-center">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {m.genre || "Fiction"}
            </div>
            <h3 className="font-serif text-base leading-tight mt-0.5 line-clamp-2">{m.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              by {m.profiles?.pen_name ?? "Anonymous"}
            </p>
            {m.synopsis && (
              <p className="mt-1.5 text-xs text-foreground/80 line-clamp-3">{m.synopsis}</p>
            )}
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
              Read on Quill →
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
