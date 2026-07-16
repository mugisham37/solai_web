"use client";

import { Check } from "lucide-react";
import { PriceCard } from "@/components/molecules/PriceCard";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { performancePricing, subscriptionTiers } from "@/lib/data/pricing";
import { formatPrice } from "@/lib/format";
import type { CurrencyCode } from "@/lib/format";
import type { PlanType } from "@/components/molecules/PlanToggle";

interface PricingSectionProps {
  plan: PlanType;
  currency: CurrencyCode;
}

export function PricingSection({ plan, currency }: PricingSectionProps) {
  if (plan === "performance") {
    const revenue = performancePricing.exampleRevenueUsd;
    const fee = revenue * performancePricing.feePercent;
    const keep = revenue - fee;

    return (
      <div className="mx-auto max-w-[560px]">
        <div className="relative rounded-lg border border-brand bg-surface p-7">
          <div className="mb-3 font-mono text-[11px] tracking-[0.06em] text-text-subtle uppercase">
            {performancePricing.tier}
          </div>
          <div className="text-[36px] font-semibold text-text">
            {performancePricing.rate}
            <span className="text-base font-normal text-text-muted">
              {performancePricing.rateSuffix}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            {performancePricing.desc}
          </p>
          <div className="mt-4 rounded-md border border-border bg-bg p-4">
            <p className="mb-2 text-xs text-text-subtle">
              Example at {formatPrice(revenue, currency)} monthly revenue
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Your revenue</span>
                <span className="tnum font-mono font-medium text-text">
                  {formatPrice(revenue, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">SolAI fee (8%)</span>
                <span className="tnum font-mono font-medium text-text">
                  {formatPrice(fee, currency)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span className="text-text-muted">You keep</span>
                <span className="tnum font-mono text-success">
                  {formatPrice(keep, currency)}
                </span>
              </div>
            </div>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {performancePricing.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[13px] text-text-muted"
              >
                <Check className="size-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
          <MarketingButton
            href="/contact"
            variant="cta"
            className="mt-4 w-full justify-center"
          >
            {performancePricing.cta}
          </MarketingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {subscriptionTiers.map((tier) => (
        <PriceCard key={tier.tier} tier={tier} currency={currency} />
      ))}
    </div>
  );
}
