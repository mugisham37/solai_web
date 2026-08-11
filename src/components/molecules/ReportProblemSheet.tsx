"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { reportOrderProblemAction } from "@/app/actions/dashboard/report-problem";
import { useToastContext } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/cn";

const REASON_KEYS = [
  "cannotReachBuyer",
  "courierNeverArrived",
  "buyerWontGiveCode",
  "somethingElse",
] as const;

type ReportProblemSheetProps = {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReportProblemSheet({
  orderId,
  open,
  onOpenChange,
}: ReportProblemSheetProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();

  const submit = (reasonKey: (typeof REASON_KEYS)[number]) => {
    startTransition(async () => {
      const result = await reportOrderProblemAction(orderId, reasonKey);
      if (!result.ok) {
        toast(t("orders.report.failed"));
        return;
      }
      toast(t("orders.report.sent"));
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[85vh] rounded-t-[22px] border border-hair bg-paper p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "@[700px]/app:inset-auto @[700px]/app:top-1/2 @[700px]/app:left-1/2 @[700px]/app:max-h-[min(90vh,560px)] @[700px]/app:w-[min(100%-2rem,420px)] @[700px]/app:-translate-x-1/2 @[700px]/app:-translate-y-1/2 @[700px]/app:rounded-card",
        )}
      >
        <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
          {t("orders.report.title")}
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-ink-70">
          {t("orders.report.lede")}
        </SheetDescription>
        <div className="mt-4 flex flex-col gap-2">
          {REASON_KEYS.map((key) => (
            <ActionButton
              key={key}
              type="button"
              variant="line"
              block
              disabled={pending}
              onClick={() => submit(key)}
            >
              {t(`orders.report.reasons.${key}`)}
            </ActionButton>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
