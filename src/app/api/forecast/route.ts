import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPlan, limitsFor, getUsage, bumpUsage } from "@/lib/account";
import { toDaily, forecast } from "@/lib/engine/planning";

const body = z.object({ horizon_days: z.number().int().min(7).max(180).default(28), sku: z.string().optional() });

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const plan = await getPlan(sb, user.id);
  const limit = limitsFor(plan).forecasts;
  const used = (await getUsage(sb, user.id)).forecasts;
  if (used >= limit) return NextResponse.json({ error: `Forecast limit reached (${limit}/month on ${plan}). Upgrade on the Billing page.` }, { status: 402 });

  let q = sb.from("products").select("sku");
  if (parsed.data.sku) q = q.eq("sku", parsed.data.sku);
  const { data: prods } = await q;
  if (!prods?.length) return NextResponse.json({ error: "No products found. Import products first." }, { status: 400 });

  const { data: sales } = await sb.from("sales").select("sku,sold_on,qty").in("sku", prods.map((p) => p.sku)).order("sold_on").limit(100000);
  const by = new Map<string, { date: string; qty: number }[]>();
  (sales ?? []).forEach((s) => { const a = by.get(s.sku) ?? []; a.push({ date: s.sold_on, qty: s.qty }); by.set(s.sku, a); });

  const rows = prods.map((p) => {
    const f = forecast(toDaily(by.get(p.sku) ?? []), parsed.data.horizon_days);
    return { user_id: user.id, sku: p.sku, horizon_days: parsed.data.horizon_days, method: f.method, daily_forecast: +f.daily.toFixed(3), total_forecast: +f.total.toFixed(2), wape: f.wape, bias: f.bias, sigma: +f.sigma.toFixed(3) };
  });
  const { error } = await sb.from("forecasts").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await bumpUsage(user.id, "forecasts");
  return NextResponse.json({ forecasted: rows.length });
}
