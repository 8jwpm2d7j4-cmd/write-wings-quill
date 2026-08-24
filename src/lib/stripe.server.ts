import Stripe from "stripe";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = "sandbox" | "live";

const GATEWAY_STRIPE_BASE = "https://connector-gateway.lovable.dev/stripe";

export function getConnectionApiKey(env: StripeEnv): string {
  return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = getEnv("LOVABLE_API_KEY");

  return new Stripe(connectionApiKey, {
    apiVersion: "2026-03-25.dahlia",
    httpClient: Stripe.createFetchHttpClient(((input: URL | RequestInfo, init?: RequestInit) => {
      const original =
        typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const gatewayUrl = original.replace("https://api.stripe.com", GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(new Headers(init?.headers).entries()),
          "X-Connection-Api-Key": connectionApiKey,
          "Lovable-API-Key": lovableApiKey,
        },
      });
    }) as typeof fetch),
  });
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;
    const raw = e.raw && typeof e.raw === "object" ? (e.raw as Record<string, unknown>) : undefined;
    const message = raw?.message ?? e.message;
    if (message) {
      const details = [
        raw?.type ?? e.type,
        raw?.code ?? e.code,
        raw?.decline_code ?? e.decline_code,
        raw?.param ?? e.param,
      ].filter(Boolean);
      const text = String(message);
      return details.length ? `${text} (${details.join(", ")})` : text;
    }
  }
  return "Stripe request failed";
}

export async function verifyWebhook(req: Request, env: StripeEnv): Promise<Stripe.Event> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret =
    env === "sandbox"
      ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
      : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");

  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const payload = new TextEncoder().encode(`${timestamp}.${body}`);
  const valid = await Promise.all(
    v1Signatures.map(async (candidate) => {
      if (!/^[a-f0-9]{64}$/i.test(candidate)) return false;
      const signatureBytes = Uint8Array.from(candidate.match(/.{2}/g)!, (byte) =>
        Number.parseInt(byte, 16),
      );
      return crypto.subtle.verify("HMAC", key, signatureBytes, payload);
    }),
  );
  if (!valid.some(Boolean)) throw new Error("Invalid webhook signature");

  return JSON.parse(body) as Stripe.Event;
}
