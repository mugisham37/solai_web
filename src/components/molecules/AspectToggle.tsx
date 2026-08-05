import { Chip } from "@/components/atoms/Chip";
import type { AspectRatio } from "@/types/build";

type AspectToggleProps = {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  squareLabel: string;
  tallLabel: string;
};

export function AspectToggle({ value, onChange, squareLabel, tallLabel }: AspectToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(
        [
          ["1:1", squareLabel],
          ["4:5", tallLabel],
        ] as const
      ).map(([ratio, label]) => (
        <button
          key={ratio}
          type="button"
          aria-pressed={value === ratio}
          onClick={() => onChange(ratio)}
        >
          <Chip variant={value === ratio ? "default" : "line"} className={value === ratio ? "bg-deep text-on-deep" : ""}>
            {label}
          </Chip>
        </button>
      ))}
    </div>
  );
}
