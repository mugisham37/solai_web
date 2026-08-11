"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Chip } from "@/components/atoms/Chip";
import { Icon } from "@/components/atoms/Icon";
import { ActionButton } from "@/components/atoms/ActionButton";
import { ImageStudioPanel } from "@/components/organisms/ImageStudioPanel";
import { ListingDetailsPanel } from "@/components/organisms/ListingDetailsPanel";
import { DraftActionBar } from "@/components/organisms/DraftActionBar";
import { removeGeneratedImage } from "@/lib/build-reducer";
import type { AutosaveStatus, Draft, SceneStyle, Tone } from "@/types/build";
import { cn } from "@/lib/cn";

type DraftEditorProps = {
  t: (key: string) => string;
  draft: Draft;
  allowanceRemaining: number;
  onDraftChange: (draft: Draft) => void;
  onBlurSave: () => void;
  onWhyPrice: () => void;
  onRewriteTone: (tone: Tone) => void;
  originalTitle: string;
  originalPriceMinor: number;
  onRebuild: () => void;
  onContinue: () => void;
  autosaveStatus: AutosaveStatus;
  onAddPhoto: () => void;
};

export function DraftEditor({
  t,
  draft,
  allowanceRemaining,
  onDraftChange,
  onBlurSave,
  onWhyPrice,
  onRewriteTone,
  originalTitle,
  originalPriceMinor,
  onRebuild,
  onContinue,
  autosaveStatus,
  onAddPhoto,
}: DraftEditorProps) {
  const [tab, setTab] = useState<"photos" | "details">("photos");
  const [selectedId, setSelectedId] = useState(draft.coverImageId);

  const updateDraft = (next: Draft) => {
    onDraftChange(next);
    setSelectedId(next.coverImageId);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-3.5 pt-3 @[1000px]:hidden">
        <div className="flex rounded-pill bg-paper-2 p-0.5" role="tablist" aria-label={t("draft.tabsLabel")}>
          {(
            [
              ["photos", t("draft.tabPhotos")],
              ["details", t("draft.tabDetails")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={cn(
                "min-h-10 flex-1 rounded-pill text-sm font-bold",
                tab === id ? "bg-white text-ink shadow-sm" : "text-ink-45",
              )}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3 px-3.5 py-3 md:px-6">
        <div>
          <Eyebrow className="text-sun-deep">{t("draft.eyebrow")}</Eyebrow>
          <Heading level={1} size="h2" className="mt-1 text-d2 normal-case">
            {t("draft.title")}
          </Heading>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="default" className="bg-mauve/20 text-[#5e4478]">
            <Icon name="spark" size="sm" />
            {t("draft.aiBadge")}
          </Chip>
          <ActionButton type="button" variant="line" size="sm" onClick={onRebuild}>
            <Icon name="refresh" size="sm" />
            {t("draft.buildAgain")}
          </ActionButton>
        </div>
      </div>

      <div className="grid flex-1 items-start gap-5 px-3.5 pb-4 md:px-6 @[1000px]:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] @[1000px]:gap-7">
        <section
          role="tabpanel"
          aria-labelledby="tab-photos"
          hidden={tab !== "photos" ? true : undefined}
          className={cn("@[1000px]:block!", tab !== "photos" && "hidden @[1000px]:!block")}
        >
          <ImageStudioPanel
            t={t}
            draft={draft}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onSetCover={() => {
              if (!selectedId) return;
              updateDraft({ ...draft, coverImageId: selectedId, updatedAt: new Date().toISOString() });
            }}
            onRemove={() => {
              const next = removeGeneratedImage(draft, selectedId);
              if (next) updateDraft(next);
            }}
            onRegenerateScene={() => onRebuild()}
            allowanceRemaining={allowanceRemaining}
            onSceneToggle={(style: SceneStyle) => {
              const has = draft.sceneStyles.includes(style);
              const styles = has
                ? draft.sceneStyles.filter((s) => s !== style)
                : draft.sceneStyles.length < 5
                  ? [...draft.sceneStyles, style]
                  : draft.sceneStyles;
              updateDraft({ ...draft, sceneStyles: styles, updatedAt: new Date().toISOString() });
            }}
            onAspectChange={(aspectRatio) =>
              updateDraft({ ...draft, aspectRatio, updatedAt: new Date().toISOString() })
            }
            onRegenerateScenes={onRebuild}
            onAddPhoto={onAddPhoto}
          />
        </section>
        <section
          role="tabpanel"
          aria-labelledby="tab-details"
          hidden={tab !== "details" ? true : undefined}
          className={cn("@[1000px]:block!", tab !== "details" && "hidden @[1000px]:!block")}
        >
          <ListingDetailsPanel
            t={t}
            draft={draft}
            onDraftChange={updateDraft}
            onBlurSave={onBlurSave}
            onWhyPrice={onWhyPrice}
            onRewriteTone={onRewriteTone}
            originalTitle={originalTitle}
            originalPriceMinor={originalPriceMinor}
          />
        </section>
      </div>

      <DraftActionBar
        t={t}
        autosaveStatus={autosaveStatus}
        onRebuild={onRebuild}
        onContinue={onContinue}
      />
    </div>
  );
}
