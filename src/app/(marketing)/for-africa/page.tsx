import { Emphasis } from "@/components/atoms/emphasis";
import { PageHeader } from "@/components/molecules/page-header";
import { AfricaGridSection } from "@/components/organisms/marketing/africa-grid-section";
import { StatsSection } from "@/components/organisms/marketing/stats-section";
import { AFRICA_STATS } from "@/data/marketing/africa";

export default function ForAfricaPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Africa"
        title={
          <>
            Built <Emphasis>from</Emphasis> Africa, <Emphasis>for</Emphasis> Africa.
          </>
        }
        subCopy="SolAI is headquartered in Kigali, Rwanda. We understand the infrastructure, the payment rails, the languages, and the opportunity."
      />
      <AfricaGridSection />
      <StatsSection stats={AFRICA_STATS} />
    </>
  );
}
