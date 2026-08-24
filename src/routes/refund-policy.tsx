import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Quill" },
      {
        name: "description",
        content: "Quill's 30-day money-back guarantee for Pro subscriptions.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-stone">
      <Link to="/" className="text-sm text-muted-foreground">
        ← Back
      </Link>
      <h1 className="font-serif text-4xl mt-4">Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: May 18, 2026</p>

      <h2>30-day money-back guarantee</h2>
      <p>
        Quill, operated by <strong>Sarah Zimmerman</strong>, offers a 30-day money-back guarantee on
        Quill Pro subscriptions. If you are not satisfied with your purchase, you can request a full
        refund within 30 days of your order date.
      </p>

      <h2>How to request a refund</h2>
      <p>
        To request a refund, contact our support team using the email address you used to subscribe
        and we will process the refund through our payment provider, Stripe.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel your subscription at any time from the{" "}
        <Link to="/upgrade">Manage subscription</Link> page. After cancellation, your Pro access
        continues until the end of the current billing period.
      </p>
    </div>
  );
}
