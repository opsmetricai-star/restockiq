import { DemoForm } from "@/components/site/DemoForm";
import { Section } from "@/components/site/Ui";

export const metadata = { title: "Request a demo | RestockIQ" };

export default function Demo() {
  return (
    <Section tone="mist">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <h1 className="h-display">See RestockIQ on your own data</h1>
          <p className="mt-6 text-[17px] text-muted">Tell us about your operation. We will walk you through forecasting, inventory targets and automated replenishment, using a sample of your catalogue where possible.</p>
          <ul className="mt-6 list-disc space-y-2 pl-6 text-muted"><li>30-minute guided walkthrough</li><li>Fit assessment for your industry</li><li>No obligation</li></ul>
        </div>
        <DemoForm />
      </div>
    </Section>
  );
}
