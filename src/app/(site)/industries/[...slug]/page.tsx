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
  const picks = SOLUTIONS.filter((_, n) => (n + title.length) % 4 === 0).slice(0, 6);
  const challenges = [
    ["Volatile demand", "Seasonality, promotions and local events make static rules unreliable."],
    ["Tight margins", "Overstock and stock-outs both erode profit. Balance is the goal."],
    ["Fragmented systems", "Data lives in ERP, POS and spreadsheets that rarely agree."],
  ];
  return (
    <>
      <PageHero eyebrow={child ? parent.title : "Industry"} title={`Planning for ${title.toLowerCase()}`}>
        <p>{title} teams face demand swings, supplier variability and pressure on margin. RestockIQ brings forecasting, inventory and replenishment into one governed workflow so planners spend time on decisions, not data wrangling.</p>
      </PageHero>
      <Section>
        <h2 className="h-display mb-10 text-center">Challenges we help solve</h2>
        <div className="grid gap-6 md:grid-cols-3">{challenges.map(([t, d]) => (<div key={t} className="card p-8"><h3 className="text-xl font-bold">{t}</h3><p className="mt-3 text-muted">{d}</p></div>))}</div>
      </Section>
      <Section tone="mist">
        <h2 className="mb-8 text-2xl font-bold">Recommended solutions</h2>
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
