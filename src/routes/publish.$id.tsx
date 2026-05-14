import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, ExternalLink, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { buildEpub } from "@/lib/epub";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscribeButton } from "@/components/SubscribeButton";

export const Route = createFileRoute("/publish/$id")({ component: () => <AppShell><Publish /></AppShell> });

function Publish() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { isPro } = useSubscription();

  const { data: manuscript, refetch } = useQuery({
    queryKey: ["m", id],
    queryFn: async () =>
      (await supabase.from("manuscripts").select("*, profiles(pen_name)").eq("id", id).single()).data,
  });
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", id],
    queryFn: async () => (await supabase.from("chapters").select("*").eq("manuscript_id", id).order("order")).data ?? [],
  });
  const { data: invites = [], refetch: refetchInv } = useQuery({
    queryKey: ["inv", id],
    queryFn: async () => (await supabase.from("beta_invites").select("*").eq("manuscript_id", id)).data ?? [],
    enabled: !!user,
  });

  const togglePublish = async () => {
    if (!manuscript) return;
    const next = manuscript.status === "published" ? "draft" : "published";
    await supabase.from("manuscripts").update({ status: next }).eq("id", id);
    refetch();
  };

  const newInvite = async () => {
    await supabase.from("beta_invites").insert({ manuscript_id: id });
    refetchInv();
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
      } catch { /* skip cover */ }
    }
    const blob = await buildEpub({
      title: manuscript.title,
      author: (manuscript as any).profiles?.pen_name ?? "Unknown",
      synopsis: manuscript.synopsis ?? undefined,
      chapters: chapters.map((c: any) => ({ title: c.title, content: c.content })),
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

  return (
    <div className="px-5 pt-12">
      <Link to="/write/$id" params={{ id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="mt-2 font-serif text-3xl">Publish & share</h1>
      <p className="mt-1 text-sm text-muted-foreground">Reach readers everywhere.</p>

      <section className="mt-7 paper-card p-5">
        <h2 className="font-serif text-lg">Quill community</h2>
        <p className="mt-1 text-sm text-muted-foreground">Free, instant — appears in Discover.</p>
        <Button onClick={togglePublish} className="mt-4 w-full rounded-full">
          {manuscript?.status === "published"
            ? <><Lock className="mr-2 h-4 w-4" /> Unpublish</>
            : <><Globe className="mr-2 h-4 w-4" /> Publish to Discover</>}
        </Button>
      </section>

      <section className="mt-5 paper-card p-5">
        <h2 className="font-serif text-lg">Export manuscript</h2>
        <p className="mt-1 text-sm text-muted-foreground">Download a clean file you can upload to KDP, Wattpad, Royal Road, or attach to an email.</p>
        <Button variant="outline" onClick={exportEpub} className="mt-4 w-full rounded-full">
          <Download className="mr-2 h-4 w-4" />Download .epub (Kindle, Apple Books, Kobo)
        </Button>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
          <ExternalGuide href="https://kdp.amazon.com/" name="Amazon KDP" steps="Sign in → Create → Paperback or Kindle eBook → upload your file & cover." />
          <ExternalGuide href="https://www.wattpad.com/" name="Wattpad" steps="Create → New story → paste chapters or upload." />
          <ExternalGuide href="https://www.royalroad.com/" name="Royal Road" steps="Write → Create New Fiction → import chapters." />
        </div>
      </section>

      <section className="mt-5 paper-card p-5">
        <h2 className="font-serif text-lg">Beta reader invites</h2>
        <p className="mt-1 text-sm text-muted-foreground">Private links — only people with the link can read.</p>
        {isPro ? (
          <>
            <Button variant="outline" onClick={newInvite} className="mt-4 w-full rounded-full">Generate invite link</Button>
            <ul className="mt-3 space-y-2">
              {invites.map((i: any) => {
                const url = `${window.location.origin}/beta/${i.token}`;
                return (
                  <li key={i.id} className="flex items-center gap-2 rounded-lg border border-border p-2 text-xs">
                    <code className="flex-1 truncate">{url}</code>
                    <button onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Copied"))}
                            className="grid h-7 w-7 place-items-center rounded hover:bg-accent">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Beta-reader invites are a Pro feature.</p>
            <SubscribeButton className="mt-3 w-full rounded-full" />
          </div>
        )}
      </section>
    </div>
  );
}

function ExternalGuide({ href, name, steps }: { href: string; name: string; steps: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-start gap-2 rounded-lg border border-border p-3 hover:bg-accent">
      <ExternalLink className="h-4 w-4 mt-0.5 text-primary" />
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <div className="text-muted-foreground">{steps}</div>
      </div>
    </a>
  );
}
