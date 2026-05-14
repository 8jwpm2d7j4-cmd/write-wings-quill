
import { Code2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EmbedSnippet({ manuscriptId, title }: { manuscriptId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://quill.lovable.app";
  const snippet = `<iframe src="${origin}/embed/${manuscriptId}" width="100%" height="180" frameborder="0" style="border:0;border-radius:16px;max-width:480px" loading="lazy" title="${title.replace(/"/g, "&quot;")} on Quill"></iframe>`;
  const copy = async () => { await navigator.clipboard.writeText(snippet); toast.success("Embed code copied"); };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent" title="Embed on your site">
          <Code2 className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Embed this book</DialogTitle></DialogHeader>
        <p className="text-xs text-muted-foreground">Paste this snippet into any blog post or website.</p>
        <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-[10px]">{snippet}</pre>
        <Button onClick={copy} className="rounded-full">Copy snippet</Button>
        <div className="mt-2 text-xs text-muted-foreground">Live preview:</div>
        <iframe src={`${origin}/embed/${manuscriptId}`} width="100%" height={180} className="rounded-xl border" title="preview" />
      </DialogContent>
    </Dialog>
  );
}
