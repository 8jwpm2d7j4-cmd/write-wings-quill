import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export function SubscribeButton({
  className,
  label = "Upgrade to Pro — $6/mo",
  priceId = "quill_pro_monthly",
}: {
  className?: string;
  label?: string;
  priceId?: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, checkoutElement } = useStripeCheckout();

  const onClick = () => {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email,
      userId: user.id,
      title: "Upgrade to Quill Pro",
    });
  };

  return (
    <>
      <Button onClick={onClick} className={className}>
        <Crown className="mr-2 h-4 w-4" />
        {label}
      </Button>
      {checkoutElement}
    </>
  );
}
