import { useRef, useState } from "react";
import { Music2, Loader2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { narrate } from "@/lib/tts.functions";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

function drawCard(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { quote: string; title: string; author: string }) {
  // Background gradient
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1a1410");
  g.addColorStop(1, "#2a1a0c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Decorative corner
  ctx.strokeStyle = "rgba(232,200,128,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  // Quote
  ctx.fillStyle = "#f5efe2";
  ctx.font = '600 54px "Times New Roman", Georgia, serif';
  ctx.textBaseline = "top";
  const maxW = w - 200;
  const words = opts.quote.split(" ");
  let line = "";
  let y = 280;
  ctx.fillText("\u201C", 100, 200);
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), 100, y);
      line = word + " ";
      y += 70;
      if (y > h - 320) { line = line.slice(0, -1) + "…"; break; }
    } else line = test;
  }
  if (line) ctx.fillText(line.trim(), 100, y);

  // Footer
  ctx.fillStyle = "rgba(232,200,128,0.95)";
  ctx.font = '500 32px Georgia, serif';
  ctx.fillText(opts.title, 100, h - 220);
  ctx.fillStyle = "rgba(245,239,226,0.7)";
  ctx.font = '400 26px sans-serif';
  ctx.fillText("by " + opts.author, 100, h - 175);

  // Brand
  ctx.fillStyle = "rgba(245,239,226,0.55)";
  ctx.font = '500 24px sans-serif';
  ctx.fillText("✦  Read on Quill", 100, h - 110);
}

export function ShareClipButton({ title, author, excerpt }: { title: string; author: string; excerpt: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"idle" | "image" | "audio">("idle");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const callNarrate = useServerFn(narrate);
  const { isPro } = useSubscription();

  const quote = excerpt.replace(/\s+/g, " ").trim().slice(0, 240);

  const generateImage = () => {
    setBusy("image");
    const c = canvasRef.current!;
    c.width = 1080; c.height = 1920;
    const ctx = c.getContext("2d")!;
    drawCard(ctx, 1080, 1920, { quote, title, author });
    c.toBlob((blob) => {
      if (blob) setImgUrl(URL.createObjectURL(blob));
      setBusy("idle");
    }, "image/png");
  };
  const generateAudio = async () => {
    if (!isPro) { toast.error("Audio narration is a Pro feature"); return; }
    setBusy("audio");
    try {
      const r = await callNarrate({ data: { text: quote } });
      const bin = atob(r.audio);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const blob = new Blob([arr], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Audio generation failed");
    } finally { setBusy("idle"); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o && !imgUrl) generateImage(); }}>
      <DialogTrigger asChild>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent" title="Share clip for TikTok / Reels">
          <Music2 className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Share to TikTok / Reels</DialogTitle></DialogHeader>
        <p className="text-xs text-muted-foreground">Download the quote card and (optionally) the narrated audio. Then upload to TikTok or Instagram Reels.</p>
        <canvas ref={canvasRef} className="hidden" />
        {busy === "image" && <div className="grid h-40 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
        {imgUrl && <img src={imgUrl} alt="quote card" className="mx-auto max-h-72 rounded-lg border" />}
        <div className="grid grid-cols-2 gap-2">
          {imgUrl && (
            <a href={imgUrl} download={`${title.replace(/[^a-z0-9]+/gi, "-")}-quill.png`} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs hover:bg-accent">
              <Download className="h-3.5 w-3.5" /> Image
            </a>
          )}
          {audioUrl ? (
            <a href={audioUrl} download={`${title.replace(/[^a-z0-9]+/gi, "-")}-quill.mp3`} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs hover:bg-accent">
              <Download className="h-3.5 w-3.5" /> Audio
            </a>
          ) : isPro ? (
            <Button onClick={generateAudio} disabled={busy === "audio"} variant="outline" size="sm" className="rounded-full">
              {busy === "audio" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Generate audio"}
            </Button>
          ) : (
            <Link to="/upgrade" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs hover:bg-accent">
              Audio · Pro
            </Link>
          )}
        </div>
        <a href="https://www.tiktok.com/upload" target="_blank" rel="noopener" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Open TikTok upload
        </a>
        <p className="text-[11px] text-muted-foreground text-center">Tag your post #BookTok #QuillStories so readers can find you.</p>
      </DialogContent>
    </Dialog>
  );
}
