"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLimitsAction } from "./limits";

export function ProductForm() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setBusy(true); setErr("");
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    const lim = await getLimitsAction();
    const { count } = await sb.from("products").select("*", { count: "exact", head: true });
    if ((count ?? 0) >= lim.skus) { setErr(`SKU limit reached (${lim.skus}). Upgrade on the Billing page.`); setBusy(false); return; }
    const { error } = await sb.from("products").insert({ user_id: user!.id, sku: f.sku.trim(), name: f.name.trim(), supplier: f.supplier, unit_cost: Number(f.unit_cost || 0), price: Number(f.price || 0), on_hand: Number(f.on_hand || 0), lead_time_days: Number(f.lead_time_days || 7), service_level: Number(f.service_level || 95) / 100, min_order_qty: Number(f.min_order_qty || 1) });
    if (error) setErr(error.code === "23505" ? "That SKU already exists." : error.message);
    else { form.reset(); router.refresh(); }
    setBusy(false);
  }
  return (
    <form onSubmit={add} className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
      <input name="sku" required placeholder="SKU" className="field" />
      <input name="name" required placeholder="Name" className="field" />
      <input name="supplier" placeholder="Supplier" className="field" />
      <input name="unit_cost" type="number" step="0.01" min="0" placeholder="Unit cost" className="field" />
      <input name="price" type="number" step="0.01" min="0" placeholder="Price" className="field" />
      <input name="on_hand" type="number" min="0" placeholder="On hand" className="field" />
      <input name="lead_time_days" type="number" min="0" placeholder="Lead time (days)" className="field" />
      <input name="service_level" type="number" min="50" max="99.9" step="0.1" placeholder="Service level % (95)" className="field" />
      <input name="min_order_qty" type="number" min="1" placeholder="Min order qty" className="field" />
      <button disabled={busy} className="btn btn-primary">{busy ? "Adding…" : "Add product"}</button>
      {err && <p className="text-sm text-red-600 sm:col-span-2">{err}</p>}
    </form>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const router = useRouter();
  return <button className="text-sm text-red-600 hover:underline" onClick={async () => { if (!confirm("Delete this product?")) return; await createClient().from("products").delete().eq("id", id); router.refresh(); }}>Delete</button>;
}
