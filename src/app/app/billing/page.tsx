import { PageTitle, Meter } from "@/components/app/ui";
import { ClaimPayment } from "@/components/app/Actions";
import { createClient } from "@/lib/supabase/server";
import { getPlan, getUsage, limitsFor } from "@/lib/account";
import { PLANS } from "@/lib/content";

export default async function Billing() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const plan = await getPlan(sb, user!.id);
  const usage = await getUsage(sb, user!.id);
  const lim = limitsFor(plan);
  const { data: sub } = await sb.from("subscriptions").select("current_period_end").eq("user_id", user!.id).maybeSingle();
  const { count } = await sb.from("products").select("*", { count: "exact", head: true });
  const { data: claims } = await sb.from("payment_claims").select("id,plan,reference,status,created_at").order("created_at", { ascending: false }).limit(20);
  return (
    <>
      <PageTitle title="Billing & subscription" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card space-y-5 p-6">
            <div><div className="text-sm text-muted">Current plan</div><div className="text-3xl font-bold capitalize">{plan}</div>{plan !== "free" && sub?.current_period_end && <div className="text-sm text-muted">Active until {new Date(sub.current_period_end).toLocaleDateString()}</div>}</div>
            <Meter label="SKUs" used={count ?? 0} limit={lim.skus} />
            <Meter label="Forecast runs this month" used={usage.forecasts} limit={lim.forecasts} />
            <Meter label="AI insights this month" used={usage.ai} limit={lim.ai} />
          </div>
          <div className="card p-6">
            <h2 className="mb-3 font-bold">Payment history</h2>
            {!claims?.length ? <p className="text-sm text-muted">No payments submitted yet.</p> : (
              <table className="data"><thead><tr><th>Date</th><th>Plan</th><th>Reference</th><th>Status</th></tr></thead><tbody>{claims.map((c) => (<tr key={c.id}><td>{new Date(c.created_at).toLocaleDateString()}</td><td className="capitalize">{c.plan}</td><td>{c.reference}</td><td className="capitalize">{c.status}</td></tr>))}</tbody></table>
            )}
          </div>
        </div>
        <ClaimPayment plans={PLANS.map((p) => ({ id: p.id, name: p.name, price: p.price, href: p.href }))} />
      </div>
    </>
  );
}
