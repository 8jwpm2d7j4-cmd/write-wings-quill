import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { toast } from "sonner";

export function TipJar({ authorId, manuscriptId, authorName }: { authorId: string; manuscriptId: string; authorName: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { openCheckout, loading } = usePaddleCheckout();

  const tip = async (priceId: string, cents: number) => {
    if (!user) { toast.error("Sign in to tip"); return; }
    if (user.id === authorId) { toast.error("You can't tip yourself"); return; }
    await openCheckout({
      priceId,
      customerEmail: user.email,
      customData: {
        userId: user.id,
        kind: "tip",
        toUserId: authorId,
        manuscriptId,
        amountCents: String(cents),
      },
      successUrl: `${window.location.origin}/checkout/success?kind=tip`,
    });
    setOpen(false);
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
              { id: "tip_3", label: "$3", c: 300 },
              { id: "tip_5", label: "$5", c: 500 },
              { id: "tip_10", label: "$10", c: 1000 },
            ].map((t) => (
              <Button key={t.id} disabled={loading} onClick={() => tip(t.id, t.c)} className="rounded-full h-12 font-serif text-lg">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
