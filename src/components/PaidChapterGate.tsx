import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { toast } from "sonner";

const PRICE_FOR_CENTS: Record<number, string> = {
  99: "chapter_unlock_99",
  199: "chapter_unlock_199",
  299: "chapter_unlock_299",
};

export function PaidChapterGate({ chapterId, chapterTitle, priceCents }: { chapterId: string; chapterTitle: string; priceCents: number }) {
  const { user } = useAuth();
  const { openCheckout, checkoutElement } = useStripeCheckout();
  const priceId = PRICE_FOR_CENTS[priceCents] ?? "chapter_unlock_99";

  const buy = () => {
    if (!user) { toast.error("Sign in to unlock"); return; }
    openCheckout({
      priceId,
      customerEmail: user.email,
      userId: user.id,
      metadata: {
        kind: "chapter_unlock",
        chapterId,
      },
      title: `Unlock "${chapterTitle}"`,
    });
  };

  return (
    <>
      <div className="paper-card p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-serif text-xl">{chapterTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Premium chapter — unlock to keep reading.</p>
        <Button onClick={buy} className="mt-4 rounded-full w-full">
          Unlock for ${(priceCents / 100).toFixed(2)}
        </Button>
      </div>
      {checkoutElement}
    </>
  );
}
