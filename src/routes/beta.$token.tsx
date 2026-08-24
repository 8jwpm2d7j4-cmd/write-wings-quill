import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type BetaBook = {
  id: string;
  title: string;
  synopsis: string | null;
  genre: string | null;
  cover_url: string | null;
  word_count: number;
  author: string;
  chapters: Array<{ id: string; title: string; content: string; word_count: number }>;
};

export const Route = createFileRoute("/beta/$token")({
  component: BetaReader,
  head: () => ({
    meta: [
      { title: "Private beta reading — Quill" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
    ],
  }),
});

function BetaReader() {
  const { token } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["beta-book", token],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_beta_book", { _token: token });
      if (error) throw error;
      return data as BetaBook | null;
    },
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Opening private draft…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-items-center px-6 text-center">
        <div>
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-2xl">This invitation is unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The link may be incorrect or the author may have withdrawn it.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm text-primary">
            <ArrowLeft className="h-4 w-4" /> Return to Quill
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-20 pt-10">
      <div className="rounded-full border border-border bg-accent/40 px-4 py-2 text-center text-xs text-muted-foreground">
        Private beta-reader draft · Please don’t share this link
      </div>
      <header className="mt-8 text-center">
        {data.cover_url && (
          <img
            src={data.cover_url}
            alt={data.title}
            className="book-cover mx-auto aspect-[2/3] w-40 object-cover"
          />
        )}
        <div className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">
          {data.genre || "Draft manuscript"}
        </div>
        <h1 className="mt-1 font-serif text-4xl">{data.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">by {data.author}</p>
        {data.synopsis && (
          <p className="mx-auto mt-5 max-w-lg text-sm text-foreground/80">{data.synopsis}</p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {data.word_count.toLocaleString()} words
        </p>
      </header>

      <article className="mt-12 space-y-12 font-serif text-[17px] leading-relaxed">
        {data.chapters.map((chapter) => (
          <section key={chapter.id}>
            <h2 className="border-b border-border pb-2 text-2xl">{chapter.title}</h2>
            <div className="mt-5">
              {chapter.content.split(/\n\n+/).map((paragraph, index) => (
                <p key={index} className="mb-4 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}
