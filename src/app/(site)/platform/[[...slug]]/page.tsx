import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { PLATFORM_LINKS } from "@/lib/content";

const BODY: Record<string, { title: string; lead: string; points: [string, string][] }> = {
  "": { title: "One AI engine that decides what to buy, where and when", lead: "RestockIQ puts forecasting, inventory targets and replenishment on a single data model, so every order is derived from the same demand signal and the same service-level policy.", points: [["Forecast", "Each SKU is modeled on its own sales history, with competing methods backtested and the most accurate one selected."], ["Decide", "Safety stock, reorder points and order quantities are computed per SKU from lead time, demand variability and target service level."], ["Act", "Recommended orders become supplier-grouped purchase orders in one step, and receipts update stock."]] },
  "artificial-intelligence": { title: "Artificial intelligence at the center of every plan", lead: "Statistical models produce the numbers. A generative analyst reads those numbers and tells your team what matters and what to do next.", points: [["Model selection by backtest", "Moving average and exponential smoothing variants compete on your holdout data. Accuracy is reported as WAPE for every SKU."], ["Grounded analysis", "The AI analyst receives only your computed forecasts and stock positions, returns structured output, and is validated before display."], ["Governed usage", "Monthly AI and forecast quotas per plan keep spend predictable for operations teams."]] },
  "data-management": { title: "Planning data you can trust", lead: "Reliable decisions need reliable inputs. RestockIQ validates every import and isolates every organization's data.", points: [["Validated imports", "CSV rows are checked field by field. Invalid rows are rejected with the reason, and valid rows load."], ["Row-level isolation", "Database policies ensure each account can read and write only its own records."], ["Private file storage", "Uploaded source files are stored privately, in a folder scoped to your account."]] },
};

export function generateStaticParams() {
  return [{ slug: [] }, ...Object.keys(BODY).filter(Boolean).map((k) => ({ slug: [k] }))];
}

export default async function PlatformPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const key = slug?.[0] ?? "";
  const b = BODY[key];
  if (!b || (slug && slug.length > 1)) notFound();
  return (
    <>
      <PageHero eyebrow="Platform" title={b.title}><p>{b.lead}</p></PageHero>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">{b.points.map(([t, d]) => (<div key={t} className="card p-8"><h3 className="text-xl font-bold">{t}</h3><p className="mt-3 text-muted">{d}</p></div>))}</div>
      </Section>
      <Section tone="mist">
        <div className="grid gap-4 md:grid-cols-3">{PLATFORM_LINKS.map((l) => (<Link key={l.href} href={l.href} className="card card-hover p-5"><div className="font-bold">{l.title}</div><div className="text-sm text-muted">{l.desc}</div></Link>))}</div>
      </Section>
      <CtaBand />
    </>
  );
}
