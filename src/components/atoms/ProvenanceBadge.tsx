import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type ProvenanceBadgeProps = {
  kind: "original" | "generated";
  variant?: "compact" | "full";
  /** Seller editor vs buyer storefront copy. */
  audience?: "seller" | "buyer";
  sceneLabel?: string;
  className?: string;
};

export function ProvenanceBadge({
  kind,
  variant = "compact",
  audience = "seller",
  sceneLabel,
  className,
}: ProvenanceBadgeProps) {
  const isAi = kind === "generated";

  let label: string;
  if (audience === "buyer") {
    if (variant === "full") {
      label = isAi ? "Styled picture" : "Seller’s own photo";
    } else {
      label = isAi ? "AI" : "";
    }
  } else if (variant === "full") {
    label = isAi ? `AI scene · ${sceneLabel ?? "Generated"}` : "Your photo";
  } else {
    label = isAi ? "AI" : "YOURS";
  }

  if (audience === "buyer" && variant === "compact" && !isAi) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold text-white",
        variant === "compact"
          ? "rounded-[5px] px-1 py-0.5 text-[0.55rem]"
          : "rounded-lg px-2 py-1 text-[0.68rem] backdrop-blur-md",
        isAi ? "bg-[rgb(94_68_120/86%)]" : "bg-[rgb(11_35_34/72%)]",
        className,
      )}
    >
      {variant === "full" || isAi ? (
        <Icon name={isAi ? "spark" : "camera"} size="sm" className="size-3" />
      ) : null}
      {label}
    </span>
  );
}
