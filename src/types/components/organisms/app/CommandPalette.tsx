"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { commandPaletteItems } from "@/lib/data/app/nav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: () => void;
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commandPaletteItems;
    return commandPaletteItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof commandPaletteItems>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const navigate = (href: string) => {
    handleClose();
    onNavigate?.();
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <div className="flex items-center gap-2">
            <Search className="size-4 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages and actions…"
              className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-subtle"
              autoFocus
            />
            <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-text-subtle sm:inline">
              ⌘K
            </kbd>
          </div>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto p-2">
          {groups.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-text-muted">
              No results found.
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-1.5 text-xs font-medium tracking-wide text-text-subtle uppercase">
                  {group}
                </p>
                {items.map((item) => (
                  <button
                    key={item.href + item.label}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-text transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
