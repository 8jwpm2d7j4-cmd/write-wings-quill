import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type Stripe from "stripe";

function priceLookupFrom(item: Stripe.SubscriptionItem | undefined): string | undefined {
  return item?.price.lookup_key || item?.price.metadata?.lovable_external_id || item?.price.id;
}

function expandableId(value: string | { id: string } | null | undefined): string | undefined {
  return typeof value === "string" ? value : value?.id;
}

function ensureDb(result: { error: { message: string } | null }, label: string): void {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
}

async function handleSubscriptionUpserted(subscription: Stripe.Subscription, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata", subscription.id);
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = priceLookupFrom(item);
  if (!item || !priceId) return;
  const productId =
    typeof item.price.product === "string" ? item.price.product : item.price.product.id;
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const periodStart = item.current_period_start;
  const periodEnd = item.current_period_end;

  ensureDb(
    await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        product_id: productId,
        price_id: priceId,
        status: subscription.status,
        current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    ),
    "Subscription upsert failed",
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, env: StripeEnv) {
  ensureDb(
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subscription.id)
      .eq("environment", env),
    "Subscription cancellation failed",
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, env: StripeEnv) {
  if (session.mode !== "payment") return; // subscriptions handled by customer.subscription.*
  const md = session.metadata || {};
  const kind = md.kind;
  const userId = md.userId;
  if (!userId || !kind) return;

  const amountCents: number = session.amount_total ?? 0;
  if (!amountCents) return;

  if (kind === "tip") {
    const toUserId = md.toUserId;
    if (!toUserId || toUserId === userId) {
      console.warn("Skipping tip: invalid toUserId", { toUserId, userId });
      return;
    }
    ensureDb(
      await supabaseAdmin.from("tips").upsert(
        {
          from_user_id: userId,
          to_user_id: toUserId,
          manuscript_id: md.manuscriptId || null,
          amount_cents: amountCents,
          stripe_session_id: session.id,
          environment: env,
        },
        { onConflict: "stripe_session_id" },
      ),
      "Tip fulfillment failed",
    );
    ensureDb(
      await supabaseAdmin
        .from("user_achievements")
        .upsert({ user_id: userId, code: "first_tip" }, { onConflict: "user_id,code" }),
      "Tip achievement failed",
    );
    ensureDb(
      await supabaseAdmin.from("notifications").insert({
        user_id: toUserId,
        actor_id: userId,
        kind: "tip_received",
        manuscript_id: md.manuscriptId || null,
        message: `You received a $${(amountCents / 100).toFixed(2)} tip ✦`,
      }),
      "Tip notification failed",
    );
  } else if (kind === "chapter_unlock") {
    const chapterId = md.chapterId;
    if (!chapterId) return;

    const chapterResult = await supabaseAdmin
      .from("chapters")
      .select("manuscript_id, title, is_paid, unlock_price_cents, manuscripts!inner(author_id)")
      .eq("id", chapterId)
      .maybeSingle();
    ensureDb(chapterResult, "Chapter lookup failed");
    const ch = chapterResult.data;

    if (!ch || !ch.is_paid) {
      console.warn("Skipping chapter_unlock: chapter not eligible", { chapterId });
      return;
    }
    const expected = ch.unlock_price_cents ?? 0;
    if (amountCents !== expected) {
      throw new Error(
        `Chapter payment amount mismatch: chapter=${chapterId} paid=${amountCents} expected=${expected}`,
      );
    }

    ensureDb(
      await supabaseAdmin.from("chapter_unlocks").upsert(
        {
          user_id: userId,
          chapter_id: chapterId,
          amount_cents: amountCents,
          stripe_session_id: session.id,
          environment: env,
        },
        { onConflict: "user_id,chapter_id" },
      ),
      "Chapter unlock fulfillment failed",
    );

    const authorId = ch.manuscripts.author_id;
    if (authorId && authorId !== userId) {
      ensureDb(
        await supabaseAdmin.from("notifications").insert({
          user_id: authorId,
          actor_id: userId,
          kind: "chapter_purchased",
          manuscript_id: ch.manuscript_id,
          message: `A reader unlocked "${ch.title}" for $${(amountCents / 100).toFixed(2)}`,
        }),
        "Chapter purchase notification failed",
      );
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, env: StripeEnv) {
  const subscriptionId =
    expandableId(invoice.parent?.subscription_details?.subscription) ||
    expandableId(invoice.lines?.data?.[0]?.subscription) ||
    expandableId(invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription);
  if (!subscriptionId) return;
  const subscriptionResult = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .eq("environment", env)
    .maybeSingle();
  ensureDb(subscriptionResult, "Subscription lookup failed");
  const sub = subscriptionResult.data;
  const userId = sub?.user_id;
  if (!userId) return;
  ensureDb(
    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      actor_id: null,
      kind: "payment_failed",
      message: "A payment failed. Please update your payment method to keep Pro active.",
    }),
    "Payment failure notification failed",
  );
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpserted(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object, env);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env query parameter:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
