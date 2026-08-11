import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { Link } from "@/i18n/navigation";
import type { BuyerCatalogueItem } from "@/types/buyer";
import { cn } from "@/lib/cn";

type BuyerProductCardProps = {
  item: BuyerCatalogueItem;
  href: string;
  locale: string;
  inStockLabel: string;
  soldOutLabel: string;
  className?: string;
};

export function BuyerProductCard({
  item,
  href,
  locale,
  inStockLabel,
  soldOutLabel,
  className,
}: BuyerProductCardProps) {
  const oos = item.status === "oos";
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-card border border-hair bg-white p-2.5 text-left transition-opacity hover:border-ink-20",
        oos && "opacity-70",
        className,
      )}
    >
      <BeadedBracelet
        paletteIndex={item.palette}
        beadCount={13}
        gradientId={`cat-${item.id}`}
        className="rounded-xl"
      />
      <span className="mt-2.5 block text-[0.92rem] font-bold leading-snug">{item.title}</span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <MoneyDisplay value={item.price} locale={locale} />
        <StatusChip
          label={oos ? soldOutLabel : inStockLabel}
          tone={oos ? "clay" : "live"}
        />
      </span>
    </Link>
  );
}
