"use client";
import Link from "next/link";
import { useState } from "react";
import { SOLUTIONS } from "@/lib/content";

const TABS = [
  { id: "ret", label: "Retailers", title: "Keep every shelf and every channel in stock without overbuying", body: ["Retail margin is lost in two places: sales missed to stockouts and cash trapped in slow movers. RestockIQ forecasts each SKU, sets a service-level-driven reorder point, and raises the order before the gap appears.", "Planners review exceptions the AI analyst has already ranked, instead of scanning thousands of rows."] },
  { id: "dist", label: "Wholesalers and distributors", title: "Hold the stock that serves demand across every customer and lane", body: ["Long lead times and thin margins punish both shortage and surplus. RestockIQ sizes safety stock from real demand variability and supplier lead time, then converts the result into supplier-grouped purchase orders.", "Minimum order quantities are respected automatically, so recommended orders are ready to send."] },
  { id: "mfg", label: "Manufacturers", title: "Align purchasing of materials and finished goods with demand signals", body: ["Production and procurement decisions depend on knowing what will sell. RestockIQ gives operations teams a measured demand forecast per item and the replenishment quantity that protects the target service level.", "Forecast accuracy is reported for every SKU, so planners know exactly where to trust the model and where to intervene."] },
];

export function ValueChain() {
  const [i, setI] = useState(0);
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
      <div className="card grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="text-2xl font-bold md:text-3xl">{t.title}</h3>
          <div className="mt-5 space-y-4 leading-relaxed text-muted">{t.body.map((p) => <p key={p}>{p}</p>)}</div>
          <Link href="/signup" className="btn btn-primary mt-7">Create account</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}`} className="rounded-2xl bg-mist p-5 transition hover:bg-sky">
              <div className="mb-1 text-[13px] font-bold uppercase tracking-wide text-brand">{s.group}</div>
              <div className="font-bold">{s.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
