import { PageTitle, Empty } from "@/components/app/ui";
import { RunForecast } from "@/components/app/Actions";
import { loadPlan } from "@/lib/plan-data";

export default async function Forecasts() {
  const rows = (await loadPlan()).filter((r) => r.method);
  return (
    <>
      <PageTitle title="Forecasts" sub="The best of moving average and exponential smoothing is chosen per SKU by backtest." action={<RunForecast />} />
      <div className="card overflow-x-auto p-2">
        {!rows.length ? <Empty title="No forecasts yet">Import sales history, then run a forecast.</Empty> : (
          <table className="data"><thead><tr><th>SKU</th><th>Name</th><th>Method</th><th>Daily demand</th><th>Backtest WAPE</th></tr></thead>
            <tbody>{rows.map((r) => (<tr key={r.sku}><td className="font-medium">{r.sku}</td><td>{r.name}</td><td>{r.method}</td><td>{r.daily.toFixed(2)}</td><td>{r.wape == null ? "n/a" : (r.wape * 100).toFixed(1) + "%"}</td></tr>))}</tbody></table>
        )}
      </div>
    </>
  );
}
