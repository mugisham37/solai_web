"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type ShareErrorStateProps = {
  t: TranslateFn;
  message?: string;
  /** Overrides the default intent-failure title when the shop itself failed to load. */
  title?: string;
  /** Null when the shop itself failed to load, which hides the copy action. */
  shopUrl: string | null;
  onBack: () => void;
  backLabel?: string;
  onToast: (message: string) => void;
};

/**
 * Almost always "the app isn't installed", not a fault in the product — so the
 * copy says so plainly and hands back the one thing that always works.
 */
export function ShareErrorState({
  t,
  message,
  title,
  shopUrl,
  onBack,
  backLabel,
  onToast,
}: ShareErrorStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="flex flex-1 flex-col items-center justify-center px-3.5 py-8 text-center md:px-6"
      aria-label={title || t("error.title")}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4">
        <IconTile variant="neutral" className="size-13 rounded-2xl bg-clay/10 text-clay">
          <Icon name="alert" size="lg" />
        </IconTile>

        <div>
          <Heading level={1} size="display" className="text-d1 normal-case">
            {title || t("error.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{message || t("error.lede")}</Text>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {shopUrl ? (
            <CopyButton
              text={shopUrl}
              label={t("error.copyLink")}
              successMessage={t("toast.linkCopied")}
              failureMessage={t("toast.copyFailed")}
              onResult={onToast}
              variant="sun"
              size="default"
            />
          ) : null}

          <ActionButton type="button" variant="line" onClick={onBack}>
            {backLabel || t("error.backToSharing")}
          </ActionButton>
        </div>
      </div>
    </motion.section>
  );
}
