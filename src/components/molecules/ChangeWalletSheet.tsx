"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

type ChangeWalletSheetProps = {
  draftId: string;
  walletMasked: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Routes into the existing payout flow — do not rebuild OTP here.
 */
export function ChangeWalletSheet({
  draftId,
  walletMasked,
  open,
  onOpenChange,
}: ChangeWalletSheetProps) {
  const t = useTranslations("dashboard");

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
          {t("settings.wallet.sheetTitle")}
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-ink-70">
          {t("settings.wallet.sheetLede", { number: walletMasked })}
        </SheetDescription>
        <div className="mt-5 flex flex-col gap-2">
          <ActionButton asChild variant="sun" block>
            <Link href={`/build/${draftId}/payout`}>
              {t("settings.wallet.startChange")}
            </Link>
          </ActionButton>
          <ActionButton
            type="button"
            variant="plain"
            block
            onClick={() => onOpenChange(false)}
          >
            {t("settings.wallet.notNow")}
          </ActionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
