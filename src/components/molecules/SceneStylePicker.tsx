import type { SceneStyle } from "@/types/build";
import { Chip } from "@/components/atoms/Chip";
import { cn } from "@/lib/cn";

type SceneStylePickerProps = {
  options: ReadonlyArray<{ id: SceneStyle; label: string }>;
  selected: readonly SceneStyle[];
  max: number;
  onToggle: (id: SceneStyle) => void;
};

export function SceneStylePicker({ options, selected, max, onToggle }: SceneStylePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt.id);
        const disabled = !on && selected.length >= max;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            aria-pressed={on}
            onClick={() => onToggle(opt.id)}
            className={cn(disabled && "opacity-40")}
          >
            <Chip variant={on ? "default" : "line"} className={on ? "bg-deep text-on-deep" : ""}>
              {opt.label}
            </Chip>
          </button>
        );
      })}
    </div>
  );
}
