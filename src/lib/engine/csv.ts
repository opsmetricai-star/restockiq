import { z } from "zod";

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { cur.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      cur.push(cell); cell = "";
      if (cur.some((c) => c.trim() !== "")) rows.push(cur);
      cur = [];
    } else cell += ch;
  }
  cur.push(cell);
  if (cur.some((c) => c.trim() !== "")) rows.push(cur);
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const num = (d: number) => z.preprocess((v) => (v === "" || v == null ? d : Number(v)), z.number().finite());

export const productRow = z.object({
  sku: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  category: z.string().max(100).optional().default(""),
  supplier: z.string().max(100).optional().default(""),
  unit_cost: num(0).pipe(z.number().min(0)),
  price: num(0).pipe(z.number().min(0)),
  on_hand: num(0).pipe(z.number().int().min(0)),
  on_order: num(0).pipe(z.number().int().min(0)),
  lead_time_days: num(7).pipe(z.number().int().min(0).max(365)),
  service_level: num(0.95).pipe(z.number().min(0.5).max(0.999)),
  min_order_qty: num(1).pipe(z.number().int().min(1)),
});

export const salesRow = z.object({
  sku: z.string().min(1).max(64),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  qty: z.preprocess((v) => Number(v), z.number().int().min(0)),
});
