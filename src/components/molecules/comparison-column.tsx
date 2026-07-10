import { Emphasis } from "@/components/atoms/emphasis";
import { ComparisonRow } from "@/components/molecules/comparison-row";
import { cn } from "@/lib/utils";
import type { ComparisonColumn as ComparisonColumnData } from "@/types/marketing";

export function ComparisonColumn({ column }: { column: ComparisonColumnData }) {
  const restOfHeading = column.heading.replace(column.emphasisWord, "").trim();

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-7">
      <h3 className="mb-5 text-xl font-semibold text-text">
        <Emphasis>{column.emphasisWord}</Emphasis> {restOfHeading}
      </h3>
      {column.rows.map((row) => (
        <ComparisonRow key={row.text} row={row} tone={column.tone} />
      ))}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-[3px]",
          column.tone === "negative" ? "bg-danger" : "bg-success",
        )}
      />
    </div>
  );
}
