import { PermCell } from "@/components/atoms/PermCell";
import { CAPABILITY_ORDER, PERMISSION_MATRIX } from "@/lib/console/permissions";
import { cn } from "@/lib/cn";

type PermissionMatrixProps = {
  labels: Record<string, string>;
  className?: string;
};

export function PermissionMatrix({ labels, className }: PermissionMatrixProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div
        className="grid min-w-[320px] gap-x-2 gap-y-2"
        style={{ gridTemplateColumns: "minmax(0,1.6fr) repeat(3, 52px)" }}
        role="table"
        aria-label="Permission matrix"
      >
        <span role="columnheader" />
        <span
          role="columnheader"
          className="text-center text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase"
        >
          Support
        </span>
        <span
          role="columnheader"
          className="text-center text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase"
        >
          Finance
        </span>
        <span
          role="columnheader"
          className="text-center text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase"
        >
          Admin
        </span>

        {CAPABILITY_ORDER.map((key) => {
          const row = PERMISSION_MATRIX[key];
          return (
            <div key={key} className="contents" role="row">
              <span
                role="rowheader"
                className={cn(
                  "text-[0.8rem] text-ink-70",
                  key === "moveMoney" && "font-bold text-ink",
                )}
              >
                {labels[key] ?? row.labelKey}
              </span>
              <PermCell allowed={row.support} />
              <PermCell allowed={row.finance} />
              <PermCell allowed={row.admin} />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[0.74rem] text-ink-45">
        The last row is the important one and it has no exception at any level.
        Payouts only ever go to the wallet already on the order.
      </p>
    </div>
  );
}
