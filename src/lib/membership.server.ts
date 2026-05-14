import { createClient } from "@supabase/supabase-js";

let _admin: any = null;
function admin(): any {
  if (!_admin) {
    _admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _admin;
}

/**
 * Returns true if the user has an active Pro subscription in either environment.
 * Allows test-mode previews to gate features the same way live does.
 */
export async function userIsPro(userId: string): Promise<boolean> {
  const now = Date.now();

  // Bonus Pro from referrals
  const { data: prof } = await admin()
    .from("profiles")
    .select("bonus_pro_until")
    .eq("id", userId)
    .maybeSingle();
  if (prof?.bonus_pro_until && new Date(prof.bonus_pro_until).getTime() > now) return true;

  const { data } = await admin()
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  const rows = (data ?? []) as Array<{ status: string; current_period_end: string | null }>;
  return rows.some((r) => {
    const end = r.current_period_end ? new Date(r.current_period_end).getTime() : null;
    const future = end === null || end > now;
    if (["active", "trialing", "past_due"].includes(r.status) && future) return true;
    if (r.status === "canceled" && end !== null && end > now) return true;
    return false;
  });
}
