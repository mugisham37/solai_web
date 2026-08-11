"use client";

import { Icon } from "@/components/atoms/Icon";
import { SecureBadge } from "@/components/atoms/SecureBadge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type CheckoutTopBarProps = {
  title: string;
  secureLabel: string;
  backHref: string;
  backLabel: string;
  className?: string;
};

export function CheckoutTopBar({
  title,
  secureLabel,
  backHref,
  backLabel,
  className,
}: CheckoutTopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-hair bg-paper/94 backdrop-blur-[14px]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 @[700px]:px-6 @[700px]:py-3">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-hair bg-white hover:bg-paper-2"
        >
          <Icon name="arrowLeft" size="md" />
        </Link>
        <span className="flex items-center gap-2 text-[0.9rem] font-bold">
          <span className="grid size-6 place-items-center rounded-lg bg-sun text-sun-ink">
            <Icon name="bolt" size="sm" className="size-3.5" />
          </span>
          {title}
        </span>
        <span className="flex-1" />
        <SecureBadge label={secureLabel} className="hidden min-[420px]:inline-flex" />
      </div>
    </header>
  );
}
