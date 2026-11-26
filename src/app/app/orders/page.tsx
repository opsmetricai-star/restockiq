import { PageTitle, Empty, money } from "@/components/app/ui";
import { PoStatus } from "@/components/app/Actions";
import { createClient } from "@/lib/supabase/server";

export default async function Orders() {
  const sb = await createClient();
  const { data: pos } = await sb.from("purchase_orders").select("id,supplier,status,created_at").order("created_at", { ascending: false }).limit(200);
  const { data: lines } = await sb.from("purchase_order_lines").select("po_id,sku,qty,unit_cost").limit(5000);
  return (
    <>
      <PageTitle title="Purchase orders" sub="Marking an order received adds its quantities to on-hand stock." />
      {!pos?.length ? <Empty title="No purchase orders">Create drafts from the Replenishment page.</Empty> : (
        <div className="space-y-4">
          {pos.map((po) => {
            const ls = (lines ?? []).filter((l) => l.po_id === po.id);
            const total = ls.reduce((s, l) => s + l.qty * Number(l.unit_cost), 0);
            return (
              <div key={po.id} className="card p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><div className="font-bold">{po.supplier}</div><div className="text-sm text-muted">{new Date(po.created_at).toLocaleDateString()} | {ls.length} lines | {money(total)}</div></div><PoStatus id={po.id} status={po.status} /></div>
                <table className="data"><thead><tr><th>SKU</th><th>Qty</th><th>Unit cost</th></tr></thead><tbody>{ls.map((l) => (<tr key={l.sku}><td>{l.sku}</td><td>{l.qty}</td><td>{money(Number(l.unit_cost))}</td></tr>))}</tbody></table>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
