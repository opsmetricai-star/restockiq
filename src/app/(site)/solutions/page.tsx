import Link from "next/link";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { SOLUTIONS, SOLUTION_GROUPS } from "@/lib/content";

export const metadata = { title: "Solutions | RestockIQ" };

export default function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Five AI capabilities, one planning engine">
        <p>Forecasting, inventory optimization, replenishment, procurement and AI analysis share one data model, so each decision builds on the last.</p>
        <p>Each capability produces a number you can audit and an action you can execute.</p>
      </PageHero>
      {SOLUTION_GROUPS.map((g, n) => (
        <Section key={g} tone={n % 2 ? "mist" : "white"}>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">{g}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.filter((s) => s.group === g).map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="card card-hover block p-7">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.summary}</p>
                
              </Link>
            ))}
          </div>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
