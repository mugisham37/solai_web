"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import type { BlockedOption } from "@/types/build";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type BlockedStateProps = {
  t: (key: string) => string;
  reason: string;
  rule: string;
  options: readonly BlockedOption[];
  onListOther: () => void;
};

export function BlockedState({ t, reason, rule, options, onListOther }: BlockedStateProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <Icon name="shield" size="lg" className="size-12 text-clay" />
        <Heading level={1} size="display" className="text-d1 normal-case">
          {t("blocked.title")}
        </Heading>
        <Text className="text-ink-70">{reason || t("blocked.lede")}</Text>
        <div className="rounded-card bg-paper-2 p-4">
          <p className="mb-2 text-sm font-bold">{t("blocked.whatYouCanDo")}</p>
          {options.map((o) => (
            <Text key={o.id} className="text-sm text-ink-70">
              • {t(o.labelKey)}
            </Text>
          ))}
        </div>
        <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay">
          {t("blocked.rulePrefix")} <strong>{rule}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <ActionButton type="button" variant="line" onClick={onListOther}>
            {t("blocked.listOther")}
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
}
