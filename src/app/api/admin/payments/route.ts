import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/account";

const body = z.object({ id: z.string().uuid(), action: z.enum(["verify", "reject"]) });

// Trusted administrative verification: only listed admins can activate a plan.
export async function POST(req: Request) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const admin = createServiceClient();
  const { data: claim } = await admin.from("payment_claims").select("*").eq("id", parsed.data.id).maybeSingle();
  if (!claim || claim.status !== "pending") return NextResponse.json({ error: "Claim not found or already reviewed" }, { status: 404 });

  if (parsed.data.action === "verify") {
    const end = new Date(); end.setDate(end.getDate() + 31);
    await admin.from("subscriptions").upsert({ user_id: claim.user_id, plan: claim.plan, status: "active", current_period_end: end.toISOString(), updated_at: new Date().toISOString() });
    await admin.from("notifications").insert({ user_id: claim.user_id, title: "Plan activated", body: `Your ${claim.plan} plan is now active.` });
  } else {
    await admin.from("notifications").insert({ user_id: claim.user_id, title: "Payment not verified", body: "We could not verify your payment reference. Please contact support." });
  }
  await admin.from("payment_claims").update({ status: parsed.data.action === "verify" ? "verified" : "rejected", reviewed_at: new Date().toISOString() }).eq("id", claim.id);
  return NextResponse.json({ ok: true });
}
