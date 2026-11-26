import Link from "next/link";
import { redirect } from "next/navigation";
import { Truck, BarChart3, LayoutDashboard, Package, Upload, LineChart, Repeat, ClipboardList, Sparkles, CreditCard, Settings, Bell, Shield, LogOut } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/server";
import { getPlan, isAdmin } from "@/lib/account";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workspace | RestockIQ" };

const NAV = [
  ["/app", "Dashboard", LayoutDashboard], ["/app/products", "Products", Package], ["/app/import", "Import data", Upload],
  ["/app/forecasts", "Forecasts", LineChart], ["/app/replenishment", "Replenishment", Repeat], ["/app/orders", "Purchase orders", ClipboardList], ["/app/suppliers", "Suppliers", Truck], ["/app/reports", "Reports", BarChart3],
  ["/app/assistant", "AI assistant", Sparkles], ["/app/notifications", "Notifications", Bell], ["/app/billing", "Billing", CreditCard], ["/app/settings", "Settings", Settings],
] as const;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const plan = await getPlan(sb, user.id);
  const { count } = await sb.from("notifications").select("*", { count: "exact", head: true }).eq("read", false);
  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-white p-5 md:flex">
        <Link href="/app"><Logo /></Link>
        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
          {NAV.map(([h, t, Icon]) => (
            <Link key={h} href={h} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-sky hover:text-brand">
              <Icon size={18} />{t}{h === "/app/notifications" && !!count && <span className="ml-auto rounded-full bg-brand px-2 text-xs text-white">{count}</span>}
            </Link>
          ))}
          {isAdmin(user.email) && <Link href="/app/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium hover:bg-sky"><Shield size={18} />Admin</Link>}
        </nav>
        <div className="border-t border-line pt-4 text-sm">
          <div className="truncate font-medium">{user.email}</div>
          <div className="mb-3 text-muted">Plan: <span className="font-bold capitalize text-brand">{plan}</span></div>
          <form action="/auth/signout" method="post"><button className="flex items-center gap-2 text-muted hover:text-brand"><LogOut size={16} />Sign out</button></form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex gap-2 overflow-x-auto border-b border-line bg-white p-3 md:hidden">
          {NAV.map(([h, t]) => (<Link key={h} href={h} className="whitespace-nowrap rounded-full bg-sky px-3 py-1.5 text-sm font-medium">{t}</Link>))}
        </div>
        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
