"use client";

import { useCallback, useState } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { QrCode } from "@/components/atoms/QrCode";
import { qrPngBlob } from "@/lib/qr";

type QrPanelLabels = Readonly<{
  qrAlt: string;
  download: string;
  print: string;
  enlarge: string;
  savedToast: string;
  failedToast: string;
}>;

type QrPanelProps = {
  shopUrl: string;
  slug: string;
  size?: number;
  labels: QrPanelLabels;
  onToast: (message: string) => void;
  onEnlarge?: () => void;
};

export function QrPanel({
  shopUrl,
  slug,
  size = 220,
  labels,
  onToast,
  onEnlarge,
}: QrPanelProps) {
  const [saving, setSaving] = useState(false);

  /**
   * Export a PNG, not the SVG: sellers take this to a copy shop, and copy shops
   * cannot open SVG.
   */
  const handleDownload = useCallback(async () => {
    setSaving(true);
    try {
      const blob = await qrPngBlob(shopUrl);
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = `solai-${slug}-qr.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
      onToast(labels.savedToast);
    } catch {
      onToast(labels.failedToast);
    } finally {
      setSaving(false);
    }
  }, [shopUrl, slug, onToast, labels.savedToast, labels.failedToast]);

  return (
    <div className="flex flex-col gap-3">
      {/* White only, never tinted — contrast is a scanning requirement. */}
      <div className="grid place-items-center rounded-2xl border border-hair bg-white p-3.5">
        <QrCode url={shopUrl} label={labels.qrAlt} size={size} className="max-w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton
          type="button"
          variant="line"
          size="sm"
          disabled={saving}
          onClick={() => void handleDownload()}
        >
          <Icon name="download" size="sm" />
          {labels.download}
        </ActionButton>

        <ActionButton type="button" variant="line" size="sm" onClick={() => window.print()}>
          <Icon name="print" size="sm" />
          {labels.print}
        </ActionButton>

        {onEnlarge ? (
          <ActionButton type="button" variant="line" size="sm" onClick={onEnlarge}>
            <Icon name="qr" size="sm" />
            {labels.enlarge}
          </ActionButton>
        ) : null}
      </div>
    </div>
  );
}
