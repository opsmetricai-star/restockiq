import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/site/Ui";

const DOCS: Record<string, { title: string; sections: [string, string][] }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      ["Information we collect", "We collect the account details you provide (name, company, email), the business data you upload (products, stock, sales history, purchase orders), and basic usage data such as plan consumption."],
      ["How we use it", "We use your data to operate RestockIQ: to produce forecasts, replenishment recommendations and AI analyses for your account, to bill and support you, and to secure the service."],
      ["AI processing", "When you request an AI analysis, a summary of your planning data is sent to our AI provider to generate the response. Your data is not used to build any other customer's plan."],
      ["Storage and isolation", "Data is stored with our database provider, with row-level security so each account can access only its own records. Uploaded files are held in private storage scoped to your account."],
      ["Retention and deletion", "You may delete products, orders and files at any time. To close your account and remove associated data, write to us from the email address on your account."],
      ["Your rights", "You may access, correct or delete your personal information. Requests are handled from the email address registered to the account."],
    ],
  },
  "terms-of-use": {
    title: "Terms of Use",
    sections: [
      ["Service", "RestockIQ provides inventory forecasting, replenishment recommendations and AI-generated analysis for business use. Recommendations support, but do not replace, your own purchasing judgment."],
      ["Accounts", "You are responsible for the accuracy of the data you upload and for activity under your account. Keep your credentials confidential."],
      ["Plans and billing", "Paid plans are billed monthly in US dollars and are activated after payment verification. Usage limits apply per plan and reset monthly."],
      ["Acceptable use", "You may not misuse the service, attempt to access another account's data, or interfere with its operation."],
      ["Availability and liability", "We work to keep the service available but do not guarantee uninterrupted operation. Forecasts are statistical estimates and carry error; the service is provided without warranty of specific business results."],
      ["Changes", "We may update these terms. Continued use after an update constitutes acceptance."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DOCS[slug];
  if (!d) notFound();
  return (
    <>
      <PageHero title={d.title} image={false} cta={false} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8">
          {d.sections.map(([h, t]) => (<div key={h}><h2 className="text-xl font-bold">{h}</h2><p className="mt-2 leading-relaxed text-muted">{t}</p></div>))}
        </div>
      </Section>
    </>
  );
}
