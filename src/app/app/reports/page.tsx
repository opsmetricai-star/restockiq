import Link from "next/link";
import { PageTitle, Stat, Empty, money } from "@/components/app/ui";
import { StockByCategoryChart, StatusDonut } from "@/components/app/Charts";
import { loadAnalytics } from "@/lib/analytics";

export default async function Reports() {
  const a = await loadAnalytics();
  const exports = [["products", "Products"], ["sales", "Sales history"], ["replenishment", "Replenishment plan"]];
  const classCount = (c: string) => a.abc.filter((r) => r.cls === c).length;
  return (
    <>
      <PageTitle title="Reports" sub="Portfolio analytics computed from your live data."
        action={<div className="flex flex-wrap gap-2">{exports.map(([k, l]) => (<a key={k} href={`/api/export/${k}`} className="btn btn-outline !px-4 !py-2 !text-sm">Export {l}</a>))}</div>} />
      {!a.rows.length ? <Empty title="No data to report on">Import products and sales history first.</Empty> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Stock value (cost)" value={money(a.stockValue)} />
            <Stat label="Overstock value" value={money(a.overstockValue)} hint="Capital tied up beyond 120 days of cover" />
            <Stat label="Revenue at risk (14 days)" value={money(a.atRiskRevenue)} tone={a.atRiskRevenue ? "warn" : "ok"} hint="From SKUs at stock-out risk" />
            <Stat label="Forecast accuracy" value={a.accuracy == null ? "Run forecast" : (a.accuracy * 100).toFixed(1) + "%"} hint="1 minus average WAPE" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card p-6"><h2 className="mb-2 font-bold">Inventory status</h2><StatusDonut data={Object.entries(a.status).map(([name, value]) => ({ name, value }))} /></div>
            <div className="card p-6"><h2 className="mb-2 font-bold">Stock value by category</h2><StockByCategoryChart data={a.stockByCategory} /></div>
          </div>
          <div className="card mt-6 p-6">
            <h2 className="font-bold">ABC analysis (90-day revenue)</h2>
            <p className="mb-4 mt-1 text-sm text-muted">{classCount("A")} A items drive 80% of revenue, {classCount("B")} B items the next 15%, {classCount("C")} C items the last 5%. Total revenue: {money(a.revenue90)}.</p>
            <div className="overflow-x-auto"><table className="data"><thead><tr><th>Class</th><th>SKU</th><th>Name</th><th>Revenue</th><th>Share</th><th>Cumulative</th></tr></thead>
              <tbody>{a.abc.slice(0, 50).map((r) => (<tr key={r.sku}><td><span className="rounded-full bg-sky px-2.5 py-1 text-xs font-bold text-brand">{r.cls}</span></td><td><Link href={`/app/products/${encodeURIComponent(r.sku)}`} className="font-medium text-brand">{r.sku}</Link></td><td>{r.name}</td><td>{money(r.revenue)}</td><td>{(r.share * 100).toFixed(1)}%</td><td>{(r.cumulative * 100).toFixed(1)}%</td></tr>))}</tbody></table></div>
          </div>
        </>
      )}
    </>
  );
}
