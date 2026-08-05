"use client";

import type { DraftImage } from "@/types/build";
import { ImageThumb } from "@/components/molecules/ImageThumb";
import { Icon } from "@/components/atoms/Icon";

type ImageStripProps = {
  images: readonly DraftImage[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddPhoto: () => void;
  onAddScene: () => void;
  addPhotoLabel: string;
  addSceneLabel: string;
};

export function ImageStrip({
  images,
  selectedId,
  onSelect,
  onAddPhoto,
  onAddScene,
  addPhotoLabel,
  addSceneLabel,
}: ImageStripProps) {
  return (
    <div
      role="listbox"
      aria-label="Product images"
      className="@container grid grid-cols-4 gap-1.5 @[400px]:grid-cols-6"
    >
      {images.map((image) => (
        <ImageThumb
          key={image.id}
          image={image}
          selected={image.id === selectedId}
          onSelect={() => onSelect(image.id)}
        />
      ))}
      <button
        type="button"
        onClick={onAddPhoto}
        className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-ink-20 bg-white text-ink-45 hover:border-sun hover:text-sun-deep"
        aria-label={addPhotoLabel}
      >
        <Icon name="plus" />
        <span className="mt-0.5 text-[0.6rem] font-bold">Photo</span>
      </button>
      <button
        type="button"
        onClick={onAddScene}
        className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-ink-20 bg-white text-ink-45 hover:border-sun hover:text-sun-deep"
        aria-label={addSceneLabel}
      >
        <Icon name="spark" />
        <span className="mt-0.5 text-[0.6rem] font-bold">Scene</span>
      </button>
    </div>
  );
}
