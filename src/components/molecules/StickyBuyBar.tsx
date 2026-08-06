"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import type { Money } from "@/types/money";
import { cn } from "@/lib/cn";

type StickyBuyBarProps = {
  total: Money;
  locale: string;
  totalLabel: string;
  askLabel: string;
  askAria: string;
  buyLabel: string;
  onAsk: () => void;
  onBuy: () => void;
  buyPending?: boolean;
  className?: string;
};

export function StickyBuyBar({
  total,
  locale,
  totalLabel,
  askLabel,
  askAria,
  buyLabel,
  onAsk,
  onBuy,
  buyPending,
  className,
}: StickyBuyBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-28 shrink-0 border-t border-hair bg-paper/95 backdrop-blur-[14px]",
        "px-3.5 py-2.5 pb-[calc(0.7rem+env(safe-area-inset-bottom))] @[700px]:px-6",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1100px] items-center gap-2.5">
        <div className="shrink-0">
          <span className="block text-[0.74rem] text-ink-45">{totalLabel}</span>
          <MoneyDisplay value={total} locale={locale} className="text-d3" />
        </div>
        <ActionButton type="button" variant="line" onClick={onAsk} aria-label={askAria}>
          <Icon name="whatsapp" size="md" />
          {askLabel}
        </ActionButton>
        <ActionButton
          type="button"
          variant="sun"
          size="lg"
          className="flex-1 @[700px]:ml-auto @[700px]:min-w-[300px] @[700px]:flex-none"
          onClick={onBuy}
          disabled={buyPending}
        >
          {buyLabel}
          <Icon name="arrowRight" size="md" />
        </ActionButton>
      </div>
    </div>
  );
}
