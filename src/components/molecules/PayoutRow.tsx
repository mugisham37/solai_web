import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { cn } from "@/lib/cn";
import type { DashboardPayout } from "@/types/dashboard";

type PayoutRowProps = {
  payout: DashboardPayout;
  locale: string;
  meta: string;
  settledLabel: string;
  className?: string;
};

/** Payout list row — always a door into the related order. */
export function PayoutRow({
  payout,
  locale,
  meta,
  settledLabel,
  className,
}: PayoutRowProps) {
  return (
    <Link
      href={`/dashboard/orders/${payout.orderId}`}
      className={cn(
        "flex w-full min-h-11 items-center gap-2.5 px-2 py-3 text-left transition-colors hover:bg-paper-2",
        className,
      )}
    >
      <IconTile variant="sea">
        <Icon name="wallet" />
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block">
          <MoneyDisplay
            value={payout.amount}
            locale={locale}
            className="text-[0.97rem] font-bold text-ink"
          />
        </span>
        <span className="mt-0.5 block text-[0.73rem] text-ink-45">{meta}</span>
      </span>
      <StatusChip tone="live" label={settledLabel} />
      <Icon name="chevronRight" size="sm" className="shrink-0 text-ink-45" />
    </Link>
  );
}
