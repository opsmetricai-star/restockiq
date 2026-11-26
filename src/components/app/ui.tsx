import type { ReactNode } from "react";

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-bold">{title}</h1>{sub && <p className="mt-1 text-muted">{sub}</p>}</div>
      {action}
    </div>
  );
}
export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: "warn" | "ok" }) {
  return (
    <div className="card p-5">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${tone === "warn" ? "text-red-600" : ""}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}
export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="card p-10 text-center"><div className="text-lg font-bold">{title}</div><div className="mt-2 text-muted">{children}</div></div>;
}
export function Meter({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-muted">{used} / {limit}</span></div>
      <div className="h-2.5 rounded-full bg-line"><div className={`h-2.5 rounded-full ${pct >= 90 ? "bg-red-500" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
