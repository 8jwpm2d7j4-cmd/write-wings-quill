import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, DollarSign, Edit3, Eye, EyeOff, Plus, Trash2, Settings2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/manage")({
  component: () => <AppShell><Manage /></AppShell>,
  head: () => ({ meta: [{ title: "Manage your books — Quill" }] }),
});

function Manage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [pricingFor, setPricingFor] = useState<string | null>(null);

  const { data: books = [] } = useQuery({
    queryKey: ["manage-books", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase
      .from("manuscripts")
      .select("*")
      .eq("author_id", user!.id)
      .order("updated_at", { ascending: false })).data ?? [],
  });

  const togglePublish = async (b: any) => {
    const next = b.status === "published" ? "draft" : "published";
    await supabase.from("manuscripts").update({ status: next }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["manage-books"] });
    toast.success(next === "published" ? "Published" : "Unpublished");
  };

  const remove = async (b: any) => {
    if (!confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    await supabase.from("manuscripts").delete().eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["manage-books"] });
    toast.success("Deleted");
  };

  return (
    <div className="px-5 pt-12">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Profile
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-serif text-3xl">Manage books</h1>
        <Link to="/new" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm">
          <Plus className="h-4 w-4" />New
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Author admin — edit, publish, price chapters, archive.</p>

      <ul className="mt-6 space-y-3">
        {books.map((b: any) => (
          <li key={b.id} className="paper-card p-4">
            <div className="flex items-start gap-3">
              <div className="book-cover h-16 w-12 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted">
                {b.cover_url ? <img src={b.cover_url} alt="" className="h-full w-full object-cover" />
                  : <div className="grid h-full place-items-center text-[10px] text-muted-foreground"><BookOpen className="h-4 w-4" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-base leading-tight truncate">{b.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {(b.word_count ?? 0).toLocaleString()} words · {b.status}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Link to="/write/$id" params={{ id: b.id }}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent">
                    <Edit3 className="h-3 w-3" />Write
                  </Link>
                  <button onClick={() => togglePublish(b)}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent">
                    {b.status === "published" ? <><EyeOff className="h-3 w-3" />Unpublish</> : <><Eye className="h-3 w-3" />Publish</>}
                  </button>
                  <button onClick={() => setPricingFor(b.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent">
                    <DollarSign className="h-3 w-3" />Pricing
                  </button>
                  <Link to="/publish/$id" params={{ id: b.id }}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent">
                    <Settings2 className="h-3 w-3" />Wizard
                  </Link>
                  <button onClick={() => remove(b)}
                    className="inline-flex items-center gap-1 rounded-full border border-destructive/30 text-destructive px-2.5 py-1 text-[11px] hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" />Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
        {books.length === 0 && (
          <li className="paper-card p-8 text-center text-sm text-muted-foreground">
            No books yet. <Link to="/new" className="text-primary underline">Start one</Link>.
          </li>
        )}
      </ul>

      <Dialog open={!!pricingFor} onOpenChange={(o) => !o && setPricingFor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Chapter pricing</DialogTitle></DialogHeader>
          {pricingFor && <PricingPanel manuscriptId={pricingFor} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PricingPanel({ manuscriptId }: { manuscriptId: string }) {
  const qc = useQueryClient();
  const { data: chapters = [] } = useQuery({
    queryKey: ["pricing-chapters", manuscriptId],
    queryFn: async () => (await supabase.from("chapters")
      .select("id,title,order,is_paid,unlock_price_cents")
      .eq("manuscript_id", manuscriptId).order("order")).data ?? [],
  });

  const update = async (id: string, patch: any) => {
    await supabase.from("chapters").update(patch).eq("id", id);
    qc.invalidateQueries({ queryKey: ["pricing-chapters", manuscriptId] });
  };

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
      <p className="text-xs text-muted-foreground">Toggle paid chapters and set unlock price (USD cents, min 99 = $0.99).</p>
      {chapters.map((c: any) => (
        <div key={c.id} className="rounded-lg border border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-serif text-sm truncate flex-1">{c.title}</div>
            <Switch checked={!!c.is_paid} onCheckedChange={(v) => update(c.id, { is_paid: v })} />
          </div>
          {c.is_paid && (
            <div className="mt-2 flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Cents</Label>
              <Input type="number" min={99} step={100} defaultValue={c.unlock_price_cents ?? 199}
                onBlur={(e) => update(c.id, { unlock_price_cents: Number(e.target.value) })}
                className="h-8 text-sm" />
              <span className="text-xs text-muted-foreground">${(((c.unlock_price_cents ?? 199) / 100)).toFixed(2)}</span>
            </div>
          )}
        </div>
      ))}
      {chapters.length === 0 && <div className="text-sm text-muted-foreground">No chapters yet.</div>}
    </div>
  );
}
