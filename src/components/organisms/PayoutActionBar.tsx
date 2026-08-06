"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import type { ReactNode } from "react";

type PayoutActionBarProps = {
  hint: string;
  ctaLabel: string;
  disabled: boolean;
  disabledReason?: string;
  onSubmit: () => void;
  loading?: boolean;
  extra?: ReactNode;
};

export function PayoutActionBar({
  hint,
  ctaLabel,
  disabled,
  disabledReason,
  onSubmit,
  loading,
  extra,
}: PayoutActionBarProps) {
  return (
    <div className="sticky bottom-0 z-25 border-t border-hair bg-paper/95 pb-[calc(0.7rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-3.5 md:px-6">
        <span className="hidden min-w-0 flex-1 text-xs text-ink-45 md:block">
          {disabled && disabledReason ? disabledReason : hint}
        </span>
        {extra}
        <ActionButton
          type="button"
          variant="sun"
          size="lg"
          disabled={disabled || loading}
          onClick={onSubmit}
          className="min-h-11 w-full min-w-0 flex-1 @[700px]:ml-auto @[700px]:w-[300px] @[700px]:flex-none"
        >
          {ctaLabel}
          <Icon name="arrowRight" />
        </ActionButton>
      </div>
      {disabled && disabledReason ? (
        <p className="mt-1 px-3.5 text-center text-xs text-ink-45 md:hidden">{disabledReason}</p>
      ) : null}
    </div>
  );
}
