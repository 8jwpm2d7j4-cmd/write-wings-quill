import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { toast } from "sonner";

export function TipJar({ authorId, manuscriptId, authorName }: { authorId: string; manuscriptId: string; authorName: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { openCheckout, checkoutElement } = useStripeCheckout();

  const tip = (priceId: string, label: string) => {
    if (!user) { toast.error("Sign in to tip"); return; }
    if (user.id === authorId) { toast.error("You can't tip yourself"); return; }
    setOpen(false);
    openCheckout({
      priceId,
      customerEmail: user.email,
      userId: user.id,
      metadata: {
        kind: "tip",
        toUserId: authorId,
        manuscriptId,
      },
      title: `Tip ${authorName} — ${label}`,
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="rounded-full">
        <Heart className="mr-2 h-4 w-4" /> Tip the author
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Tip {authorName}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">A small thanks goes a long way.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { id: "tip_3", label: "$3" },
              { id: "tip_5", label: "$5" },
              { id: "tip_10", label: "$10" },
            ].map((t) => (
              <Button
                key={t.id}
                onClick={() => tip(t.id, t.label)}
                className="rounded-full h-12 font-serif text-lg"
              >
                {t.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {checkoutElement}
    </>
  );
}
