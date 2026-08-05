import { ProvenanceBadge } from "@/components/atoms/ProvenanceBadge";
import { Icon } from "@/components/atoms/Icon";
import type { DraftImage } from "@/types/build";
import { cn } from "@/lib/cn";

type ImageThumbProps = {
  image: DraftImage;
  selected: boolean;
  onSelect: () => void;
};

export function ImageThumb({ image, selected, onSelect }: ImageThumbProps) {
  const isOriginal = image.kind === "original";
  const name = isOriginal
    ? "Your original photo"
    : `Generated scene: ${image.sceneLabel}`;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={name}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "relative aspect-square overflow-hidden rounded-xl border-2 bg-paper-2",
        selected ? "border-sun" : "border-transparent",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.thumbnailUrl} alt="" className="size-full object-cover" />
      <span className="absolute left-0.5 top-0.5">
        <ProvenanceBadge kind={image.kind} variant="compact" />
      </span>
      {isOriginal ? (
        <span className="absolute bottom-0.5 right-0.5 text-white opacity-85" aria-hidden>
          <Icon name="lock" size="sm" className="size-3" />
        </span>
      ) : null}
    </button>
  );
}
