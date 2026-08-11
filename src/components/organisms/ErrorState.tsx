"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type ErrorStateProps = {
  t: (key: string) => string;
  message: string;
  canRetry: boolean;
  chargedAllowance: boolean;
  onRetry: () => void;
  onBack: () => void;
};

export function ErrorState({
  t,
  message,
  canRetry,
  chargedAllowance,
  onRetry,
  onBack,
}: ErrorStateProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col items-center px-3.5 py-4 text-center md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4">
        <Icon name="alert" size="lg" className="size-12 text-clay" />
        <Heading level={1} size="display" className="text-d1 normal-case">
          {t("error.title")}
        </Heading>
        <Text className="text-ink-70">
          {message || t("error.lede")}
          {!chargedAllowance ? ` ${t("error.notCharged")}` : ""}
        </Text>
        <div className="flex flex-wrap justify-center gap-2">
          {canRetry ? (
            <ActionButton type="button" variant="sun" onClick={onRetry}>
              <Icon name="refresh" />
              {t("error.retry")}
            </ActionButton>
          ) : null}
          <ActionButton type="button" variant="line" onClick={onBack}>
            {t("error.back")}
          </ActionButton>
        </div>
        <Text className="text-xs text-ink-45">{t("error.support")}</Text>
      </div>
    </motion.div>
  );
}
