"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";
import type { EscrowStageIndex } from "@/types/escrow";

type MoneyFlowProps = {
  variant?: "three" | "four";
  /** Seller dashboard/live vs buyer storefront/order strip labels. */
  audience?: "seller" | "buyer" | "buyerOrder";
  /** When audience is buyerOrder and the order is complete, third node is Delivered. */
  complete?: boolean;
  current: EscrowStageIndex;
  surface?: "light" | "dark";
  className?: string;
};

const threeNodes = ["buyerPays", "held", "yourePaid"] as const;
const fourNodesSeller = ["paid", "held", "code", "paidOut"] as const;
const fourNodesBuyer = ["youPay", "held", "delivered", "sellerPaid"] as const;
const fourNodesBuyerOrder = ["youPaid", "held", "onTheWay", "shesPaid"] as const;
const fourNodesBuyerOrderDone = ["youPaid", "held", "delivered", "shesPaid"] as const;

export function MoneyFlow({
  variant = "four",
  audience = "seller",
  complete = false,
  current,
  surface = "light",
  className,
}: MoneyFlowProps) {
  const t = useTranslations("moneyFlow");
  const nodes =
    variant === "three"
      ? threeNodes
      : audience === "buyerOrder"
        ? complete
          ? fourNodesBuyerOrderDone
          : fourNodesBuyerOrder
        : audience === "buyer"
          ? fourNodesBuyer
          : fourNodesSeller;
  const icons: readonly IconName[] =
    variant === "three"
      ? (["users", "shield", "wallet"] as const)
      : audience === "buyerOrder"
        ? (["check", "shield", "truck", "wallet"] as const)
        : audience === "buyer"
          ? (["users", "shield", "truck", "wallet"] as const)
          : (["users", "shield", "key", "wallet"] as const);

  return (
    <div
      className={cn(
        "@container flex overflow-hidden rounded-tile border border-hair bg-white",
        surface === "dark" && "border-deep-hair bg-white/10",
        className,
      )}
    >
      {nodes.map((key, index) => {
        const done = index < current;
        const now = index === current;
        const isPaidOut = variant === "four" && index === 3;
        return (
          <div
            key={key}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-1 py-3 text-center transition-colors",
              index > 0 && "border-l border-hair",
              surface === "dark" && index > 0 && "border-deep-hair",
              now && !isPaidOut && "bg-berry/10",
              now && isPaidOut && "bg-sea/15",
              variant === "three" && now && index === 2 && "bg-sea/15",
            )}
          >
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full bg-paper-2 text-ink-45",
                done && "bg-sea text-white",
                now && !isPaidOut && "bg-berry text-white shadow-[0_0_0_5px_rgb(188_79_148_/_16%)]",
                now && isPaidOut && "bg-sea text-white shadow-[0_0_0_5px_rgb(74_143_135_/_18%)]",
                surface === "dark" && "bg-white/15 text-on-deep-60",
              )}
            >
              <Icon name={icons[index] ?? "wallet"} size="sm" />
            </span>
            <span
              className={cn(
                "text-[0.65rem] font-bold uppercase tracking-wide text-ink-45",
                done && "text-ink-70",
                now && !isPaidOut && "text-berry",
                now && isPaidOut && "text-sea-muted",
                surface === "dark" && "text-on-deep-30",
              )}
            >
              {t(key)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
