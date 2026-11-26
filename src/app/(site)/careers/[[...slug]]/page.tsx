import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { CAREER_LINKS } from "@/lib/content";

export function generateStaticParams() {
  return [{ slug: [] }, ...CAREER_LINKS.slice(1).map((l) => ({ slug: [l.href.split("/").pop()!] }))];
}

export default async function Careers({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const key = slug?.[0];
  const l = key ? CAREER_LINKS.find((x) => x.href.endsWith(`/${key}`)) : CAREER_LINKS[0];
  if (!l || (slug && slug.length > 1)) notFound();
  return (
    <>
      <PageHero eyebrow="Careers" title={key ? l.title : "Help us build the future of planning"} image={false}>
        <p>We are a small team solving a large, practical problem. {key ? `Learn what ${l.title.toLowerCase()} looks like at RestockIQ.` : "Explore the teams below."}</p>
        <p>No openings are published yet. Check back soon.</p>
      </PageHero>
      <Section>
        <div className="grid gap-4 md:grid-cols-3">{CAREER_LINKS.slice(1).map((c) => (<a key={c.href} href={c.href} className="card card-hover p-5 font-bold">{c.title}</a>))}</div>
      </Section>
      <CtaBand title="Want to work with us?" text="Send us a note through the contact page and we will keep you in mind." primary={{ href: "/company/contact", label: "Contact us" }} secondary={{ href: "/company/about", label: "About us" }} />
    </>
  );
}
