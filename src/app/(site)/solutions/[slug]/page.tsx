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
    ["Decisions grounded in data", `${s.title} uses one shared set of forecasts, constraints and inventory positions, so every team plans from the same numbers.`],
    ["Automation where it counts", "Routine decisions run on their own. Planners step in only on exceptions, with the context needed to decide quickly."],
    ["Measurable results", `Track the effect on service level, stock value and waste. Typical goal: ${s.outcome.toLowerCase()}.`],
  ];
  const steps = [
    ["Connect your data", "Import sales, stock, supplier and calendar data through CSV or integrations."],
    ["Model the business", "Set service targets, lead times, shelf-life and cost parameters per item and location."],
    ["Generate recommendations", "The engine computes forecasts, targets and proposed actions with transparent logic."],
    ["Act and learn", "Approve, adjust or automate. Outcomes feed back to improve the next cycle."],
  ];
  return (
    <>
      <PageHero eyebrow={s.group} title={s.title}>
        <p>{s.summary}</p>
        <p className="font-bold text-navy">{s.outcome}.</p>
      </PageHero>
      <Section>
        <h2 className="h-display mb-10 text-center">Why teams choose {s.title.toLowerCase()} with RestockIQ</h2>
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
