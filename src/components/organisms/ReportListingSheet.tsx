"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/atoms/Icon";
import { ActionButton } from "@/components/atoms/ActionButton";
import { useToastContext } from "@/components/providers/ToastProvider";
import { reportListingAction } from "@/app/actions/buyer/report-listing";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ReportListingReason } from "@/types/buyer";
import { cn } from "@/lib/cn";

const REASONS: ReportListingReason[] = [
  "counterfeit",
  "stolenPhotos",
  "misleading",
  "illegal",
  "other",
];

type ReportListingSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  productId: string;
};

export function ReportListingSheet({
  open,
  onOpenChange,
  slug,
  productId,
}: ReportListingSheetProps) {
  const t = useTranslations("storefront");
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();

  const submit = (reason: ReportListingReason) => {
    startTransition(async () => {
      await reportListingAction({ slug, productId, reason });
      onOpenChange(false);
      toast(t("reportOk"));
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[min(90vh,560px)] sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
            {t("reportTitle")}
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
        <SheetDescription className="mb-4 text-sm text-ink-70">
          {t("reportLede")}
        </SheetDescription>
        <div className="flex flex-col gap-2">
          {REASONS.map((reason) => (
            <ActionButton
              key={reason}
              type="button"
              variant="line"
              block
              disabled={pending}
              onClick={() => submit(reason)}
            >
              {t(`reportReasons.${reason}`)}
            </ActionButton>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
