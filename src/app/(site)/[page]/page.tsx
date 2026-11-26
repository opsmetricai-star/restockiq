import { notFound } from "next/navigation";
import { PageHero, CtaBand, Section } from "@/components/site/Ui";

const PAGES: Record<string, { title: string; text: string }> = {
  community: { title: "Community", text: "A place for planners to swap practices, ask questions and shape the roadmap. Community access opens to customers after onboarding." },
  partners: { title: "Partners", text: "Implementation, consulting and technology partners help customers go live faster. Partner programme details will be published here." },
  analysts: { title: "Analysts", text: "Information for industry analysts and independent reviewers who evaluate planning software." },
  events: { title: "Events", text: "Webinars and conference appearances will be listed here. No upcoming events are scheduled yet." },
  news: { title: "News", text: "Product releases and company announcements will appear here." },
  search: { title: "Search", text: "Site search is coming soon. For now, browse Solutions, Industries and Resources from the main menu." },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export default async function Misc({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = PAGES[page];
  if (!p) notFound();
  return (
    <>
      <PageHero title={p.title} image={false}><p>{p.text}</p></PageHero>
      <Section><p className="mx-auto max-w-3xl text-muted">Have something specific in mind? <a href="/company/contact" className="font-bold text-brand">Contact us</a>.</p></Section>
      <CtaBand />
    </>
  );
}
