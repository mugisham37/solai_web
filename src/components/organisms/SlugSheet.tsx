"use client";

import { useCallback, useState } from "react";
import { changeShopSlug } from "@/app/actions/publish";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { SlugEditor } from "@/components/molecules/SlugEditor";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type SlugSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: TranslateFn;
  draftId: string;
  currentSlug: string;
  host: string;
  onSaved: (slug: string, shopUrl: string) => void;
  onToast: (message: string) => void;
};

/**
 * Radix Dialog supplies the focus trap, Escape handling and focus restore, so
 * none of that is reimplemented here.
 */
export function SlugSheet({
  open,
  onOpenChange,
  t,
  draftId,
  currentSlug,
  host,
  onSaved,
  onToast,
}: SlugSheetProps) {
  const [candidate, setCandidate] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /** Never carry a stale candidate into a reopened sheet. */
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setCandidate(null);
        setSaving(false);
      }
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const handleSave = useCallback(async () => {
    if (!candidate) return;
    setSaving(true);
    const result = await changeShopSlug(draftId, candidate);
    setSaving(false);

    if (!result.ok) {
      onToast(result.message);
      return;
    }

    onSaved(result.slug, result.shopUrl);
    onToast(t("toast.slugChanged", { slug: result.slug }));
    handleOpenChange(false);
  }, [candidate, draftId, onSaved, handleOpenChange, onToast, t]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="fixed inset-x-0 bottom-0 top-auto z-[70] max-h-[88vh] w-full max-w-[520px] gap-0 overflow-auto rounded-t-[22px] border-0 bg-white p-5 text-ink md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[20px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SheetTitle className="text-base font-bold">{t("slug.sheetTitle")}</SheetTitle>
          <SheetClose
            className="grid size-9 place-items-center rounded-full border border-hair text-ink-45"
            aria-label={t("slug.close")}
          >
            <Icon name="x" size="sm" />
          </SheetClose>
        </div>

        {/* Remounts per open so the field always starts from the live slug. */}
        {open ? (
          <SlugEditor
            key={currentSlug}
            draftId={draftId}
            currentSlug={currentSlug}
            host={host}
            labels={{
              fieldLabel: t("slug.fieldLabel"),
              inputLabel: t("slug.inputLabel"),
              hintDefault: t("slug.hintDefault"),
              hintChecking: t("slug.hintChecking"),
              hintTooShort: t("slug.hintTooShort"),
              hintTooLong: t("slug.hintTooLong"),
              hintUnchanged: t("slug.hintUnchanged"),
              hintTaken: t("slug.hintTaken"),
              hintReserved: t("slug.hintReserved"),
              hintInvalid: t("slug.hintInvalid"),
              hintFree: (slug) => t("slug.hintFree", { slug }),
              suggestionsLabel: t("slug.suggestionsLabel"),
            }}
            onValidChange={setCandidate}
          />
        ) : null}

        <Text size="tiny" className="mt-3">
          {t("slug.note")}
        </Text>

        <ActionButton
          type="button"
          variant="sun"
          block
          className="mt-4"
          disabled={!candidate || saving}
          onClick={() => void handleSave()}
        >
          {saving ? t("slug.saving") : t("slug.save")}
        </ActionButton>
      </SheetContent>
    </Sheet>
  );
}
