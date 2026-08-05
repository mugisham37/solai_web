"use client";

import { useMemo } from "react";
import { qrSvgString } from "@/lib/qr";
import { cn } from "@/lib/cn";

/**
 * Below this the code stops scanning reliably at arm's length, which turns a
 * working feature into a broken one.
 */
export const QR_MIN_SIZE_PX = 180;

type QrCodeProps = {
  url: string;
  /** Describes where the code leads. The URL is always available as text too. */
  label: string;
  /** Rendered box size in pixels; never goes below `QR_MIN_SIZE_PX`. */
  size?: number;
  className?: string;
};

export function QrCode({ url, label, size = QR_MIN_SIZE_PX, className }: QrCodeProps) {
  const svg = useMemo(() => {
    try {
      return qrSvgString(url);
    } catch {
      return null;
    }
  }, [url]);

  const box = Math.max(QR_MIN_SIZE_PX, size);

  if (!svg) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-tile border border-hair bg-white p-3 text-center text-[0.76rem] leading-snug text-ink-45",
          className,
        )}
        style={{ width: box, height: box }}
      >
        {url}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("[&>svg]:h-full [&>svg]:w-full", className)}
      style={{ width: box, height: box }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
