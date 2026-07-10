"use client";

import { cn } from "@/lib/utils";
import { useHeroFloat } from "@/lib/hooks/use-hero-float";
import type { HeroLayer } from "@/types/marketing";

const LAYER_STYLES = [
  "top-0 left-[10%] z-30 h-[35%] w-4/5 border-[rgba(255,181,71,.3)] bg-[rgba(255,181,71,.08)] text-warning",
  "top-[25%] left-[5%] z-20 h-[35%] w-4/5 border-[rgba(91,124,255,.3)] bg-[rgba(91,124,255,.08)] text-brand",
  "top-1/2 left-[12%] z-10 h-[35%] w-4/5 border-[rgba(52,211,153,.3)] bg-[rgba(52,211,153,.08)] text-success",
];

export function HeroVisual({ layers }: { layers: HeroLayer[] }) {
  const containerRef = useHeroFloat<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[440px]"
      style={{ aspectRatio: "1 / 0.85" }}
      aria-hidden="true"
    >
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          data-hero-layer
          className={cn(
            "absolute flex items-end rounded-lg border px-4 py-3 backdrop-blur-sm [transform:perspective(600px)_rotateX(8deg)]",
            LAYER_STYLES[index],
          )}
        >
          <span className="font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
            {layer.label}
          </span>
        </div>
      ))}
    </div>
  );
}
