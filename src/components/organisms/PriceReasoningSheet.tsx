"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import type { PriceSuggestion } from "@/types/build";
import { formatMoney } from "@/lib/money";
import { useLocale } from "next-intl";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type PriceReasoningSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
  price: PriceSuggestion;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

export function PriceReasoningSheet({
  open,
  onOpenChange,
  t,
  price,
}: PriceReasoningSheetProps) {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-deep/60 data-[state=open]:animate-in" />
        <Dialog.Content
          className={cn(
            "fixed z-50 max-h-[88vh] w-full max-w-lg overflow-auto bg-white p-4 shadow-lg",
            "bottom-0 left-0 right-0 rounded-t-[22px] @[700px]:bottom-auto @[700px]:left-1/2 @[700px]:top-1/2 @[700px]:-translate-x-1/2 @[700px]:-translate-y-1/2 @[700px]:rounded-[20px]",
          )}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.element, ease: MOTION_EASE }}
          >
            <div className="mb-3 flex items-center justify-between">
              <Dialog.Title className="text-d3">
                {t("priceSheet.title").replace("{amount}", formatMoney({ amountMinor: price.amountMinor, currency: price.currency }, locale))}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="grid size-10 place-items-center rounded-full border border-hair" aria-label={t("priceSheet.close")}>
                  <Icon name="x" />
                </button>
              </Dialog.Close>
            </div>
            <p className="mb-3 text-sm text-ink-70">{t("priceSheet.lede")}</p>
            <div className="mb-3 rounded-card bg-paper-2 p-3 text-sm">
              <div className="flex justify-between py-1">
                <span>{t("priceSheet.compared")}</span>
                <strong>{price.comparisonCount}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>{t("priceSheet.sold")}</span>
                <strong>{price.soldCount}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>{t("priceSheet.median")}</span>
                <strong>{formatMoney({ amountMinor: price.medianMinor, currency: price.currency }, locale)}</strong>
              </div>
            </div>
            <p className="mb-3 text-sm text-ink-70">{price.explanation}</p>
            <p className="rounded-xl bg-paper-2 p-3 text-sm">
              {t("priceSheet.payout").replace(
                "{amount}",
                formatMoney({ amountMinor: price.payoutMinor, currency: price.currency }, locale),
              )}
            </p>
            <ActionButton type="button" variant="sun" block className="mt-3" onClick={() => onOpenChange(false)}>
              {t("priceSheet.gotIt")}
            </ActionButton>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
