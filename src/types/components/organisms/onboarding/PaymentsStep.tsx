"use client";

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentRailCard } from "@/components/molecules/onboarding/PaymentRailCard";
import { OnboardingLayout } from "@/components/organisms/onboarding/OnboardingLayout";
import { updatePaymentsAction } from "@/lib/actions/onboarding";
import { PAYMENT_RAILS } from "@/lib/onboarding/constants";
import type { OnboardingDraft, PaymentRail } from "@/types/onboarding";

interface PaymentsStepProps {
  draft: OnboardingDraft;
}

export function PaymentsStep({ draft: initialDraft }: PaymentsStepProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);

  const hasEnabledConnected = Object.values(draft.payments).some(
    (r) => r.enabled && r.status === "connected",
  );

  function updateRail(rail: PaymentRail, state: OnboardingDraft["payments"][PaymentRail]) {
    setDraft((d) => ({
      ...d,
      payments: { ...d.payments, [rail]: state },
    }));
  }

  async function handleContinue() {
    await updatePaymentsAction(draft.payments, 3);
    router.push("/onboarding/product-budget");
  }

  return (
    <OnboardingLayout
      step={2}
      onContinue={handleContinue}
      nextDisabled={!hasEnabledConnected}
    >
      <h1 className="mb-1.5 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Set up payment rails
      </h1>
      <p className="mb-7 max-w-[560px] text-[15px] text-text-muted">
        Choose how your customers will pay. You can enable multiple rails —
        SolAI&apos;s Sales Agent will offer the best option based on the
        buyer&apos;s location.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PAYMENT_RAILS.map((rail) => (
          <PaymentRailCard
            key={rail.key}
            rail={rail.key}
            label={rail.label}
            desc={rail.desc}
            tag={rail.tag}
            credentialEntry={rail.credentialEntry}
            state={draft.payments[rail.key]}
            onUpdate={updateRail}
          />
        ))}
      </div>

      {!hasEnabledConnected && (
        <p className="mt-4 text-sm text-danger" role="alert">
          Enable and connect at least one payment rail to continue. Without a
          payment method, the Sales Agent cannot generate checkout links.
        </p>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-surface px-3.5 py-3 text-[13px] text-text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <span>
          MoMo and Airtel settlements take ~24 hours. SolAI shows settlement
          status in the Orders view.
        </span>
      </div>
    </OnboardingLayout>
  );
}
