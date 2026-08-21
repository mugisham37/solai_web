"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Icon } from "@/components/atoms/Icon";
import { isExternalHref } from "@/lib/buyer/paths";

type ShopLinkBarProps = {
  /** Display host, e.g. `solai.shop/`. */
  host: string;
  slug: string;
  /** Absolute URL used for copying / QR / captions. */
  shopUrl: string;
  /**
   * Same-origin path for the open-shop control (e.g. `/amara`).
   * Falls back to `shopUrl` when omitted.
   */
  openHref?: string;
  copyLabel: string;
  copySuccess: string;
  copyFailure: string;
  openLabel: string;
  onToast: (message: string) => void;
};

export function ShopLinkBar({
  host,
  slug,
  shopUrl,
  openHref,
  copyLabel,
  copySuccess,
  copyFailure,
  openLabel,
  onToast,
}: ShopLinkBarProps) {
  const href = openHref ?? shopUrl;
  const external = isExternalHref(href);

  return (
    <div className="flex items-center gap-2 rounded-tile border border-ink-20 bg-white py-2 pl-3 pr-2">
      {/* Selectable text, so the QR is never the only route to the link. */}
      <span className="min-w-0 flex-1 truncate font-display text-base font-bold tracking-tight @[700px]:text-lg">
        <span className="text-ink-45">{host}</span>
        {slug}
      </span>

      <CopyButton
        text={shopUrl}
        label={copyLabel}
        successMessage={copySuccess}
        failureMessage={copyFailure}
        onResult={onToast}
      />

      <ActionButton
        type="button"
        variant="line"
        size="sm"
        aria-label={openLabel}
        className="min-h-11 rounded-full border-hair px-3"
        asChild
      >
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <Icon name="open" size="sm" />
        </a>
      </ActionButton>
    </div>
  );
}
