"use client";

import { Icon } from "@/components/atoms/Icon";
import { SecureBadge } from "@/components/atoms/SecureBadge";
import { cn } from "@/lib/cn";

type BuyerTopBarProps = {
  shopName: string;
  secureLabel: string;
  shareLabel: string;
  onShare: () => void;
  className?: string;
};

export function BuyerTopBar({
  shopName,
  secureLabel,
  shareLabel,
  onShare,
  className,
}: BuyerTopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-hair bg-paper/94 backdrop-blur-[14px]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 @[700px]:px-6 @[700px]:py-3">
        <span className="flex items-center gap-2 text-[0.9rem] font-bold">
          <span className="grid size-6 place-items-center rounded-lg bg-sun text-sun-ink">
            <Icon name="bolt" size="sm" className="size-3.5" />
          </span>
          {shopName}
        </span>
        <span className="flex-1" />
        <SecureBadge label={secureLabel} className="hidden min-[380px]:inline-flex" />
        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-hair bg-white hover:bg-paper-2"
          aria-label={shareLabel}
          onClick={onShare}
        >
          <Icon name="share" size="md" />
        </button>
      </div>
    </header>
  );
}
