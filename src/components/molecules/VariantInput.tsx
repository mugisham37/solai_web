"use client";

import { Icon } from "@/components/atoms/Icon";

type VariantInputProps = {
  variants: readonly string[];
  onChange: (variants: string[]) => void;
  placeholder: string;
  ariaLabel: string;
};

export function VariantInput({ variants, onChange, placeholder, ariaLabel }: VariantInputProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-1.5 rounded-xl border border-ink-20 bg-white p-2"
      onClick={(e) => {
        const input = e.currentTarget.querySelector("input");
        input?.focus();
      }}
    >
      {variants.map((v) => (
        <span key={v} className="inline-flex items-center gap-1 rounded-pill bg-paper-2 px-2 py-0.5 text-sm font-semibold">
          {v}
          <button
            type="button"
            aria-label={`Remove ${v}`}
            onClick={() => onChange(variants.filter((x) => x !== v))}
          >
            <Icon name="x" size="sm" className="size-3" />
          </button>
        </span>
      ))}
      <input
        className="min-w-[90px] flex-1 border-0 bg-transparent text-sm outline-none"
        placeholder={placeholder}
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            e.preventDefault();
            onChange([...variants, e.currentTarget.value.trim()]);
            e.currentTarget.value = "";
          }
          if (e.key === "Backspace" && !e.currentTarget.value && variants.length) {
            onChange(variants.slice(0, -1));
          }
        }}
      />
    </div>
  );
}
