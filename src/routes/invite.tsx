import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift, Sparkles, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { redeemCode } from "@/lib/referral";

export const Route = createFileRoute("/invite")({
  component: () => (
    <AppShell>
      <Invite />
    </AppShell>
  ),
  head: () => ({
    meta: [
      { title: "Invite friends — Quill" },
      {
        name: "description",
        content: "Invite a writer to Quill. Both of you get a free month of Pro.",
      },
    ],
  }),
});

function Invite() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const { data: prof, refetch } = useQuery({
    queryKey: ["my-ref", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.rpc("get_my_profile_settings").maybeSingle()).data,
  });
  const { data: invitedCount = 0 } = useQuery({
    queryKey: ["invited-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.rpc("my_invited_count");
      return (data as number | null) ?? 0;
    },
  });

  const link =
    prof?.referral_code && typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${prof.referral_code}`
      : "";

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Invite link copied");
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Quill",
          text: "Write your novel on Quill — we both get a free month of Pro:",
          url: link,
        });
      } catch {
        // Closing the native share sheet is not an error.
      }
    } else copy();
  };
  const submit = async () => {
    if (!code.trim()) return;
    setRedeeming(true);
    const r = await redeemCode(code);
    setRedeeming(false);
    if (r.ok) {
      toast.success("🎉 30 days of Pro added");
      refetch();
      setCode("");
    } else toast.error(r.error?.replace(/_/g, " ") ?? "Could not redeem");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <p className="text-sm text-muted-foreground">Sign in to invite friends.</p>
        <Link to="/auth" className="mt-3 inline-block text-sm text-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const bonusActive =
    prof?.bonus_pro_until && new Date(prof.bonus_pro_until).getTime() > Date.now();

  return (
    <div className="mx-auto max-w-md min-h-screen pb-32">
      <header className="sticky top-0 z-10 flex items-center gap-2 bg-paper/90 backdrop-blur border-b border-border px-3 py-2.5">
        <Link
          to="/profile"
          aria-label="Back to profile"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="font-serif text-sm">Invite & Earn</div>
      </header>
      <h1 className="sr-only">Invite friends and earn Pro months</h1>

      <div className="px-5 pt-6 space-y-5">
        <div className="paper-card p-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-serif text-2xl">Give a month, get a month</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            When a writer signs up with your link, you both get 30 days of Quill Pro — free.
          </p>
        </div>

        <div className="paper-card p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Your link</div>
          <div className="mt-2 flex gap-2">
            <Input value={link} readOnly className="font-mono text-xs" />
            <Button
              onClick={copy}
              aria-label="Copy invite link"
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={share} className="mt-3 w-full rounded-full">
            Share invite
          </Button>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-accent/40 p-3">
              <div className="text-2xl font-serif">{invitedCount}</div>
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> Invited
              </div>
            </div>
            <div className="rounded-xl bg-accent/40 p-3">
              <div className="text-2xl font-serif">{bonusActive ? "Pro" : "—"}</div>
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Bonus active
              </div>
            </div>
          </div>
        </div>

        {!prof?.referred_by && (
          <div className="paper-card p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Have a code?
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="friend's code"
                className="font-mono"
              />
              <Button onClick={submit} disabled={redeeming} className="rounded-full">
                Redeem
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              One-time only. Both of you get 30 days of Pro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
