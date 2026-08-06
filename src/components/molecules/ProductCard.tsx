import { Link } from "@/i18n/navigation";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { cn } from "@/lib/cn";
import type { DashboardProduct } from "@/types/dashboard";

type ProductCardProps = {
  product: DashboardProduct;
  statusLabel: string;
  statusTone: "live" | "clay" | "grey";
  meta: string;
  locale: string;
  className?: string;
};

/** Catalogue tile — always a door into the editor. */
export function ProductCard({
  product,
  statusLabel,
  statusTone,
  meta,
  locale,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/dashboard/products/${product.id}`}
      className={cn(
        "flex flex-col rounded-card border border-hair bg-white p-[0.72rem] text-left transition-[filter] hover:brightness-[1.01]",
        className,
      )}
    >
      <ProductThumb
        palette={product.palette}
        beadCount={13}
        size="lg"
        gradientId={`product-card-${product.id}`}
      />
      <span className="mt-[0.7rem] block text-[0.97rem] font-bold tracking-tight text-ink">
        {product.name}
      </span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <MoneyDisplay
          value={product.price}
          locale={locale}
          className="font-display text-[1.05rem] font-extrabold text-ink"
        />
        <StatusChip tone={statusTone} label={statusLabel} />
      </span>
      <span className="mt-2 text-[0.73rem] text-ink-45">{meta}</span>
    </Link>
  );
}
