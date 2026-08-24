import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Lock,
  Image as ImageIcon,
  BookOpen,
  DollarSign,
  Rocket,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { buildEpub } from "@/lib/epub";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscribeButton } from "@/components/SubscribeButton";
import { buildPdf } from "@/lib/pdf";
import type { Database } from "@/integrations/supabase/types";

type Manuscript = Database["public"]["Tables"]["manuscripts"]["Row"];
type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
type ChapterUpdate = Database["public"]["Tables"]["chapters"]["Update"];
type BetaInvite = Database["public"]["Tables"]["beta_invites"]["Row"];
type PublishingManuscript = Manuscript & { profiles: { pen_name: string } | null };

export const Route = createFileRoute("/publish/$id")({
  component: () => (
    <AppShell>
      <Wizard />
    </AppShell>
  ),
});

const STEPS = [
  { key: "details", title: "Details", icon: BookOpen },
  { key: "cover", title: "Cover", icon: ImageIcon },
  { key: "pricing", title: "Pricing", icon: DollarSign },
  { key: "publish", title: "Publish", icon: Rocket },
] as const;

function Wizard() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const { data: manuscript, refetch } = useQuery({
    queryKey: ["m", id],
    queryFn: async () =>
      (await supabase.from("manuscripts").select("*, profiles(pen_name)").eq("id", id).single())
        .data,
  });
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", id],
    queryFn: async () =>
      (await supabase.from("chapters").select("*").eq("manuscript_id", id).order("order")).data ??
      [],
  });
  const { data: invites = [], refetch: refetchInv } = useQuery({
    queryKey: ["inv", id],
    queryFn: async () =>
      (await supabase.from("beta_invites").select("*").eq("manuscript_id", id)).data ?? [],
    enabled: !!user,
  });

  const togglePublish = async () => {
    if (!manuscript) return;
    const next = manuscript.status === "published" ? "draft" : "published";
    if (next === "published") {
      if (!manuscript.title.trim() || !manuscript.synopsis?.trim()) {
        toast.error("Add a title and synopsis before publishing.");
        setStep(0);
        return;
      }
      if (!chapters.some((chapter) => chapter.content.trim())) {
        toast.error("Write at least one chapter before publishing.");
        return;
      }
    }
    const { error } = await supabase.from("manuscripts").update({ status: next }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refetch();
    toast.success(next === "published" ? "Published to Discover ✦" : "Unpublished");
  };

  const newInvite = async () => {
    const { error } = await supabase.from("beta_invites").insert({ manuscript_id: id });
    if (error) {
      toast.error(error.message);
      return;
    }
    await refetchInv();
  };

  const exportEpub = async () => {
    if (!manuscript) return;
    let coverDataUrl: string | undefined;
    if (manuscript.cover_url) {
      try {
        const r = await fetch(manuscript.cover_url);
        const b = await r.blob();
        coverDataUrl = await new Promise((res) => {
          const fr = new FileReader();
          fr.onloadend = () => res(fr.result as string);
          fr.readAsDataURL(b);
        });
      } catch {
        /* skip */
      }
    }
    const blob = await buildEpub({
      title: manuscript.title,
      author: manuscript.profiles?.pen_name ?? "Unknown",
      synopsis: manuscript.synopsis ?? undefined,
      chapters: chapters.map((c) => ({ title: c.title, content: c.content })),
      coverDataUrl,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manuscript.title || "manuscript"}.epub`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("EPUB downloaded — ready for KDP");
  };

  const exportPdf = async () => {
    if (!manuscript) return;
    const blob = await buildPdf({
      title: manuscript.title,
      author: manuscript.profiles?.pen_name ?? "Unknown",
      synopsis: manuscript.synopsis ?? undefined,
      chapters: chapters.map((chapter) => ({ title: chapter.title, content: chapter.content })),
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${manuscript.title || "manuscript"}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Print-ready 6×9 PDF downloaded");
  };

  // Step gating
  const detailsOk = !!manuscript?.title && !!manuscript?.synopsis;
  const canNext =
    (step === 0 && detailsOk) ||
    step === 1 || // cover optional
    step === 2 || // pricing optional
    step === 3;

  return (
    <div className="px-5 pt-12 pb-8">
      <Link
        to="/write/$id"
        params={{ id }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to writing
      </Link>
      <h1 className="mt-2 font-serif text-3xl">Publishing wizard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Four steps from draft to readers worldwide.
      </p>

      {/* Stepper */}
      <ol className="mt-6 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <li key={s.key}>
              <button
                onClick={() => setStep(i)}
                className={`w-full rounded-xl border p-2.5 text-left transition ${
                  active
                    ? "border-primary bg-primary/5"
                    : done
                      ? "border-primary/40 bg-accent/30"
                      : "border-border opacity-70"
                }`}
              >
                <div
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <div className="mt-1.5 text-[11px] font-medium">{s.title}</div>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="mt-6 paper-card p-5 min-h-[260px]">
        {step === 0 && manuscript && (
          <Details
            manuscript={manuscript}
            onSaved={() => qc.invalidateQueries({ queryKey: ["m", id] })}
          />
        )}
        {step === 1 && manuscript && <CoverStep manuscript={manuscript} id={id} />}
        {step === 2 && <PricingStep chapters={chapters} manuscriptId={id} />}
        {step === 3 && manuscript && (
          <PublishStep
            manuscript={manuscript}
            isPro={isPro}
            invites={invites}
            onTogglePublish={togglePublish}
            onNewInvite={newInvite}
            onExport={exportEpub}
            onExportPdf={exportPdf}
          />
        )}
      </section>

      <div className="mt-5 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canNext}
            className="rounded-full"
          >
            Continue
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => navigate({ to: "/discover" })} className="rounded-full">
            Done
            <Check className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Details({
  manuscript,
  onSaved,
}: {
  manuscript: PublishingManuscript;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(manuscript.title ?? "");
  const [synopsis, setSynopsis] = useState(manuscript.synopsis ?? "");
  const [genre, setGenre] = useState(manuscript.genre ?? "");

  const save = async () => {
    if (!title.trim()) {
      toast.error("A book title is required.");
      return;
    }
    const { error } = await supabase
      .from("manuscripts")
      .update({ title: title.trim(), synopsis: synopsis.trim(), genre: genre.trim() })
      .eq("id", manuscript.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onSaved();
    toast.success("Saved");
  };

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg">Tell readers about your book</h2>
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Genre</Label>
        <Input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Fantasy, Romance, Sci-Fi…"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Synopsis</Label>
        <Textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          className="min-h-[120px]"
          placeholder="Hook readers in 2–3 sentences."
        />
      </div>
      <Button onClick={save} className="w-full rounded-full">
        Save details
      </Button>
    </div>
  );
}

function CoverStep({ manuscript, id }: { manuscript: PublishingManuscript; id: string }) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg">Cover art</h2>
      <div className="flex items-start gap-4">
        <div className="book-cover h-44 w-32 shrink-0 overflow-hidden bg-gradient-to-br from-secondary to-muted">
          {manuscript.cover_url ? (
            <img src={manuscript.cover_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-center font-serif text-xs px-2">
              {manuscript.title}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm text-muted-foreground">
            A great cover triples your click-through rate.
          </p>
          <Link
            to="/cover/$id"
            params={{ id }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            {manuscript.cover_url ? "Replace cover" : "Generate cover"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingStep({ chapters, manuscriptId }: { chapters: Chapter[]; manuscriptId: string }) {
  const qc = useQueryClient();
  const update = async (id: string, patch: ChapterUpdate) => {
    const { error } = await supabase.from("chapters").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await qc.invalidateQueries({ queryKey: ["chapters", manuscriptId] });
  };
  const paidCount = chapters.filter((c) => c.is_paid).length;

  return (
    <div className="space-y-3">
      <h2 className="font-serif text-lg">
        Chapter pricing <span className="text-xs text-muted-foreground font-sans">(optional)</span>
      </h2>
      <p className="text-xs text-muted-foreground">
        First chapters free hooks readers; later chapters paid earns you revenue. {paidCount} of{" "}
        {chapters.length} chapters paid.
      </p>
      <div className="max-h-[280px] overflow-y-auto space-y-2">
        {chapters.map((c) => (
          <div key={c.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <span className="font-serif text-sm flex-1 truncate">{c.title}</span>
            <button
              onClick={() =>
                update(c.id, {
                  is_paid: !c.is_paid,
                  unlock_price_cents: c.unlock_price_cents ?? 199,
                })
              }
              className={`rounded-full px-2.5 py-1 text-[11px] border transition ${
                c.is_paid
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              {c.is_paid ? `$${((c.unlock_price_cents ?? 199) / 100).toFixed(2)}` : "Free"}
            </button>
          </div>
        ))}
        {chapters.length === 0 && (
          <div className="text-sm text-muted-foreground">No chapters yet.</div>
        )}
      </div>
    </div>
  );
}

