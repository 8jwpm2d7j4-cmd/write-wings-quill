import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trophy, Sparkles, Crown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscribeButton } from "@/components/SubscribeButton";
import type { Database } from "@/integrations/supabase/types";

type Contest = Database["public"]["Tables"]["contests"]["Row"];
type ContestEntry = Database["public"]["Tables"]["contest_entries"]["Row"];
type ManuscriptOption = Pick<
  Database["public"]["Tables"]["manuscripts"]["Row"],
  "id" | "title" | "word_count"
>;

export const Route = createFileRoute("/contests")({
  component: () => (
    <AppShell>
      <Contests />
    </AppShell>
  ),
});

function Contests() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: contests = [] } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => (await supabase.from("contests").select("*").order("ends_at")).data ?? [],
  });

  const { isPro, subscription } = useSubscription();

  const { data: myEntries = [] } = useQuery({
    queryKey: ["my-entries", user?.id],
    queryFn: async () =>
      user
        ? ((await supabase.from("contest_entries").select("*").eq("user_id", user.id)).data ?? [])
        : [],
    enabled: !!user,
  });

  return (
    <div className="px-5 pt-12">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h1 className="font-serif text-3xl">Contests</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Monthly prizes for the best new writing.</p>

      {!isPro ? (
        <section className="mt-6 paper-card p-5 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg">Quill Pro</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            $6/mo · Enter members-only contests, unlimited AI assists, AI narration, beta-reader
            invites.
          </p>
          <SubscribeButton className="mt-4 w-full rounded-full" />
        </section>
      ) : (
        <section className="mt-6 paper-card p-4 flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="font-serif">You're a Quill Pro member ✨</div>
            {subscription?.cancel_at_period_end && subscription.current_period_end && (
              <div className="text-xs text-muted-foreground">
                Access until {new Date(subscription.current_period_end).toLocaleDateString()}
              </div>
            )}
          </div>
        </section>
      )}

      <ul className="mt-6 space-y-4">
        {contests.map((c) => (
          <ContestCard
            key={c.id}
            contest={c}
            isPro={isPro}
            myEntries={myEntries}
            onChange={() => qc.invalidateQueries({ queryKey: ["my-entries", user?.id] })}
          />
        ))}
        {contests.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No active contests right now — check back soon.
          </p>
        )}
      </ul>
    </div>
  );
}

function ContestCard({
  contest,
  isPro,
  myEntries,
  onChange,
}: {
  contest: Contest;
  isPro: boolean;
  myEntries: ContestEntry[];
  onChange: () => void;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: manuscripts = [] } = useQuery({
    queryKey: ["my-ms", user?.id],
    queryFn: async () =>
      user
        ? ((
            await supabase
              .from("manuscripts")
              .select("id,title,word_count")
              .eq("author_id", user.id)
          ).data ?? [])
        : [],
    enabled: !!user && open,
  });

  const daysLeft = Math.max(0, Math.ceil((+new Date(contest.ends_at) - Date.now()) / 86400000));
  const entered = myEntries.some((e) => e.contest_id === contest.id);
  const locked = contest.members_only && !isPro;

  const submit = async (manuscript_id: string, word_count: number) => {
    if (word_count < contest.min_words || word_count > contest.max_words) {
      toast.error(`Word count must be ${contest.min_words}–${contest.max_words}`);
      return;
    }
    const { error } = await supabase
      .from("contest_entries")
      .insert({ contest_id: contest.id, manuscript_id, user_id: user!.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Entry submitted ✨");
      setOpen(false);
      onChange();
    }
  };

  return (
    <li className="paper-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {daysLeft}d left
        </div>
        {contest.members_only && (
          <span className="text-[10px] uppercase tracking-widest text-primary flex items-center gap-1">
            <Crown className="h-3 w-3" /> Pro
          </span>
        )}
      </div>
      <h3 className="mt-2 font-serif text-xl">{contest.title}</h3>
      <p className="mt-1 text-sm text-foreground/85">{contest.theme}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {contest.min_words}–{contest.max_words} words · 🏆 {contest.prize}
      </p>

      {entered ? (
        <Button disabled className="mt-4 w-full rounded-full">
          ✓ Entered
        </Button>
      ) : locked ? (
        <Button disabled variant="outline" className="mt-4 w-full rounded-full">
          <Crown className="mr-2 h-4 w-4" /> Pro members only
        </Button>
      ) : !user ? (
        <Link to="/auth">
          <Button className="mt-4 w-full rounded-full">Sign in to enter</Button>
        </Link>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="mt-4 w-full rounded-full">
              <Sparkles className="mr-2 h-4 w-4" /> Submit entry
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="text-left">
              <SheetTitle className="font-serif text-2xl">Pick a manuscript</SheetTitle>
            </SheetHeader>
            <ul className="mt-4 space-y-2">
              {(manuscripts as ManuscriptOption[]).map((m) => {
                const ok = m.word_count >= contest.min_words && m.word_count <= contest.max_words;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => submit(m.id, m.word_count)}
                      disabled={!ok}
                      className="w-full text-left paper-card p-3 hover:bg-accent disabled:opacity-50"
                    >
                      <div className="font-serif">{m.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {m.word_count} words {!ok && "· out of range"}
                      </div>
                    </button>
                  </li>
                );
              })}
              {manuscripts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No manuscripts yet. Start writing first.
                </p>
              )}
            </ul>
          </SheetContent>
        </Sheet>
      )}
    </li>
  );
}
