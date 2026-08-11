"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { checkShopSlug } from "@/app/actions/publish";
import { Chip } from "@/components/atoms/Chip";
import { cn } from "@/lib/cn";
import { checkSlugShape, sanitiseSlug } from "@/lib/slug";
import { SLUG_MAX_LENGTH } from "@/types/live";

type SlugLabels = Readonly<{
  fieldLabel: string;
  inputLabel: string;
  hintDefault: string;
  hintChecking: string;
  hintTooShort: string;
  hintTooLong: string;
  hintUnchanged: string;
  hintTaken: string;
  hintReserved: string;
  hintInvalid: string;
  /** Takes a `{slug}` placeholder. */
  hintFree: (slug: string) => string;
  suggestionsLabel: string;
}>;

type SlugEditorProps = {
  draftId: string;
  currentSlug: string;
  host: string;
  labels: SlugLabels;
  /** Reports the slug to save, or null while it is not saveable. */
  onValidChange: (slug: string | null) => void;
};

type Verdict =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "ok"; slug: string }
  | { kind: "bad"; message: string; suggestions: readonly string[] };

const DEBOUNCE_MS = 350;

export function SlugEditor({
  draftId,
  currentSlug,
  host,
  labels,
  onValidChange,
}: SlugEditorProps) {
  const [value, setValue] = useState(currentSlug);
  const [verdict, setVerdict] = useState<Verdict>({ kind: "idle" });

  const inputId = useId();
  const hintId = useId();

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Only the newest request may write a verdict. */
  const requestSeq = useRef(0);

  const runCheck = useCallback(
    async (slug: string) => {
      const seq = requestSeq.current;
      const result = await checkShopSlug(draftId, slug);
      if (seq !== requestSeq.current) return; // superseded while in flight

      if (result.available) {
        setVerdict({ kind: "ok", slug });
        onValidChange(slug);
        return;
      }

      const message =
        result.reason === "taken"
          ? labels.hintTaken
          : result.reason === "reserved"
            ? labels.hintReserved
            : labels.hintInvalid;
      setVerdict({ kind: "bad", message, suggestions: result.suggestions });
      onValidChange(null);
    },
    [draftId, labels.hintTaken, labels.hintReserved, labels.hintInvalid, onValidChange],
  );

  const evaluate = useCallback(
    (raw: string) => {
      if (debounce.current) clearTimeout(debounce.current);
      requestSeq.current += 1;

      const slug = sanitiseSlug(raw);
      const shape = checkSlugShape(slug, currentSlug);

      if (shape) {
        onValidChange(null);
        setVerdict(
          shape === "unchanged"
            ? { kind: "idle" }
            : {
                kind: "bad",
                message: shape === "too-short" ? labels.hintTooShort : labels.hintTooLong,
                suggestions: [],
              },
        );
        return;
      }

      onValidChange(null);
      setVerdict({ kind: "checking" });
      debounce.current = setTimeout(() => void runCheck(slug), DEBOUNCE_MS);
    },
    [currentSlug, labels.hintTooShort, labels.hintTooLong, onValidChange, runCheck],
  );

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
      requestSeq.current += 1;
    };
  }, []);

  /** Rewrite the field as they type, so what they see is what the URL becomes. */
  const handleChange = (raw: string) => {
    const clean = sanitiseSlug(raw);
    setValue(clean);
    evaluate(clean);
  };

  const applySuggestion = (slug: string) => {
    setValue(slug);
    evaluate(slug);
  };

  const state = verdict.kind === "ok" ? "good" : verdict.kind === "bad" ? "bad" : "neutral";
  const hint =
    verdict.kind === "ok"
      ? labels.hintFree(verdict.slug)
      : verdict.kind === "bad"
        ? verdict.message
        : verdict.kind === "checking"
          ? labels.hintChecking
          : value === currentSlug
            ? labels.hintUnchanged
            : labels.hintDefault;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-bold uppercase tracking-wider text-ink-45"
      >
        {labels.fieldLabel}
      </label>

      <div
        className={cn(
          "flex items-center overflow-hidden rounded-xl border bg-white",
          state === "neutral" && "border-ink-20",
          state === "good" && "border-sea shadow-[0_0_0_3px_rgb(74_143_135_/_16%)]",
          state === "bad" && "border-clay shadow-[0_0_0_3px_rgb(110_0_0_/_14%)]",
        )}
      >
        <span className="whitespace-nowrap py-3 pl-3 font-bold text-ink-45" aria-hidden>
          {host}
        </span>
        <input
          id={inputId}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={SLUG_MAX_LENGTH}
          autoComplete="off"
          spellCheck={false}
          inputMode="url"
          aria-label={labels.inputLabel}
          aria-describedby={hintId}
          aria-invalid={state === "bad"}
          className="min-w-0 flex-1 border-0 bg-transparent py-3 pl-0.5 pr-3 font-bold outline-none"
        />
      </div>

      <p
        id={hintId}
        aria-live="polite"
        className={cn(
          "text-[0.73rem]",
          state === "good" && "text-sea-muted",
          state === "bad" && "text-clay",
          state === "neutral" && "text-ink-45",
        )}
      >
        {hint}
      </p>

      {verdict.kind === "bad" && verdict.suggestions.length > 0 ? (
        <div className="mt-1 flex flex-col gap-1.5">
          <p className="text-[0.73rem] text-ink-45">{labels.suggestionsLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {verdict.suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => applySuggestion(suggestion)}>
                <Chip variant="line" className="cursor-pointer hover:bg-paper-2">
                  {suggestion}
                </Chip>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
