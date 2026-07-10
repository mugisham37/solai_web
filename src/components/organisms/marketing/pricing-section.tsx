"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { PageHeader } from "@/components/molecules/page-header";
import { PriceCard } from "@/components/molecules/price-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { CURRENCY_RATES, PERFORMANCE_PRICING, PRICE_TIERS } from "@/data/marketing/pricing";
import type { CurrencyCode } from "@/types/marketing";

const PLAN_OPTIONS = [
  { id: "subscription", label: "Subscription" },
  { id: "performance", label: "Performance" },
] as const;

type PlanId = (typeof PLAN_OPTIONS)[number]["id"];

const CURRENCY_CODES = Object.keys(CURRENCY_RATES) as CurrencyCode[];

export function PricingSection() {
  const [plan, setPlan] = useState<PlanId>("subscription");
  const [currency, setCurrency] = useState<CurrencyCode>("US$");

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple, transparent pricing."
        subCopy="Two models. One audit log. We only win when you win."
      >
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="inline-flex gap-0.5 rounded-md border border-border bg-surface-2 p-[3px]">
            {PLAN_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlan(option.id)}
                className={cn(
                  "rounded px-4.5 py-2 text-[13px] font-medium text-text-muted transition-colors duration-150 ease-brand",
                  plan === option.id && "bg-brand text-white",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="rounded-md border border-border bg-bg px-3 py-2 font-mono text-[13px] text-text"
          >
            {CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
        {plan === "subscription" ? (
          <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.08}>
            {PRICE_TIERS.map((tier) => (
              <PriceCard key={tier.tierLabel} tier={tier} currency={currency} />
            ))}
          </StaggerGroup>
        ) : (
          <div className="mx-auto max-w-[560px] rounded-lg border border-brand bg-surface p-7">
            <div className="mb-3 font-mono text-[11px] tracking-[0.06em] text-text-subtle uppercase">
              {PERFORMANCE_PRICING.label}
            </div>
            <div className="text-[36px] font-mono font-semibold text-text">
              {PERFORMANCE_PRICING.feePercent}%
              <span className="text-base font-normal text-text-muted">
                {" "}
                of attributed revenue
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              {PERFORMANCE_PRICING.description}
            </p>
            <div className="mt-4 rounded-md border border-border bg-bg p-4">
              <p className="mb-2 text-xs text-text-subtle">
                Example at {formatCurrency(PERFORMANCE_PRICING.exampleRevenueUsd, currency)}{" "}
                monthly revenue
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Your revenue</span>
                  <span className="font-mono font-medium tabular-nums text-text">
                    {formatCurrency(PERFORMANCE_PRICING.exampleRevenueUsd, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">
                    SolAI fee ({PERFORMANCE_PRICING.feePercent}%)
                  </span>
                  <span className="font-mono font-medium tabular-nums text-text">
                    {formatCurrency(
                      (PERFORMANCE_PRICING.exampleRevenueUsd * PERFORMANCE_PRICING.feePercent) /
                        100,
                      currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                  <span className="text-text-muted">You keep</span>
                  <span className="font-mono tabular-nums text-success">
                    {formatCurrency(
                      PERFORMANCE_PRICING.exampleRevenueUsd -
                        (PERFORMANCE_PRICING.exampleRevenueUsd * PERFORMANCE_PRICING.feePercent) /
                          100,
                      currency,
                    )}
                  </span>
                </div>
              </div>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {PERFORMANCE_PRICING.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-[13px] text-text-muted"
                >
                  <Check size={16} className="shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
            <CtaButtonLink
              cta={PERFORMANCE_PRICING.cta}
              variant="cta"
              className="mt-4 w-full justify-center"
            />
          </div>
        )}
      </section>
    </>
  );
}
