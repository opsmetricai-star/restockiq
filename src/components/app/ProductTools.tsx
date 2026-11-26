"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type P = { id: string; sku: string; name: string; category: string | null; supplier: string | null; unit_cost: number; price: number; on_hand: number; on_order: number; lead_time_days: number; service_level: number; min_order_qty: number };
const note = (ok: boolean) => `text-sm ${ok ? "text-green-700" : "text-red-600"}`;

export function EditProduct({ p }: { p: P }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const sl = Number(f.service_level) / 100;
    if (!f.name.trim() || sl < 0.5 || sl > 0.999 || Number(f.min_order_qty) < 1) { setMsg({ ok: false, t: "Check the values: service level must be 50 to 99.9 and minimum order at least 1." }); return; }
    setBusy(true);
    const { error } = await createClient().from("products").update({ name: f.name.trim(), category: f.category, supplier: f.supplier, unit_cost: Number(f.unit_cost), price: Number(f.price), on_hand: Number(f.on_hand), on_order: Number(f.on_order), lead_time_days: Number(f.lead_time_days), service_level: sl, min_order_qty: Number(f.min_order_qty) }).eq("id", p.id);
    setMsg(error ? { ok: false, t: error.message } : { ok: true, t: "Saved." });
    setBusy(false); router.refresh();
  }
  const F = ({ n, l, v, t = "number", step }: { n: string; l: string; v: string | number; t?: string; step?: string }) => (
    <label className="text-sm font-medium">{l}<input name={n} type={t} step={step} defaultValue={v} className="field mt-1" /></label>
  );
  return (
    <form onSubmit={save} className="card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <F n="name" l="Name" v={p.name} t="text" /><F n="category" l="Category" v={p.category ?? ""} t="text" /><F n="supplier" l="Supplier" v={p.supplier ?? ""} t="text" />
      <F n="unit_cost" l="Unit cost" v={p.unit_cost} step="0.01" /><F n="price" l="Price" v={p.price} step="0.01" /><F n="on_hand" l="On hand" v={p.on_hand} />
      <F n="on_order" l="On order" v={p.on_order} /><F n="lead_time_days" l="Lead time (days)" v={p.lead_time_days} />
      <F n="service_level" l="Service level (%)" v={Math.round(Number(p.service_level) * 1000) / 10} step="0.1" /><F n="min_order_qty" l="Minimum order qty" v={p.min_order_qty} />
      <div className="flex items-end gap-3"><button disabled={busy} className="btn btn-primary">{busy ? "Saving…" : "Save changes"}</button>{msg && <span className={note(msg.ok)}>{msg.t}</span>}</div>
    </form>
  );
}

export function RecordSale({ sku, onHand, id }: { sku: string; onHand: number; id: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const qty = Number(f.qty);
    if (!Number.isInteger(qty) || qty < 1) { setMsg({ ok: false, t: "Enter a whole number of units." }); return; }
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    const { data: ex } = await sb.from("sales").select("qty").eq("sku", sku).eq("sold_on", f.date).maybeSingle();
    const a = await sb.from("sales").upsert({ user_id: user!.id, sku, sold_on: f.date, qty: (ex?.qty ?? 0) + qty }, { onConflict: "user_id,sku,sold_on" });
    const cur = await sb.from("products").select("on_hand").eq("id", id).single();
    const b = await sb.from("products").update({ on_hand: Math.max(0, (cur.data?.on_hand ?? onHand) - qty) }).eq("id", id);
    if (a.error || b.error) setMsg({ ok: false, t: (a.error ?? b.error)!.message });
    else { setMsg({ ok: true, t: "Sale recorded and stock reduced." }); form.reset(); router.refresh(); }
  }
  return (
    <form onSubmit={go} className="card flex flex-wrap items-end gap-3 p-6">
      <label className="text-sm font-medium">Date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="field mt-1" /></label>
      <label className="text-sm font-medium">Units sold<input name="qty" type="number" min="1" required className="field mt-1" /></label>
      <button className="btn btn-outline">Record sale</button>
      {msg && <span className={note(msg.ok)}>{msg.t}</span>}
    </form>
  );
}

export function AdjustStock({ id, onHand }: { id: string; onHand: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Number(new FormData(form).get("delta"));
    if (!Number.isInteger(d) || d === 0) { setMsg({ ok: false, t: "Enter a non-zero whole number (negative to remove stock)." }); return; }
    const sb = createClient();
    const cur = ((await sb.from("products").select("on_hand").eq("id", id).single()).data?.on_hand ?? onHand);
    if (cur + d < 0) { setMsg({ ok: false, t: "Adjustment would make stock negative." }); return; }
    const { error } = await sb.from("products").update({ on_hand: cur + d }).eq("id", id);
    if (error) setMsg({ ok: false, t: error.message }); else { setMsg({ ok: true, t: `Stock is now ${cur + d}.` }); form.reset(); router.refresh(); }
  }
  return (
    <form onSubmit={go} className="card flex flex-wrap items-end gap-3 p-6">
      <label className="text-sm font-medium">Adjust stock by<input name="delta" type="number" required placeholder="e.g. 50 or -10" className="field mt-1" /></label>
      <button className="btn btn-outline">Apply adjustment</button>
      {msg && <span className={note(msg.ok)}>{msg.t}</span>}
    </form>
  );
}

export function AlertButton() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button disabled={busy} className="btn btn-outline !py-2" onClick={async () => {
        setBusy(true);
        const r = await fetch("/api/alerts", { method: "POST" }); const j = await r.json().catch(() => ({}));
        setMsg(r.ok ? (j.risky ? `${j.risky} SKU(s) at risk. Alert sent to Notifications.` : "No stock-out risk found.") : (j.error ?? "Failed."));
        setBusy(false); router.refresh();
      }}>{busy ? "Checking…" : "Run stock alerts"}</button>
      {msg && <span className="text-sm text-muted">{msg}</span>}
    </div>
  );
}
