"use server";
import { createClient } from "@/lib/supabase/server";
import { getPlan, limitsFor } from "@/lib/account";

export async function getLimitsAction() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { skus: 0, forecasts: 0, ai: 0 };
  return limitsFor(await getPlan(sb, user.id));
}
