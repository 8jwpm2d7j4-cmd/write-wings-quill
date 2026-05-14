import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";

export function SubscribeButton({ className, label = "Upgrade to Pro — $6/mo" }: { className?: string; label?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading } = usePaddleCheckout();

  const onClick = async () => {
    if (!user) { navigate({ to: "/auth" }); return; }
    await openCheckout({
      priceId: "quill_pro_monthly",
      customerEmail: user.email,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/checkout/success`,
    });
  };

  return (
    <Button onClick={onClick} disabled={loading} className={className}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
