"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { ActionButton } from "@/components/atoms/ActionButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

const FAQ_KEYS = [
  ["accountQ", "accountA"],
  ["payQ", "payA"],
  ["wrongQ", "wrongA"],
  ["collectQ", "collectA"],
  ["photosQ", "photosA"],
] as const;

type BuyerFaqSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BuyerFaqSheet({ open, onOpenChange }: BuyerFaqSheetProps) {
  const t = useTranslations("storefront");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(90vh,640px)] sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
            {t("faqTitle")}
          </SheetTitle>
          <button
            type="button"
            className="grid size-[38px] place-items-center rounded-full border border-hair bg-white"
            aria-label={t("close")}
            onClick={() => onOpenChange(false)}
          >
            <Icon name="x" size="md" />
          </button>
        </div>
        <SheetDescription className="sr-only">{t("faqTitle")}</SheetDescription>

        <div className="flex flex-col gap-4">
          {FAQ_KEYS.map(([q, a]) => (
            <div key={q}>
              <p className="text-[0.92rem] font-bold">{t(`faq.${q}`)}</p>
              <p className="mt-1 text-[0.96rem] leading-relaxed text-ink-70">
                {t(`faq.${a}`)}
              </p>
            </div>
          ))}
        </div>

        <ActionButton
          type="button"
          variant="line"
          block
          className="mt-4"
          onClick={() => onOpenChange(false)}
        >
          {t("faqClose")}
        </ActionButton>
      </SheetContent>
    </Sheet>
  );
}
