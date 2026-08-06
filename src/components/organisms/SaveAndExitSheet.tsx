"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type SaveAndExitSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: (key: string) => string;
  phone: string;
  onPhoneChange: (v: string) => void;
  onSendLink: () => void;
};

export function SaveAndExitSheet({
  open,
  onOpenChange,
  t,
  phone,
  onPhoneChange,
  onSendLink,
}: SaveAndExitSheetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-deep/60" />
        <Dialog.Content
          className={cn(
            "fixed z-50 w-full max-w-lg bg-white p-4",
            "bottom-0 left-0 right-0 rounded-t-[22px] md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[20px]",
          )}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.element, ease: MOTION_EASE }}
          >
            <div className="mb-2 flex items-center justify-between">
              <Dialog.Title className="text-d3">{t("exitSheet.title")}</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="grid size-10 place-items-center rounded-full border border-hair" aria-label={t("exitSheet.close")}>
                  <Icon name="x" />
                </button>
              </Dialog.Close>
            </div>
            <p className="mb-3 text-sm text-ink-70">{t("exitSheet.body")}</p>
            <label className="mb-3 flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-ink-45">
              {t("exitSheet.phoneLabel")}
              <div className="flex overflow-hidden rounded-xl border border-ink-20">
                <span className="flex items-center bg-paper-2 px-3 font-bold normal-case">+250</span>
                <input
                  className="min-h-11 flex-1 px-3 normal-case"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder={t("exitSheet.phonePlaceholder")}
                />
              </div>
              <span className="font-normal normal-case text-ink-45">{t("exitSheet.phoneHint")}</span>
            </label>
            <ActionButton type="button" variant="sun" block onClick={onSendLink}>
              {t("exitSheet.send")}
            </ActionButton>
            <ActionButton type="button" variant="plain" block className="mt-2" onClick={() => onOpenChange(false)}>
              {t("exitSheet.stay")}
            </ActionButton>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
