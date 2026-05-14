import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Quill Pro from $6/month" },
      { name: "description", content: "Quill Pro: unlimited AI assists, AI narration, beta-reader invites, and monthly contests. $6/month or $60/year." },
      { property: "og:title", content: "Pricing — Quill Pro" },
      { property: "og:description", content: "Unlimited AI assists, AI narration, beta-reader invites — $6/mo or $60/yr." },
    ],
  }),
  component: PricingPage,
});

const FEATURES = [
  "Unlimited AI writing assists",
  "AI narration (text-to-speech)",
  "Members-only monthly writing contests",
  "Beta-reader invite links",
  "Priority support",
];

function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 font-serif text-xl">
          <BookOpen className="h-5 w-5" /> Quill
        </Link>
        <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
      </header>

      <div className="mt-10 text-center">
        <h1 className="font-serif text-4xl tracking-tight">Simple, writer-friendly pricing</h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready to publish.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="paper-card p-6">
          <h2 className="font-serif text-2xl">Free</h2>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-5xl">$0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Write and publish chapters</li>
            <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Reader following and comments</li>
            <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> Limited AI assists</li>
            <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 text-primary shrink-0" /> EPUB export</li>
          </ul>
          <Link to="/auth" className="mt-6 block">
            <Button variant="outline" className="w-full rounded-full">Create free account</Button>
          </Link>
        </div>

        <div className="paper-card p-6 border-primary/30">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-2xl">Quill Pro</h2>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-5xl">$6</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-xs text-muted-foreground">or $60/year — save $12</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/auth" className="mt-6 block">
            <Button className="w-full rounded-full"><Crown className="mr-2 h-4 w-4" /> Get Quill Pro</Button>
          </Link>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Payments are processed by Paddle, our Merchant of Record.
      </p>

      <footer className="mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/refund-policy">Refunds</Link>
      </footer>
    </div>
  );
}
