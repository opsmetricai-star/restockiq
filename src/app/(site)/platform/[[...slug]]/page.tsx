import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { PLATFORM_LINKS } from "@/lib/content";

const BODY: Record<string, { lead: string; points: [string, string][] }> = {
  "": { lead: "One unified planning platform that connects demand, supply, inventory, merchandising and pricing, so every plan starts from the same data and the same logic.", points: [["Single data foundation", "Sales, stock, supplier and calendar data live in one governed model."], ["Planner-driven AI", "Transparent models with overrides, so planners stay in control."], ["Configurable by design", "Adapt rules, hierarchies and workflows without custom code."]] },
  "artificial-intelligence": { lead: "Machine-learning forecasts, anomaly detection and a generative planning assistant, built into the workflow rather than bolted on.", points: [["Forecasting models", "Seasonality, trend and promotion effects estimated per item and location."], ["Explainable output", "Every recommendation shows the numbers behind it."], ["Guardrails", "Structured outputs, validation and usage limits protect your plans."]] },
  "data-management": { lead: "A dependable data layer: import, validate, cleanse and version the data every plan depends on.", points: [["Validated imports", "Row-level checks catch bad data before it reaches a forecast."], ["Row-level security", "Each organisation sees only its own records."], ["Audit trail", "Know who changed what, and when."]] },
  integrations: { lead: "Connect the systems you already run. Start with CSV today and extend through APIs as you grow.", points: [["CSV import and export", "Products, sales history and stock levels in minutes."], ["API-ready", "Server-side endpoints for ERP, POS, WMS and e-commerce feeds."], ["Storage", "Uploaded files are kept securely per organisation."]] },
  "meet-the-agents": { lead: "Agents watch your plan around the clock, flag exceptions, and draft the action: a purchase order, a transfer, a markdown.", points: [["Stock-out watch", "Spot items that will run out before the next delivery."], ["Overstock watch", "Find slow movers tying up cash."], ["Draft actions", "Agents propose; planners approve."]] },
  sustainability: { lead: "Better planning removes waste at the source: fewer expired goods, fewer emergency shipments, less excess production.", points: [["Less spoilage", "Shelf-life aware ordering."], ["Fewer expedites", "Earlier warning means slower, cleaner transport."], ["Right-sized production", "Make what will sell."]] },
  "unified-merchandising": { lead: "Range, space, price, promotion and replenishment decisions made together, not in separate silos.", points: [["Connected decisions", "A price change updates the forecast and the order."], ["Shared constraints", "Space, supply and funding rules apply everywhere."], ["One view", "Merchants and planners share the same facts."]] },
};

export function generateStaticParams() {
  return [{ slug: [] }, ...Object.keys(BODY).filter(Boolean).map((k) => ({ slug: [k] }))];
}

export default async function PlatformPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const key = slug?.[0] ?? "";
  const b = BODY[key];
  if (!b || (slug && slug.length > 1)) notFound();
  const link = PLATFORM_LINKS.find((l) => l.href === (key ? `/platform/${key}` : "/platform"))!;
  return (
    <>
      <PageHero eyebrow="Platform" title={link.title === "Platform" ? "A unified platform for planning from production to shelf" : link.title}><p>{b.lead}</p></PageHero>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">{b.points.map(([t, d]) => (<div key={t} className="card p-8"><h3 className="text-xl font-bold">{t}</h3><p className="mt-3 text-muted">{d}</p></div>))}</div>
      </Section>
      <Section tone="mist">
        <h2 className="mb-8 text-2xl font-bold">More about the platform</h2>
        <div className="grid gap-4 md:grid-cols-3">{PLATFORM_LINKS.map((l) => (<Link key={l.href} href={l.href} className="card card-hover p-5"><div className="font-bold">{l.title}</div><div className="text-sm text-muted">{l.desc}</div></Link>))}</div>
      </Section>
      <CtaBand />
    </>
  );
}
