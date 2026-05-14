import { Flag } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const REASONS = ["Spam", "Hate or harassment", "Sexual content", "Copyright", "Other"];

export function ReportButton({ manuscriptId, commentId, label = "Report" }: { manuscriptId?: string; commentId?: string; label?: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!user) { toast.error("Sign in to report"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("content_reports").insert({
      reporter_id: user.id, manuscript_id: manuscriptId ?? null, comment_id: commentId ?? null, reason, details,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Thanks — our team will review");
    setOpen(false); setDetails("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Flag className="h-3 w-3" />{label}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Report content</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {REASONS.map((r) => (
              <button key={r} onClick={() => setReason(r)} className={`rounded-full border px-3 py-1.5 text-xs ${reason === r ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{r}</button>
            ))}
          </div>
          <Textarea placeholder="Anything else we should know?" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={submitting} className="rounded-full">Submit report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
