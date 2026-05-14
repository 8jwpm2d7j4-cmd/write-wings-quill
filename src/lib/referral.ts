import { supabase } from "@/integrations/supabase/client";

const KEY = "quill.refcode";

export function captureRefFromUrl() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  const code = p.get("ref");
  if (code && code.length >= 4 && code.length <= 24) {
    try { localStorage.setItem(KEY, code.toLowerCase()); } catch {}
  }
}

export function getStoredRef(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function clearStoredRef() {
  try { localStorage.removeItem(KEY); } catch {}
}

export async function redeemStoredRef(): Promise<{ ok: boolean; error?: string }> {
  const code = getStoredRef();
  if (!code) return { ok: false, error: "no_code" };
  const { data, error } = await supabase.rpc("redeem_referral", { _code: code });
  if (error) return { ok: false, error: error.message };
  const r = (data ?? {}) as { ok?: boolean; error?: string };
  if (r.ok) clearStoredRef();
  return { ok: !!r.ok, error: r.error };
}

export async function redeemCode(code: string): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("redeem_referral", { _code: code.trim().toLowerCase() });
  if (error) return { ok: false, error: error.message };
  const r = (data ?? {}) as { ok?: boolean; error?: string };
  return { ok: !!r.ok, error: r.error };
}
