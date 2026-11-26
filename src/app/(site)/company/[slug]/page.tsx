import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { COMPANY_LINKS } from "@/lib/content";

const COPY: Record<string, string[]> = {
  about: ["RestockIQ exists to make good planning accessible. We build software that helps retailers, wholesalers and manufacturers keep the right products in the right place at the right time.", "Our platform pairs transparent forecasting with practical automation, so small planning teams can operate with the precision of much larger ones."],
  collaboration: ["Planning improves when partners share data. RestockIQ supports governed sharing of forecasts, orders and stock positions between suppliers and customers.", "We also work with consultancies and technology partners to deliver implementations."],
  contact: ["Questions about the platform, pricing or a pilot? Use the demo request form and a member of our team will reply. For existing customers, sign in and use the support option in your workspace."],
  "in-the-news": ["Press coverage and announcements will be listed here as they are published."],
  leadership: ["Leadership profiles will be added here once the team is finalised."],
  media: ["Logos, product screenshots and brand guidelines for press use will be available from this page."],
  sustainability: ["Waste is the most direct sustainability lever in supply chains. Better forecasts and shelf-life aware ordering reduce spoilage, excess production and emergency freight."],
};

export function generateStaticParams() {
  return COMPANY_LINKS.map((l) => ({ slug: l.href.split("/").pop()! }));
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = COMPANY_LINKS.find((x) => x.href.endsWith(`/${slug}`));
  if (!l) notFound();
  return (
    <>
      <PageHero eyebrow="Company" title={l.title} image={false}>{COPY[slug].map((p) => <p key={p}>{p}</p>)}</PageHero>
      <Section><div className="mx-auto max-w-3xl text-lg text-muted">Want to talk? <a className="font-bold text-brand" href="/demo-request">Request a demo</a>.</div></Section>
      <CtaBand />
    </>
  );
}
