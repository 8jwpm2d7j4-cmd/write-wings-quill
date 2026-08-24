import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Quill" },
      { name: "description", content: "Terms of Service for Quill, operated by Sarah Zimmerman." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-stone">
      <Link to="/" className="text-sm text-muted-foreground">
        ← Back
      </Link>
      <h1 className="font-serif text-4xl mt-4">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: May 14, 2026</p>

      <h2>1. Who we are</h2>
      <p>
        Quill (the "Service") is operated by <strong>Sarah Zimmerman</strong> ("we", "us", "our").
        By creating an account or using the Service, you ("you", "user") agree to these Terms of
        Service.
      </p>

      <h2>2. Acceptance</h2>
      <p>
        By continuing to access or use the Service, you confirm that you accept these Terms and that
        you have the authority and legal capacity to do so. If you do not agree, do not use the
        Service.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You must not misuse the Service. In particular, you must not:</p>
      <ul>
        <li>use the Service for any unlawful, fraudulent, harmful, or abusive purpose;</li>
        <li>
          upload, distribute, or generate content that infringes intellectual property rights,
          contains malware, or is defamatory, hateful, or sexually exploitative of minors;
        </li>
        <li>send spam or unsolicited communications;</li>
        <li>probe, scan, scrape, or interfere with the security or integrity of the Service.</li>
      </ul>

      <h2>4. Generative AI features</h2>
      <p>
        Quill includes AI-assisted drafting, narration, and cover generation. You are responsible
        for the prompts you submit, for verifying the accuracy of any AI output, and for ensuring
        you have the rights to any input content you provide. AI output may be inaccurate or
        incomplete and is not a substitute for professional advice. We may filter, restrict, or
        refuse outputs and may suspend accounts for repeated or serious misuse, including
        infringement complaints. Rights holders may contact us to request takedown of infringing
        output.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        We retain ownership of the Service, including its software, design, branding, and
        documentation. You retain ownership of the content you create with Quill. You grant us a
        limited licence to host, store, and process your content solely to operate and improve the
        Service.
      </p>

      <h2>6. Service availability</h2>
      <p>
        We work to keep Quill running smoothly but do not guarantee uninterrupted or error-free
        access. Features may change, and we may update or discontinue parts of the Service.
      </p>

      <h2>7. Payments and subscriptions</h2>
      <p>
        Payments are processed by <strong>Stripe</strong>. Billing, taxes, renewals, cancellations,
        and refunds are governed by the{" "}
        <a href="https://stripe.com/legal/consumer" target="_blank" rel="noreferrer">
          Stripe Services Consumer Terms
        </a>{" "}
        and our <Link to="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>8. Suspension and termination</h2>
      <p>
        We may suspend or terminate your access if you materially breach these Terms, fail to pay,
        pose a security or fraud risk, or repeatedly violate our policies. You may stop using the
        Service at any time.
      </p>

      <h2>9. Disclaimers and liability</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. To the fullest extent
        permitted by law, our aggregate liability for any claim relating to the Service is limited
        to the fees you paid to us in the twelve months before the event giving rise to the claim.
        We are not liable for indirect, consequential, or special damages.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be communicated through
        the Service.
      </p>

      <h2>11. Contact</h2>
      <p>Questions? Contact Sarah Zimmerman through the in-app support channel.</p>
    </div>
  );
}
