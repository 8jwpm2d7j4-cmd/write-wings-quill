import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Check, Crown, ArrowLeft, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { createPortalSession } from "@/lib/portal.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { toast } from "sonner";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Upgrade to Quill Pro — Unlimited AI, contests & more" },
      {
        name: "description",
        content:
          "Become a Quill Pro member for $6/mo. Unlimited AI assists, AI narration, beta-reader invites, and entry to monthly writing contests.",
      },
      { property: "og:title", content: "Upgrade to Quill Pro" },
      {
        property: "og:description",
        content:
          "Unlimited AI assists, AI narration, beta-reader invites, and contest entries — $6/mo.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <Upgrade />
    </AppShell>
  ),
});

const FEATURES = [
  "Unlimited AI writing assists",
  "AI narration (text-to-speech)",
  "Members-only monthly writing contests",
  "Beta-reader invite links",
  "Priority support",
];

function Upgrade() {
  const { user } = useAuth();
  const { isPro, subscription, loading } = useSubscription();
  const openPortal = useServerFn(createPortalSession);
  const [portalLoading, setPortalLoading] = useState(false);
  const [yearly, setYearly] = useState(false);
  const { openCheckout, checkoutElement } = useStripeCheckout();

  const subscribe = () => {
    if (!user) return;
    openCheckout({
      priceId: yearly ? "quill_pro_yearly" : "quill_pro_monthly",
      customerEmail: user.email,
      userId: user.id,
      title: yearly ? "Quill Pro — Yearly" : "Quill Pro — Monthly",
    });
  };

  const manage = async () => {
    setPortalLoading(true);
    try {
      const result = await openPortal({ data: { environment: getStripeEnvironment() } });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open portal");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="px-5 pt-12 pb-10">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="mt-4 paper-card p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground">
          <Crown className="h-6 w-6" />
        </div>
        <h1 className="mt-3 font-serif text-3xl">Quill Pro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to finish and share your book.
        </p>
        <div className="mt-4 inline-flex rounded-full border border-border p-1 text-xs">
          <button
            onClick={() => setYearly(false)}
            className={`px-3 py-1 rounded-full ${!yearly ? "bg-primary text-primary-foreground" : ""}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-3 py-1 rounded-full ${yearly ? "bg-primary text-primary-foreground" : ""}`}
          >
            Yearly · save $12
          </button>
        </div>
        <div className="mt-3 flex items-baseline justify-center gap-1">
          <span className="font-serif text-5xl">{yearly ? "$60" : "$6"}</span>
          <span className="text-muted-foreground">/{yearly ? "year" : "month"}</span>
        </div>

        <ul className="mt-6 space-y-2.5 text-left">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          {loading ? (
            <Button disabled className="w-full rounded-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : isPro ? (
            <div className="space-y-3">
              <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                You're a Pro member ✦
              </div>
              {subscription?.cancel_at_period_end && subscription.current_period_end && (
                <p className="text-xs text-muted-foreground">
                  Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
              <Button
                onClick={manage}
                disabled={portalLoading}
                variant="outline"
                className="w-full rounded-full"
              >
                {portalLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Manage subscription
              </Button>
            </div>
          ) : (
            <Button onClick={subscribe} disabled={!user} className="w-full rounded-full">
              <Crown className="mr-2 h-4 w-4" />
              {user ? `Upgrade — ${yearly ? "$60/yr" : "$6/mo"}` : "Sign in to upgrade"}
            </Button>
          )}
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Cancel anytime. Pro access continues until the end of your billing period.
        </p>
      </div>
      {checkoutElement}
    </div>
  );
}
