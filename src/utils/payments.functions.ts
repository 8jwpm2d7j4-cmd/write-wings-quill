import { createServerFn } from "@tanstack/react-start";
import { gatewayFetch, type PaddleEnv } from '@/lib/paddle.server';

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: PaddleEnv }) => data)
  .handler(async ({ data }) => {
    const response = await gatewayFetch(
      data.environment,
      `/prices?external_id=${encodeURIComponent(data.priceId)}&status=active`
    );
    const result = await response.json();
    const prices = (result.data ?? []) as Array<{ id: string; status: string; created_at?: string }>;
    const active = prices
      .filter((p) => p.status === "active")
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    if (!active.length) throw new Error(`Price not found: ${data.priceId}`);
    return active[0].id;
  });
