import { PageHeader } from "@/components/molecules/page-header";
import { FeaturesGridSection } from "@/components/organisms/marketing/features-grid-section";

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Everything SolAI does for you."
        subCopy="Eight capabilities that close the loop from product upload to revenue."
      />
      <FeaturesGridSection />
    </>
  );
}
