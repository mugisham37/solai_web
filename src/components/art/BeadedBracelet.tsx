type BeadedBraceletProps = {
  paletteIndex?: number;
  beadCount?: number;
  aspectClass?: string;
  gradientId: string;
  className?: string;
  style?: React.CSSProperties;
};

import { BRACELET_PALETTES } from "@/data/bracelet-palettes";

export function BeadedBracelet({
  paletteIndex = 0,
  beadCount = 12,
  aspectClass = "aspect-square",
  gradientId,
  className,
  style,
}: BeadedBraceletProps) {
  const palette =
    BRACELET_PALETTES[paletteIndex % BRACELET_PALETTES.length] ??
    BRACELET_PALETTES[0];
  const beads = Array.from({ length: beadCount }, (_, i) => i);

  return (
    <div className={`overflow-hidden rounded-xl ${aspectClass} ${className ?? ""}`} style={{ background: palette.bg, ...style }}>
      <svg viewBox="0 0 100 100" role="img" aria-label="Beaded bracelet" className="size-full">
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%">
            <stop offset="0" stopColor={palette.light} />
            <stop offset="1" stopColor={palette.dark} />
          </radialGradient>
        </defs>
        <g transform="translate(50 50)">
          <circle r="27" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {beads.map((i) => (
            <circle
              key={i}
              cx="0"
              cy="-27"
              r="6"
              fill={`url(#${gradientId})`}
              transform={`rotate(${(i * 360) / beadCount})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
