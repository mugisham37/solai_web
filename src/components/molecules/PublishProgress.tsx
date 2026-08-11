"use client";

import { useEffect, useRef } from "react";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { cn } from "@/lib/cn";
import type { PublishStage } from "@/types/live";

type PublishProgressProps = {
  stages: readonly PublishStage[];
  progress: number;
  progressLabel: string;
};

export function PublishProgress({ stages, progress, progressLabel }: PublishProgressProps) {
  const liveRef = useRef<HTMLParagraphElement>(null);
  const announced = useRef<string | null>(null);

  /** One announcement per stage — re-announcing the same label is noise. */
  useEffect(() => {
    const active = stages.find((stage) => stage.status === "active");
    if (!active || active.id === announced.current) return;
    announced.current = active.id;
    if (liveRef.current) liveRef.current.textContent = active.label;
  }, [stages]);

  return (
    <div className="flex flex-col gap-4">
      <p ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <ProgressBar value={progress} heightClass="h-1.5" label={progressLabel} />

      <ol className="flex flex-col gap-3">
        {stages.map((stage) => (
          <li
            key={stage.id}
            className={cn(
              "flex items-center gap-2.5 text-sm transition-colors",
              stage.status === "pending" && "text-ink-20",
              stage.status === "active" && "text-ink",
              stage.status === "done" && "text-ink-70",
            )}
          >
            <span
              className={cn(
                "grid size-[22px] shrink-0 place-items-center rounded-full border-2 text-[0.62rem]",
                stage.status === "pending" && "border-current",
                stage.status === "active" && "border-sun border-r-transparent motion-safe:animate-spin",
                stage.status === "done" && "border-sea bg-sea text-white",
              )}
              aria-hidden
            >
              {stage.status === "done" ? "✓" : ""}
            </span>
            {stage.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
