import { PageTitle } from "@/components/app/ui";
import { UploadCard } from "@/components/app/Actions";

export default function ImportPage() {
  return (
    <>
      <PageTitle title="Import data" sub="Upload CSV files. Rows are validated; invalid rows are skipped and reported. Existing SKUs and dates are updated." />
      <div className="grid gap-6 lg:grid-cols-2">
        <UploadCard kind="products" title="1. Products" columns="sku, name, category, supplier, unit_cost, price, on_hand, on_order, lead_time_days, service_level, min_order_qty"
          sample={"sku,name,category,supplier,unit_cost,price,on_hand,on_order,lead_time_days,service_level,min_order_qty\nSKU-001,Oat Milk 1L,Dairy alt,Greenfield,1.20,2.49,120,0,5,0.95,24\nSKU-002,Granola 500g,Cereal,Mill & Co,2.10,4.99,40,0,10,0.97,12\n"} />
        <UploadCard kind="sales" title="2. Daily sales history" columns="sku, date (YYYY-MM-DD), qty"
          sample={"sku,date,qty\nSKU-001,2026-01-01,14\nSKU-001,2026-01-02,11\nSKU-002,2026-01-01,3\n"} />
      </div>
    </>
  );
}
