import { PageTitle, Empty, money } from "@/components/app/ui";
import { createClient } from "@/lib/supabase/server";
import { ProductForm, DeleteProduct } from "@/components/app/ProductForm";

export default async function Products() {
  const sb = await createClient();
  const { data } = await sb.from("products").select("*").order("sku").limit(1000);
  return (
    <>
      <PageTitle title="Products" sub={`${data?.length ?? 0} items`} />
      <ProductForm />
      <div className="card mt-6 overflow-x-auto p-2">
        {!data?.length ? <Empty title="No products yet">Add one above or import a CSV.</Empty> : (
          <table className="data"><thead><tr><th>SKU</th><th>Name</th><th>Supplier</th><th>Cost</th><th>On hand</th><th>On order</th><th>Lead time</th><th>Service</th><th /></tr></thead>
            <tbody>{data.map((p) => (<tr key={p.id}><td className="font-medium">{p.sku}</td><td>{p.name}</td><td>{p.supplier}</td><td>{money(Number(p.unit_cost))}</td><td>{p.on_hand}</td><td>{p.on_order}</td><td>{p.lead_time_days}d</td><td>{Math.round(Number(p.service_level) * 100)}%</td><td><DeleteProduct id={p.id} /></td></tr>))}</tbody></table>
        )}
      </div>
    </>
  );
}
