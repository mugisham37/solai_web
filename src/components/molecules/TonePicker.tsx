import type { Tone } from "@/types/build";
import { Chip } from "@/components/atoms/Chip";

type TonePickerProps = {
  options: ReadonlyArray<{ id: Tone; label: string }>;
  onSelect: (tone: Tone) => void;
  prefix: string;
};

export function TonePicker({ options, onSelect, prefix }: TonePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ink-45">{prefix}</span>
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onSelect(o.id)}>
          <Chip variant="line">{o.label}</Chip>
        </button>
      ))}
    </div>
  );
}
