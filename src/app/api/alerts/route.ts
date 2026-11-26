import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAlerts } from "@/lib/analytics";

export async function POST() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ risky: await createAlerts(user.id) });
}
