import { createClient } from "./supabase/server";
import { replenish, type ReplenishResult } from "./engine/planning";

export type Row = { sku: string; name: string; supplier: string | null; unit_cost: number; on_hand: number; on_order: number; lead_time_days: number; daily: number; wape: number | null; method: string | null; r: ReplenishResult };

/** Joins products with their latest forecast and computes replenishment. RLS scopes to the user. */
export async function loadPlan(): Promise<Row[]> {
  const sb = await createClient();
  const { data: prods } = await sb.from("products").select("*").order("sku").limit(10000);
  const { data: fc } = await sb.from("forecasts").select("sku,daily_forecast,sigma,wape,method,created_at").order("created_at", { ascending: false }).limit(20000);
  const latest = new Map<string, { daily_forecast: number; sigma: number; wape: number | null; method: string }>();
  (fc ?? []).forEach((f) => { if (!latest.has(f.sku)) latest.set(f.sku, f); });
  return (prods ?? []).map((p) => {
    const f = latest.get(p.sku);
    const daily = Number(f?.daily_forecast ?? 0);
    const r = replenish({ dailyDemand: daily, sigma: Number(f?.sigma ?? 0), leadTimeDays: p.lead_time_days, serviceLevel: Number(p.service_level), onHand: p.on_hand, onOrder: p.on_order, minOrderQty: p.min_order_qty });
    return { sku: p.sku, name: p.name, supplier: p.supplier, unit_cost: Number(p.unit_cost), on_hand: p.on_hand, on_order: p.on_order, lead_time_days: p.lead_time_days, daily, wape: f?.wape ?? null, method: f?.method ?? null, r };
  });
}
