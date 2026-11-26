import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlan, limitsFor, bumpUsage } from "@/lib/account";
import { parseCsv, productRow, salesRow } from "@/lib/engine/csv";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const kind = form.get("kind");
  const file = form.get("file");
  if ((kind !== "products" && kind !== "sales") || !(file instanceof File)) return NextResponse.json({ error: "Provide kind (products|sales) and a CSV file." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 5 MB)." }, { status: 413 });

  const text = await file.text();
  const rows = parseCsv(text);
  if (!rows.length) return NextResponse.json({ error: "CSV is empty or has no header row." }, { status: 400 });

  const errors: string[] = [];
  const plan = await getPlan(sb, user.id);
  const limits = limitsFor(plan);

  // Keep the original file in private storage
  await sb.storage.from("uploads").upload(`${user.id}/${Date.now()}-${kind}.csv`, file, { contentType: "text/csv" });

  if (kind === "products") {
    const good: Record<string, unknown>[] = [];
    rows.forEach((r, i) => {
      const p = productRow.safeParse(r);
      if (p.success) good.push({ ...p.data, user_id: user.id });
      else if (errors.length < 10) errors.push(`Row ${i + 2}: ${p.error.issues[0].path.join(".")} ${p.error.issues[0].message}`);
    });
    const { count } = await sb.from("products").select("*", { count: "exact", head: true });
    const existing = new Set((await sb.from("products").select("sku")).data?.map((x) => x.sku));
    const newCount = good.filter((g) => !existing.has(g.sku as string)).length;
    if ((count ?? 0) + newCount > limits.skus)
      return NextResponse.json({ error: `Your ${plan} plan allows ${limits.skus} SKUs. This import would exceed it. Upgrade on the Billing page.` }, { status: 402 });
    if (good.length) {
      const { error } = await sb.from("products").upsert(good, { onConflict: "user_id,sku" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await bumpUsage(user.id, "uploads");
    return NextResponse.json({ imported: good.length, skipped: rows.length - good.length, errors });
  }

  const good: Record<string, unknown>[] = [];
  rows.forEach((r, i) => {
    const s = salesRow.safeParse(r);
    if (s.success) good.push({ user_id: user.id, sku: s.data.sku, sold_on: s.data.date, qty: s.data.qty });
    else if (errors.length < 10) errors.push(`Row ${i + 2}: ${s.error.issues[0].message}`);
  });
  for (let i = 0; i < good.length; i += 1000) {
    const { error } = await sb.from("sales").upsert(good.slice(i, i + 1000), { onConflict: "user_id,sku,sold_on" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  await bumpUsage(user.id, "uploads");
  return NextResponse.json({ imported: good.length, skipped: rows.length - good.length, errors });
}
