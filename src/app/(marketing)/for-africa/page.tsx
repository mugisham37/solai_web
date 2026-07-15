import type { Metadata } from "next";
import { PageHeader } from "@/components/organisms/PageHeader";
import { AfricaGrid } from "@/components/organisms/AfricaGrid";
import { StatsSection } from "@/components/organisms/StatsSection";
import { africaCards } from "@/lib/data/africa";
import { africaStats } from "@/lib/data/stats";

export const metadata: Metadata = {
  title: "For Africa",
  description:
    "Built from Africa, for Africa — payment rails, WhatsApp-first commerce, four languages, data residency in AWS af-south-1.",
};

export default function ForAfricaPage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <PageHeader
        label="For Africa"
        title={
          <>
            Built <em>from</em> Africa, <em>for</em> Africa.
          </>
        }
        description="SolAI is headquartered in Kigali, Rwanda. We understand the infrastructure, the payment rails, the languages, and the opportunity."
      />
      <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <AfricaGrid cards={africaCards} />
      </section>
      <StatsSection stats={africaStats} />
    </div>
  );
}
