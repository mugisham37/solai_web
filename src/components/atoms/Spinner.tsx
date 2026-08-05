"use client";

import { cn } from "@/lib/cn";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span
      className={cn("inline-block size-[34px] rounded-full border-[3px] border-paper-2 border-t-sun motion-safe:animate-spin", className)}
      role="status"
      aria-label={label ?? "Loading"}
    />
  );
}
