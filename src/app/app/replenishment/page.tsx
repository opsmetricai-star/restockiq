import { PageTitle, Empty } from "@/components/app/ui";
import { CreatePOs } from "@/components/app/Actions";
import { loadPlan } from "@/lib/plan-data";

const badge: Record<string, string> = { "stockout-risk": "bg-red-100 text-red-700", reorder: "bg-amber-100 text-amber-800", ok: "bg-green-100 text-green-800", overstock: "bg-sky text-brand" };

export default async function Replenishment() {
  const rows = (await loadPlan()).filter((r) => r.method);
  const lines = rows.filter((r) => r.r.orderQty > 0).map((r) => ({ sku: r.sku, qty: r.r.orderQty, unit_cost: r.unit_cost, supplier: r.supplier ?? "" }));
  return (
    <>
      <PageTitle title="Replenishment" sub="Reorder point = demand × lead time + safety stock. Safety stock = z(service level) × σ × √lead time." action={<CreatePOs lines={lines} />} />
      <div className="card overflow-x-auto p-2">
        {!rows.length ? <Empty title="Nothing to plan yet">Run a forecast first.</Empty> : (
          <table className="data"><thead><tr><th>SKU</th><th>Status</th><th>On hand</th><th>On order</th><th>Days cover</th><th>Safety stock</th><th>Reorder point</th><th>Suggested order</th></tr></thead>
            <tbody>{rows.map((r) => (<tr key={r.sku}><td className="font-medium">{r.sku}</td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badge[r.r.status]}`}>{r.r.status}</span></td><td>{r.on_hand}</td><td>{r.on_order}</td><td>{r.r.daysOfCover >= 9999 ? "∞" : r.r.daysOfCover}</td><td>{r.r.safetyStock}</td><td>{r.r.reorderPoint}</td><td className="font-bold">{r.r.orderQty || "–"}</td></tr>))}</tbody></table>
        )}
      </div>
    </>
  );
}
