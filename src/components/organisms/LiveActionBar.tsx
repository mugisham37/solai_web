"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";

type LiveActionBarProps = {
  hint: string;
  ctaLabel: string;
  shareHref: string;
};

export function LiveActionBar({ hint, ctaLabel, shareHref }: LiveActionBarProps) {
  return (
    <div className="sticky bottom-0 z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-hair bg-white/95 px-3.5 py-3 backdrop-blur md:px-6">
      {/* Says plainly that the shop has no audience yet, which is why the CTA exists. */}
      <Text size="tiny" className="max-w-[38ch] flex-1">
        {hint}
      </Text>

      <ActionButton variant="sun" size="lg" asChild>
        <Link href={shareHref}>
          {ctaLabel}
          <Icon name="arrowRight" />
        </Link>
      </ActionButton>
    </div>
  );
}
