"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type InstagramHandoffSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: TranslateFn;
  /** The composed caption, with the link already inside it. */
  caption: string;
  shopUrl: string;
  imagesBusy: boolean;
  onSaveImages: () => void;
  onOpenInstagram: () => void;
  onToast: (message: string) => void;
};

/**
 * Instagram permits no third-party app to compose a post, and TikTok is the
 * same. A button that appears to post is a dead button, so this hands the seller
 * the two pieces and tells them where they go.
 *
 * Step three is the most valuable line on the sheet: Instagram captions are not
 * clickable, and the bio is the step every seller misses.
 */
export function InstagramHandoffSheet({
  open,
  onOpenChange,
  t,
  caption,
  shopUrl,
  imagesBusy,
  onSaveImages,
  onOpenInstagram,
  onToast,
}: InstagramHandoffSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="fixed inset-x-0 bottom-0 top-auto z-[70] max-h-[92vh] w-full max-w-[540px] gap-0 overflow-auto rounded-t-[22px] border-0 bg-white p-5 text-ink md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[20px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SheetTitle className="text-base font-bold">{t("instagram.title")}</SheetTitle>
          <SheetClose
            className="grid size-9 place-items-center rounded-full border border-hair text-ink-45"
            aria-label={t("instagram.close")}
          >
            <Icon name="x" size="sm" />
          </SheetClose>
        </div>

        <Text size="small" className="mb-4">
          {t("instagram.explanation")}
        </Text>

        <ol className="flex flex-col gap-3">
          <li className="flex items-center gap-3">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-sun text-[0.8rem] font-extrabold text-sun-ink"
              aria-hidden
            >
              1
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.93rem] font-bold leading-snug">
                {t("instagram.step1Title")}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-ink-45">
                {t("instagram.step1Sub")}
              </span>
            </span>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              disabled={imagesBusy}
              onClick={onSaveImages}
            >
              <Icon name="download" size="sm" />
              {t("instagram.step1Action")}
            </ActionButton>
          </li>

          <li className="flex items-center gap-3">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-sun text-[0.8rem] font-extrabold text-sun-ink"
              aria-hidden
            >
              2
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.93rem] font-bold leading-snug">
                {t("instagram.step2Title")}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-ink-45">
                {t("instagram.step2Sub")}
              </span>
            </span>
            <CopyButton
              text={caption}
              label={t("instagram.step2Action")}
              successMessage={t("toast.captionCopied")}
              failureMessage={t("toast.copyFailed")}
              onResult={onToast}
            />
          </li>

          <li className="flex items-center gap-3">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-sun text-[0.8rem] font-extrabold text-sun-ink"
              aria-hidden
            >
              3
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.93rem] font-bold leading-snug">
                {t("instagram.step3Title")}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-ink-45">
                {t("instagram.step3Sub")}
              </span>
            </span>
            <CopyButton
              text={shopUrl}
              label={t("instagram.step3Action")}
              successMessage={t("toast.bioLinkCopied")}
              failureMessage={t("toast.copyFailed")}
              onResult={onToast}
            />
          </li>
        </ol>

        <ActionButton
          type="button"
          variant="sun"
          block
          className="mt-4"
          onClick={onOpenInstagram}
        >
          {t("instagram.open")}
        </ActionButton>

        <Text size="tiny" className="mt-2.5 text-center">
          {t("instagram.tiktokNote")}
        </Text>
      </SheetContent>
    </Sheet>
  );
}
