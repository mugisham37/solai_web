import { Check } from "lucide-react";

import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { AD_SPEND_CAP_TOKEN, AD_SPEND_CAP_USD } from "@/data/marketing/pricing";
import type { CurrencyCode, PriceTier } from "@/types/marketing";

interface PriceCardProps {
  tier: PriceTier;
  currency: CurrencyCode;
}

export function PriceCard({ tier, currency }: PriceCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface p-7",
        tier.featured && "border-brand",
      )}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-6 rounded-sm bg-brand px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.04em] text-white uppercase">
          Most popular
        </span>
      )}
      <div className="mb-3 font-mono text-[11px] tracking-[0.06em] text-text-subtle uppercase">
        {tier.tierLabel}
      </div>
      <div className="font-mono text-[clamp(28px,3vw,40px)] font-semibold tabular-nums text-text">
        {formatCurrency(tier.amountUsd, currency)}
        {tier.period === "monthly" && (
          <span className="text-base font-normal text-text-muted">/month</span>
        )}
      </div>
      <p className="mt-1 mb-3 text-[13px] text-text-subtle">
        {tier.period === "free"
          ? "Free forever"
          : `${formatCurrency(tier.annualNoteUsd ?? 0, currency)} paid annually`}
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-muted">{tier.description}</p>
      <ul className="mb-5 flex flex-col gap-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-[13px] text-text-muted">
            <Check size={16} className="shrink-0 text-success" />
            {feature === AD_SPEND_CAP_TOKEN
              ? `Up to ${formatCurrency(AD_SPEND_CAP_USD, currency)}/mo ad spend`
              : feature}
          </li>
        ))}
      </ul>
      <CtaButtonLink
        cta={tier.cta}
        variant={tier.featured ? "cta" : "secondary"}
        className="w-full justify-center"
      />
    </div>
  );
}
