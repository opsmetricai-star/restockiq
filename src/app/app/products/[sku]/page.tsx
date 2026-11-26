import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle, Stat, money } from "@/components/app/ui";
import { EditProduct, RecordSale, AdjustStock } from "@/components/app/ProductTools";
import { HistoryForecastChart } from "@/components/app/Charts";
import { createClient } from "@/lib/supabase/server";
import { loadPlan } from "@/lib/plan-data";

export default async function ProductDetail({ params }: { params: Promise<{ sku: string }> }) {
  const { sku: raw } = await params;
  const sku = decodeURIComponent(raw);
  const sb = await createClient();
  const { data: p } = await sb.from("products").select("*").eq("sku", sku).maybeSingle();
  if (!p) notFound();
  const plan = (await loadPlan()).find((r) => r.sku === sku);
  const since = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const { data: sales } = await sb.from("sales").select("sold_on,qty").eq("sku", sku).gte("sold_on", since).order("sold_on").limit(1000);
  const { data: fcs } = await sb.from("forecasts").select("method,daily_forecast,wape,bias,horizon_days,created_at").eq("sku", sku).order("created_at", { ascending: false }).limit(5);

  const chart: { date: string; actual?: number; forecast?: number }[] = (sales ?? []).map((s) => ({ date: s.sold_on.slice(5), actual: s.qty }));
  const daily = plan?.daily ?? 0;
  if (plan?.method && chart.length) {
    chart[chart.length - 1].forecast = chart[chart.length - 1].actual;
    const last = new Date((sales ?? []).slice(-1)[0].sold_on + "T00:00:00Z");
    for (let i = 1; i <= 28; i++) chart.push({ date: new Date(last.getTime() + i * 86400000).toISOString().slice(5, 10), forecast: +daily.toFixed(2) });
  }
  const r = plan?.r;
  return (
    <>
      <PageTitle title={`${p.sku}: ${p.name}`} sub="Edit parameters, record sales and review the plan for this SKU." action={<Link href="/app/products" className="font-bold text-brand">Back to products</Link>} />
      {r ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Status" value={<span className="capitalize">{r.status}</span>} tone={r.status === "stockout-risk" ? "warn" : undefined} />
          <Stat label="Days of cover" value={r.daysOfCover >= 9999 ? "n/a" : r.daysOfCover} hint={`${daily.toFixed(2)} units per day forecast`} />
          <Stat label="Reorder point" value={r.reorderPoint} hint={`Safety stock ${r.safetyStock}`} />
          <Stat label="Suggested order" value={r.orderQty || "None"} hint={r.orderQty ? money(r.orderQty * Number(p.unit_cost)) : undefined} />
        </div>
      ) : null}
      <div className="card mb-6 p-6">
        <h2 className="mb-4 font-bold">Sales history and forecast</h2>
        {chart.length ? <HistoryForecastChart data={chart} /> : <p className="text-muted">No sales recorded for this SKU in the last 90 days. Import history or record a sale below.</p>}
        {!plan?.method && <p className="mt-3 text-sm text-muted">Run a forecast from the Forecasts page to see projected demand.</p>}
      </div>
      <div className="space-y-6">
        <EditProduct p={p} />
        <div className="grid gap-6 lg:grid-cols-2"><RecordSale sku={p.sku} onHand={p.on_hand} id={p.id} /><AdjustStock id={p.id} onHand={p.on_hand} /></div>
        {!!fcs?.length && (
          <div className="card overflow-x-auto p-2">
            <table className="data"><thead><tr><th>Forecast run</th><th>Method</th><th>Daily demand</th><th>WAPE</th><th>Bias</th></tr></thead>
              <tbody>{fcs.map((f) => (<tr key={f.created_at}><td>{new Date(f.created_at).toLocaleString()}</td><td>{f.method}</td><td>{Number(f.daily_forecast).toFixed(2)}</td><td>{f.wape == null ? "n/a" : (Number(f.wape) * 100).toFixed(1) + "%"}</td><td>{f.bias == null ? "n/a" : (Number(f.bias) * 100).toFixed(1) + "%"}</td></tr>))}</tbody></table>
          </div>
        )}
      </div>
    </>
  );
}
