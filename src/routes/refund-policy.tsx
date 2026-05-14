import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Quill" },
      { name: "description", content: "Quill's 30-day money-back guarantee, processed by Paddle." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-stone">
      <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
      <h1 className="font-serif text-4xl mt-4">Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: May 14, 2026</p>

      <h2>30-day money-back guarantee</h2>
      <p>
        Quill, operated by <strong>Sarah Zimmerman</strong>, offers a 30-day money-back guarantee on
        Quill Pro subscriptions. If you are not satisfied with your purchase, you can request a full
        refund within 30 days of your order date.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Refunds are processed by our payment provider, <strong>Paddle</strong>, who is the Merchant
        of Record for all Quill orders. To request a refund, visit{" "}
        <a href="https://paddle.net" target="_blank" rel="noreferrer">paddle.net</a> using the email
        address you used to subscribe, or contact our support team and we will help you submit the
        request.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel your subscription at any time from the{" "}
        <Link to="/upgrade">Manage subscription</Link> page. After cancellation, your Pro access
        continues until the end of the current billing period.
      </p>

      <h2>More information</h2>
      <p>
        Refund handling is also governed by Paddle's{" "}
        <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noreferrer">
          Refund Policy
        </a>{" "}
        and the{" "}
        <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noreferrer">
          Paddle Buyer Terms
        </a>.
      </p>
    </div>
  );
}
