"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { StatusChip } from "@/components/atoms/StatusChip";
import { Link } from "@/i18n/navigation";
import type { BuyerSellerRecord } from "@/types/buyer";
import { cn } from "@/lib/cn";

type SellerRecordCardProps = {
  shopName: string;
  city: string;
  seller: BuyerSellerRecord;
  shopHref: string;
  className?: string;
};

export function SellerRecordCard({
  shopName,
  city,
  seller,
  shopHref,
  className,
}: SellerRecordCardProps) {
  const t = useTranslations("storefront");
  const rows = [
    [t("ordersDelivered"), seller.deliveredLabel],
    [t("confirmedReceived"), seller.confirmedPctLabel],
    [t("usuallyShips"), seller.shipsLabel],
    [t("answersIn"), seller.repliesLabel],
  ] as const;

  return (
    <div className={cn("rounded-card border border-hair bg-white p-4", className)}>
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-deep text-[0.78rem] font-bold text-on-deep">
          {seller.initials}
        </span>
        <span className="flex-1">
          <span className="block text-[0.92rem] font-bold">{shopName}</span>
          <span className="text-[0.74rem] text-ink-45">
            {t("sellerMeta", { city, since: seller.sellingSinceLabel })}
          </span>
        </span>
        {seller.verifiedWallet ? (
          <StatusChip label={t("verifiedWallet")} tone="live" />
        ) : null}
      </div>
      <hr className="my-3 border-0 border-t border-hair" />
      <div className="flex flex-col">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={cn(
              "flex justify-between gap-4 py-[0.42rem] text-[0.85rem]",
              i > 0 && "border-t border-dashed border-hair",
            )}
          >
            <span className="text-ink-70">{label}</span>
            <span className="font-bold">{value}</span>
          </div>
        ))}
      </div>
      {seller.isNewerSeller ? (
        <p className="mt-2.5 text-[0.74rem] leading-snug text-ink-45">
          {t("newerSellerNote")}
        </p>
      ) : null}
      <ActionButton asChild variant="line" size="sm" block className="mt-3">
        <Link href={shopHref}>{t("seeEverything", { name: shopName.split(" ")[0] ?? shopName })}</Link>
      </ActionButton>
    </div>
  );
}
