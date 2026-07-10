import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { type StripeEnv, verifyWebhook } from '@/lib/stripe.server';

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

function priceLookupFrom(item: any): string | undefined {
  return (
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id
  );
}

async function handleSubscriptionUpserted(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error('No userId in subscription metadata', subscription.id);
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = priceLookupFrom(item);
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  );
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id)
    .eq('environment', env);
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  if (session.mode !== 'payment') return; // subscriptions handled by customer.subscription.*
  const md = session.metadata || {};
  const kind = md.kind;
  const userId = md.userId;
  if (!userId || !kind) return;

  const amountCents: number = session.amount_total ?? 0;
  if (!amountCents) return;

  if (kind === 'tip') {
    const toUserId = md.toUserId;
    if (!toUserId || toUserId === userId) {
      console.warn('Skipping tip: invalid toUserId', { toUserId, userId });
      return;
    }
    await getSupabase().from('tips').upsert({
      from_user_id: userId,
      to_user_id: toUserId,
      manuscript_id: md.manuscriptId || null,
      amount_cents: amountCents,
      stripe_session_id: session.id,
      environment: env,
    }, { onConflict: 'stripe_session_id' });
    await getSupabase().from('user_achievements').upsert(
      { user_id: userId, code: 'first_tip' }, { onConflict: 'user_id,code' }
    );
    await getSupabase().from('notifications').insert({
      user_id: toUserId,
      actor_id: userId,
      kind: 'tip_received',
      manuscript_id: md.manuscriptId || null,
      message: `You received a $${(amountCents / 100).toFixed(2)} tip ✦`,
    });
  } else if (kind === 'chapter_unlock') {
    const chapterId = md.chapterId;
    if (!chapterId) return;

    const { data: ch } = await getSupabase()
      .from('chapters')
      .select('manuscript_id, title, is_paid, unlock_price_cents, manuscripts!inner(author_id)')
      .eq('id', chapterId)
      .maybeSingle();

    if (!ch || !(ch as any).is_paid) {
      console.warn('Skipping chapter_unlock: chapter not eligible', { chapterId });
      return;
    }
    const expected = (ch as any).unlock_price_cents ?? 0;
    if (amountCents < expected) {
      console.warn('Skipping chapter_unlock: paid below chapter price', { chapterId, amountCents, expected });
      return;
    }

    await getSupabase().from('chapter_unlocks').upsert({
      user_id: userId,
      chapter_id: chapterId,
      amount_cents: amountCents,
      stripe_session_id: session.id,
      environment: env,
    }, { onConflict: 'user_id,chapter_id' });

    const authorId = (ch as any)?.manuscripts?.author_id;
    if (authorId && authorId !== userId) {
      await getSupabase().from('notifications').insert({
        user_id: authorId,
        actor_id: userId,
        kind: 'chapter_purchased',
        manuscript_id: (ch as any).manuscript_id,
        message: `A reader unlocked "${(ch as any).title}" for $${(amountCents / 100).toFixed(2)}`,
      });
    }
  }
}

async function handleInvoicePaymentFailed(invoice: any, env: StripeEnv) {
  const subscriptionId: string | undefined =
    invoice.subscription ||
    invoice.parent?.subscription_details?.subscription ||
    invoice.lines?.data?.[0]?.subscription ||
    invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription;
  if (!subscriptionId) return;
  const { data: sub } = await getSupabase()
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .eq('environment', env)
    .maybeSingle();
  const userId = (sub as any)?.user_id;
  if (!userId) return;
  await getSupabase().from('notifications').insert({
    user_id: userId,
    actor_id: null,
    kind: 'payment_failed',
    message: 'A payment failed. Please update your payment method to keep Pro active.',
  });
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpserted(event.data.object, env);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object, env);
      break;
    default:
      console.log('Unhandled event:', event.type);
  }
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get('env');
        if (rawEnv !== 'sandbox' && rawEnv !== 'live') {
          console.error('Webhook received with invalid env query parameter:', rawEnv);
          return Response.json({ received: true, ignored: 'invalid env' });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error('Webhook error:', e);
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});
