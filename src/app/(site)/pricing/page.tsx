import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { PLANS, FREE_LIMITS } from "@/lib/content";

export const metadata = { title: "Pricing | RestockIQ" };

const faqs = [
  ["How does billing work?", "Create an account, open Billing, and pay for your plan through the secure checkout. Submit your payment reference and your plan is activated once the payment is verified."],
  ["Is there a free workspace?", `Yes. Every account starts with ${FREE_LIMITS.skus} SKUs, ${FREE_LIMITS.forecasts} forecast runs and ${FREE_LIMITS.ai} AI analyses per month.`],
  ["What currency are prices in?", "All prices are in US dollars per month."],
  ["What happens at a limit?", "Imports, forecasts and AI analyses stop at your plan limit and prompt you to upgrade. Existing data is never deleted."],
];

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Pricing that scales with your catalogue" image={false} cta={false}>
        <p>Every plan includes the full planning engine: forecasting, inventory optimization, replenishment, purchase orders and the AI analyst. Plans differ by volume.</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.id} className={`card relative flex flex-col p-8 ${"popular" in p ? "border-2 !border-brand" : ""}`}>
              {"popular" in p && <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">Most popular</span>}
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <p className="mt-2 text-muted">{p.blurb}</p>
              <div className="mt-6 text-5xl font-bold">${p.price}<span className="text-base font-medium text-muted"> / month</span></div>
              <ul className="my-8 flex-1 space-y-3">{p.features.map((f) => (<li key={f} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-brand" size={18} />{f}</li>))}</ul>
              <Link href={`/signup?plan=${p.id}`} className="btn btn-primary">Sign up</Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-muted">Already have an account? <Link href="/login?next=/app/billing" className="font-bold text-brand">Sign in</Link> to upgrade.</p>
      </Section>
      <Section tone="mist">
        <h2 className="h-display mb-8 text-center">Billing questions</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map(([q, a]) => (<details key={q} className="card p-5"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-muted">{a}</p></details>))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
