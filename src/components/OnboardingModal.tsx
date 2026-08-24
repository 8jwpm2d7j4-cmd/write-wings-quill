import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Mystery",
  "Memoir",
  "Literary",
  "Historical",
  "YA",
  "Horror",
];

export function OnboardingModal() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [penName, setPenName] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [target, setTarget] = useState(500);

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("get_my_profile_settings")
      .maybeSingle()
      .then(({ data }) => {
        if (data && !data.onboarded) {
          setPenName(data.pen_name ?? "");
          setOpen(true);
        }
      });
  }, [user]);

  const finish = async () => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ pen_name: penName.trim() || "Anonymous", genres, onboarded: true })
      .eq("id", user.id);
    await supabase.from("writing_goals").update({ daily_target: target }).eq("user_id", user.id);
    toast.success("Welcome to Quill ✨");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => v || finish()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Welcome to Quill</DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">What name should appear on your books?</p>
            <Label>Pen name</Label>
            <Input
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              placeholder="e.g. J.R. Smith"
            />
            <Button
              className="w-full rounded-full"
              onClick={() => setStep(1)}
              disabled={!penName.trim()}
            >
              Next
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Pick a few genres you love.</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => {
                const on = genres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => setGenres((s) => (on ? s.filter((x) => x !== g) : [...s, g]))}
                    className={`px-3 py-1.5 rounded-full text-xs border ${on ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <Button className="w-full rounded-full" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Set a daily writing goal. Tiny progress beats marathons.
            </p>
            <Label>Words per day</Label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((n) => (
                <button
                  key={n}
                  onClick={() => setTarget(n)}
                  className={`rounded-full py-2 text-sm border ${target === n ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <Button className="w-full rounded-full" onClick={finish}>
              Start writing
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
