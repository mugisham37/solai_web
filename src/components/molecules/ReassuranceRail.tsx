"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import type { Draft } from "@/types/build";
import { formatMoney } from "@/lib/money";

type ReassuranceRailProps = {
  t: (key: string, values?: Record<string, string | number>) => string;
  draft: Draft | null;
  shopNamePreview: string;
  locale: string;
  onPrivacyClick: () => void;
};

export function ReassuranceRail({ t, draft, shopNamePreview, locale, onPrivacyClick }: ReassuranceRailProps) {
  const title = draft?.title.en ?? draft?.title[Object.keys(draft?.title ?? {})[0] ?? "en"] ?? "";
  const price = draft
    ? formatMoney({ amountMinor: draft.price.amountMinor, currency: draft.price.currency }, locale)
    : "";
  const imageCount =
    draft != null
      ? 1 + draft.images.additionalOriginals.length + draft.images.generated.length
      : 0;

  return (
    <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-20">
      <div className="rounded-card bg-deep p-4 text-on-deep">
        <Eyebrow className="text-sun">{t("rail.whyEyebrow")}</Eyebrow>
        <ol className="mt-3 flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex items-start gap-2">
              <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-xs font-bold text-sun-ink">
                {n}
              </span>
              <Text size="small" className="text-on-deep-60">
                {t(`rail.why${n}` as "rail.why1")}
              </Text>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-card border border-sea/30 bg-sea/10 p-4">
        <div className="flex gap-2">
          <IconTile variant="sea">
            <Icon name="shield" />
          </IconTile>
          <div>
            <p className="text-[0.93rem] font-bold text-sea-deep-text">{t("rail.privateTitle")}</p>
            <Text className="text-xs text-sea-deep-text">
              {t("rail.privateBody", { shop: shopNamePreview || "Your shop" })}
            </Text>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-hair bg-white p-4">
        <Eyebrow className="text-ink-45">{t("rail.waitingEyebrow")}</Eyebrow>
        <div className="mt-2 flex gap-2">
          <IconTile variant="neutral" className="bg-mauve/20 text-[#5e4478]">
            <Icon name="spark" />
          </IconTile>
          <div>
            <p className="font-bold">{title || t("rail.draftFallbackTitle")}</p>
            <Text className="text-xs text-ink-45">
              {price ? `${price} · ${t("rail.images", { count: imageCount })}` : t("rail.draftFallbackMeta")}
            </Text>
          </div>
        </div>
        <hr className="my-3 border-hair" />
        <Text className="text-xs text-ink-45">{t("rail.draftNote")}</Text>
      </div>

      <ActionButton type="button" variant="plain" className="justify-start px-0" onClick={onPrivacyClick}>
        <Icon name="info" size="sm" />
        {t("rail.privacyLink")}
      </ActionButton>
    </div>
  );
}
