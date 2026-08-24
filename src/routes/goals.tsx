import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Flame,
  Target as TargetIcon,
  TrendingUp,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { StreakCalendar } from "@/components/StreakCalendar";

export const Route = createFileRoute("/goals")({
  component: () => (
    <AppShell>
      <Goals />
    </AppShell>
  ),
});

function Goals() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [target, setTarget] = useState(500);

  const { data: goals } = useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () =>
      (await supabase.from("writing_goals").select("*").eq("user_id", user!.id).single()).data,
    enabled: !!user,
  });
  useEffect(() => {
    if (goals?.daily_target) setTarget(goals.daily_target);
  }, [goals?.daily_target]);

  const { data: dailyLog = [] } = useQuery({
    queryKey: ["daily-log", user?.id],
    queryFn: async () =>
      (
        await supabase
          .from("daily_word_log")
          .select("date,words")
          .eq("user_id", user!.id)
          .order("date", { ascending: true })
          .limit(120)
      ).data ?? [],
    enabled: !!user,
  });

  const { data: manuscripts = [] } = useQuery({
    queryKey: ["manuscripts", user?.id],
    queryFn: async () =>
      (await supabase.from("manuscripts").select("word_count,updated_at").eq("author_id", user!.id))
        .data ?? [],
    enabled: !!user,
  });

  const totalWords = manuscripts.reduce((s, m) => s + (m.word_count ?? 0), 0);
  const todayWords = manuscripts
    .filter((m) => new Date(m.updated_at).toDateString() === new Date().toDateString())
    .reduce((s, m) => s + (m.word_count ?? 0), 0);
  const progress = Math.min(100, Math.round((todayWords / target) * 100));

  const save = async () => {
    await supabase.from("writing_goals").update({ daily_target: target }).eq("user_id", user!.id);
    qc.invalidateQueries({ queryKey: ["goals"] });
    toast.success("Goal updated");
  };

  return (
    <div className="px-5 pt-12">
      <h1 className="font-serif text-3xl">Writing goals</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tiny daily progress beats infrequent bursts.
      </p>

      <div className="mt-7 paper-card p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Today</div>
          <div className="inline-flex items-center gap-1 text-sm">
            <Flame className="h-4 w-4 text-primary" />
            {goals?.current_streak ?? 0} day streak
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="font-serif text-5xl">{todayWords.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">/ {target} words</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 paper-card p-5">
        <Label icon={TargetIcon}>Daily word target</Label>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-serif text-3xl">{target}</span>
          <span className="text-sm text-muted-foreground">words/day</span>
        </div>
        <Slider
          value={[target]}
          min={100}
          max={2500}
          step={50}
          onValueChange={(v) => setTarget(v[0])}
          className="mt-4"
        />
        <Button onClick={save} className="mt-4 w-full rounded-full">
          Save goal
        </Button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Activity
        </div>
        <StreakCalendar entries={dailyLog} target={target} />
      </div>

      <div className="mt-5 paper-card p-5">
        <Label icon={TrendingUp}>Total written</Label>
        <div className="mt-2 font-serif text-3xl">{totalWords.toLocaleString()} words</div>
        <p className="mt-1 text-sm text-muted-foreground">
          across {manuscripts.length} {manuscripts.length === 1 ? "work" : "works"}
        </p>
      </div>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest text-muted-foreground inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}
