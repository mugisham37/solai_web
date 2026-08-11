"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";

type ShareActionBarProps = {
  /** "Nothing shared yet" or "Shared in N places" — resolved by the shell. */
  countLabel: string;
  skipLabel: string;
  doneLabel: string;
  skipHref: string;
  onDone: () => void;
};

export function ShareActionBar({
  countLabel,
  skipLabel,
  doneLabel,
  skipHref,
  onDone,
}: ShareActionBarProps) {
  return (
    <div className="sticky bottom-0 z-20 flex shrink-0 flex-wrap items-center gap-2 border-t border-hair bg-white/95 px-3.5 py-3 backdrop-blur md:px-6">
      <Text size="tiny" className="flex-1">
        {countLabel}
      </Text>

      {/* Nothing here is gated: skipping is a first-class exit. */}
      <ActionButton variant="line" size="sm" asChild>
        <Link href={skipHref}>{skipLabel}</Link>
      </ActionButton>

      <ActionButton type="button" variant="sun" size="lg" onClick={onDone}>
        {doneLabel}
        <Icon name="arrowRight" />
      </ActionButton>
    </div>
  );
}
