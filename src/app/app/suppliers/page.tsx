import { PageTitle, Empty, money } from "@/components/app/ui";
import { createClient } from "@/lib/supabase/server";
import { loadPlan } from "@/lib/plan-data";

export default async function Suppliers() {
  const sb = await createClient();
  const rows = await loadPlan();
  const { data: pos } = await sb.from("purchase_orders").select("id,supplier,status").limit(1000);
  const { data: lines } = await sb.from("purchase_order_lines").select("po_id,qty,unit_cost").limit(20000);
  const by = new Map<string, { skus: number; value: number; lead: number[]; risk: number; reorder: number; suggested: number; openPos: number; openValue: number }>();
  const get = (s: string) => { if (!by.has(s)) by.set(s, { skus: 0, value: 0, lead: [], risk: 0, reorder: 0, suggested: 0, openPos: 0, openValue: 0 }); return by.get(s)!; };
  rows.forEach((r) => {
    const s = get(r.supplier || "Unassigned");
    s.skus++; s.value += r.on_hand * r.unit_cost; s.lead.push(r.lead_time_days);
    if (r.r.status === "stockout-risk") s.risk++;
    if (r.r.orderQty > 0) { s.reorder++; s.suggested += r.r.orderQty * r.unit_cost; }
  });
  (pos ?? []).filter((p) => p.status === "draft" || p.status === "sent").forEach((p) => {
    const s = get(p.supplier || "Unassigned"); s.openPos++;
    s.openValue += (lines ?? []).filter((l) => l.po_id === p.id).reduce((t, l) => t + l.qty * Number(l.unit_cost), 0);
  });
  const list = [...by.entries()].sort((a, b) => b[1].value - a[1].value);
  return (
    <>
      <PageTitle title="Suppliers" sub="Exposure, lead times and open orders by supplier. Suppliers are taken from your product records." />
      {!list.length ? <Empty title="No suppliers yet">Add a supplier to your products to see this view.</Empty> : (
        <div className="card overflow-x-auto p-2">
          <table className="data"><thead><tr><th>Supplier</th><th>SKUs</th><th>Stock value</th><th>Avg lead time</th><th>At risk</th><th>Reorder needed</th><th>Suggested spend</th><th>Open POs</th><th>Open PO value</th></tr></thead>
            <tbody>{list.map(([name, s]) => (<tr key={name}><td className="font-medium">{name}</td><td>{s.skus}</td><td>{money(s.value)}</td><td>{Math.round(s.lead.reduce((a, b) => a + b, 0) / s.lead.length)}d</td><td className={s.risk ? "font-bold text-red-600" : ""}>{s.risk}</td><td>{s.reorder}</td><td>{money(s.suggested)}</td><td>{s.openPos}</td><td>{money(s.openValue)}</td></tr>))}</tbody></table>
        </div>
      )}
    </>
  );
}
