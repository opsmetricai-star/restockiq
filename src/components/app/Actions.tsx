"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const msgCls = (ok: boolean) => `rounded-lg p-3 text-sm ${ok ? "bg-sky" : "bg-red-50 text-red-700"}`;

export function UploadCard({ kind, title, columns, sample }: { kind: "products" | "sales"; title: string; columns: string; sample: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setRes(null);
    const fd = new FormData(e.currentTarget); fd.set("kind", kind);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setRes({ ok: true, text: `Imported ${j.imported} rows, skipped ${j.skipped}.${j.errors?.length ? " " + j.errors.join(" | ") : ""}` }); router.refresh(); }
    else setRes({ ok: false, text: j.error ?? "Upload failed." });
    setBusy(false);
  }
  const href = "data:text/csv;charset=utf-8," + encodeURIComponent(sample);
  return (
    <form onSubmit={go} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted">Columns: <code>{columns}</code></p>
      <a href={href} download={`${kind}-sample.csv`} className="text-sm font-bold text-brand">Download sample CSV</a>
      <input type="file" name="file" accept=".csv,text/csv" required className="field" />
      <button disabled={busy} className="btn btn-primary">{busy ? "Importing…" : "Upload CSV"}</button>
      {res && <p className={msgCls(res.ok)}>{res.text}</p>}
    </form>
  );
}

export function RunForecast() {
  const router = useRouter();
  const [h, setH] = useState(28);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function go() {
    setBusy(true); setRes(null);
    const r = await fetch("/api/forecast", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ horizon_days: h }) });
    const j = await r.json().catch(() => ({}));
    setRes(r.ok ? { ok: true, text: `Forecasted ${j.forecasted} products.` } : { ok: false, text: j.error ?? "Forecast failed." });
    if (r.ok) router.refresh();
    setBusy(false);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select value={h} onChange={(e) => setH(Number(e.target.value))} className="field !w-auto">{[14, 28, 56, 90].map((d) => <option key={d} value={d}>{d}-day horizon</option>)}</select>
      <button onClick={go} disabled={busy} className="btn btn-primary">{busy ? "Running…" : "Run forecast"}</button>
      {res && <span className={msgCls(res.ok)}>{res.text}</span>}
    </div>
  );
}

export type PoLine = { sku: string; qty: number; unit_cost: number; supplier: string };
export function CreatePOs({ lines }: { lines: PoLine[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function go() {
    setBusy(true); setRes(null);
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    const bySup = new Map<string, PoLine[]>();
    lines.forEach((l) => bySup.set(l.supplier || "Unassigned", [...(bySup.get(l.supplier || "Unassigned") ?? []), l]));
    let made = 0;
    for (const [supplier, ls] of bySup) {
      const { data: po, error } = await sb.from("purchase_orders").insert({ user_id: user!.id, supplier }).select("id").single();
      if (error || !po) { setRes({ ok: false, text: error?.message ?? "Could not create PO." }); setBusy(false); return; }
      const { error: e2 } = await sb.from("purchase_order_lines").insert(ls.map((l) => ({ po_id: po.id, user_id: user!.id, sku: l.sku, qty: l.qty, unit_cost: l.unit_cost })));
      if (e2) { setRes({ ok: false, text: e2.message }); setBusy(false); return; }
      made++;
    }
    setRes({ ok: true, text: `Created ${made} draft purchase order(s).` });
    router.refresh(); setBusy(false);
  }
  return (
    <div className="flex items-center gap-3">
      <button onClick={go} disabled={busy || !lines.length} className="btn btn-primary">{busy ? "Creating…" : `Draft POs for ${lines.length} items`}</button>
      {res && <span className={msgCls(res.ok)}>{res.text}</span>}
    </div>
  );
}

export function PoStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  return (
    <select value={status} className="field !w-auto !py-1.5" onChange={async (e) => {
      const next = e.target.value;
      const sb = createClient();
      await sb.from("purchase_orders").update({ status: next }).eq("id", id);
      if (next === "received") {
        const { data: lines } = await sb.from("purchase_order_lines").select("sku,qty").eq("po_id", id);
        for (const l of lines ?? []) {
          const { data: p } = await sb.from("products").select("id,on_hand").eq("sku", l.sku).maybeSingle();
          if (p) await sb.from("products").update({ on_hand: p.on_hand + l.qty }).eq("id", p.id);
        }
      }
      router.refresh();
    }}>
      {["draft", "sent", "received", "cancelled"].map((s) => <option key={s}>{s}</option>)}
    </select>
  );
}

type Risk = { sku: string; issue: string; action: string };
export function Assistant() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ summary: string; risks: Risk[]; answer?: string } | null>(null);
  const [err, setErr] = useState("");
  async function ask(question?: string) {
    setBusy(true); setErr("");
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setOut(j); else setErr(j.error ?? "Request failed.");
    setBusy(false);
  }
  return (
    <div className="space-y-6">
      <div className="card space-y-3 p-6">
        <div className="flex flex-wrap gap-3"><button onClick={() => ask()} disabled={busy} className="btn btn-primary">{busy ? "Analysing…" : "Generate inventory summary"}</button></div>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }} className="flex gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={500} placeholder="Ask about your inventory, e.g. Which SKUs should I reorder first?" className="field" />
          <button disabled={busy} className="btn btn-outline">Ask</button>
        </form>
      </div>
      {err && <p className={msgCls(false)}>{err}</p>}
      {out && (
        <div className="card space-y-4 p-6">
          <p className="text-lg">{out.summary}</p>
          {out.answer && <p className="rounded-lg bg-sky p-4">{out.answer}</p>}
          <div className="grid gap-3 md:grid-cols-2">{out.risks.map((r) => (<div key={r.sku + r.issue} className="rounded-xl border border-line p-4"><div className="font-bold">{r.sku}</div><div className="text-sm text-muted">{r.issue}</div><div className="mt-2 text-sm font-medium text-brand">Action: {r.action}</div></div>))}</div>
        </div>
      )}
    </div>
  );
}

