"use client";

import { useId } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Chip } from "@/components/atoms/Chip";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/cn";
import type { CaptionLanguage, CaptionTone } from "@/types/share";

const TONES: readonly CaptionTone[] = ["friendly", "short", "offer"];
const LANGUAGES: readonly CaptionLanguage[] = ["en", "rw"];

type CaptionComposerLabels = Readonly<{
  eyebrow: string;
  textareaLabel: string;
  languageGroupLabel: string;
  languageNames: Readonly<Record<CaptionLanguage, string>>;
  rewriteAs: string;
  toneNames: Readonly<Record<CaptionTone, string>>;
  aiBadge: string;
  restore: string;
  copy: string;
  copySuccess: string;
  copyFailure: string;
  hint: string;
}>;

type CaptionComposerProps = {
  value: string;
  /** The unedited service-authored caption for the current language and tone. */
  authoredValue: string;
  language: CaptionLanguage;
  tone: CaptionTone;
  labels: CaptionComposerLabels;
  onValueChange: (value: string) => void;
  onLanguageChange: (language: CaptionLanguage) => void;
  onToneChange: (tone: CaptionTone) => void;
  onRestore: () => void;
  onToast: (message: string) => void;
};

/**
 * The caption is the single source for every share action on this screen.
 *
 * Editing it here changes what WhatsApp, Facebook, Telegram, X, SMS and email
 * all send — that one-way flow is the most commonly broken thing in share
 * implementations, so the value lives in the shell and every channel reads it.
 */
export function CaptionComposer({
  value,
  authoredValue,
  language,
  tone,
  labels,
  onValueChange,
  onLanguageChange,
  onToneChange,
  onRestore,
  onToast,
}: CaptionComposerProps) {
  const textareaId = useId();
  const edited = value !== authoredValue;

  return (
    <section className="rounded-card border border-hair bg-white p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <Eyebrow variant="quiet">{labels.eyebrow}</Eyebrow>

        <div
          role="tablist"
          aria-label={labels.languageGroupLabel}
          className="inline-flex gap-0.5 rounded-pill bg-paper-2 p-0.5"
        >
          {LANGUAGES.map((code) => {
            const selected = code === language;
            return (
              <button
                key={code}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onLanguageChange(code)}
                className={cn(
                  "cursor-pointer rounded-pill px-2.5 py-1 text-[0.72rem] font-bold transition-colors",
                  selected ? "bg-white text-ink" : "text-ink-45 hover:text-ink",
                )}
              >
                {labels.languageNames[code]}
              </button>
            );
          })}
        </div>
      </div>

      <label htmlFor={textareaId} className="sr-only">
        {labels.textareaLabel}
      </label>

      <div className="flex flex-col gap-1">
        {!edited ? (
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-45">
            <span className="rounded-pill bg-mauve/20 px-1.5 py-0.5 text-[0.62rem] normal-case text-[#5e4478]">
              {labels.aiBadge}
            </span>
          </span>
        ) : (
          <ActionButton
            type="button"
            variant="plain"
            size="sm"
            className="min-h-0 self-start px-1 py-0 text-xs font-semibold text-ink-45"
            onClick={onRestore}
          >
            <Icon name="undo" size="sm" />
            {labels.restore}
          </ActionButton>
        )}

        <textarea
          id={textareaId}
          value={value}
          /* Screen readers need this to pronounce Kinyarwanda correctly. */
          lang={language}
          onChange={(event) => onValueChange(event.target.value)}
          className={cn(
            "min-h-[132px] w-full resize-y rounded-xl p-3 text-[0.93rem] leading-relaxed outline-none",
            "focus:border-sun focus:shadow-[0_0_0_3px_rgba(255,127,92,.2)]",
            edited
              ? "border border-ink-20 bg-white"
              : "border border-dashed border-mauve/75 bg-mauve/[0.06]",
          )}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Text size="tiny">{labels.rewriteAs}</Text>

        {TONES.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === tone}
            onClick={() => onToneChange(id)}
            className="cursor-pointer rounded-pill"
          >
            <Chip variant={id === tone ? "sun" : "line"}>{labels.toneNames[id]}</Chip>
          </button>
        ))}

        <CopyButton
          text={value}
          label={labels.copy}
          successMessage={labels.copySuccess}
          failureMessage={labels.copyFailure}
          onResult={onToast}
          className="ml-auto"
        />
      </div>

      <Text size="tiny" className="mt-2">
        {labels.hint}
      </Text>
    </section>
  );
}
