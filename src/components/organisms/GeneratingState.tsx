"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { ShimmerBlock } from "@/components/atoms/ShimmerBlock";
import { GenerationStage } from "@/components/molecules/GenerationStage";
import type { GenerationStageStatus } from "@/types/build";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type GeneratingStateProps = {
  t: (key: string) => string;
  stages: readonly GenerationStageStatus[];
  progress: number;
  onCancel: () => void;
  liveMessage: string;
};

export function GeneratingState({ t, stages, progress, onCancel, liveMessage }: GeneratingStateProps) {
  const reduceMotion = useReducedMotion();
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = stages.find((s) => s.status === "active");
    if (active && liveRef.current) {
      liveRef.current.textContent = `${active.label}. ${active.subLabel}`;
    }
  }, [stages]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        /* reconnect hook point for real provider */
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <div className="grid flex-1 items-center gap-6 @[1000px]:grid-cols-2 @[1000px]:gap-10">
        <div className="flex flex-col gap-4">
          <div>
            <Eyebrow className="text-sun-deep">{t("generating.eyebrow")}</Eyebrow>
            <Heading level={1} size="display" className="mt-2 text-d1 normal-case">
              {t("generating.title")}
            </Heading>
            <Text className="mt-2 text-ink-70">{t("generating.lede")}</Text>
          </div>
          <ProgressBar value={progress} heightClass="h-1.5" />
          <div className="flex flex-col gap-3">
            {stages.map((s) => (
              <GenerationStage key={s.id} label={s.label} subLabel={s.subLabel} status={s.status} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton type="button" variant="line" size="sm" onClick={onCancel}>
              {t("generating.cancel")}
            </ActionButton>
            <Text className="text-xs text-ink-45">{t("generating.leaveNote")}</Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <ShimmerBlock className="rounded-card" aspectRatio="1" />
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <ShimmerBlock key={i} aspectRatio="1" />
            ))}
          </div>
          <ShimmerBlock className="h-4 w-[70%]" />
          <ShimmerBlock className="h-4 w-[45%]" />
        </div>
      </div>
    </motion.div>
  );
}
