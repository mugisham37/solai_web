"use client";

import { useState } from "react";
import { PageHeader } from "@/components/organisms/PageHeader";
import { PricingSection } from "@/components/organisms/PricingSection";
import { PlanToggle } from "@/components/molecules/PlanToggle";
import { CurrencySelect } from "@/components/molecules/CurrencySelect";
import type { CurrencyCode } from "@/lib/format";

export function PricingPageContent() {
  const [plan, setPlan] = useState<"subscription" | "performance">(
    "subscription",
  );
  const [currency, setCurrency] = useState<CurrencyCode>("US$");

  return (
    <>
      <PageHeader
        label="Pricing"
        title="Simple, transparent pricing."
        description="Two models. One audit log. We only win when you win."
      >
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <PlanToggle value={plan} onChange={setPlan} />
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
      </PageHeader>
      <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <PricingSection plan={plan} currency={currency} />
      </section>
    </>
  );
}
