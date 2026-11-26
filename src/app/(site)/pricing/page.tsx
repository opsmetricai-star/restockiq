import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { PLANS, FREE_LIMITS } from "@/lib/content";

export const metadata = { title: "Pricing | RestockIQ" };

const faqs = [
  ["How do I pay?", "Choose a plan and complete checkout on our secure payment page. After paying, open Billing in your workspace and submit your payment reference. We verify it and activate your plan."],
  ["Is activation instant?", "Activation happens after payment is verified by our team, so it can take a short while. A redirect alone never unlocks a plan."],
  ["Can I start free?", `Yes. The free workspace includes ${FREE_LIMITS.skus} SKUs, ${FREE_LIMITS.forecasts} forecast runs and ${FREE_LIMITS.ai} AI insights per month.`],
  ["Which currency?", "Prices are listed in USD."],
];

export default function Pricing() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple plans that scale with your catalogue" image={false} cta={false}>
        <p>Start free, upgrade when you need more SKUs, forecasts or AI planning. All plans include secure storage, row-level data isolation and CSV import and export.</p>
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
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Choose {p.name}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-muted">Prefer to try first? <Link href="/signup" className="font-bold text-brand">Start free</Link></p>
      </Section>
      <Section tone="mist">
        <h2 className="h-display mb-8 text-center">Questions, answered</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map(([q, a]) => (<details key={q} className="card p-5"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-muted">{a}</p></details>))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
