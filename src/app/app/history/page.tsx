import Link from "next/link";
import { PageTitle, Empty } from "@/components/app/ui";
import { createClient } from "@/lib/supabase/server";

const tone: Record<string, string> = { sale: "bg-sky text-brand", receipt: "bg-green-100 text-green-800", adjustment: "bg-amber-100 text-amber-800", edit: "bg-line text-navy" };

export default async function History({ searchParams }: { searchParams: Promise<{ sku?: string; reason?: string }> }) {
  const { sku, reason } = await searchParams;
  const sb = await createClient();
  let q = sb.from("stock_movements").select("id,sku,delta,balance,reason,note,created_at").order("created_at", { ascending: false }).limit(300);
  if (sku) q = q.eq("sku", sku);
  if (reason) q = q.eq("reason", reason);
  const { data } = await q;
  return (
    <>
      <PageTitle title="Stock history" sub="Every change to on-hand stock: sales, adjustments, receipts and edits." />
      <form className="mb-6 flex flex-wrap gap-3">
        <input name="sku" defaultValue={sku ?? ""} placeholder="Filter by SKU" className="field !w-56" />
        <select name="reason" defaultValue={reason ?? ""} className="field !w-48"><option value="">All reasons</option>{["sale", "receipt", "adjustment", "edit"].map((r) => <option key={r}>{r}</option>)}</select>
        <button className="btn btn-outline !py-2">Apply filter</button>
      </form>
      <div className="card overflow-x-auto p-2">
        {!data?.length ? <Empty title="No stock changes recorded yet">Sales, adjustments and received purchase orders will appear here.</Empty> : (
          <table className="data"><thead><tr><th>When</th><th>SKU</th><th>Reason</th><th>Change</th><th>Balance</th><th>Note</th></tr></thead>
            <tbody>{data.map((m) => (<tr key={m.id}><td>{new Date(m.created_at).toLocaleString()}</td><td><Link className="font-medium text-brand" href={`/app/products/${encodeURIComponent(m.sku)}`}>{m.sku}</Link></td><td><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${tone[m.reason]}`}>{m.reason}</span></td><td className={m.delta < 0 ? "font-bold text-red-600" : "font-bold text-green-700"}>{m.delta > 0 ? "+" : ""}{m.delta}</td><td>{m.balance}</td><td>{m.note}</td></tr>))}</tbody></table>
        )}
      </div>
    </>
  );
}
