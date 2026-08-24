import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { aiAssist } from "@/lib/ai.functions";
import {
  ArrowLeft,
  BookCopy,
  Image as ImageIcon,
  Mic,
  MicOff,
  MoreHorizontal,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Globe,
  Lock,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  History,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/write/$id")({ component: WritePage });

const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
type Manuscript = Database["public"]["Tables"]["manuscripts"]["Row"];
type Chapter = Database["public"]["Tables"]["chapters"]["Row"];

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};
type SpeechRecognitionErrorLike = { error: string };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function WritePage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

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
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .eq("manuscript_id", id)
        .order("order");
      return data ?? [];
    },
    enabled: !!user,
  });

  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  useEffect(() => {
    if (!activeChapterId && chapters.length) setActiveChapterId(chapters[0].id);
  }, [chapters, activeChapterId]);

  const active = useMemo(
    () => chapters.find((c) => c.id === activeChapterId),
    [chapters, activeChapterId],
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const draftRef = useRef({ chapterId: "", title: "", content: "", dirty: false });
  useEffect(() => {
    if (active) {
      setTitle(active.title);
      setContent(active.content);
      draftRef.current = {
        chapterId: active.id,
        title: active.title,
        content: active.content,
        dirty: false,
      };
      setSaveState("saved");
    }
  }, [active]);

  const persistDraft = useCallback(async () => {
    const draft = { ...draftRef.current };
    if (!draft.chapterId || !draft.dirty) return true;
    setSaveState("saving");
    const wc = countWords(draft.content);
    const { error } = await supabase
      .from("chapters")
      .update({ title: draft.title, content: draft.content, word_count: wc })
      .eq("id", draft.chapterId);
    if (error) {
      setSaveState("error");
      return false;
    }
    if (
      draftRef.current.chapterId === draft.chapterId &&
      draftRef.current.title === draft.title &&
      draftRef.current.content === draft.content
    ) {
      draftRef.current.dirty = false;
      setSaveState("saved");
    }
    const { data: ch } = await supabase
      .from("chapters")
      .select("word_count")
      .eq("manuscript_id", id);
    const total = (ch ?? []).reduce((sum, chapter) => sum + (chapter.word_count ?? 0), 0);
    await supabase.from("manuscripts").update({ word_count: total }).eq("id", id);
    qc.setQueryData(["chapters", id], (existing: Chapter[] | undefined) =>
      (existing ?? []).map((chapter) =>
        chapter.id === draft.chapterId
          ? { ...chapter, title: draft.title, content: draft.content, word_count: wc }
          : chapter,
      ),
    );
    qc.setQueryData(["m", id], (existing: Manuscript | undefined) =>
      existing ? { ...existing, word_count: total } : existing,
    );
    return true;
  }, [id, qc]);

  // Autosave after a short pause. Page exit and chapter changes flush immediately below.
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!draftRef.current.chapterId || !draftRef.current.dirty) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => void persistDraft(), 700);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [title, content, persistDraft]);

  useEffect(() => {
    const flush = () => void persistDraft();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      void persistDraft();
    };
  }, [persistDraft]);

  const selectChapter = async (chapterId: string) => {
    if (chapterId === activeChapterId) return;
    const saved = await persistDraft();
    if (!saved) {
      toast.error("Your latest changes could not be saved. Check your connection and try again.");
      return;
    }
    setActiveChapterId(chapterId);
  };

  const appendContent = (text: string, separator: string) => {
    setContent((current) => {
      const next = current + (current ? separator : "") + text;
      draftRef.current.content = next;
      draftRef.current.dirty = true;
      setSaveState("saving");
      return next;
    });
  };

  const addChapter = async () => {
    const saved = await persistDraft();
    if (!saved) {
      toast.error("Save the current chapter before adding another.");
      return;
    }
    const order = chapters.length;
    const { data, error } = await supabase
      .from("chapters")
      .insert({
        manuscript_id: id,
        title: `Chapter ${order + 1}`,
        order,
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["chapters", id] });
    if (data) setActiveChapterId(data.id);
  };

  const deleteActiveChapter = async () => {
    if (!active) return;
    if (chapters.length === 1) {
      toast.error("A manuscript must keep at least one chapter.");
      return;
    }
    if (!window.confirm(`Delete “${active.title}”? You can’t undo this action.`)) return;
    const nextChapter = chapters.find((chapter) => chapter.id !== active.id);
    const { error } = await supabase.from("chapters").delete().eq("id", active.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    draftRef.current = { chapterId: "", title: "", content: "", dirty: false };
    setActiveChapterId(nextChapter?.id ?? null);
    await qc.invalidateQueries({ queryKey: ["chapters", id] });
    toast.success("Chapter deleted");
  };

  const importFiles = async (files: FileList) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    const { default: mammoth } = await import("mammoth");
    let order = chapters.length;
    let firstId: string | null = null;
    let imported = 0;
    for (const file of arr) {
      try {
        const name = file.name.replace(/\.(docx?|txt|md)$/i, "").trim() || `Chapter ${order + 1}`;
        let text = "";
        if (/\.docx$/i.test(file.name)) {
          const buf = await file.arrayBuffer();
          const r = await mammoth.extractRawText({ arrayBuffer: buf });
          text = r.value;
        } else if (/\.(txt|md)$/i.test(file.name)) {
          text = await file.text();
        } else if (/\.doc$/i.test(file.name)) {
          toast.error(`${file.name}: legacy .doc not supported — save as .docx and try again`);
          continue;
        } else {
          toast.error(`${file.name}: unsupported file type`);
          continue;
        }
        const content = text
          .replace(/\r\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        const wc = countWords(content);
        const { data } = await supabase
          .from("chapters")
          .insert({
            manuscript_id: id,
            title: name,
            order,
            content,
            word_count: wc,
          })
          .select()
          .single();
        if (data && !firstId) firstId = data.id;
        order += 1;
        imported += 1;
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "import failed"}`);
      }
    }
    if (imported) {
      const { data: ch } = await supabase
        .from("chapters")
        .select("word_count")
        .eq("manuscript_id", id);
      const total = (ch ?? []).reduce((s, c) => s + (c.word_count ?? 0), 0);
      await supabase.from("manuscripts").update({ word_count: total }).eq("id", id);
      qc.invalidateQueries({ queryKey: ["chapters", id] });
      qc.invalidateQueries({ queryKey: ["m", id] });
      if (firstId) setActiveChapterId(firstId);
      toast.success(`Imported ${imported} chapter${imported > 1 ? "s" : ""}`);
    }
  };

  const togglePublish = async () => {
    if (!manuscript) return;
    const next = manuscript.status === "published" ? "draft" : "published";
    await supabase.from("manuscripts").update({ status: next }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["m", id] });
    toast.success(next === "published" ? "Published to Discover" : "Moved to drafts");
  };

  if (!manuscript)
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>
    );

  return (
    <div className="mx-auto min-h-screen max-w-md flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper/90 backdrop-blur border-b border-border px-3 py-2.5">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <div className="font-serif text-sm leading-none truncate max-w-[180px]">
            {manuscript.title}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
            {manuscript.word_count.toLocaleString()} words · {manuscript.status}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            {saveState === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </>
            ) : saveState === "error" ? (
              <>
                <AlertCircle className="h-3 w-3 text-destructive" /> Save failed
              </>
            ) : (
              <>
                <Check className="h-3 w-3" /> Saved
              </>
            )}
          </div>
        </div>
        <SettingsSheet
          manuscript={manuscript}
          activeChapter={active}
          onPublish={togglePublish}
          onRestore={(revision) => {
            setTitle(revision.title);
            setContent(revision.content);
            draftRef.current = {
              chapterId: active?.id ?? "",
              title: revision.title,
              content: revision.content,
              dirty: true,
            };
            setSaveState("saving");
            void persistDraft();
          }}
        />
      </header>

      <ChapterStrip
        chapters={chapters}
        activeId={activeChapterId}
        onSelect={(chapterId) => void selectChapter(chapterId)}
        onAdd={addChapter}
        onImport={importFiles}
        onDelete={deleteActiveChapter}
      />

      <div className="flex-1 px-5 py-4">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            draftRef.current.title = e.target.value;
            draftRef.current.dirty = true;
            setSaveState("saving");
          }}
          placeholder="Chapter title"
          className="w-full bg-transparent font-serif text-2xl outline-none placeholder:text-muted-foreground"
        />
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            draftRef.current.content = e.target.value;
            draftRef.current.dirty = true;
            setSaveState("saving");
          }}
          placeholder="Once upon a time…"
          className="mt-4 w-full min-h-[60vh] resize-none bg-transparent font-serif text-[17px] leading-relaxed outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <DictateButton
        onTranscript={(text) => appendContent(text, content.endsWith(" ") || !content ? "" : " ")}
      />
      <AiBar content={content} onInsert={(text) => appendContent(text, "\n\n")} />
    </div>
  );
}

function DictateButton({ onTranscript }: { onTranscript: (t: string) => void }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const toggle = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SR = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice dictation not supported in this browser");
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal) onTranscript(last[0].transcript.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      toast.error(`Mic: ${e.error}`);
      setListening(false);
    };
    rec.start();
    recRef.current = rec;
    setListening(true);
    toast.success("Listening… speak naturally");
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "fixed bottom-5 left-5 z-40 grid h-14 w-14 place-items-center rounded-full shadow-cover transition-colors",
        listening
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : "bg-card border border-border text-foreground",
      )}
    >
      {listening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </button>
  );
}

function ChapterStrip({
  chapters,
  activeId,
  onSelect,
  onAdd,
  onImport,
  onDelete,
}: {
  chapters: { id: string; title: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onImport: (files: FileList) => Promise<void>;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [importing, setImporting] = useState(false);
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setImporting(true);
    try {
      await onImport(e.target.files);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  return (
    <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b border-border bg-card/50">
      {chapters.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
            c.id === activeId
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {i + 1}. {c.title}
        </button>
      ))}
      <button
        onClick={onAdd}
        className="shrink-0 grid place-items-center h-7 w-7 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground"
        title="New chapter"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={chapters.length <= 1}
        className="shrink-0 grid place-items-center h-7 w-7 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-30"
        title={chapters.length <= 1 ? "A manuscript needs one chapter" : "Delete current chapter"}
        aria-label="Delete current chapter"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={importing}
        className="shrink-0 grid place-items-center h-7 w-7 rounded-full border border-dashed border-border text-muted-foreground hover:text-foreground disabled:opacity-50"
        title="Import .docx, .txt, or .md"
      >
        {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".docx,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}

function AiBar({ content, onInsert }: { content: string; onInsert: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"continue" | "rewrite" | "improve" | "brainstorm" | "outline">(
    "continue",
  );
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const assist = useServerFn(aiAssist);

  const run = async () => {
    setBusy(true);
    setResult("");
    try {
      const ctx = mode === "outline" ? content || instruction : content.slice(-4000);
      if (!ctx.trim() && mode !== "outline") {
        toast.error("Write a few lines first so the AI has context.");
        return;
      }
      const r = await assist({ data: { mode, context: ctx || instruction, instruction } });
      setResult(r.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
    } finally {
      setBusy(false);
    }
  };

  const insert = () => {
    onInsert(result);
    setOpen(false);
    setResult("");
    setInstruction("");
  };

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
          {(["continue", "improve", "rewrite", "brainstorm", "outline"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs capitalize border",
                mode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={
            mode === "outline"
              ? "Describe your premise…"
              : "Optional note (tone, what to focus on, what to avoid)"
          }
          className="mt-3 min-h-[80px]"
        />
        <Button onClick={run} disabled={busy} className="mt-3 w-full rounded-full h-11">
          <Send className="mr-2 h-4 w-4" />
          {busy ? "Quill is thinking…" : "Generate"}
        </Button>
        {result && (
          <div className="mt-4 paper-card p-4 font-serif text-[15px] leading-relaxed whitespace-pre-wrap">
            {result}
            <div className="mt-3 flex gap-2">
              <Button onClick={insert} className="rounded-full">
                Insert into chapter
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  navigator.clipboard.writeText(result).then(() => toast.success("Copied"))
                }
                className="rounded-full"
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SettingsSheet({
  manuscript,
  activeChapter,
  onPublish,
  onRestore,
}: {
  manuscript: Manuscript;
  activeChapter: Chapter | undefined;
  onPublish: () => void;
  onRestore: (revision: { title: string; content: string }) => void;
}) {
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
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-2xl">Manuscript</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Genre</Label>
            <Input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Fantasy, Romance, Memoir…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Synopsis</Label>
            <Textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="min-h-[100px]"
              placeholder="A single-paragraph hook for readers."
            />
          </div>
          <Button onClick={save} className="w-full rounded-full">
            Save details
          </Button>

          {activeChapter && <RevisionHistory chapter={activeChapter} onRestore={onRestore} />}

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link
              to="/cover/$id"
              params={{ id: manuscript.id }}
              className="paper-card p-4 text-center hover:bg-accent transition-colors"
            >
              <ImageIcon className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-medium">Generate cover</div>
            </Link>
            <Link
              to="/publish/$id"
              params={{ id: manuscript.id }}
              className="paper-card p-4 text-center hover:bg-accent transition-colors"
            >
              <BookCopy className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-sm font-medium">Publish & export</div>
            </Link>
          </div>

          <Button variant="outline" onClick={onPublish} className="w-full rounded-full">
            {manuscript.status === "published" ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Move to drafts
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" /> Publish to Discover
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function RevisionHistory({
  chapter,
  onRestore,
}: {
  chapter: Chapter;
  onRestore: (revision: { title: string; content: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ["chapter-revisions", chapter.id],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_revisions")
        .select("id,title,content,word_count,created_at")
        .eq("chapter_id", chapter.id)
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-full">
          <History className="mr-2 h-4 w-4" /> Revision history
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Revision history</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Quill keeps rolling recovery points while you write. Restoring one preserves the current
          version as another recovery point.
        </p>
        <div className="max-h-[55vh] space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">Loading…</div>
          ) : revisions.length ? (
            revisions.map((revision) => (
              <div key={revision.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-serif text-sm">{revision.title}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(revision.created_at).toLocaleString()} ·{" "}
                      {revision.word_count.toLocaleString()} words
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onRestore({ title: revision.title, content: revision.content });
                      setOpen(false);
                      toast.success("Revision restored");
                    }}
                    className="shrink-0 rounded-full"
                  >
                    Restore
                  </Button>
                </div>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-muted-foreground">
                  {revision.content || "Blank chapter"}
                </p>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Recovery points will appear after this chapter is edited.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
