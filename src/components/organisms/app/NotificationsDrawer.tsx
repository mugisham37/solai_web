"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Notification } from "@/types/app";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/atoms/app/StatusDot";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
}

type NotifTab = "all" | "actions" | "wins";

export function NotificationsDrawer({
  open,
  onClose,
  notifications,
}: NotificationsDrawerProps) {
  const [tab, setTab] = useState<NotifTab>("all");

  const filtered = useMemo(() => {
    if (tab === "actions") {
      return notifications.filter(
        (n) => n.type === "warning" || n.type === "danger"
      );
    }
    if (tab === "wins") {
      return notifications.filter((n) => n.type === "success");
    }
    return notifications;
  }, [notifications, tab]);

  const toneText: Record<Notification["type"], string> = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-border bg-surface p-0 sm:max-w-[380px]"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-4 py-4">
          <SheetTitle className="text-text">Notifications</SheetTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Close notifications"
          >
            <X className="size-4" />
          </button>
        </SheetHeader>

        <div className="flex gap-1 border-b border-border px-4 py-2">
          {(
            [
              { id: "all", label: "All" },
              { id: "actions", label: "Needs attention" },
              { id: "wins", label: "Wins" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                tab === t.id
                  ? "bg-brand-soft text-brand"
                  : "text-text-muted hover:text-text"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="flex gap-3 border-b border-border px-4 py-3 last:border-0"
            >
              <StatusDot tone={n.type} className="mt-1.5" />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <span
                    className={cn("text-sm font-medium", toneText[n.type])}
                  >
                    {n.agent}
                  </span>
                  <span className="shrink-0 text-xs text-text-subtle">
                    {n.time}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{n.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
