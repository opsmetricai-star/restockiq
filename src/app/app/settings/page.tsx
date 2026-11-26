import { PageTitle } from "@/components/app/ui";
import { ProfileForm, PasswordForm } from "@/components/app/Actions";
import { createClient } from "@/lib/supabase/server";

export default async function Settings() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data: p } = await sb.from("profiles").select("full_name,org_name").eq("id", user!.id).maybeSingle();
  return (
    <>
      <PageTitle title="Settings" sub={user?.email ?? ""} />
      <div className="space-y-6"><ProfileForm name={p?.full_name ?? ""} org={p?.org_name ?? ""} /><PasswordForm /></div>
    </>
  );
}
