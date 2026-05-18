-- Wipe Paddle-referenced rows (preview/sandbox only; no live customers yet on Stripe)
delete from public.subscriptions;
delete from public.tips;
delete from public.chapter_unlocks;

-- Rename Paddle columns to Stripe equivalents
alter table public.subscriptions rename column paddle_subscription_id to stripe_subscription_id;
alter table public.subscriptions rename column paddle_customer_id to stripe_customer_id;
alter table public.tips rename column paddle_transaction_id to stripe_session_id;
alter table public.chapter_unlocks rename column paddle_transaction_id to stripe_session_id;