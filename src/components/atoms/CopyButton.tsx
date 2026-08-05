"use client";

import { useCallback, useState } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";

type CopyButtonProps = {
  text: string;
  label: string;
  /** Announced after a successful copy. */
  successMessage: string;
  /** Announced when both clipboard paths fail, telling them what to do instead. */
  failureMessage: string;
  onResult: (message: string) => void;
  onCopied?: () => void;
  variant?: "line" | "sun" | "plain";
  size?: "sm" | "default" | "lg";
  block?: boolean;
  /** Renders icon-only with `label` as the accessible name. */
  iconOnly?: boolean;
  className?: string;
};

export function CopyButton({
  text,
  label,
  successMessage,
  failureMessage,
  onResult,
  onCopied,
  variant = "line",
  size = "sm",
  block = false,
  iconOnly = false,
  className,
}: CopyButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleCopy = useCallback(async () => {
    setBusy(true);
    const outcome = await copyText(text);
    setBusy(false);
    if (outcome === "copied") {
      onResult(successMessage);
      onCopied?.();
    } else {
      onResult(failureMessage);
    }
  }, [text, onResult, successMessage, failureMessage, onCopied]);

  return (
    <ActionButton
      type="button"
      variant={variant}
      size={size}
      block={block}
      disabled={busy}
      onClick={() => void handleCopy()}
      aria-label={iconOnly ? label : undefined}
      className={cn(iconOnly && "px-3", className)}
    >
      <Icon name="copy" size="sm" />
      {iconOnly ? null : label}
    </ActionButton>
  );
}
