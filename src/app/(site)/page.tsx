import Link from "next/link";
import { HeroIllustration, CtaBand, Section } from "@/components/site/Ui";
import { ValueChain } from "@/components/site/ValueChain";

const engine = [
  ["Predicts", "Every SKU is modeled on its own sales history. Competing forecast methods are backtested and the most accurate one is selected automatically."],
  ["Decides", "Safety stock, reorder points and order quantities are computed from lead time, demand variability and the service level you set."],
  ["Automates", "Recommended orders are grouped by supplier into purchase orders, and receipts update stock without manual re-keying."],
  ["Analyzes", "An AI analyst reads your live plan, ranks the risks and recommends the next action, using only numbers the engine has computed."],
];

const outcomes = [
  ["Revenue", "Stockouts are flagged before they happen, so demand is served instead of lost."],
  ["Cost", "Excess and slow-moving stock is surfaced, releasing working capital tied up on shelves."],
  ["Speed", "Replenishment decisions that took a weekly review now update the moment data changes."],
  ["Risk", "Forecast error is measured for every SKU, so teams know where to trust the model and where to intervene."],
];

export default function Home() {
  return (
    <>
      <section className="hero-grid">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="fade-up">
            <h1 className="h-display">The AI engine that decides what to buy, where and when</h1>
            <p className="mt-6 text-[18px] leading-relaxed text-muted">RestockIQ forecasts demand, sets inventory targets and generates replenishment orders for every SKU and location. Operations teams cut stockouts and release working capital, with every decision backed by a measured model.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup" className="btn btn-primary">Create account</Link>
              <Link href="/login" className="btn btn-outline">Sign in</Link>
            </div>
          </div>
          <HeroIllustration className="mx-auto w-full max-w-[540px]" />
        </div>
      </section>

      <Section tone="mist">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="h-display">AI is the engine, not an add-on</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">Four capabilities run on one data model, so every order traces back to the same demand signal and the same service-level policy.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {engine.map(([t, d], n) => (
            <div key={t} className="card p-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">{n + 1}</div>
              <h3 className="text-xl font-bold">{t}</h3>
              <p className="mt-3 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="h-display mx-auto mb-10 max-w-3xl text-center">Built for the teams that run supply</h2>
        <ValueChain />
      </Section>

      <Section tone="mist">
        <h2 className="h-display mx-auto mb-10 max-w-3xl text-center">Outcomes the business can measure</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {outcomes.map(([t, d]) => (
            <div key={t} className="card p-7">
              <div className="text-sm font-bold uppercase tracking-widest text-brand">{t}</div>
              <p className="mt-3 text-[17px]">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h-display">From first upload to first purchase order in one session</h2>
            <ol className="mt-8 space-y-5">
              {["Import products and daily sales history from CSV.", "Run a forecast. The engine selects the best model per SKU.", "Review reorder points, safety stock and suggested quantities.", "Generate supplier-grouped purchase orders and track receipt."].map((s, n) => (
                <li key={s} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky font-bold text-brand">{n + 1}</span><span className="pt-0.5 text-[17px]">{s}</span></li>
              ))}
            </ol>
          </div>
          <div className="card bg-sky p-10">
            <h3 className="text-2xl font-bold">Measured, not assumed</h3>
            <p className="mt-4 text-muted">Every forecast is backtested against held-out history and reported as WAPE and bias. The AI analyst never invents figures: it receives the engine&apos;s computed results and explains them.</p>
            <Link href="/platform/artificial-intelligence" className="mt-6 inline-block font-bold text-brand">How the AI works</Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
