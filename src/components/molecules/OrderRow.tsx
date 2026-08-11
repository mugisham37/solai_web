import { Link } from "@/i18n/navigation";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { orderTotal } from "@/lib/dashboard/derive";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import { cn } from "@/lib/cn";
import type { DashboardOrder, DashboardProduct } from "@/types/dashboard";

type OrderRowProps = {
  order: DashboardOrder;
  product: DashboardProduct;
  statusLabel: string;
  locale: string;
  className?: string;
};

export function OrderRow({
  order,
  product,
  statusLabel,
  locale,
  className,
}: OrderRowProps) {
  const total = orderTotal(order);

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className={cn(
        "flex w-full items-center gap-3 rounded-[10px] px-1 py-3 text-left transition-colors hover:bg-paper-2 @container",
        className,
      )}
    >
      <ProductThumb
        palette={product.palette}
        gradientId={`order-thumb-${order.id}`}
        beadCount={12}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.91rem] font-bold text-ink">
          {order.buyerName} · {order.buyerArea}
        </span>
        <span className="mt-0.5 block truncate text-[0.73rem] text-ink-45">
          #{order.id} · {product.name} ×{order.qty} · {order.whenLabel}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <MoneyDisplay value={total} locale={locale} className="text-sm" />
        <StatusChip status={order.status} label={statusLabel} />
      </span>
      <span className="sr-only">{ORDER_STATUS[order.status].noteKey}</span>
    </Link>
  );
}
