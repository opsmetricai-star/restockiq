import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { GUIDES } from "@/lib/content";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) notFound();
  return (
    <>
      <PageHero eyebrow={g.type} title={g.title} image={false} cta={false}><p>{g.summary}</p></PageHero>
      <Section>
        <article className="mx-auto max-w-3xl space-y-5 text-[17px] leading-relaxed text-muted">
          <h2 className="text-2xl font-bold text-navy">What this guide covers</h2>
          <p>{g.summary} This page is a summary placeholder; the full long-form guide is authored in the content workflow and will be published here.</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>The problem and why it matters to planners</li>
            <li>Methods and metrics worth adopting</li>
            <li>A step-by-step implementation checklist</li>
            <li>Pitfalls to avoid</li>
          </ul>
          <Link href="/demo-request" className="btn btn-primary">Talk to an expert</Link>
        </article>
      </Section>
      <CtaBand />
    </>
  );
}
