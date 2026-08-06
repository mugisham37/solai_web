"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Chip } from "@/components/atoms/Chip";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";
import type { PayoutDoneSummary, PayoutRail } from "@/types/payout";

function railDisplayName(rail: PayoutRail): string {
  switch (rail) {
    case "mtn-momo":
      return "MTN Mobile Money";
    case "airtel-money":
      return "Airtel Money";
    case "mpesa":
      return "M-Pesa";
    case "bank":
      return "Bank account";
    default:
      return rail;
  }
}

type PayoutDoneStateProps = {
  t: (key: string) => string;
  summary: PayoutDoneSummary;
  draftId: string;
};

export function PayoutDoneState({ t, summary, draftId }: PayoutDoneStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-3.5 py-8 text-center md:px-6">
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4">
        <IconTile variant="sea" className="size-16 rounded-[20px] bg-sea text-white">
          <Icon name="check" size="lg" />
        </IconTile>
        <Heading level={1} size="display" className="text-d1 normal-case">
          {t("done.title")}
        </Heading>
        <Text className="text-ink-70">{t("done.lede")}</Text>
        <div className="w-full rounded-card border border-hair bg-white p-4 text-left">
          <div className="flex gap-2">
            <IconTile variant="sun">
              <Icon name="wallet" />
            </IconTile>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{railDisplayName(summary.destination.rail)}</p>
              <Text className="text-xs text-ink-45">
                {summary.destination.maskedIdentifier} · {summary.destination.verifiedHolderName}
              </Text>
            </div>
            <Chip variant="live">{t("done.verified")}</Chip>
          </div>
          <hr className="my-3 border-hair" />
          <div className="flex gap-2">
            <IconTile variant="neutral">
              <Icon name="store" />
            </IconTile>
            <div>
              <p className="font-bold">{summary.shopName}</p>
              <Text className="text-xs text-ink-45">
                {summary.productReadyLabel} · solai.shop/{summary.shopSlug}
              </Text>
            </div>
          </div>
        </div>
        <ActionButton variant="sun" size="lg" block asChild>
          <Link href={`/build/${draftId}/live`}>
            {t("done.cta")}
            <Icon name="arrowRight" />
          </Link>
        </ActionButton>
        <Text className="text-xs text-ink-45">{t("done.footnote")}</Text>
      </div>
    </div>
  );
}
