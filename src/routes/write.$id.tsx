import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { aiAssist } from "@/lib/ai.functions";
import { ArrowLeft, BookCopy, Image as ImageIcon, Mic, MicOff, MoreHorizontal, Plus, Send, Settings2, Sparkles, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/write/$id")({ component: WritePage });

const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

function WritePage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: manuscript } = useQuery({
    queryKey: ["m", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("manuscripts").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", id],
    queryFn: async () => {
      const { data } = await supabase.from("chapters").select("*").eq("manuscript_id", id).order("order");
      return data ?? [];
    },
    enabled: !!user,
  });

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  useEffect(() => {
    if (!activeChapterId && chapters.length) setActiveChapterId(chapters[0].id);
  }, [chapters, activeChapterId]);

  const active = useMemo(() => chapters.find(c => c.id === activeChapterId), [chapters, activeChapterId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    if (active) { setTitle(active.title); setContent(active.content); }
  }, [active?.id]); // eslint-disable-line

  // Autosave (debounced)
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!active) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const wc = countWords(content);
      await supabase.from("chapters").update({ title, content, word_count: wc }).eq("id", active.id);
      // recompute manuscript word_count
      const { data: ch } = await supabase.from("chapters").select("word_count").eq("manuscript_id", id);
      const total = (ch ?? []).reduce((s, c) => s + (c.word_count ?? 0), 0);
      await supabase.from("manuscripts").update({ word_count: total }).eq("id", id);
      qc.invalidateQueries({ queryKey: ["chapters", id] });
      qc.invalidateQueries({ queryKey: ["m", id] });
    }, 700);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [title, content, active?.id, id, qc]);

  const addChapter = async () => {
    const order = chapters.length;
    const { data } = await supabase.from("chapters").insert({
      manuscript_id: id, title: `Chapter ${order + 1}`, order,
    }).select().single();
    qc.invalidateQueries({ queryKey: ["chapters", id] });
    if (data) setActiveChapterId(data.id);
  };

  const togglePublish = async () => {
    if (!manuscript) return;
    const next = manuscript.status === "published" ? "draft" : "published";
    await supabase.from("manuscripts").update({ status: next }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["m", id] });
    toast.success(next === "published" ? "Published to Discover" : "Moved to drafts");
  };

  if (!manuscript) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto min-h-screen max-w-md flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper/90 backdrop-blur border-b border-border px-3 py-2.5">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <div className="font-serif text-sm leading-none truncate max-w-[180px]">{manuscript.title}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
            {manuscript.word_count.toLocaleString()} words · {manuscript.status}
          </div>
        </div>
        <SettingsSheet manuscript={manuscript} onPublish={togglePublish} />
      </header>

      <ChapterStrip chapters={chapters} activeId={activeChapterId} onSelect={setActiveChapterId} onAdd={addChapter} />

      <div className="flex-1 px-5 py-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chapter title"
          className="w-full bg-transparent font-serif text-2xl outline-none placeholder:text-muted-foreground"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Once upon a time…"
          className="mt-4 w-full min-h-[60vh] resize-none bg-transparent font-serif text-[17px] leading-relaxed outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <DictateButton onTranscript={(t) => setContent(c => c + (c.endsWith(" ") || !c ? "" : " ") + t)} />
      <AiBar content={content} onInsert={(t) => setContent(c => (c + (c.endsWith("\n") ? "" : "\n\n") + t))} />
    </div>
  );
}

function DictateButton({ onTranscript }: { onTranscript: (t: string) => void }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  const toggle = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice dictation not supported in this browser"); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal) onTranscript(last[0].transcript.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = (e: any) => { toast.error(`Mic: ${e.error}`); setListening(false); };
    rec.start();
    recRef.current = rec;
    setListening(true);
    toast.success("Listening… speak naturally");
  };

  return (
    <button onClick={toggle}
      className={cn("fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full shadow-cover transition-colors",
        listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-card border border-border text-foreground")}>
      {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </button>
  );
}

function ChapterStrip({ chapters, activeId, onSelect, onAdd }: {
  chapters: { id: string; title: string }[]; activeId: string | null;
  onSelect: (id: string) => void; onAdd: () => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b border-border bg-card/50">
      {chapters.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
            c.id === activeId ? "bg-primary text-primary-foreground border-primary" : "bg-transparent border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {i + 1}. {c.title}
        </button>
      ))}
      <button onClick={onAdd} className="shrink-0 grid place-items-center h-7 w-7 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function AiBar({ content, onInsert }: { content: string; onInsert: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"continue" | "rewrite" | "improve" | "brainstorm" | "outline">("continue");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const assist = useServerFn(aiAssist);

  const run = async () => {
    setBusy(true); setResult("");
    try {
      const ctx = mode === "outline" ? (content || instruction) : content.slice(-4000);
      if (!ctx.trim() && mode !== "outline") {
        toast.error("Write a few lines first so the AI has context.");
        return;
      }
      const r = await assist({ data: { mode, context: ctx || instruction, instruction } });
      setResult(r.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
    } finally { setBusy(false); }
  };

  const insert = () => { onInsert(result); setOpen(false); setResult(""); setInstruction(""); };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-cover">
          <Sparkles className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-2xl">Quill AI</SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["continue","improve","rewrite","brainstorm","outline"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn("rounded-full px-3 py-1.5 text-xs capitalize border",
                mode === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground")}>{m}</button>
          ))}
        </div>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={mode === "outline" ? "Describe your premise…" : "Optional note (tone, what to focus on, what to avoid)"}
          className="mt-3 min-h-[80px]"
        />
        <Button onClick={run} disabled={busy} className="mt-3 w-full rounded-full h-11">
          <Send className="mr-2 h-4 w-4" />{busy ? "Quill is thinking…" : "Generate"}
        </Button>
        {result && (
          <div className="mt-4 paper-card p-4 font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
            {result}
            <div className="mt-3 flex gap-2">
              <Button onClick={insert} className="rounded-full">Insert into chapter</Button>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(result).then(() => toast.success("Copied"))} className="rounded-full">Copy</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SettingsSheet({ manuscript, onPublish }: { manuscript: any; onPublish: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(manuscript.title);
  const [synopsis, setSynopsis] = useState(manuscript.synopsis ?? "");
  const [genre, setGenre] = useState(manuscript.genre ?? "");

  const save = async () => {
    await supabase.from("manuscripts").update({ title, synopsis, genre }).eq("id", manuscript.id);
    qc.invalidateQueries({ queryKey: ["m", manuscript.id] });
    toast.success("Saved");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left"><SheetTitle className="font-serif text-2xl">Manuscript</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Genre</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Fantasy, Romance, Memoir…" />
          </div>
          <div className="space-y-1.5">
            <Label>Synopsis</Label>
            <Textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="min-h-[100px]" placeholder="A single-paragraph hook for readers." />
          </div>
          <Button onClick={save} className="w-full rounded-full">Save details</Button>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link to="/cover/$id" params={{ id: manuscript.id }} className="paper-card p-4 text-center hover:bg-accent transition-colors">
              <ImageIcon className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-medium">Generate cover</div>
            </Link>
            <Link to="/publish/$id" params={{ id: manuscript.id }} className="paper-card p-4 text-center hover:bg-accent transition-colors">
              <BookCopy className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-medium">Publish & export</div>
            </Link>
          </div>

          <Button variant="outline" onClick={onPublish} className="w-full rounded-full">
            {manuscript.status === "published"
              ? <><Lock className="mr-2 h-4 w-4" /> Move to drafts</>
              : <><Globe className="mr-2 h-4 w-4" /> Publish to Discover</>}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
