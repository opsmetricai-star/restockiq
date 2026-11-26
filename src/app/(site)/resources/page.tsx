import Link from "next/link";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { GUIDES, FEATURED_RESOURCES } from "@/lib/content";

export const metadata = { title: "Resources | RestockIQ" };

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Guides, reports and videos for planning leaders" image={false} cta={false}>
        <p>Practical material on forecasting, inventory, pricing and supply chain strategy.</p>
      </PageHero>
      <Section>
        <h2 className="mb-6 text-2xl font-bold">Featured</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURED_RESOURCES.map((r) => (<div key={r.title} className="card p-7"><span className="rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase text-brand">{r.type}</span><h3 className="mt-3 text-lg font-bold">{r.title}</h3><p className="mt-2 text-muted">{r.desc}</p></div>))}
        </div>
      </Section>
      <Section tone="mist">
        <h2 className="mb-6 text-2xl font-bold">Helpful guides</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (<Link key={g.slug} href={`/resources/${g.slug}`} className="card card-hover block p-6"><span className="rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase text-brand">{g.type}</span><h3 className="mt-3 font-bold leading-snug">{g.title}</h3><p className="mt-2 text-sm text-muted">{g.summary}</p></Link>))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
