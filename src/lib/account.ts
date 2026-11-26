import { PLANS, FREE_LIMITS, type PlanId } from "./content";
import { createServiceClient } from "./supabase/server";

export const period = () => new Date().toISOString().slice(0, 7);

export function limitsFor(plan: PlanId) {
  const p = PLANS.find((x) => x.id === plan);
  return p ? { skus: p.skus, forecasts: p.forecasts, ai: p.ai } : FREE_LIMITS;
}

type Sb = { from: (t: string) => any };

export async function getPlan(sb: Sb, userId: string): Promise<PlanId> {
  const { data } = await sb.from("subscriptions").select("plan,status,current_period_end").eq("user_id", userId).maybeSingle();
  if (!data || data.status !== "active") return "free";
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) return "free";
  return data.plan as PlanId;
}

export async function getUsage(sb: Sb, userId: string) {
  const { data } = await sb.from("usage_counters").select("forecasts,ai,uploads").eq("user_id", userId).eq("period", period()).maybeSingle();
  return { forecasts: data?.forecasts ?? 0, ai: data?.ai ?? 0, uploads: data?.uploads ?? 0 };
}

/** Increment a usage counter (service role: users cannot write usage themselves). */
export async function bumpUsage(userId: string, field: "forecasts" | "ai" | "uploads", by = 1) {
  const admin = createServiceClient();
  const { data } = await admin.from("usage_counters").select("*").eq("user_id", userId).eq("period", period()).maybeSingle();
  const next = { user_id: userId, period: period(), forecasts: data?.forecasts ?? 0, ai: data?.ai ?? 0, uploads: data?.uploads ?? 0 };
  next[field] += by;
  await admin.from("usage_counters").upsert(next);
}

export const isAdmin = (email?: string | null) =>
  !!email && (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
