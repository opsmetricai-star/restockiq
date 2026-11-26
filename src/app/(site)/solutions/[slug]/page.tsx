import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { SOLUTIONS } from "@/lib/content";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTIONS.find((x) => x.slug === slug);
  return { title: s ? `${s.title} | RestockIQ` : "Solution" };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SOLUTIONS.find((x) => x.slug === slug);
  if (!s) notFound();
  const related = SOLUTIONS.filter((x) => x.group === s.group && x.slug !== s.slug).slice(0, 3);
  const benefits = [
    ["One source of truth", `${s.title} runs on the same forecasts, constraints and stock positions as every other module, so teams act on identical numbers.`],
    ["Automation with exceptions", "Routine decisions execute automatically. Planners step in only where judgment adds value, with full context."],
    ["Measurable results", `Track the effect on service level and stock value. Business goal: ${s.outcome.charAt(0).toLowerCase() + s.outcome.slice(1)}.`],
  ];
  const steps = [
    ["Load your data", "Import products, stock and daily sales history from CSV."],
    ["Set your policy", "Define service level, lead time, cost and minimum order quantity per SKU."],
    ["Compute", "The engine produces forecasts, targets and recommended actions with transparent logic."],
    ["Execute", "Turn recommendations into purchase orders and track receipt against plan."],
  ];
  return (
    <>
      <PageHero eyebrow={s.group} title={s.title}>
        <p>{s.summary}</p>
        <p className="font-bold text-navy">{s.outcome}.</p>
      </PageHero>
      <Section>
        <h2 className="h-display mb-10 text-center">What {s.title.toLowerCase()} delivers</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map(([t, d]) => (<div key={t} className="card p-8"><h3 className="text-xl font-bold">{t}</h3><p className="mt-3 text-muted">{d}</p></div>))}
        </div>
      </Section>
      <Section tone="mist">
        <h2 className="h-display mb-10 text-center">How it works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <div key={t} className="card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</div>
              <h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      {related.length > 0 && (
        <Section>
          <h2 className="mb-8 text-2xl font-bold">Related solutions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (<Link key={r.slug} href={`/solutions/${r.slug}`} className="card card-hover block p-6"><h3 className="font-bold">{r.title}</h3><p className="mt-2 text-sm text-muted">{r.summary}</p></Link>))}
          </div>
        </Section>
      )}
      <CtaBand />
    </>
  );
}
