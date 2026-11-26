import Link from "next/link";
import { Stat, PageTitle, Empty, Meter, money } from "@/components/app/ui";
import { loadPlan } from "@/lib/plan-data";
import { createClient } from "@/lib/supabase/server";
import { getPlan, getUsage, limitsFor } from "@/lib/account";
import { SalesChart } from "@/components/app/SalesChart";
import { AlertButton } from "@/components/app/ProductTools";

export default async function Dashboard() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const [rows, plan, usage] = await Promise.all([loadPlan(), getPlan(sb, user!.id), getUsage(sb, user!.id)]);
  const lim = limitsFor(plan);
  const since = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  const { data: sales } = await sb.from("sales").select("sold_on,qty").gte("sold_on", since).limit(50000);
  const byDay = new Map<string, number>();
  (sales ?? []).forEach((s) => byDay.set(s.sold_on, (byDay.get(s.sold_on) ?? 0) + s.qty));
  const series = [...byDay.entries()].sort().map(([date, qty]) => ({ date: date.slice(5), qty }));
  const value = rows.reduce((s, r) => s + r.on_hand * r.unit_cost, 0);
  const risk = rows.filter((r) => r.r.status === "stockout-risk").length;
  const reorder = rows.filter((r) => r.r.status === "reorder").length;
  const over = rows.filter((r) => r.r.status === "overstock").length;
  const actions = rows.filter((r) => r.r.status === "stockout-risk" || r.r.status === "reorder").sort((a, b) => (a.r.status === "stockout-risk" ? 0 : 1) - (b.r.status === "stockout-risk" ? 0 : 1) || a.r.daysOfCover - b.r.daysOfCover).slice(0, 8);
  const wapes =rows.map((r) => r.wape).filter((w): w is number => w != null);
  const avgWape = wapes.length ? wapes.reduce((a, b) => a + b, 0) / wapes.length : null;
  return (
    <>
      <PageTitle title="Dashboard" sub="Inventory health at a glance" action={<AlertButton />} />
      {rows.length === 0 ? (
        <Empty title="Welcome to RestockIQ">Start by <Link className="font-bold text-brand" href="/app/import">importing your products and sales history</Link>, then run a forecast.</Empty>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="SKUs" value={rows.length} />
            <Stat label="Stock value (at cost)" value={money(value)} />
            <Stat label="Stock-out risk" value={risk} tone={risk ? "warn" : "ok"} hint="Needs action now" />
            <Stat label="Reorder suggested" value={reorder} hint={`${over} overstocked`} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="card p-6"><h2 className="mb-4 font-bold">Units sold, last 60 days</h2>{series.length ? <SalesChart data={series} /> : <p className="text-muted">No sales history yet.</p>}</div>
            <div className="card space-y-5 p-6">
              <h2 className="font-bold">Plan usage ({plan})</h2>
              <Meter label="Forecast runs" used={usage.forecasts} limit={lim.forecasts} />
              <Meter label="AI insights" used={usage.ai} limit={lim.ai} />
              <Meter label="SKUs" used={rows.length} limit={lim.skus} />
              <div className="text-sm text-muted">Average forecast WAPE: {avgWape == null ? "run a forecast" : (avgWape * 100).toFixed(1) + "%"}</div>
            </div>
          </div>
          <div className="card mt-6 overflow-x-auto p-6">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Priority actions</h2><Link href="/app/replenishment" className="text-sm font-bold text-brand">Full replenishment plan</Link></div>
            {actions.length === 0 ? <p className="text-muted">{rows.some((r) => r.method) ? "No SKUs need action right now." : "Run a forecast to generate recommended actions."}</p> : (
              <table className="data"><thead><tr><th>SKU</th><th>Status</th><th>On hand</th><th>Days cover</th><th>Suggested order</th></tr></thead>
                <tbody>{actions.map((r) => (<tr key={r.sku}><td><Link className="font-medium text-brand" href={`/app/products/${encodeURIComponent(r.sku)}`}>{r.sku}</Link> <span className="text-muted">{r.name}</span></td><td className="capitalize">{r.r.status}</td><td>{r.on_hand}</td><td>{r.r.daysOfCover >= 9999 ? "n/a" : r.r.daysOfCover}</td><td className="font-bold">{r.r.orderQty || "None"}</td></tr>))}</tbody></table>
            )}
          </div>
        </>
      )}
    </>
  );
}
