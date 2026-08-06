"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type PublishErrorStateProps = {
  t: (key: string) => string;
  /** Server-supplied detail; falls back to the standard copy when absent. */
  message?: string;
  backHref: string;
  onRetry: () => void;
};

export function PublishErrorState({ t, message, backHref, onRetry }: PublishErrorStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="flex flex-1 flex-col items-center justify-center px-3.5 py-8 text-center md:px-6"
      aria-label={t("error.title")}
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
            {t("error.title")}
          </Heading>
          {/* True because publishing commits in one step: a failure wrote nothing. */}
          <Text className="mt-2 text-ink-70">{message || t("error.lede")}</Text>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton type="button" variant="sun" onClick={onRetry}>
            <Icon name="refresh" size="sm" />
            {t("error.retry")}
          </ActionButton>
          <ActionButton type="button" variant="line" asChild>
            <Link href={backHref}>{t("error.backToListing")}</Link>
          </ActionButton>
        </div>

        <Text size="tiny">{t("error.helpHint")}</Text>
      </div>
    </motion.section>
  );
}
