import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { INDUSTRIES, SOLUTIONS } from "@/lib/content";

export function generateStaticParams() {
  return INDUSTRIES.flatMap((i) => [{ slug: [i.slug] }, ...(i.children ?? []).map((c) => ({ slug: [i.slug, c.slug] }))]);
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const parent = INDUSTRIES.find((i) => i.slug === slug[0]);
  if (!parent || slug.length > 2) notFound();
  const child = slug[1] ? parent.children?.find((c) => c.slug === slug[1]) : undefined;
  if (slug[1] && !child) notFound();
  const title = child?.title ?? parent.title;
  const picks = SOLUTIONS;
  const challenges = [
    ["Volatile demand", "Seasonality, promotions and local events make static reorder rules unreliable."],
    ["Tight margins", "Stockouts lose revenue and overstock traps cash. Both are priced into every order."],
    ["Fragmented data", "Sales, stock and supplier data sit in separate files that rarely agree."],
  ];
  return (
    <>
      <PageHero eyebrow={child ? parent.title : "Industry"} title={`AI inventory planning for ${title.toLowerCase()}`}>
        <p>{title} operators carry demand swings, supplier variability and margin pressure. RestockIQ forecasts each SKU, sets service-level-driven reorder points and generates the purchase orders, so planners manage exceptions instead of spreadsheets.</p>
      </PageHero>
      <Section>
        <h2 className="h-display mb-10 text-center">Challenges we help solve</h2>
        <div className="grid gap-6 md:grid-cols-3">{challenges.map(([t, d]) => (<div key={t} className="card p-8"><h3 className="text-xl font-bold">{t}</h3><p className="mt-3 text-muted">{d}</p></div>))}</div>
      </Section>
      <Section tone="mist">
        <h2 className="mb-8 text-2xl font-bold">Capabilities deployed</h2>
        <div className="grid gap-6 md:grid-cols-3">{picks.map((s) => (<Link key={s.slug} href={`/solutions/${s.slug}`} className="card card-hover block p-6"><h3 className="font-bold">{s.title}</h3><p className="mt-2 text-sm text-muted">{s.summary}</p></Link>))}</div>
      </Section>
      {!child && parent.children && (
        <Section>
          <h2 className="mb-8 text-2xl font-bold">Segments</h2>
          <div className="grid gap-4 md:grid-cols-3">{parent.children.map((c) => (<Link key={c.slug} href={`/industries/${parent.slug}/${c.slug}`} className="card card-hover p-5 font-bold">{c.title}</Link>))}</div>
        </Section>
      )}
      <CtaBand />
    </>
  );
}
