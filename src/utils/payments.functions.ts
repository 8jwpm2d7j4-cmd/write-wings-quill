import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type CheckoutResult = { clientSecret: string } | { error: string };

const SUBSCRIPTION_PRICES = new Set(["quill_pro_monthly", "quill_pro_yearly"]);
const TIP_PRICES = new Set(["tip_3", "tip_5", "tip_10"]);
const TIP_AMOUNT_BY_PRICE: Record<string, number> = { tip_3: 300, tip_5: 500, tip_10: 1000 };
const CHAPTER_PRICE_BY_CENTS: Record<number, string> = {
  99: "chapter_unlock_99",
  199: "chapter_unlock_199",
  299: "chapter_unlock_299",
};

async function validatePurchase(
  userId: string,
  priceId: string,
  metadata: Record<string, string>,
): Promise<Record<string, string>> {
  if (SUBSCRIPTION_PRICES.has(priceId)) return {};

  if (metadata.kind === "tip") {
    if (!TIP_PRICES.has(priceId) || !metadata.manuscriptId || !metadata.toUserId) {
      throw new Error("Invalid tip request");
    }
    const { data: manuscript, error } = await supabaseAdmin
      .from("manuscripts")
      .select("id,author_id,status")
      .eq("id", metadata.manuscriptId)
      .maybeSingle();
    if (error || !manuscript || manuscript.status !== "published") {
      throw new Error("This book is not available for tips");
    }
    if (manuscript.author_id !== metadata.toUserId || manuscript.author_id === userId) {
      throw new Error("Invalid tip recipient");
    }
    return {
      kind: "tip",
      toUserId: manuscript.author_id,
      manuscriptId: manuscript.id,
    };
  }

  if (metadata.kind === "chapter_unlock") {
    if (!metadata.chapterId) throw new Error("Missing chapter");
    const { data: chapter, error } = await supabaseAdmin
      .from("chapters")
      .select("id,is_paid,unlock_price_cents,manuscripts!inner(author_id,status)")
      .eq("id", metadata.chapterId)
      .maybeSingle();
    if (error || !chapter || !chapter.is_paid || chapter.manuscripts.status !== "published") {
      throw new Error("This chapter is not available for purchase");
    }
    if (chapter.manuscripts.author_id === userId) throw new Error("Authors already have access");
    const expectedPrice = CHAPTER_PRICE_BY_CENTS[chapter.unlock_price_cents ?? 99];
    if (!expectedPrice || priceId !== expectedPrice) throw new Error("Chapter price mismatch");
    return { kind: "chapter_unlock", chapterId: chapter.id };
  }

  throw new Error("Unsupported purchase type");
}

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId: string },
): Promise<string> {
  const found = await stripe.customers.search({
    query: `metadata['userId']:'${options.userId}'`,
    limit: 1,
  });
  if (found.data.length) return found.data[0].id;

  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    metadata: { userId: options.userId },
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      priceId: string;
      quantity?: number;
      returnUrl: string;
      environment: StripeEnv;
      metadata?: Record<string, string>;
    }) => {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
      return data;
    },
  )
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);

      // Identity is derived from the authenticated session; never trust client input for user attribution.
      const userId = context.userId;
      const customerEmail =
        typeof context.claims.email === "string" ? context.claims.email : undefined;

      const trustedMetadata = await validatePurchase(userId, data.priceId, data.metadata ?? {});

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0];
      const isRecurring = stripePrice.type === "recurring";

      if (
        trustedMetadata.kind === "tip" &&
        stripePrice.unit_amount !== TIP_AMOUNT_BY_PRICE[data.priceId]
      ) {
        throw new Error("Tip price is misconfigured");
      }
      if (trustedMetadata.kind === "chapter_unlock") {
        const expectedCents = Number(data.priceId.match(/(\d+)$/)?.[1]);
        if (!expectedCents || stripePrice.unit_amount !== expectedCents) {
          throw new Error("Chapter price is misconfigured");
        }
      }

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: customerEmail,
        userId,
      });

      let productDescription: string | undefined;
      if (!isRecurring) {
        const productId =
          typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        productDescription = product.name;
      }

      const mergedMetadata: Record<string, string> = {
        userId,
        ...trustedMetadata,
        managed_payments: "true",
      };

      const checkoutParams: Parameters<typeof stripe.checkout.sessions.create>[0] & {
        managed_payments: { enabled: boolean };
      } = {
        line_items: [{ price: stripePrice.id, quantity: data.quantity || 1 }],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        ...(!isRecurring &&
          productDescription && {
            payment_intent_data: { description: productDescription },
          }),
        metadata: mergedMetadata,
        ...(isRecurring && {
          subscription_data: { metadata: { userId } },
        }),
        managed_payments: { enabled: true },
      };
      const session = await stripe.checkout.sessions.create(checkoutParams);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
