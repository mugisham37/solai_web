"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { HolderConfirmCard } from "@/components/molecules/HolderConfirmCard";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import type { HolderInfo } from "@/types/payout";

type HolderConfirmStateProps = {
  t: (key: string) => string;
  holder: HolderInfo;
  onConfirm: () => void;
  onReject: () => void;
};

export function HolderConfirmState({ t, holder, onConfirm, onReject }: HolderConfirmStateProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
        <div>
          <Eyebrow>{t("confirm.eyebrow")}</Eyebrow>
          <Heading level={1} size="display" className="text-d1 mt-2 normal-case">
            {t("confirm.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{t("confirm.lede")}</Text>
        </div>
        <div className="rounded-xl bg-paper-2 p-3 text-sm text-ink-70">{t("confirm.note")}</div>
        <HolderConfirmCard
          holderName={holder.holderName}
          maskedDestination={holder.maskedDestination}
          confirmLabel={t("confirm.yes")}
          rejectLabel={t("confirm.no")}
          onConfirm={onConfirm}
          onReject={onReject}
        />
      </div>
    </motion.div>
  );
}
