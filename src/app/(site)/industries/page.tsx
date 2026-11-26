import Link from "next/link";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { INDUSTRIES } from "@/lib/content";

export const metadata = { title: "Industries | RestockIQ" };

export default function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Planning built for how your industry actually works">
        <p>From grocery shelves to factory floors, RestockIQ adapts to the demand patterns, lead times and shelf-life rules of each sector.</p>
      </PageHero>
      {INDUSTRIES.map((i, n) => (
        <Section key={i.slug} tone={n % 2 ? "mist" : "white"}>
          <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-bold md:text-3xl">{i.title}</h2><Link href={`/industries/${i.slug}`} className="font-bold text-brand">Overview →</Link></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {i.children?.map((c) => (<Link key={c.slug} href={`/industries/${i.slug}/${c.slug}`} className="card card-hover p-5 font-bold">{c.title}</Link>))}
          </div>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
