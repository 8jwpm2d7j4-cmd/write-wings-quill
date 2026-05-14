import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateCover } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscribeButton } from "@/components/SubscribeButton";

export const Route = createFileRoute("/cover/$id")({ component: () => <AppShell><Cover /></AppShell> });

function Cover() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const gen = useServerFn(generateCover);
  const { isPro } = useSubscription();

  const { data: manuscript, refetch } = useQuery({
    queryKey: ["m", id],
    queryFn: async () => (await supabase.from("manuscripts").select("*").eq("id", id).single()).data,
  });

  const [vibe, setVibe] = useState("atmospheric, cinematic, painterly");
  const [genre, setGenre] = useState(manuscript?.genre ?? "");
  const [preview, setPreview] = useState<string | null>(manuscript?.cover_url ?? null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!manuscript) return;
    setBusy(true);
    try {
      const r = await gen({ data: { title: manuscript.title, genre, vibe } });
      setPreview(r.dataUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  };

  const save = async () => {
    if (!preview || !user) return;
    setBusy(true);
    try {
      // Upload to storage
      const blob = await (await fetch(preview)).blob();
      const path = `${user.id}/${id}-${Date.now()}.png`;
      const { error } = await supabase.storage.from("covers").upload(path, blob, { upsert: true, contentType: "image/png" });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("covers").getPublicUrl(path);
      await supabase.from("manuscripts").update({ cover_url: pub.publicUrl, genre }).eq("id", id);
      toast.success("Cover saved");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="px-5 pt-12">
      <Link to="/write/$id" params={{ id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to chapter
      </Link>
      <h1 className="mt-2 font-serif text-3xl">Design your cover</h1>
      <p className="mt-1 text-sm text-muted-foreground">AI generates the artwork. Title and author overlay are added when readers see it.</p>

      <div className="mt-6 grid place-items-center">
        <div className="book-cover relative aspect-[2/3] w-44 overflow-hidden bg-gradient-to-br from-secondary to-muted">
          {preview ? (
            <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center font-serif text-xs px-2 text-center text-muted-foreground">
              Press generate to preview
            </div>
          )}
          {preview && (
            <div className="absolute inset-0 flex flex-col justify-between p-3 text-center pointer-events-none">
              <div className="font-serif text-white drop-shadow-lg text-sm leading-tight">{manuscript?.title}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/90 drop-shadow">Quill</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <Label>Genre</Label>
          <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Fantasy, Thriller, Memoir…" />
        </div>
        <div className="space-y-1.5">
          <Label>Vibe / mood</Label>
          <Textarea value={vibe} onChange={(e) => setVibe(e.target.value)} className="min-h-[80px]"
            placeholder="e.g. moody forest, golden-hour cinematic, watercolor portrait" />
        </div>
        {!isPro ? (
          <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
            <Crown className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-medium">AI cover generation is a Pro feature</p>
            <p className="mt-1 text-xs text-muted-foreground">Unlimited covers, AI co-writer, EPUB export, beta invites — $6/mo.</p>
            <SubscribeButton className="mt-3 w-full rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={run} disabled={busy} variant="outline" className="rounded-full h-11">
              <Sparkles className="mr-2 h-4 w-4" />{busy ? "Conjuring…" : "Generate"}
            </Button>
            <Button onClick={save} disabled={!preview || busy} className="rounded-full h-11">
              <Check className="mr-2 h-4 w-4" />Save cover
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
