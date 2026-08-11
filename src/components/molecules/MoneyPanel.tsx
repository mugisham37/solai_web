import { KpiTile } from "@/components/atoms/KpiTile";
import { Lockbar } from "@/components/atoms/Lockbar";
import { MoneyDisplay } from "@/components/atoms/Money";
import { cn } from "@/lib/cn";
import type { Money } from "@/types/money";

type MoneyPanelProps = {
  held: Money;
  reserve: Money;
  paid: Money;
  locale: string;
  className?: string;
};

/** Read-only. Nothing on this panel moves a franc. */
export function MoneyPanel({
  held,
  reserve,
  paid,
  locale,
  className,
}: MoneyPanelProps) {
  return (
    <div className={cn("rounded-card border border-hair bg-white p-4", className)}>
      <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
        Money on this account
      </p>
      <div className="grid grid-cols-1 gap-2.5 @[700px]:grid-cols-3">
        <KpiTile
          label="Held now"
          value={<MoneyDisplay value={held} locale={locale} />}
          tone="held"
        />
        <KpiTile
          label="Reserve"
          value={<MoneyDisplay value={reserve} locale={locale} />}
        />
        <KpiTile
          label="Paid out lifetime"
          value={<MoneyDisplay value={paid} locale={locale} />}
          tone="good"
        />
      </div>
      <Lockbar className="mt-3" icon="lock">
        <span>
          Read-only. Nothing on this page moves a franc — the controls change
          what the{" "}
          <span className="font-bold text-on-deep">system</span> is allowed to
          do next, and the ledger acts on that.
        </span>
      </Lockbar>
    </div>
  );
}
