import Link from "next/link";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { SOLUTIONS, SOLUTION_GROUPS } from "@/lib/content";

export const metadata = { title: "Solutions | RestockIQ" };

export default function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="AI-native planning that drives profitable growth">
        <p>RestockIQ Solutions give retailers, manufacturers and wholesalers one platform for deciding and acting across demand, inventory, merchandising, pricing and supply chain operations.</p>
        <p>Built on a unified data foundation, every module shares the same forecasts, constraints and inventory positions, so teams scale new capabilities at their own pace.</p>
      </PageHero>
      {SOLUTION_GROUPS.map((g, n) => (
        <Section key={g} tone={n % 2 ? "mist" : "white"}>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">{g}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.filter((s) => s.group === g).map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="card card-hover block p-7">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.summary}</p>
                <div className="mt-4 font-bold text-brand">Learn more →</div>
              </Link>
            ))}
          </div>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
