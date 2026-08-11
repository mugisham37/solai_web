"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { renderStory, waitForFonts, type StoryRenderData } from "@/lib/share/story-renderer";

/** Preview size, in device pixels. Same renderer, smaller canvas. */
const PREVIEW_WIDTH = 270;
const PREVIEW_HEIGHT = 480;

type StoryPreviewLabels = Readonly<{
  eyebrow: string;
  description: string;
  download: string;
  pack: string;
  hint: string;
}>;

type StoryPreviewProps = {
  data: StoryRenderData;
  labels: StoryPreviewLabels;
  onDownloadStory: () => void;
  onDownloadPack: () => void;
  busy?: boolean;
};

/**
 * The on-screen preview is the export renderer at a smaller size — one
 * implementation, never two, so what the seller sees is what they get.
 */
export function StoryPreview({
  data,
  labels,
  onDownloadStory,
  onDownloadPack,
  busy = false,
}: StoryPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      // Canvas does not wait for webfonts; drawing early silently falls back to
      // a system font and the seller only finds out once it is posted.
      await waitForFonts();
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      renderStory(canvas, data, PREVIEW_WIDTH, PREVIEW_HEIGHT);
      setReady(true);
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <section className="rounded-card border border-hair bg-white p-4">
      <Eyebrow variant="quiet" className="mb-3">
        {labels.eyebrow}
      </Eyebrow>

      <div className="flex items-start gap-3">
        <div className="w-[132px] shrink-0 overflow-hidden rounded-xl border border-hair bg-deep">
          {/* Decorative: everything it shows is stated in the text beside it. */}
          <canvas
            ref={canvasRef}
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            aria-hidden
            className="block aspect-[9/16] w-full"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Text size="small">{labels.description}</Text>

          <ActionButton
            type="button"
            variant="line"
            size="sm"
            disabled={busy || !ready}
            onClick={onDownloadStory}
          >
            <Icon name="download" size="sm" />
            {labels.download}
          </ActionButton>

          <ActionButton
            type="button"
            variant="line"
            size="sm"
            disabled={busy || !ready}
            onClick={onDownloadPack}
          >
            <Icon name="image" size="sm" />
            {labels.pack}
          </ActionButton>
        </div>
      </div>

      <Text size="tiny" className="mt-2.5">
        {labels.hint}
      </Text>
    </section>
  );
}
