import { MoneyDisplay } from "@/components/atoms/Money";
import { cn } from "@/lib/cn";
import type { Money } from "@/types/money";

export type LedgerLine = Readonly<{
  label: string;
  amount: Money;
  tone?: "default" | "negative" | "berry";
}>;

type LedgerTableProps = {
  lines: readonly LedgerLine[];
  totalLabel: string;
  total: Money;
  locale: string;
  className?: string;
};

export function LedgerTable({
  lines,
  totalLabel,
  total,
  locale,
  className,
}: LedgerTableProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {lines.map((line, i) => (
        <div
          key={`${line.label}-${i}`}
          className={cn(
            "flex justify-between gap-4 py-1.5 text-sm",
            i > 0 && "border-t border-dashed border-hair",
          )}
        >
          <span className="text-ink-70">{line.label}</span>
          <span
            className={cn(
              "inline-flex items-baseline gap-1 tabular-nums font-bold text-ink",
              line.tone === "negative" && "text-clay",
              line.tone === "berry" && "text-berry-muted",
            )}
          >
            {line.tone === "negative" ? <span aria-hidden>−</span> : null}
            <MoneyDisplay
              value={line.amount}
              locale={locale}
              className={cn(
                line.tone === "negative" && "text-clay",
                line.tone === "berry" && "text-berry-muted",
              )}
            />
          </span>
        </div>
      ))}
      <div className="mt-1 flex justify-between gap-4 border-t border-ink-20 pt-2 text-sm font-bold">
        <span>{totalLabel}</span>
        <MoneyDisplay value={total} locale={locale} />
      </div>
    </div>
  );
}
