"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { ProvenanceBadge } from "@/components/atoms/ProvenanceBadge";
import { AiPhotoNote } from "@/components/molecules/AiPhotoNote";
import type { BuyerProductImage } from "@/types/buyer";
import { cn } from "@/lib/cn";

type ProductGalleryProps = {
  images: readonly BuyerProductImage[];
  productId: string;
  className?: string;
};

export function ProductGallery({ images, productId, className }: ProductGalleryProps) {
  const t = useTranslations("storefront");
  const [shot, setShot] = useState(0);
  const current = images[shot] ?? images[0];
  if (!current) return null;

  const isAi = current.kind === "ai";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-square overflow-hidden rounded-card bg-paper-2">
        <BeadedBracelet
          paletteIndex={current.palette}
          beadCount={current.beads}
          gradientId={`hero-${productId}-${shot}`}
          className="size-full rounded-none"
          aspectClass="aspect-square h-full"
        />
        <ProvenanceBadge
          kind={isAi ? "generated" : "original"}
          variant="full"
          audience="buyer"
          className="absolute top-2.5 left-2.5"
        />
      </div>

      {images.length > 1 ? (
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 6)}, 1fr)` }}
        >
          {images.map((im, i) => (
            <button
              key={`${im.label}-${i}`}
              type="button"
              aria-current={i === shot}
              aria-label={im.label}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[11px] border-2 bg-paper-2",
                i === shot ? "border-sun" : "border-transparent",
              )}
              onClick={() => setShot(i)}
            >
              <BeadedBracelet
                paletteIndex={im.palette}
                beadCount={im.beads}
                gradientId={`thumb-${productId}-${i}`}
                className="size-full rounded-none"
                aspectClass="aspect-square h-full"
              />
              {im.kind === "ai" ? (
                <ProvenanceBadge
                  kind="generated"
                  variant="compact"
                  audience="buyer"
                  className="absolute top-0.5 left-0.5"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      <p className="text-[0.74rem] leading-snug text-ink-45">
        {t("shotNote", {
          n: shot + 1,
          total: images.length,
          label: current.label.toLowerCase(),
        })}
      </p>

      {isAi ? (
        <AiPhotoNote title={t("aiNoteTitle")} body={t("aiNoteBody")} />
      ) : null}
    </div>
  );
}
