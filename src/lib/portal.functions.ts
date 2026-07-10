import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type PortalResult = { url: string } | { error: string };

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv; returnUrl?: string }) => data)
  .handler(async ({ data, context }): Promise<PortalResult> => {
    try {
      const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data: sub } = await admin
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", context.userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!sub?.stripe_customer_id) return { error: "No subscription found" };

      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id as string,
        ...(data.returnUrl && { return_url: data.returnUrl }),
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
