"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type PrivacySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
};

export function PrivacySheet({ open, onOpenChange, t }: PrivacySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="fixed inset-x-0 bottom-0 top-auto z-50 max-h-[88vh] w-full max-w-[520px] overflow-auto rounded-t-[22px] border-0 bg-white p-5 text-ink md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[20px]">
        <SheetTitle className="text-base font-bold">{t("privacy.title")}</SheetTitle>
        <div className="mt-4 flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-2">
              <IconTile variant="sea">
                <Icon name="check" />
              </IconTile>
              <p className="text-sm text-ink-70">{t(`privacy.do${n}` as "privacy.do1")}</p>
            </div>
          ))}
          <hr className="border-hair" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-2">
              <IconTile variant="neutral" className="bg-clay/10 text-clay">
                <Icon name="x" />
              </IconTile>
              <p className="text-sm text-ink-70">{t(`privacy.dont${n}` as "privacy.dont1")}</p>
            </div>
          ))}
        </div>
        <ActionButton type="button" variant="sun" block className="mt-4" onClick={() => onOpenChange(false)}>
          {t("privacy.close")}
        </ActionButton>
      </SheetContent>
    </Sheet>
  );
}
