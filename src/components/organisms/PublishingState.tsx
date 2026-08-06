"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { PublishProgress } from "@/components/molecules/PublishProgress";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import type { PublishStage } from "@/types/live";

type PublishingStateProps = {
  t: (key: string) => string;
  stages: readonly PublishStage[];
  progress: number;
};

export function PublishingState({ t, stages, progress }: PublishingStateProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      aria-label={t("publishing.title")}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      {/* Centred and narrow: a five-item list stretched across a desktop reads as a table. */}
      <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col justify-center gap-5">
        <div>
          <Eyebrow>{t("publishing.eyebrow")}</Eyebrow>
          <Heading level={1} size="display" className="mt-2 text-d1 normal-case">
            {t("publishing.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{t("publishing.lede")}</Text>
        </div>

        <PublishProgress
          stages={stages}
          progress={progress}
          progressLabel={t("publishing.progressLabel")}
        />

        <Text size="tiny">{t("publishing.closeTip")}</Text>
      </div>
    </motion.section>
  );
}
