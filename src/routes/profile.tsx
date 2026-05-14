import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogOut, Trophy, BarChart3, Rss, Crown, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { AchievementWall } from "@/components/AchievementWall";

export const Route = createFileRoute("/profile")({ component: () => <AppShell><Profile /></AppShell> });

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isPro, subscription } = useSubscription();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).single()).data,
    enabled: !!user,
  });

  const [penName, setPenName] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => { if (profile) { setPenName(profile.pen_name); setBio(profile.bio ?? ""); } }, [profile?.id]); // eslint-disable-line

  const save = async () => {
    await supabase.from("profiles").update({ pen_name: penName, bio }).eq("id", user!.id);
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile saved");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl">Your profile</h1>

      <Link
        to="/upgrade"
        className="mt-5 flex items-center gap-3 paper-card p-4 hover:bg-accent/40 transition"
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
          <Crown className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-serif text-base leading-tight">
            {isPro ? "Quill Pro ✦" : "Upgrade to Quill Pro"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isPro
              ? subscription?.cancel_at_period_end && subscription.current_period_end
                ? `Cancels ${new Date(subscription.current_period_end).toLocaleDateString()}`
                : "Active membership · manage plan"
              : "Unlimited AI, contests & more — $6/mo"}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <div className="mt-6 paper-card p-5 space-y-4">
        <div className="space-y-1.5">
          <Label>Pen name</Label>
          <Input value={penName} onChange={(e) => setPenName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[80px]" placeholder="Tell readers about yourself" />
        </div>
        <Button onClick={save} className="w-full rounded-full">Save</Button>
      </div>

      <h2 className="mt-8 font-serif text-xl">Coming soon</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <ComingSoon icon={Trophy} title="Writing contests" subtitle="Compete monthly with prompts" />
        <ComingSoon icon={Mic} title="Voice dictation" subtitle="Speak your chapters" />
        <ComingSoon icon={Headphones} title="AI narration" subtitle="Hear your draft as audio" />
      </div>

      <Button variant="outline" onClick={signOut} className="mt-8 w-full rounded-full">
        <LogOut className="mr-2 h-4 w-4" />Sign out
      </Button>
    </div>
  );
}

function ComingSoon({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="paper-card p-4">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 font-serif text-sm leading-tight">{title}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{subtitle}</div>
    </div>
  );
}
