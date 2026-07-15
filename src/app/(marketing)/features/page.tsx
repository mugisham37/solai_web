import type { Metadata } from "next";
import { PageHeader } from "@/components/organisms/PageHeader";
import { FeaturesGrid } from "@/components/organisms/FeaturesGrid";
import { features } from "@/lib/data/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Eight capabilities that close the loop from product upload to revenue — autonomous agents, explainable AI, Africa-first payments, and compliance built in.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <PageHeader
        label="Platform"
        title="Everything SolAI does for you."
        description="Eight capabilities that close the loop from product upload to revenue."
      />
      <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <FeaturesGrid features={features} />
      </section>
    </div>
  );
}
