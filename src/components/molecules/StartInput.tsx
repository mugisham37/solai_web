"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createDraftFromQuery } from "@/app/actions/create-draft";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/ui/input";
import { PLACEHOLDER_SAMPLES } from "@/lib/categories";
import { cn } from "@/lib/cn";

type StartInputProps = {
  size?: "default" | "large";
  surface?: "dark" | "light";
  label?: string;
  submitLabel: string;
  cameraLabel: string;
  placeholderSeed?: string;
  className?: string;
  id?: string;
  onValueChange?: (value: string) => void;
};

export function StartInput({
  size = "default",
  surface = "dark",
  label,
  submitLabel,
  cameraLabel,
  placeholderSeed,
  className,
  id = "start-input",
  onValueChange,
}: StartInputProps) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const typingRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let sampleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const input = inputRef.current;
    if (!input) return;

    const tick = () => {
      if (!typingRef.current) return;
      const word = PLACEHOLDER_SAMPLES[sampleIndex] ?? PLACEHOLDER_SAMPLES[0];
      charIndex = deleting ? charIndex - 1 : charIndex + 1;
      input.placeholder = word.slice(0, charIndex);
      let wait = deleting ? 35 : 72;
      if (!deleting && charIndex === word.length) {
        wait = 1700;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        sampleIndex = (sampleIndex + 1) % PLACEHOLDER_SAMPLES.length;
        wait = 260;
      }
      timeout = setTimeout(tick, wait);
    };

    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);

  const onFocus = () => {
    typingRef.current = false;
    if (inputRef.current) inputRef.current.placeholder = "";
  };

  const submit = useCallback(() => {
    const q = value.trim() || inputRef.current?.placeholder || placeholderSeed || "";
    startTransition(() => {
      void createDraftFromQuery(q || undefined);
    });
  }, [placeholderSeed, value]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <label htmlFor={id} className="text-eyebrow text-sun">
          {label}
        </label>
      ) : null}
      <form
        className={cn(
          "@container flex items-center gap-2 rounded-pill border border-deep-hair bg-white/10 p-1.5 pl-2 backdrop-blur-sm",
          surface === "light" && "border-hair bg-white",
          size === "large" && "max-w-[520px]",
        )}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <button
          type="button"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border-0 bg-white/15 text-on-deep transition hover:scale-105 hover:bg-sun hover:text-sun-ink md:size-[50px]",
            surface === "light" && "bg-paper-2 text-ink hover:bg-sun",
          )}
          aria-label={cameraLabel}
        >
          <Icon name="camera" size="lg" />
        </button>
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          onFocus={onFocus}
          autoComplete="off"
          aria-label={label ?? submitLabel}
          className={surface === "light" ? "text-ink placeholder:text-ink-45" : undefined}
        />
        <ActionButton type="submit" variant="sun" size="sm" className="shrink-0" disabled={isPending}>
          {submitLabel}
          <Icon name="arrowRight" size="sm" />
        </ActionButton>
      </form>
    </div>
  );
}
