import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhook, EventName, type PaddleEnv } from '@/lib/paddle.server';

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

async function handleSubscriptionCreated(data: any, env: PaddleEnv) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;
  const userId = customData?.userId;
  if (!userId) return console.error('No userId in customData');
  const item = items[0];
  const priceId = item.price.importMeta?.externalId;
  const productId = item.product.importMeta?.externalId;
  if (!priceId || !productId) return console.warn('Skipping subscription: missing importMeta.externalId');
  await getSupabase().from('subscriptions').upsert({
    user_id: userId, paddle_subscription_id: id, paddle_customer_id: customerId,
    product_id: productId, price_id: priceId, status,
    current_period_start: currentBillingPeriod?.startsAt,
    current_period_end: currentBillingPeriod?.endsAt,
    environment: env, updated_at: new Date().toISOString(),
  }, { onConflict: 'paddle_subscription_id' });
}

async function handleSubscriptionUpdated(data: any, env: PaddleEnv) {
  const { id, status, currentBillingPeriod, scheduledChange } = data;
  await getSupabase().from('subscriptions').update({
    status, current_period_start: currentBillingPeriod?.startsAt,
    current_period_end: currentBillingPeriod?.endsAt,
    cancel_at_period_end: scheduledChange?.action === 'cancel',
    updated_at: new Date().toISOString(),
  }).eq('paddle_subscription_id', id).eq('environment', env);
}

async function handleSubscriptionCanceled(data: any, env: PaddleEnv) {
  await getSupabase().from('subscriptions').update({
    status: 'canceled', updated_at: new Date().toISOString(),
  }).eq('paddle_subscription_id', data.id).eq('environment', env);
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  const { id, customData } = data;
  if (!customData) return;
  const kind = customData.kind;
  const userId = customData.userId;
  const amountCents = parseInt(customData.amountCents || '0', 10);
  if (!userId || !amountCents) return;

  if (kind === 'tip') {
    const toUserId = customData.toUserId;
    if (!toUserId || toUserId === userId) {
      console.warn('Skipping tip: invalid toUserId', { toUserId, userId });
      return;
    }
    await getSupabase().from('tips').upsert({
      from_user_id: userId,
      to_user_id: toUserId,
      manuscript_id: customData.manuscriptId || null,
      amount_cents: amountCents,
      paddle_transaction_id: id,
      environment: env,
    }, { onConflict: 'paddle_transaction_id' });
    await getSupabase().from('user_achievements').upsert(
      { user_id: userId, code: 'first_tip' }, { onConflict: 'user_id,code' }
    );
    await getSupabase().from('notifications').insert({
      user_id: toUserId,
      actor_id: userId,
      kind: 'tip_received',
      manuscript_id: customData.manuscriptId || null,
      message: `You received a $${(amountCents / 100).toFixed(2)} tip ✦`,
    });
  } else if (kind === 'chapter_unlock') {
    const chapterId = customData.chapterId;
    if (!chapterId) return;
    await getSupabase().from('chapter_unlocks').upsert({
      user_id: userId,
      chapter_id: chapterId,
      amount_cents: amountCents,
      paddle_transaction_id: id,
      environment: env,
    }, { onConflict: 'user_id,chapter_id' });
    const { data: ch } = await getSupabase()
      .from('chapters')
      .select('manuscript_id, title, manuscripts!inner(author_id)')
      .eq('id', chapterId)
      .maybeSingle();
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

async function handlePaymentFailed(data: any, env: PaddleEnv) {
  const { customData, subscriptionId } = data;
  let userId: string | undefined = customData?.userId;
  if (!userId && subscriptionId) {
    const { data: sub } = await getSupabase()
      .from('subscriptions')
      .select('user_id')
      .eq('paddle_subscription_id', subscriptionId)
      .eq('environment', env)
      .maybeSingle();
    userId = (sub as any)?.user_id;
  }
  if (!userId) return;
  await getSupabase().from('notifications').insert({
    user_id: userId,
    actor_id: null,
    kind: 'payment_failed',
    message: 'A payment failed. Please update your payment method to keep Pro active.',
  });
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.eventType) {
    case EventName.SubscriptionCreated: await handleSubscriptionCreated(event.data, env); break;
    case EventName.SubscriptionUpdated: await handleSubscriptionUpdated(event.data, env); break;
    case EventName.SubscriptionCanceled: await handleSubscriptionCanceled(event.data, env); break;
    case EventName.TransactionCompleted: await handleTransactionCompleted(event.data, env); break;
    case EventName.TransactionPaymentFailed: await handlePaymentFailed(event.data, env); break;
    default: console.log('Unhandled event:', event.eventType);
  }
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error('Webhook error:', e);
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});
