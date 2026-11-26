import { PageTitle } from "@/components/app/ui";
import { Assistant } from "@/components/app/Actions";

export default function AssistantPage() {
  return (
    <>
      <PageTitle title="AI assistant" sub="Gemini explains your plan. All numbers come from the deterministic planning engine." />
      <Assistant />
    </>
  );
}
