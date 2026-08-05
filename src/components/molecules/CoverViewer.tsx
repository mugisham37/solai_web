"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProvenanceBadge } from "@/components/atoms/ProvenanceBadge";
import { Icon } from "@/components/atoms/Icon";
import type { DraftImage } from "@/types/build";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CoverViewerProps = {
  image: DraftImage | null;
  title: string;
  aspectRatio: "1:1" | "4:5";
  onRegenerate?: () => void;
  onRemove?: () => void;
  canRemove: boolean;
  canRegenerate: boolean;
  regenerateLabel: string;
  removeLabel: string;
  lockHint: string;
  feedbackLabel: string;
};

function CoverArtwork({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="size-full object-cover" width={800} height={800} />
    </div>
  );
}

export function CoverViewer({
  image,
  title,
  aspectRatio,
  onRegenerate,
  onRemove,
  canRemove,
  canRegenerate,
  regenerateLabel,
  removeLabel,
  lockHint,
  feedbackLabel,
}: CoverViewerProps) {
  const reduceMotion = useReducedMotion();
  if (!image) {
    return <div className="aspect-square rounded-card bg-paper-2" />;
  }

  const alt =
    image.kind === "generated"
      ? `${title}, ${image.sceneLabel} scene`
      : `${title}, your original photo`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card bg-paper-2",
        aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square",
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={image.id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0.35 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.element, ease: MOTION_EASE }}
        >
          <CoverArtwork src={image.url} alt={alt} />
        </motion.div>
      </AnimatePresence>

      <span className="absolute left-2.5 top-2.5">
        <ProvenanceBadge
          kind={image.kind}
          variant="full"
          sceneLabel={image.kind === "generated" ? image.sceneLabel : undefined}
        />
      </span>

      <span className="absolute right-2.5 top-2.5 flex gap-1">
        <button
          type="button"
          className="grid size-[34px] place-items-center rounded-full border-0 bg-white/90 disabled:opacity-35"
          onClick={onRegenerate}
          disabled={!canRegenerate}
          aria-label={regenerateLabel}
        >
          <Icon name="refresh" size="sm" />
        </button>
        <button
          type="button"
          className="grid size-[34px] place-items-center rounded-full border-0 bg-white/90 disabled:opacity-35"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={canRemove ? removeLabel : lockHint}
          title={!canRemove ? lockHint : undefined}
        >
          <Icon name="trash" size="sm" />
        </button>
      </span>

      {image.kind === "generated" ? (
        <span
          className="absolute bottom-2.5 right-2.5 flex gap-0.5 rounded-pill bg-white/90 p-0.5"
          role="group"
          aria-label={feedbackLabel}
        >
          <button type="button" className="grid size-[30px] place-items-center rounded-full" aria-label="Good">
            <Icon name="thumbsUp" size="sm" />
          </button>
          <button type="button" className="grid size-[30px] place-items-center rounded-full" aria-label="Not good">
            <Icon name="thumbsDown" size="sm" />
          </button>
        </span>
      ) : null}
    </div>
  );
}