function PublishStep({
  manuscript,
  isPro,
  invites,
  onTogglePublish,
  onNewInvite,
  onExport,
  onExportPdf,
}: {
  manuscript: PublishingManuscript;
  isPro: boolean;
  invites: BetaInvite[];
  onTogglePublish: () => void;
  onNewInvite: () => void;
  onExport: () => void;
  onExportPdf: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-lg">Quill community</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Free, instant — appears in Discover with comments, follows, and tips.
        </p>
        <Button onClick={onTogglePublish} className="mt-3 w-full rounded-full">
          {manuscript.status === "published" ? (
            <>
              <Lock className="mr-2 h-4 w-4" /> Unpublish
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" /> Publish to Discover
            </>
          )}
        </Button>
        {manuscript.status === "published" && manuscript.slug && (
          <Link
            to="/book/$slug"
            params={{ slug: manuscript.slug }}
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary"
          >
            View public landing page <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-serif text-base">Export</h3>
        <Button variant="outline" onClick={onExport} className="mt-3 w-full rounded-full">
          <Download className="mr-2 h-4 w-4" />
          Download .epub (Kindle, Apple Books, Kobo)
        </Button>
        <Button variant="outline" onClick={onExportPdf} className="mt-2 w-full rounded-full">
          <Download className="mr-2 h-4 w-4" />
          Download 6×9 PDF
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-serif text-base">Beta readers</h3>
        {isPro ? (
          <>
            <Button variant="outline" onClick={onNewInvite} className="mt-3 w-full rounded-full">
              Generate invite link
            </Button>
            <ul className="mt-3 space-y-2">
              {invites.map((i) => {
                const url = `${window.location.origin}/beta/${i.token}`;
                return (
                  <li
                    key={i.id}
                    className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs"
                  >
                    <code className="flex-1 truncate">{url}</code>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(url).then(() => toast.success("Copied"))
                      }
                      className="grid h-7 w-7 place-items-center rounded hover:bg-accent"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Beta-reader invites are a Pro feature.</p>
            <SubscribeButton className="mt-3 w-full rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
