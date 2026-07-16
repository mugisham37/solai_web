"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex size-8 items-center justify-center rounded-md border border-border bg-transparent text-text transition-all duration-150 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
        className,
      )}
      suppressHydrationWarning
    >
      <Sun
        className={cn("size-4 text-text", isDark ? "block" : "hidden")}
        strokeWidth={1.5}
      />
      <Moon
        className={cn("size-4 text-text", isDark ? "hidden" : "block")}
        strokeWidth={1.5}
      />
    </button>
  );
}
