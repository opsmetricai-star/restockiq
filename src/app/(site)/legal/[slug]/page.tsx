import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/site/Ui";
import { LEGAL_PAGES } from "@/lib/content";

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = LEGAL_PAGES[slug];
  if (!t) notFound();
  return (
    <>
      <PageHero title={t} image={false} cta={false} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4 text-muted">
          <p><strong className="text-navy">Draft placeholder.</strong> This policy page needs text reviewed by legal counsel before launch. No legal terms have been invented here.</p>
          <p>Questions in the meantime: use the <a className="font-bold text-brand" href="/company/contact">contact page</a>.</p>
        </div>
      </Section>
    </>
  );
}
