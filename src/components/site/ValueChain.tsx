"use client";
import Link from "next/link";
import { useState } from "react";
import { SOLUTIONS } from "@/lib/content";

const TABS = [
  { id: "mfg", label: "Manufacturers", tag: "Raw material", title: "Balance supply with demand across every tier, from suppliers to stores", body: ["RestockIQ lets manufacturers balance supply with demand through connected master planning and end-to-end visibility, so decisions are faster and margins hold. Data flows cleanly across every tier for accurate demand signals, right-sized inventory and efficient production schedules.", "Scenario planning, real-time visibility and automated replenishment keep supply chains aligned from supplier to store while costs fall and service levels rise."], groups: ["Demand Planning", "Manufacturing Planning", "Strategic Planning", "Diagnostics", "Inventory & Replenishment", "Collaboration"] },
  { id: "dist", label: "Distributors", tag: "Distribution", title: "Fulfill demand across every channel with maximum service levels and minimum waste", body: ["Wholesalers and distributors serve many channels on thin margins, with little tolerance for spoilage, supplier delays or capacity limits.", "RestockIQ helps them anticipate demand in every channel and meet it at high service levels while keeping waste and obsolete stock low."], groups: ["Demand Planning", "Inventory & Replenishment", "Diagnostics", "Collaboration", "Retail Operations", "Pricing & Promotions"] },
  { id: "ret", label: "Retailers", tag: "Retail", title: "Automate and optimize planning across your supply chain", body: ["Retailers struggle with siloed planning, disconnected systems and low automation, and they lack continuous end-to-end visibility.", "With RestockIQ they gain visibility, automation and actionable insight for accurate planning from supplier to shelf. The platform is configurable, so teams adapt it to their own business rules and grow."], groups: ["Demand Planning", "Fresh Operations", "Inventory & Replenishment", "Space & Assortment", "Retail Operations", "Strategic Planning", "Pricing & Promotions", "Collaboration", "Diagnostics"] },
  { id: "con", label: "Consumers", tag: "Shopper", title: "Scale as your business evolves", body: ["Consumers get the products they want, however they choose to shop, when the whole chain works from a shared view of demand, inventory and supply.", "Talk to us about how a unified platform can drive profitable growth across your sales and distribution channels."], groups: ["Demand Planning", "Inventory & Replenishment", "Space & Assortment", "Pricing & Promotions"] },
];

export function ValueChain() {
  const [i, setI] = useState(2);
  const t = TABS[i];
  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-3" role="tablist">
        {TABS.map((x, n) => (
          <button key={x.id} role="tab" aria-selected={n === i} onClick={() => setI(n)}
            className={`rounded-full border-2 px-6 py-3 font-bold transition ${n === i ? "border-brand bg-brand text-white" : "border-line bg-white text-navy hover:border-brand"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="card grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-widest text-brand">{t.tag}</div>
          <h3 className="text-2xl font-bold md:text-3xl">{t.title}</h3>
          <div className="mt-5 space-y-4 leading-relaxed text-muted">{t.body.map((p) => <p key={p}>{p}</p>)}</div>
          <Link href="/demo-request" className="btn btn-primary mt-7">Request a demo</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {t.groups.map((g) => (
            <div key={g} className="rounded-2xl bg-mist p-5">
              <div className="mb-2 text-[13px] font-bold uppercase tracking-wide text-brand">{g}</div>
              <ul className="space-y-1 text-[15px]">
                {SOLUTIONS.filter((s) => s.group === g).map((s) => (
                  <li key={s.slug}><Link href={`/solutions/${s.slug}`} className="hover:text-brand hover:underline">{s.title}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
