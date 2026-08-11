import { MoneyDisplay } from "@/components/atoms/Money";
import type { Money } from "@/types/money";
import { cn } from "@/lib/cn";

type LedgerRow = Readonly<{
  label: string;
  value: Money | string;
  total?: boolean;
}>;

type PriceLedgerProps = {
  rows: readonly LedgerRow[];
  locale: string;
  footnote?: string;
  className?: string;
};

export function PriceLedger({ rows, locale, footnote, className }: PriceLedgerProps) {
  return (
    <div className={cn("rounded-card bg-paper-2 p-4", className)}>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className={cn(
              "flex justify-between gap-4 py-[0.42rem] text-[0.85rem]",
              i > 0 && !row.total && "border-t border-dashed border-hair",
              row.total && "mt-0.5 border-t border-ink-20 pt-2 text-[0.95rem] font-bold",
            )}
          >
            <span>{row.label}</span>
            {typeof row.value === "string" ? (
              <span className="font-bold tabular-nums">{row.value}</span>
            ) : (
              <MoneyDisplay value={row.value} locale={locale} />
            )}
          </div>
        ))}
      </div>
      {footnote ? <p className="mt-2 text-[0.74rem] leading-snug text-ink-45">{footnote}</p> : null}
    </div>
  );
}
