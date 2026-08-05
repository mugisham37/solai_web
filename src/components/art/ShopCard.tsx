import { Chip } from "@/components/atoms/Chip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { Text } from "@/components/atoms/Text";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { Separator } from "@/components/ui/separator";
import type { Money } from "@/types/money";
import type { EscrowStageIndex } from "@/types/escrow";

type ShopCardProps = {
  statusLabel: string;
  shopSlug: string;
  productTitle: string;
  productMeta: string;
  price: Money;
  locale: string;
  flowCurrent: EscrowStageIndex;
};

export function ShopCard({
  statusLabel,
  shopSlug,
  productTitle,
  productMeta,
  price,
  locale,
  flowCurrent,
}: ShopCardProps) {
  return (
    <div className="-rotate-[1.3deg] rounded-[22px] bg-white p-3.5 text-ink shadow-lift">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Chip variant="live">{statusLabel}</Chip>
        <Text size="tiny">{shopSlug}</Text>
      </div>
      <BeadedBracelet
        gradientId="hero-bracelet-grad"
        paletteIndex={0}
        beadCount={15}
        aspectClass="aspect-[4/3]"
        className="rounded-[14px]"
      />
      <div className="mt-1 grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <BeadedBracelet
            key={`thumb-${i}`}
            gradientId={`hero-thumb-${i}`}
            paletteIndex={i}
            beadCount={10 + i}
            className="animate-[pop_0.45s_var(--ease-standard)_forwards] opacity-0"
            style={{ animationDelay: `${0.9 + i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.96rem] font-bold">{productTitle}</p>
          <Text size="tiny">{productMeta}</Text>
        </div>
        <MoneyDisplay value={price} locale={locale} className="font-display text-heading-3 whitespace-nowrap normal-case" />
      </div>
      <Separator className="my-3" />
      <MoneyFlow variant="three" current={flowCurrent} />
    </div>
  );
}
