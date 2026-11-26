import { PageTitle, Empty } from "@/components/app/ui";
import { MarkRead } from "@/components/app/Actions";
import { createClient } from "@/lib/supabase/server";

export default async function Notifications() {
  const sb = await createClient();
  const { data } = await sb.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
  return (
    <>
      <PageTitle title="Notifications" action={<MarkRead />} />
      {!data?.length ? <Empty title="You are all caught up" /> : (
        <div className="space-y-3">{data.map((n) => (<div key={n.id} className={`card p-5 ${n.read ? "" : "border-l-4 !border-l-brand"}`}><div className="font-bold">{n.title}</div><div className="text-muted">{n.body}</div><div className="mt-1 text-xs text-muted">{new Date(n.created_at).toLocaleString()}</div></div>))}</div>
      )}
    </>
  );
}
