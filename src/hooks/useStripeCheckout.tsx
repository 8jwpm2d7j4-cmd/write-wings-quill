import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeEmbeddedCheckoutPanel } from "@/components/StripeEmbeddedCheckout";

interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  userId?: string;
  returnUrl?: string;
  metadata?: Record<string, string>;
  title?: string;
}

export function useStripeCheckout() {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);
  const isOpen = options !== null;

  const openCheckout = useCallback((opts: CheckoutOptions) => {
    setOptions(opts);
  }, []);

  const closeCheckout = useCallback(() => setOptions(null), []);

  const checkoutElement = (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeCheckout(); }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-serif text-xl">
            {options?.title ?? "Complete your purchase"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {options && (
            <StripeEmbeddedCheckoutPanel
              priceId={options.priceId}
              quantity={options.quantity}
              customerEmail={options.customerEmail}
              userId={options.userId}
              returnUrl={options.returnUrl}
              metadata={options.metadata}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return { openCheckout, closeCheckout, isOpen, checkoutElement };
}
