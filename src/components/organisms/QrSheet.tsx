"use client";

import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { QrPanel } from "@/components/molecules/QrPanel";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type QrSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: TranslateFn;
  shopUrl: string;
  slug: string;
  host: string;
  onToast: (message: string) => void;
};

export function QrSheet({
  open,
  onOpenChange,
  t,
  shopUrl,
  slug,
  host,
  onToast,
}: QrSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="fixed inset-x-0 bottom-0 top-auto z-[70] max-h-[92vh] w-full max-w-[440px] gap-0 overflow-auto rounded-t-[22px] border-0 bg-white p-5 text-center text-ink md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[20px]">
        <div className="mb-4 flex items-center justify-between gap-3 text-left">
          <SheetTitle className="text-base font-bold">{t("qrSheet.title")}</SheetTitle>
          <SheetClose
            className="grid size-9 place-items-center rounded-full border border-hair text-ink-45"
            aria-label={t("qrSheet.close")}
          >
            <Icon name="x" size="sm" />
          </SheetClose>
        </div>

        <QrPanel
          shopUrl={shopUrl}
          slug={slug}
          size={300}
          labels={{
            qrAlt: t("shop.qrAlt", { url: `${host}${slug}` }),
            download: t("qrSheet.download"),
            print: t("qrSheet.print"),
            enlarge: "",
            savedToast: t("toast.qrSaved"),
            failedToast: t("toast.qrFailed"),
          }}
          onToast={onToast}
        />

        {/* The link stays readable as text — a QR is never the only way through. */}
        <p className="mt-3 break-all font-display text-base font-bold">
          {host}
          {slug}
        </p>
        <Text size="tiny" className="mt-1">
          {t("qrSheet.hint")}
        </Text>
      </SheetContent>
    </Sheet>
  );
}
