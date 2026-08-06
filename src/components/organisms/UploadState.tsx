"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { UploadRow } from "@/components/molecules/UploadRow";
import type { UploadingFile } from "@/types/build";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type UploadStateProps = {
  t: (key: string) => string;
  files: readonly UploadingFile[];
  sizeLabel: (f: UploadingFile) => string;
  onRetry: (f: UploadingFile) => void;
  onAddPhoto: () => void;
  onStartBuild: () => void;
  canStart: boolean;
};

export function UploadState({
  t,
  files,
  sizeLabel,
  onRetry,
  onAddPhoto,
  onStartBuild,
  canStart,
}: UploadStateProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <div>
          <Eyebrow className="text-sun-deep">{t("upload.eyebrow")}</Eyebrow>
          <Heading level={1} size="display" className="mt-2 text-d1 normal-case">
            {t("upload.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{t("upload.lede")}</Text>
        </div>
        <div className="rounded-card border border-hair bg-white p-4">
          {files.map((f) => (
            <UploadRow
              key={f.id}
              file={f}
              sizeLabel={sizeLabel(f)}
              sentLabel={t("upload.sent")}
              retryLabel={t("upload.retry")}
              onRetry={f.status === "failed" ? () => onRetry(f) : undefined}
            />
          ))}
        </div>
        <p className="rounded-xl bg-sea/10 p-3 text-sm text-sea-deep-text">{t("upload.weakSignal")}</p>
        <div className="flex flex-wrap gap-2">
          <ActionButton type="button" variant="line" onClick={onAddPhoto}>
            {t("upload.addPhoto")}
          </ActionButton>
          <ActionButton type="button" variant="sun" onClick={onStartBuild} disabled={!canStart}>
            {t("upload.startBuild")}
            <Icon name="arrowRight" />
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
}
