"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Chip } from "@/components/atoms/Chip";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import type { ExistingShopSummary } from "@/types/payout";

type PayoutT = (key: string, values?: Record<string, string | number>) => string;

function formatJoined(iso: string, locale: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(date);
}

type AlreadyRegisteredStateProps = {
  t: PayoutT;
  shop: ExistingShopSummary;
  locale: string;
  onSignIn: () => void;
  onDifferentNumber: () => void;
};

export function AlreadyRegisteredState({
  t,
  shop,
  locale,
  onSignIn,
  onDifferentNumber,
}: AlreadyRegisteredStateProps) {
  const joined = formatJoined(shop.joinedAt, locale);
  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-4 px-3.5 py-4 md:px-6 md:py-8">
      <IconTile variant="sea" className="size-[52px] rounded-2xl">
        <Icon name="user" size="lg" />
      </IconTile>
      <Heading level={1} size="display" className="text-d1 normal-case">
        {t("inuse.title")}
      </Heading>
      <Text className="text-ink-70">{t("inuse.lede", { shop: shop.shopName })}</Text>
      <div className="rounded-card border border-hair bg-white p-4">
        <div className="flex gap-2">
          <IconTile variant="sun">
            <Icon name="store" />
          </IconTile>
          <div className="flex-1">
            <p className="font-bold">{shop.shopName}</p>
            {joined ? (
              <Text className="text-xs text-ink-45">
                {t("inuse.meta", { count: shop.productCount, joined })}
              </Text>
            ) : null}
          </div>
          <Chip variant="live">{t("inuse.active")}</Chip>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton type="button" variant="sun" onClick={onSignIn}>
          {t("inuse.signIn")}
          <Icon name="arrowRight" />
        </ActionButton>
        <ActionButton type="button" variant="line" onClick={onDifferentNumber}>
          {t("inuse.differentNumber")}
        </ActionButton>
      </div>
      <Text className="text-xs text-ink-45">{t("inuse.note")}</Text>
    </div>
  );
}
