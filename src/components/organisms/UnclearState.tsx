"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type UnclearStateProps = {
  t: (key: string) => string;
  imageUrl: string;
  issues: readonly string[];
  hint: string;
  onHintChange: (v: string) => void;
  onBuild: () => void;
  onRetake: () => void;
};

export function UnclearState({
  t,
  imageUrl,
  issues,
  hint,
  onHintChange,
  onBuild,
  onRetake,
}: UnclearStateProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <Icon name="alert" size="lg" className="size-12 text-clay" />
        <Heading level={1} size="display" className="text-d1 normal-case">
          {t("unclear.title")}
        </Heading>
        <Text className="text-ink-70">{t("unclear.lede")}</Text>
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="size-[88px] rounded-[14px] object-cover" />
          <div className="flex flex-col gap-1">
            {issues.map((issue) => (
              <span key={issue} className="rounded-pill bg-clay/10 px-2 py-0.5 text-xs font-bold text-clay">
                {issue}
              </span>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-ink-45">
          {t("unclear.hintLabel")}
          <input
            className="rounded-xl border border-ink-20 px-3 py-3 text-base normal-case"
            value={hint}
            onChange={(e) => onHintChange(e.target.value)}
            placeholder={t("unclear.hintPlaceholder")}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <ActionButton type="button" variant="sun" onClick={onBuild}>
            {t("unclear.build")}
            <Icon name="arrowRight" />
          </ActionButton>
          <ActionButton type="button" variant="line" onClick={onRetake}>
            <Icon name="camera" />
            {t("unclear.retake")}
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
}
