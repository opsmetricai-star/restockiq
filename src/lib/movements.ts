import type { SupabaseClient } from "@supabase/supabase-js";

export type Reason = "sale" | "adjustment" | "receipt" | "edit";

/** Records a stock change. Never throws: stock updates must succeed even if history is unavailable. */
export async function logMovement(sb: SupabaseClient, m: { sku: string; delta: number; balance: number; reason: Reason; note?: string }) {
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user || m.delta === 0) return;
    await sb.from("stock_movements").insert({ user_id: user.id, ...m });
  } catch { /* history is best-effort */ }
}
