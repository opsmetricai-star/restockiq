import { createClient } from "./supabase/server";
import { loadPlan, type Row } from "./plan-data";

export type AbcRow = { sku: string; name: string; revenue: number; share: number; cumulative: number; cls: "A" | "B" | "C" };

export async function loadAnalytics() {
  const sb = await createClient();
  const rows = await loadPlan();
  const { data: prods } = await sb.from("products").select("sku,category,price,unit_cost").limit(10000);
  const meta = new Map((prods ?? []).map((p) => [p.sku, p]));
  const since = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const { data: sales } = await sb.from("sales").select("sku,qty").gte("sold_on", since).limit(200000);
  const units = new Map<string, number>();
  (sales ?? []).forEach((s) => units.set(s.sku, (units.get(s.sku) ?? 0) + s.qty));

  // ABC by 90-day revenue (units x price)
  const rev = rows.map((r) => ({ sku: r.sku, name: r.name, revenue: (units.get(r.sku) ?? 0) * Number(meta.get(r.sku)?.price ?? 0) })).sort((a, b) => b.revenue - a.revenue);
  const total = rev.reduce((s, r) => s + r.revenue, 0);
  let run = 0;
  const abc: AbcRow[] = rev.map((r) => {
    run += r.revenue;
    const cumulative = total ? run / total : 1;
    const before = total ? (run - r.revenue) / total : 1;
    return { ...r, share: total ? r.revenue / total : 0, cumulative, cls: before < 0.8 ? "A" : before < 0.95 ? "B" : "C" };
  });

  const byCat = new Map<string, number>();
  rows.forEach((r) => { const c = meta.get(r.sku)?.category || "Uncategorized"; byCat.set(c, (byCat.get(c) ?? 0) + r.on_hand * r.unit_cost); });
  const stockByCategory = [...byCat.entries()].map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, 12);

  const stockValue = rows.reduce((s, r) => s + r.on_hand * r.unit_cost, 0);
  const overstockValue = rows.filter((r) => r.r.status === "overstock").reduce((s, r) => s + r.on_hand * r.unit_cost, 0);
  const atRiskRevenue = rows.filter((r) => r.r.status === "stockout-risk").reduce((s, r) => s + r.daily * Number(meta.get(r.sku)?.price ?? 0) * 14, 0);
  const wapes = rows.map((r) => r.wape).filter((w): w is number => w != null);
  const accuracy = wapes.length ? Math.max(0, 1 - wapes.reduce((a, b) => a + b, 0) / wapes.length) : null;
  const status = { "stockout-risk": 0, reorder: 0, ok: 0, overstock: 0 } as Record<Row["r"]["status"], number>;
  rows.forEach((r) => status[r.r.status]++);
  return { rows, abc, stockByCategory, stockValue, overstockValue, atRiskRevenue, accuracy, status, revenue90: total };
}

/** Creates one notification per day summarizing stock-out risk. Returns how many risky SKUs were found. */
export async function createAlerts(userId: string): Promise<number> {
  const sb = await createClient();
  const rows = (await loadPlan()).filter((r) => r.method);
  const risky = rows.filter((r) => r.r.status === "stockout-risk");
  const reorder = rows.filter((r) => r.r.status === "reorder");
  if (!risky.length && !reorder.length) return 0;
  const title = `Replenishment alert ${new Date().toISOString().slice(0, 10)}`;
  const { data: existing } = await sb.from("notifications").select("id").eq("title", title).limit(1);
  if (existing?.length) return risky.length;
  const list = risky.slice(0, 5).map((r) => r.sku).join(", ");
  await sb.from("notifications").insert({
    user_id: userId, title,
    body: `${risky.length} SKU(s) at stock-out risk${list ? ` (${list})` : ""}. ${reorder.length} more need a reorder.`,
  });
  return risky.length;
}