export function ClaimPayment({ plans }: { plans: { id: string; name: string; price: number; href: string }[] }) {
  const router = useRouter();
  const [plan, setPlan] = useState(plans[0].id);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb.from("payment_claims").insert({ user_id: user!.id, plan, reference: f.reference.trim(), payer_email: f.payer_email.trim(), status: "pending" });
    setRes(error ? { ok: false, text: error.message } : { ok: true, text: "Submitted. We will verify and activate your plan." });
    if (!error) router.refresh();
    setBusy(false);
  }
  const sel = plans.find((p) => p.id === plan)!;
  return (
    <form onSubmit={go} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold">Upgrade your plan</h2>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-muted"><li>Pick a plan and pay on the secure checkout page.</li><li>Return here and submit the payment reference or receipt email.</li><li>Your plan is activated once we verify the payment. A redirect alone does not unlock anything.</li></ol>
      <select value={plan} onChange={(e) => setPlan(e.target.value)} className="field">{plans.map((p) => <option key={p.id} value={p.id}>{p.name}: ${p.price}/month</option>)}</select>
      <a href={sel.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">Pay for {sel.name} (${sel.price})</a>
      <input name="reference" required placeholder="Payment reference / order ID" className="field" />
      <input name="payer_email" type="email" required placeholder="Email used at checkout" className="field" />
      <button disabled={busy} className="btn btn-outline w-full">{busy ? "Submitting…" : "I have paid: submit for verification"}</button>
      {res && <p className={msgCls(res.ok)}>{res.text}</p>}
    </form>
  );
}

export function ProfileForm({ name, org }: { name: string; org: string }) {
  const router = useRouter();
  const [res, setRes] = useState("");
  return (
    <form className="card max-w-lg space-y-4 p-6" onSubmit={async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      const { error } = await sb.from("profiles").update({ full_name: f.full_name, org_name: f.org_name }).eq("id", user!.id);
      setRes(error ? error.message : "Saved."); router.refresh();
    }}>
      <input name="full_name" defaultValue={name} placeholder="Full name" className="field" />
      <input name="org_name" defaultValue={org} placeholder="Company" className="field" />
      <button className="btn btn-primary">Save profile</button>
      {res && <p className="text-sm text-muted">{res}</p>}
    </form>
  );
}

export function PasswordForm() {
  const [res, setRes] = useState("");
  return (
    <form className="card max-w-lg space-y-4 p-6" onSubmit={async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      const { error } = await createClient().auth.updateUser({ password: f.password });
      setRes(error ? error.message : "Password updated."); (e.target as HTMLFormElement).reset();
    }}>
      <input name="password" type="password" minLength={8} required placeholder="New password (8+ characters)" className="field" />
      <button className="btn btn-outline">Change password</button>
      {res && <p className="text-sm text-muted">{res}</p>}
    </form>
  );
}

export function MarkRead() {
  const router = useRouter();
  return <button className="btn btn-outline !py-2" onClick={async () => { await createClient().from("notifications").update({ read: true }).eq("read", false); router.refresh(); }}>Mark all read</button>;
}

export function ReviewClaim({ id }: { id: string }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  async function act(action: "verify" | "reject") {
    const r = await fetch("/api/admin/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (r.ok) router.refresh(); else setErr((await r.json().catch(() => ({}))).error ?? "Failed");
  }
  return <span className="flex gap-2"><button onClick={() => act("verify")} className="btn btn-primary !px-4 !py-1.5 !text-sm">Verify</button><button onClick={() => act("reject")} className="btn btn-outline !px-4 !py-1.5 !text-sm">Reject</button>{err && <span className="text-xs text-red-600">{err}</span>}</span>;
}
