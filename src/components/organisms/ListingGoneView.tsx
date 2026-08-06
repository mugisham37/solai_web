"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ListingGoneViewProps = {
  shopSlug: string;
  className?: string;
};

export function ListingGoneView({ shopSlug, className }: ListingGoneViewProps) {
  const t = useTranslations("storefront");
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[620px] flex-1 flex-col items-center justify-center gap-5 px-3.5 py-8 text-center @[700px]:px-6",
        className,
      )}
    >
      <IconTile variant="clay" className="size-[52px] rounded-2xl">
        <Icon name="alert" size="lg" />
      </IconTile>
      <div>
        <h1 className="font-display text-d1 mb-2 font-extrabold uppercase">{t("goneTitle")}</h1>
        <p className="text-[0.96rem] leading-relaxed text-ink-70">{t("goneLede")}</p>
      </div>
      <div className="flex w-full gap-2 rounded-xl bg-paper-2 p-3 text-left text-[0.81rem] leading-relaxed text-ink-70">
        <Icon name="info" size="md" className="mt-0.5 shrink-0" />
        <span>{t("goneNote")}</span>
      </div>
      <ActionButton asChild variant="sun">
        <Link href={`/${shopSlug}`}>{t("goneCta")}</Link>
      </ActionButton>
    </div>
  );
}
