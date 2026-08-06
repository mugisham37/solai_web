"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/cn";

type EscrowTrustCardProps = {
  shopName: string;
  onOpenProtection: () => void;
  className?: string;
};

export function EscrowTrustCard({
  shopName,
  onOpenProtection,
  className,
}: EscrowTrustCardProps) {
  const t = useTranslations("storefront");
  return (
    <div
      className={cn(
        "rounded-card border border-sea/30 bg-sea/10 p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <IconTile variant="sea">
          <Icon name="shield" size="md" />
        </IconTile>
        <div className="flex-1">
          <p className="text-[0.92rem] font-bold text-sea-muted">
            {t("trustTitle", { name: shopName.split(" ")[0] ?? shopName })}
          </p>
          <p className="mt-0.5 text-[0.74rem] leading-snug text-sea-muted">
            {t("trustBody")}
          </p>
          <button
            type="button"
            className="mt-1.5 text-[0.83rem] font-semibold text-sea-muted underline"
            onClick={onOpenProtection}
          >
            {t("trustHow")}
          </button>
        </div>
      </div>
    </div>
  );
}
