"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { ActionButton } from "@/components/atoms/ActionButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

type ProtectionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopName: string;
};

export function BuyerProtectionSheet({
  open,
  onOpenChange,
  shopName,
}: ProtectionSheetProps) {
  const t = useTranslations("storefront");
  const steps = [
    t("protStep1", { name: shopName }),
    t("protStep2"),
    t("protStep3"),
    t("protStep4", { name: shopName }),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(90vh,640px)] sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:data-[state=open]:slide-in-from-bottom-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
            {t("protTitle")}
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
        <SheetDescription className="sr-only">{t("protTitle")}</SheetDescription>

        <MoneyFlow audience="buyer" current={1} className="mb-4" />

        <div className="flex flex-col gap-3">
          {steps.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-[0.72rem] font-bold text-sun-ink">
                {i + 1}
              </span>
              <p className="text-[0.96rem] leading-relaxed text-ink-70">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2 rounded-xl bg-clay/10 p-3 text-[0.81rem] leading-relaxed text-clay">
          <Icon name="alert" size="md" className="mt-0.5 shrink-0" />
          <span>{t("protWarn")}</span>
        </div>
        <div className="mt-2.5 flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] leading-relaxed text-ink-70">
          <IconTile variant="neutral" className="mt-0 size-5 bg-transparent p-0">
            <Icon name="clock" size="sm" />
          </IconTile>
          <span>{t("protSla")}</span>
        </div>

        <ActionButton
          type="button"
          variant="sun"
          block
          className="mt-4"
          onClick={() => onOpenChange(false)}
        >
          {t("protGotIt")}
        </ActionButton>
      </SheetContent>
    </Sheet>
  );
}
