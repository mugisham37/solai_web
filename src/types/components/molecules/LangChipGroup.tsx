import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LangChipGroupProps {
  languages: { code: string; label: string }[];
  className?: string;
}

export function LangChipGroup({ languages, className }: LangChipGroupProps) {
  return (
    <div className={cn("mt-3 flex flex-wrap gap-1.5", className)}>
      {languages.map((lang) => (
        <Badge
          key={lang.code}
          className="rounded-sm bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
        >
          {lang.label}
        </Badge>
      ))}
    </div>
  );
}
