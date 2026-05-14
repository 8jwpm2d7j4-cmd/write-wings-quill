import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { toast } from "sonner";

const PRICE_FOR_CENTS: Record<number, string> = {
  99: "chapter_unlock_99",
  199: "chapter_unlock_199",
  299: "chapter_unlock_299",
};

export function PaidChapterGate({ chapterId, chapterTitle, priceCents }: { chapterId: string; chapterTitle: string; priceCents: number }) {
  const { user } = useAuth();
  const { openCheckout, loading } = usePaddleCheckout();
  const priceId = PRICE_FOR_CENTS[priceCents] ?? "chapter_unlock_99";

  const buy = async () => {
    if (!user) { toast.error("Sign in to unlock"); return; }
    await openCheckout({
      priceId,
      customerEmail: user.email,
      customData: {
        userId: user.id,
        kind: "chapter_unlock",
        chapterId,
        amountCents: String(priceCents),
      },
      successUrl: `${window.location.origin}/checkout/success?kind=unlock`,
    });
  };

  return (
    <div className="paper-card p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
        <Lock className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-serif text-xl">{chapterTitle}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Premium chapter — unlock to keep reading.</p>
      <Button onClick={buy} disabled={loading} className="mt-4 rounded-full w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Unlock for ${(priceCents / 100).toFixed(2)}
      </Button>
    </div>
  );
}
