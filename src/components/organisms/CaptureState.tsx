"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { PhotoTipCard } from "@/components/molecules/PhotoTipCard";
import { useDropzone } from "@/hooks/useDropzone";
import { PHOTO_TIPS } from "@/data/build";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CaptureStateProps = {
  t: (key: string) => string;
  description: string;
  onDescriptionChange: (v: string) => void;
  onFiles: (files: File[]) => void;
  onDescribeSubmit: () => void;
};

export function CaptureState({
  t,
  description,
  onDescriptionChange,
  onFiles,
  onDescribeSubmit,
}: CaptureStateProps) {
  const reduceMotion = useReducedMotion();
  const { isDragOver, open, rootProps, inputProps } = useDropzone({ onFiles });

  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        <div>
          <Eyebrow className="text-sun-deep">{t("capture.eyebrow")}</Eyebrow>
          <Heading level={1} size="display" className="mt-2 text-d1 normal-case">
            {t("capture.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{t("capture.lede")}</Text>
        </div>

        <div
          {...rootProps}
          className={cn(
            "rounded-[22px] border-2 border-dashed border-ink-20 bg-white px-4 py-6 text-center transition-colors",
            isDragOver && "border-sun bg-sun/5",
          )}
        >
          <input {...inputProps} capture="environment" />
          <span className="mx-auto mb-3 grid size-16 place-items-center rounded-[20px] bg-sun text-sun-ink">
            <Icon name="camera" size="lg" className="size-8" />
          </span>
          <p className="text-d3">{t("capture.dropTitle")}</p>
          <Text className="mx-auto mt-1 max-w-[38ch] text-sm text-ink-70">{t("capture.dropBody")}</Text>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ActionButton type="button" variant="sun" onClick={open}>
              <Icon name="camera" />
              {t("capture.openCamera")}
            </ActionButton>
            <ActionButton type="button" variant="line" onClick={open}>
              <Icon name="upload" />
              {t("capture.chooseFile")}
            </ActionButton>
          </div>
          <p className="mt-3 text-xs text-ink-45">{t("capture.formats")}</p>
        </div>

        <div className="rounded-card bg-paper-2 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">{t("capture.describeTitle")}</p>
            <span className="rounded-pill border border-ink-20 px-2 py-0.5 text-xs font-bold text-ink-70">
              {t("capture.describeChip")}
            </span>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-ink-20 bg-white">
            <span className="grid place-items-center border-r border-ink-20 bg-paper-2 px-3">
              <Icon name="spark" />
            </span>
            <input
              className="min-h-11 flex-1 px-3 outline-none"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              aria-label={t("capture.describePlaceholder")}
              placeholder={t("capture.describePlaceholder")}
            />
          </div>
          <Text className="mt-2 text-xs text-ink-45">{t("capture.describeHint")}</Text>
          <ActionButton type="button" variant="line" className="mt-3" onClick={onDescribeSubmit}>
            {t("capture.describeSubmit")}
          </ActionButton>
        </div>

        <div>
          <Eyebrow className="mb-3 text-ink-45">{t("capture.tipsEyebrow")}</Eyebrow>
          <div className="grid gap-2 md:grid-cols-3">
            {PHOTO_TIPS.map((tip) => (
              <PhotoTipCard
                key={tip.id}
                good={tip.good}
                title={t(tip.titleKey)}
                body={t(tip.bodyKey)}
              />
            ))}
          </div>
        </div>

        <p className="rounded-xl bg-paper-2 p-3 text-sm text-ink-70">{t("capture.trustNote")}</p>
      </div>
    </motion.div>
  );
}
