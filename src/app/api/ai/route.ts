export const maxDuration = 60;
import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { getPlan, limitsFor, getUsage, bumpUsage } from "@/lib/account";
import { replenish } from "@/lib/engine/planning";

const body = z.object({ question: z.string().max(500).optional() });

const outputSchema = z.object({
  summary: z.string(),
  risks: z.array(z.object({ sku: z.string(), issue: z.string(), action: z.string() })).max(8),
  answer: z.string().optional(),
});

export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "AI analysis is temporarily unavailable." }, { status: 503 });
  const parsed = body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const plan = await getPlan(sb, user.id);
  const limit = limitsFor(plan).ai;
  if ((await getUsage(sb, user.id)).ai >= limit) return NextResponse.json({ error: `AI insight limit reached (${limit}/month on ${plan}). Upgrade on the Billing page.` }, { status: 402 });

  // Ground the model in real, deterministically computed data.
  const { data: prods } = await sb.from("products").select("*").limit(300);
  if (!prods?.length) return NextResponse.json({ error: "Import products first." }, { status: 400 });
  const { data: fc } = await sb.from("forecasts").select("sku,daily_forecast,sigma,wape,created_at").order("created_at", { ascending: false }).limit(2000);
  const latest = new Map<string, { daily_forecast: number; sigma: number; wape: number | null }>();
  (fc ?? []).forEach((f) => { if (!latest.has(f.sku)) latest.set(f.sku, f); });

  const facts = prods.map((p) => {
    const f = latest.get(p.sku);
    const d = Number(f?.daily_forecast ?? 0);
    const r = replenish({ dailyDemand: d, sigma: Number(f?.sigma ?? 0), leadTimeDays: p.lead_time_days, serviceLevel: Number(p.service_level), onHand: p.on_hand, onOrder: p.on_order, minOrderQty: p.min_order_qty });
    return { sku: p.sku, name: p.name, onHand: p.on_hand, dailyForecast: d, daysOfCover: r.daysOfCover, status: r.status, suggestedOrder: r.orderQty, wape: f?.wape ?? null };
  }).sort((a, b) => (a.status === "stockout-risk" ? -1 : 0) - (b.status === "stockout-risk" ? -1 : 0)).slice(0, 60);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are an inventory planning analyst. Use ONLY the JSON data below. Never invent numbers; quote figures exactly as given.\n${parsed.data.question ? `User question: ${parsed.data.question}\n` : "Task: summarise inventory health and list the most important risks.\n"}DATA:\n${JSON.stringify(facts)}`;
  try {
    const call = () => ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sku: { type: Type.STRING }, issue: { type: Type.STRING }, action: { type: Type.STRING } }, required: ["sku", "issue", "action"] } },
            answer: { type: Type.STRING },
          },
          required: ["summary", "risks"],
        },
      },
    });
    let res: Awaited<ReturnType<typeof call>> | null = null;
    for (let attempt = 0; attempt < 2 && !res; attempt++) {
      try { res = await Promise.race([call(), new Promise<never>((_, rej) => setTimeout(() => rej(new Error("503 timeout")), 20000))]); } catch (err) {
        const transient = /\b(429|500|503|504)\b|UNAVAILABLE|high demand/i.test(err instanceof Error ? err.message : "");
        if (!transient || attempt === 1) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    const out = outputSchema.safeParse(JSON.parse(res?.text ?? "{}"));
    if (!out.success) return NextResponse.json({ error: "The AI returned an unexpected format. Please retry." }, { status: 502 });
    await sb.from("ai_insights").insert({ user_id: user.id, kind: parsed.data.question ? "question" : "summary", prompt: parsed.data.question ?? null, response: out.data });
    await bumpUsage(user.id, "ai");
    return NextResponse.json(out.data);
  } catch (e) {
    console.error("AI request failed", e instanceof Error ? e.message.slice(0, 300) : e);
    return NextResponse.json({ error: "The AI analyst is busy right now. Please try again in a moment." }, { status: 502 });
  }
}
