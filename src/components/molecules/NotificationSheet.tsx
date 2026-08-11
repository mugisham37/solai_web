"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { notificationHref } from "@/lib/dashboard/notification-href";
import { cn } from "@/lib/cn";
import type { DashboardNotification, NotificationKind } from "@/types/dashboard";
import type { IconName } from "@/types/icon";

type NotificationSheetProps = {
  notifications: readonly DashboardNotification[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const KIND_ICON: Record<NotificationKind, IconName> = {
  berry: "tag",
  sea: "check",
  clay: "alert",
};

const KIND_TILE: Record<NotificationKind, "berry" | "sea" | "clay"> = {
  berry: "berry",
  sea: "sea",
  clay: "clay",
};

export function NotificationSheet({
  notifications,
  open,
  onOpenChange,
}: NotificationSheetProps) {
  const t = useTranslations("dashboard");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[88vh] rounded-t-[22px] border border-hair bg-paper p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "@[700px]/app:inset-auto @[700px]/app:top-1/2 @[700px]/app:left-1/2 @[700px]/app:max-h-[min(90vh,640px)] @[700px]/app:w-[min(100%-2rem,480px)] @[700px]/app:-translate-x-1/2 @[700px]/app:-translate-y-1/2 @[700px]/app:rounded-card",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
            {t("notifications.title")}
          </SheetTitle>
          <ActionButton
            type="button"
            variant="plain"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {t("notifications.close")}
          </ActionButton>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-2 overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-[0.73rem] text-ink-45">{t("notifications.empty")}</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={notificationHref(n.subject)}
                onClick={() => onOpenChange(false)}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-tile border border-hair bg-white px-3 py-2.5 text-left hover:bg-paper-2"
              >
                <IconTile variant={KIND_TILE[n.kind]}>
                  <Icon name={KIND_ICON[n.kind]} />
                </IconTile>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.91rem] font-bold text-ink">
                    {n.title}
                  </span>
                  <span className="block text-[0.73rem] text-ink-45">
                    {n.subtitle}
                  </span>
                </span>
                <Icon name="chevronRight" size="sm" className="text-ink-45" />
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
