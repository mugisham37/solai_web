"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { SlaChip } from "@/components/atoms/SlaChip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { ConsoleDispute } from "@/types/console";

type CaseRowProps = {
  dispute: ConsoleDispute;
  locale: string;
  className?: string;
};

/**
 * One row, two presentations: stacked card with data-label below 860px,
 * true table columns at @[860px] via CSS grid — no second markup tree.
 */
export function CaseRow({ dispute, locale, className }: CaseRowProps) {
  const closed = dispute.state === "closed";

  return (
    <Link
      href={`/console/disputes/${dispute.id}`}
      className={cn(
        "grid grid-cols-1 gap-1 border-b border-hair bg-white px-3.5 py-3 text-left transition-colors hover:bg-paper-2",
        "@[860px]:grid-cols-[1.1fr_1.2fr_1.3fr_1fr_0.9fr_28px] @[860px]:items-center @[860px]:gap-3",
        className,
      )}
    >
      <span
        className="flex items-center justify-between gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Case"
      >
        <span className="font-bold text-ink">#{dispute.id}</span>
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm text-ink-70 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="By"
      >
        {dispute.raisedBy === "buyer" ? "Buyer" : "Seller"} ·{" "}
        {dispute.raisedByName}
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm text-ink-70 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Reason"
      >
        {dispute.reasonLabel}
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Amount"
      >
        <MoneyDisplay value={dispute.amount} locale={locale} />
      </span>
      <span
        className="flex items-center justify-between gap-2 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Time"
      >
        <SlaChip hours={dispute.slaHours} closed={closed} />
      </span>
      <span className="hidden justify-end text-ink-45 @[860px]:flex">
        <Icon name="chevronRight" size="sm" />
      </span>
    </Link>
  );
}

type CaseTableHeadProps = {
  className?: string;
};

export function CaseTableHead({ className }: CaseTableHeadProps) {
  return (
    <div
      className={cn(
        "hidden grid-cols-[1.1fr_1.2fr_1.3fr_1fr_0.9fr_28px] gap-3 border-b border-hair px-3.5 py-2 text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase @[860px]:grid",
        className,
      )}
    >
      <span>Case</span>
      <span>Raised by</span>
      <span>Reason</span>
      <span>Amount held</span>
      <span>Time left</span>
      <span />
    </div>
  );
}

type CaseFiltersProps = {
  active: string;
  counts: Record<string, number>;
  keys: readonly { key: string; label: string }[];
  className?: string;
};

export function CaseFilters({
  active,
  counts,
  keys,
  className,
}: CaseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Filter cases"
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {keys.map(({ key, label }) => {
        const pressed = active === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={pressed}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-pill border px-3.5 text-[0.82rem] font-bold transition-colors",
              pressed
                ? "border-deep bg-deep text-on-deep"
                : "border-ink-20 bg-white text-ink-70 hover:bg-paper-2",
            )}
            onClick={() => {
              const params = new URLSearchParams();
              if (key !== "open") params.set("filter", key);
              const qs = params.toString();
              router.push(qs ? `${pathname}?${qs}` : pathname);
            }}
          >
            {label}
            <span
              className={cn(
                "rounded-pill px-1.5 py-0.5 text-[0.68rem]",
                pressed ? "bg-white/15 text-on-deep" : "bg-paper-2 text-ink-45",
              )}
            >
              {counts[key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
