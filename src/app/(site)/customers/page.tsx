import { PageHero, CtaBand, Section } from "@/components/site/Ui";
import { Testimonials } from "@/components/site/Testimonials";
import { CUSTOMER_LOGOS } from "@/lib/content";

export const metadata = { title: "Customers | RestockIQ" };

export default function Customers() {
  return (
    <>
      <PageHero eyebrow="Customers" title="Trusted by industry-leading retailers and manufacturers" image={false}>
        <p>Sample customer names and stories below are placeholders for design review and will be replaced with approved references.</p>
      </PageHero>
      <Section>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{CUSTOMER_LOGOS.map((n) => (<div key={n} className="card flex h-24 items-center justify-center text-lg font-bold text-navy/70">{n}</div>))}</div>
      </Section>
      <Section tone="mist"><Testimonials /></Section>
      <CtaBand />
    </>
  );
}
