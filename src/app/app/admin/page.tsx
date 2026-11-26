import { notFound } from "next/navigation";
import { PageTitle, Empty } from "@/components/app/ui";
import { ReviewClaim } from "@/components/app/Actions";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/account";

export default async function Admin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || !isAdmin(user.email)) notFound();
  const { data: claims } = await createServiceClient().from("payment_claims").select("*").eq("status", "pending").order("created_at");
  const { data: demos } = await createServiceClient().from("demo_requests").select("*").order("created_at", { ascending: false }).limit(25);
  return (
    <>
      <PageTitle title="Admin" sub="Verify payments against your Selar dashboard before activating a plan." />
      <h2 className="mb-3 text-xl font-bold">Pending payment claims</h2>
      {!claims?.length ? <Empty title="No pending claims" /> : (
        <div className="card overflow-x-auto p-2"><table className="data"><thead><tr><th>Date</th><th>Plan</th><th>Reference</th><th>Payer email</th><th /></tr></thead><tbody>{claims.map((c) => (<tr key={c.id}><td>{new Date(c.created_at).toLocaleString()}</td><td className="capitalize">{c.plan}</td><td>{c.reference}</td><td>{c.payer_email}</td><td><ReviewClaim id={c.id} /></td></tr>))}</tbody></table></div>
      )}
      <h2 className="mb-3 mt-10 text-xl font-bold">Demo requests</h2>
      {!demos?.length ? <Empty title="None yet" /> : (
        <div className="card overflow-x-auto p-2"><table className="data"><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Company</th><th>Message</th></tr></thead><tbody>{demos.map((d) => (<tr key={d.id}><td>{new Date(d.created_at).toLocaleDateString()}</td><td>{d.name}</td><td>{d.email}</td><td>{d.company}</td><td>{d.message}</td></tr>))}</tbody></table></div>
      )}
    </>
  );
}
