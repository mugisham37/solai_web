"use client";

import { useState, useTransition } from "react";
import { unmaskIdentityAction } from "@/app/actions/console/unmask";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import type { UnmaskField } from "@/types/console";

type MaskedValueProps = {
  personId: string;
  field: UnmaskField;
  masked: string;
  canUnmask: boolean;
  label: string;
  className?: string;
};

/**
 * Owns the reveal path. It is structurally impossible to render an unmasked
 * identity without going through the logged unmask action (log-before-reveal).
 */
export function MaskedValue({
  personId,
  field,
  masked,
  canUnmask,
  label,
  className,
}: MaskedValueProps) {
  const [value, setValue] = useState(masked);
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reveal = () => {
    if (!reason.trim()) {
      setError("A reason is required");
      return;
    }
    startTransition(async () => {
      const result = await unmaskIdentityAction(personId, field, reason.trim());
      if (!result.ok) {
        setError(
          result.error === "forbidden"
            ? "Your role cannot unmask"
            : "Could not unmask",
        );
        return;
      }
      setValue(result.value);
      setRevealed(true);
      setOpen(false);
      setReason("");
      setError(null);
    });
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
        <span className="text-ink-70">{label}</span>
        <span
          className={cn(
            "font-bold tabular-nums",
            !revealed && "font-mono tracking-wide text-ink-45",
          )}
        >
          {value}
        </span>
      </div>

      {!revealed ? (
        <>
          <ActionButton
            type="button"
            variant="line"
            size="sm"
            disabled={!canUnmask}
            onClick={() => setOpen(true)}
            className="self-start"
          >
            <Icon name="eye" size="sm" />
            Unmask
          </ActionButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="inset-auto top-1/2 left-1/2 z-[60] max-h-[90vh] w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-card bg-paper p-5 text-ink shadow-lift">
              <SheetTitle className="font-display text-d3 text-ink">
                Unmask {label.toLowerCase()}
              </SheetTitle>
              <SheetDescription className="mt-2 text-sm text-ink-70">
                Unmasking is logged with your name and reason, and retained for
                90 days. The log is written before the value is revealed.
              </SheetDescription>
              <label className="mt-4 flex flex-col gap-1.5">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  Reason
                </span>
                <input
                  className="rounded-xl border border-ink-20 bg-white px-3 py-3 text-[0.95rem] outline-none focus:border-sun focus:ring-[3px] focus:ring-sun/20"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why do you need to see this?"
                />
              </label>
              {error ? (
                <p className="mt-2 text-xs font-semibold text-clay" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <ActionButton
                  type="button"
                  variant="sun"
                  size="sm"
                  disabled={pending}
                  onClick={reveal}
                >
                  {pending ? "Logging…" : "Log and reveal"}
                </ActionButton>
                <SheetClose asChild>
                  <ActionButton type="button" variant="line" size="sm">
                    Cancel
                  </ActionButton>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </div>
  );
}
