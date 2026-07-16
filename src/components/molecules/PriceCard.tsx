"use client";

import { Check } from "lucide-react";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { CurrencyCode } from "@/lib/format";
import type { PricingTier } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  tier: PricingTier;
  currency: CurrencyCode;
  className?: string;
}

export function PriceCard({ tier, currency, className }: PriceCardProps) {
  const ctaHref =
    tier.cta === "Talk to sales"
      ? "/contact"
      : "/signup";

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface p-7",
        tier.featured && "border-brand",
        className,
      )}
    >
      {tier.featured && (
        <Badge className="absolute -top-3 left-6 rounded-sm bg-brand px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-white uppercase">
          Most popular
        </Badge>
      )}
      <div className="mb-3 font-mono text-[11px] tracking-[0.06em] text-text-subtle uppercase">
        {tier.tier}
      </div>
      <div className="tnum font-mono text-[clamp(28px,3vw,40px)] font-semibold text-text">
        {formatPrice(tier.priceUsd, currency)}
        {tier.priceUsd > 0 && (
          <span className="text-base font-normal text-text-muted">/month</span>
        )}
      </div>
      {tier.period && (
        <p className="mt-1 text-[13px] text-text-subtle">{tier.period}</p>
      )}
      {tier.annualUsd !== undefined && tier.priceUsd > 0 && (
        <p className="mt-1 text-[13px] text-text-subtle">
          {formatPrice(tier.annualUsd, currency)} paid annually
        </p>
      )}
      <p className="mt-3 mb-4 text-sm leading-relaxed text-text-muted">
        {tier.desc}
      </p>
      <ul className="mb-5 flex flex-col gap-2">
        {tier.features.map((feature) => {
          const label = feature.includes("US$ 10,000")
            ? `Up to ${formatPrice(10000, currency)}/mo ad spend`
            : feature;
          return (
          <li
            key={feature}
            className="flex items-center gap-2 text-[13px] text-text-muted"
          >
            <Check className="size-4 shrink-0 text-success" strokeWidth={1.5} />
            {label}
          </li>
          );
        })}
      </ul>
      <MarketingButton
        href={ctaHref}
        variant={tier.ctaVariant === "primary" ? "cta" : "secondary"}
        className="w-full justify-center"
      >
        {tier.cta}
      </MarketingButton>
    </div>
  );
}
