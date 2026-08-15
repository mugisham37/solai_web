"use client";

import { PanelErrorBoundary } from "@/components/build/PanelErrorBoundary";
import { CoverViewer } from "@/components/molecules/CoverViewer";
import { ImageStrip } from "@/components/molecules/ImageStrip";
import { AllowanceCounter } from "@/components/atoms/AllowanceCounter";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { SceneStylePicker } from "@/components/molecules/SceneStylePicker";
import { AspectToggle } from "@/components/molecules/AspectToggle";
import { SCENE_STYLE_OPTIONS } from "@/data/build";
import { orderedGalleryImages, canDeleteImage } from "@/lib/build-reducer";
import type { Draft, SceneStyle } from "@/types/build";

type ImageStudioPanelProps = {
  t: (key: string, values?: Record<string, string | number>) => string;
  draft: Draft;
  selectedId: string;
  onSelect: (id: string) => void;
  onSetCover: () => void;
  onRemove: () => void;
  onRegenerateScene: () => void;
  allowanceRemaining: number;
  onSceneToggle: (style: SceneStyle) => void;
  onAspectChange: (ratio: Draft["aspectRatio"]) => void;
  onRegenerateScenes: () => void;
  onAddPhoto: () => void;
};

export function ImageStudioPanel({
  t,
  draft,
  selectedId,
  onSelect,
  onSetCover,
  onRemove,
  onRegenerateScene,
  allowanceRemaining,
  onSceneToggle,
  onAspectChange,
  onRegenerateScenes,
  onAddPhoto,
}: ImageStudioPanelProps) {
  const images = orderedGalleryImages(draft);
  const selected = images.find((i) => i.id === selectedId) ?? images[0] ?? null;
  const sceneOptions = SCENE_STYLE_OPTIONS.map((o) => ({
    id: o.id,
    label: t(o.labelKey),
  }));

  return (
    <PanelErrorBoundary title={t("studio.errorTitle")} retryLabel={t("studio.errorRetry")}>
      <div className="flex flex-col gap-3">
        <CoverViewer
          image={selected}
          title={draft.title.en ?? ""}
          aspectRatio={draft.aspectRatio}
          onRegenerate={onRegenerateScene}
          onRemove={onRemove}
          canRemove={selected ? canDeleteImage(draft, selected.id) : false}
          canRegenerate={selected?.kind === "generated"}
          regenerateLabel={t("studio.regenerateOne")}
          removeLabel={t("studio.remove")}
          lockHint={t("studio.lockHint")}
          feedbackLabel={t("studio.feedback")}
        />
        <ImageStrip
          images={images}
          selectedId={selected?.id ?? draft.images.original.id}
          onSelect={onSelect}
          onAddPhoto={onAddPhoto}
          onAddScene={onRegenerateScenes}
          addPhotoLabel={t("studio.addPhoto")}
          addSceneLabel={t("studio.addScene")}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-45">{t("studio.coverLabel")}</span>
          <ActionButton type="button" variant="line" size="sm" onClick={onSetCover}>
            <Icon name="star" size="sm" />
            {t("studio.setCover")}
          </ActionButton>
          <span className="flex-1" />
          <AllowanceCounter
            label={t("studio.allowance", { count: allowanceRemaining })}
            className="text-xs text-ink-45"
          />
        </div>
        <p className="rounded-xl bg-mauve/15 p-3 text-sm text-[#5e4478]">{t("studio.provenanceNote")}</p>
        <details className="rounded-tile border border-hair bg-white">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 font-bold">
            <Icon name="spark" />
            {t("studio.sceneSection")}
            <Icon name="chevronDown" className="ml-auto" />
          </summary>
          <div className="flex flex-col gap-3 px-3 pb-3">
            <SceneStylePicker
              options={sceneOptions}
              selected={draft.sceneStyles}
              max={5}
              onToggle={onSceneToggle}
            />
            <AspectToggle
              value={draft.aspectRatio}
              onChange={onAspectChange}
              squareLabel={t("studio.aspectSquare")}
              tallLabel={t("studio.aspectTall")}
            />
            <ActionButton type="button" variant="line" block onClick={onRegenerateScenes}>
              <Icon name="refresh" />
              {t("studio.regenerateScenes")}
            </ActionButton>
          </div>
        </details>
      </div>
    </PanelErrorBoundary>
  );
}
