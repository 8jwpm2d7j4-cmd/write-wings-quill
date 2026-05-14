import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { narrate } from "@/lib/tts.functions";
import { ArrowLeft, Heart, MessageCircle, Pause, Play, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TipJar } from "@/components/TipJar";
import { Reactions } from "@/components/Reactions";
import { FollowButton } from "@/components/FollowButton";
import { PaidChapterGate } from "@/components/PaidChapterGate";
import { pingReadingStreak } from "@/lib/streaks";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareButton } from "@/components/ShareButton";
import { ReportButton } from "@/components/ReportButton";
import { CommentItem } from "@/components/CommentItem";
import { readingLabel } from "@/lib/reading";
import { notify } from "@/lib/notify";
import { ShareClipButton } from "@/components/ShareClipButton";
import { EmbedSnippet } from "@/components/EmbedSnippet";

export const Route = createFileRoute("/read/$id")({ component: Read });

function Read() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: m } = useQuery({
    queryKey: ["read", id],
    queryFn: async () =>
      (await supabase.from("manuscripts")
        .select("*, profiles(pen_name,avatar_url)")
        .eq("id", id).single()).data,
  });
  const { data: chapters = [] } = useQuery({
    queryKey: ["read-ch", id],
    queryFn: async () => (await supabase.from("chapters").select("*").eq("manuscript_id", id).order("order")).data ?? [],
  });
  const { data: likes = [] } = useQuery({
    queryKey: ["likes", id],
    queryFn: async () => (await supabase.from("likes").select("user_id").eq("manuscript_id", id)).data ?? [],
  });
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => (await supabase.from("comments").select("*, profiles(pen_name)").eq("manuscript_id", id).order("created_at", { ascending: false })).data ?? [],
  });
  const { data: unlocks = [] } = useQuery({
    queryKey: ["unlocks", id, user?.id],
    queryFn: async () => (await supabase.from("chapter_unlocks").select("chapter_id").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });
  const unlockedSet = new Set(unlocks.map((u: any) => u.chapter_id));

  useEffect(() => { if (user) pingReadingStreak(user.id).catch(() => {}); }, [user?.id, id]);

  // Track reading progress (scroll %)
  useEffect(() => {
    if (!user) return;
    let last = 0;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      if (Math.abs(pct - last) < 5) return;
      last = pct;
      supabase.from("reading_progress").upsert({ user_id: user.id, manuscript_id: id, scroll_pct: Math.min(100, pct), updated_at: new Date().toISOString() }).then(() => {});
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [user?.id, id]);

  const liked = !!user && likes.some((l: any) => l.user_id === user.id);
  const [body, setBody] = useState("");

  const toggleLike = async () => {
    if (!user) { toast.error("Sign in to like"); return; }
    if (liked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("manuscript_id", id);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, manuscript_id: id });
      if (m?.author_id) notify({ userId: m.author_id, actorId: user.id, kind: "like", message: `Someone liked "${m.title}"`, manuscriptId: id }).catch(() => {});
    }
    qc.invalidateQueries({ queryKey: ["likes", id] });
  };

  const postComment = async () => {
    if (!user || !body.trim()) return;
    await supabase.from("comments").insert({ user_id: user.id, manuscript_id: id, body: body.trim() });
    if (m?.author_id) notify({ userId: m.author_id, actorId: user.id, kind: "comment", message: `New comment on "${m.title}"`, manuscriptId: id }).catch(() => {});
    setBody("");
    qc.invalidateQueries({ queryKey: ["comments", id] });
  };

  if (!m) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-md min-h-screen pb-32">
      <header className="sticky top-0 z-10 flex items-center gap-1 bg-paper/90 backdrop-blur border-b border-border px-3 py-2.5">
        <Link to="/discover" className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 truncate font-serif text-sm">{m.title}</div>
        <BookmarkButton manuscriptId={m.id} />
        <EmbedSnippet manuscriptId={m.id} title={m.title} />
        <ShareClipButton title={m.title} author={(m as any).profiles?.pen_name ?? "Anonymous"} excerpt={(chapters[0] as any)?.content ?? m.synopsis ?? m.title} />
        <ShareButton title={m.title} text={m.synopsis ?? `Read "${m.title}" on Quill`} />
        <button onClick={toggleLike} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
          <Heart className={liked ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5"} />
        </button>
      </header>

      <div className="px-5 pt-8">
        {m.cover_url && (
          <div className="book-cover mx-auto aspect-[2/3] w-44 overflow-hidden">
            <img src={m.cover_url} alt={m.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="mt-5 text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.genre || "Fiction"}</div>
          <h1 className="mt-1 font-serif text-3xl">{m.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">by {(m as any).profiles?.pen_name ?? "Anonymous"}</p>
          {m.synopsis && <p className="mt-4 text-sm text-foreground/80">{m.synopsis}</p>}
          <div className="mt-3 text-xs text-muted-foreground">{readingLabel(m.word_count)} · {m.word_count.toLocaleString()} words · {likes.length} likes</div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <FollowButton authorId={m.author_id} size="sm" />
            <TipJar authorId={m.author_id} manuscriptId={m.id} authorName={(m as any).profiles?.pen_name ?? "the author"} />
          </div>
          <div className="mt-3"><ReportButton manuscriptId={m.id} /></div>
        </div>

        <article className="mt-10 space-y-10 font-serif text-[17px] leading-relaxed">
          {chapters.map((c: any) => {
            const locked = c.is_paid && !unlockedSet.has(c.id) && user?.id !== m.author_id;
            return (
              <section key={c.id}>
                <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                  <h2 className="font-serif text-2xl">{c.title}</h2>
                  {!locked && <NarrateButton text={`${c.title}. ${c.content}`} />}
                </div>
                {locked ? (
                  <PaidChapterGate chapterId={c.id} chapterTitle={c.title} priceCents={c.unlock_price_cents ?? 99} />
                ) : (
                  <>
                    {c.content.split(/\n\n+/).map((p: string, i: number) => <p key={i} className="mb-4">{p}</p>)}
                    <Reactions chapterId={c.id} />
                  </>
                )}
              </section>
            );
          })}
        </article>

        <section className="mt-12">
          <h3 className="font-serif text-xl flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Comments</h3>
          {user ? (
            <div className="mt-3 flex gap-2">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts…" className="min-h-[60px]" />
              <Button onClick={postComment} className="rounded-full h-10 self-end" size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Link to="/auth" className="mt-3 block text-sm text-primary">Sign in to comment</Link>
          )}
          <ul className="mt-5 space-y-3">
            {comments.map((c: any) => <CommentItem key={c.id} comment={c} />)}
            {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function NarrateButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callNarrate = useServerFn(narrate);

  const start = async () => {
    if (audioRef.current) {
      audioRef.current.play();
      setState("playing");
      return;
    }
    setState("loading");
    try {
      const r = await callNarrate({ data: { text: text.slice(0, 4500) } });
      const audio = new Audio(`data:audio/mpeg;base64,${r.audio}`);
      audio.onended = () => setState("idle");
      audio.onpause = () => setState((s) => (s === "playing" ? "paused" : s));
      audioRef.current = audio;
      await audio.play();
      setState("playing");
    } catch (e) {
      setState("idle");
      toast.error(e instanceof Error ? e.message : "Narration failed");
    }
  };

  const pause = () => { audioRef.current?.pause(); setState("paused"); };

  return (
    <button
      onClick={state === "playing" ? pause : start}
      className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent text-primary"
      title="Listen"
      disabled={state === "loading"}
    >
      {state === "loading" ? <Volume2 className="h-4 w-4 animate-pulse" />
        : state === "playing" ? <Pause className="h-4 w-4" />
        : <Play className="h-4 w-4" />}
    </button>
  );
}
