import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadPlan } from "@/lib/plan-data";

const esc = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const toCsv = (rows: Record<string, unknown>[]) => (rows.length ? [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map(esc).join(","))].join("\n") : "");

export async function GET(_: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let rows: Record<string, unknown>[] = [];
  if (kind === "products") {
    rows = ((await sb.from("products").select("sku,name,category,supplier,unit_cost,price,on_hand,on_order,lead_time_days,service_level,min_order_qty").order("sku").limit(20000)).data ?? []);
  } else if (kind === "sales") {
    rows = ((await sb.from("sales").select("sku,sold_on,qty").order("sold_on").limit(200000)).data ?? []).map((s) => ({ sku: s.sku, date: s.sold_on, qty: s.qty }));
  } else if (kind === "replenishment") {
    rows = (await loadPlan()).map((r) => ({ sku: r.sku, name: r.name, supplier: r.supplier, status: r.r.status, on_hand: r.on_hand, on_order: r.on_order, daily_demand: r.daily.toFixed(2), days_of_cover: r.r.daysOfCover, safety_stock: r.r.safetyStock, reorder_point: r.r.reorderPoint, suggested_order: r.r.orderQty }));
  } else return NextResponse.json({ error: "Unknown export" }, { status: 404 });

  return new NextResponse(toCsv(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="restockiq-${kind}.csv"` } });
}
