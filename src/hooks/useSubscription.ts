import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getStripeEnvironment } from "@/lib/stripe";

export type SubRow = {
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  price_id: string;
  product_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  environment: string;
};

function deriveActive(sub: SubRow | null): boolean {
  if (!sub) return false;
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  const future = end === null || end > Date.now();
  if (["active", "trialing", "past_due"].includes(sub.status) && future) return true;
  if (sub.status === "canceled" && end !== null && end > Date.now()) return true;
  return false;
}

export function useSubscription() {
  const { user } = useAuth();
  const [sub, setSub] = useState<SubRow | null>(null);
  const [bonusUntil, setBonusUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSub(null);
      setBonusUntil(null);
      setLoading(false);
      return;
    }
    const env = getStripeEnvironment();
    let cancelled = false;

    const fetchSub = async () => {
      const [{ data }, { data: prof }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("environment", env)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.rpc("get_my_profile_settings").maybeSingle(),
      ]);
      if (!cancelled) {
        setSub((data as SubRow | null) ?? null);
        setBonusUntil((prof as any)?.bonus_pro_until ?? null);
        setLoading(false);
      }
    };
    fetchSub();

    const channel = supabase
      .channel(`sub-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        () => fetchSub()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const bonusActive = !!bonusUntil && new Date(bonusUntil).getTime() > Date.now();
  return { subscription: sub, isPro: deriveActive(sub) || bonusActive, bonusUntil, loading };
}
