"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ConfirmedDeliveryRow } from "@/components/molecules/ConfirmedDeliveryRow";
import type { BuyerConfirmedDelivery } from "@/types/buyer";
import { cn } from "@/lib/cn";

type RecentDeliveriesCardProps = {
  deliveries: readonly BuyerConfirmedDelivery[];
  className?: string;
};

export function RecentDeliveriesCard({
  deliveries,
  className,
}: RecentDeliveriesCardProps) {
  const t = useTranslations("storefront");
  return (
    <div className={cn("rounded-card border border-hair bg-white p-4", className)}>
      <Eyebrow variant="quiet" className="mb-2">
        {t("recentTitle")}
      </Eyebrow>
      <div className="flex flex-col gap-2">
        {deliveries.map((d) => (
          <ConfirmedDeliveryRow
            key={d.id}
            text={t("recentRow", {
              initial: d.buyerInitial,
              area: d.area,
              when: d.whenLabel,
            })}
          />
        ))}
      </div>
      <p className="mt-2.5 text-[0.74rem] leading-snug text-ink-45">{t("recentNote")}</p>
    </div>
  );
}
