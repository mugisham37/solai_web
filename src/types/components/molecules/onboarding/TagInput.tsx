"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter",
  className,
}: TagInputProps) {
  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
  }

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap gap-1.5 rounded-md border border-border bg-bg p-2",
        className,
      )}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="gap-1 rounded-sm bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Remove ${tag}`}
            className="text-brand/60 hover:text-brand focus-visible:outline-none"
          >
            <X className="size-2.5" />
          </button>
        </Badge>
      ))}
      <Input
        className="h-7 min-w-[120px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
    </div>
  );
}
