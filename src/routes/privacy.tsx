import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Quill" },
      { name: "description", content: "How Quill, operated by Sarah Zimmerman, collects and uses personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 prose prose-stone">
      <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
      <h1 className="font-serif text-4xl mt-4">Privacy Notice</h1>
      <p className="text-sm text-muted-foreground">Last updated: May 14, 2026</p>

      <h2>1. Who we are</h2>
      <p>
        Quill is operated by <strong>Sarah Zimmerman</strong>. We act as the data controller for
        personal data processed through the Service.
      </p>

      <h2>2. Personal data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name or pen name, email address, password hash.</li>
        <li><strong>Profile and content:</strong> bios, manuscripts, chapters, comments, reactions, follows.</li>
        <li><strong>Usage data:</strong> reading progress, streaks, device and browser information, IP address, log data.</li>
        <li><strong>Support data:</strong> messages you send us.</li>
        <li><strong>Payment metadata:</strong> subscription status and identifiers returned from our payment processor. Card details are collected and stored by the payment processor, not by us.</li>
      </ul>

      <h2>3. Why we process it</h2>
      <ul>
        <li>To create and operate your account (contract performance).</li>
        <li>To provide writing, AI, narration, and publishing features (contract performance).</li>
        <li>To prevent fraud and abuse and to keep the Service secure (legitimate interests).</li>
        <li>To improve and develop the Service (legitimate interests).</li>
        <li>To respond to your support requests (contract performance / legitimate interests).</li>
        <li>To send transactional and, where you have opted in, marketing emails (consent or legitimate interests).</li>
        <li>To comply with legal obligations (legal obligation).</li>
      </ul>

      <h2>4. Who we share it with</h2>
      <ul>
        <li><strong>Service providers / subprocessors:</strong> hosting, database, analytics, email, AI inference, and customer-support tools.</li>
        <li><strong>Stripe</strong> for payment processing, subscription management, tax compliance, fraud prevention, and invoicing.</li>
        <li><strong>Professional advisers</strong> (legal, accounting) where necessary.</li>
        <li><strong>Authorities</strong> where required by law.</li>
      </ul>

      <h2>5. International transfers</h2>
      <p>
        Some of our providers are located outside your country. Where personal data is transferred
        across borders, we rely on appropriate safeguards such as Standard Contractual Clauses or
        adequacy decisions.
      </p>

      <h2>6. Retention</h2>
      <p>
        We keep personal data for as long as your account is active and for a limited period afterwards
        to comply with legal obligations, resolve disputes, and enforce our agreements. Data that is
        no longer needed is deleted or anonymised.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, rectify, erase, restrict, or
        port your personal data, to object to processing, and to withdraw consent. You may also lodge
        a complaint with your local data-protection authority. We respond to verified requests within
        the period required by applicable law.
      </p>

      <h2>8. Security</h2>
      <p>
        We use appropriate technical and organisational measures, including encryption in transit,
        access controls, and audit logging, to protect personal data.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use essential cookies and local storage to keep you signed in and to remember preferences.
        We may use analytics cookies to understand how the Service is used. You can manage cookies
        through your browser settings.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy questions or to exercise your rights, contact Sarah Zimmerman through the in-app
        support channel. See also our <Link to="/terms">Terms</Link> and <Link to="/refund-policy">Refund Policy</Link>.
      </p>
    </div>
  );
}
