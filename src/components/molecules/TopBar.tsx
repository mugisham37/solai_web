"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DashboardBrand } from "@/components/atoms/DashboardBrand";
import { Icon } from "@/components/atoms/Icon";
import { matchDashboardRoute } from "@/lib/dashboard/section";
import { cn } from "@/lib/cn";

type TopBarProps = {
  onSearch?: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
  className?: string;
};

export function TopBar({
  onSearch,
  onNotifications,
  notificationCount = 0,
  className,
}: TopBarProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const route = matchDashboardRoute(pathname);
  const title = t(route.titleKey);
  const backHref = route.backHref;

  return (
    <header
      className={cn(
        "sticky top-0 z-20 shrink-0 border-b border-hair bg-paper/92 backdrop-blur-[14px]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 @[700px]:px-6 @[700px]:py-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label={t("topBar.back")}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-hair bg-white text-ink"
          >
            <Icon name="arrowLeft" size="md" />
          </Link>
        ) : (
          <div className="flex min-w-0 items-center gap-2 @[1000px]:hidden">
            <DashboardBrand />
          </div>
        )}

        <h1 className="min-w-0 flex-1 truncate font-display text-base font-extrabold tracking-tight text-ink uppercase">
          {title}
        </h1>

        <button
          type="button"
          onClick={onSearch}
          aria-label={t("topBar.search")}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-hair bg-white text-ink disabled:opacity-50"
          disabled={!onSearch}
        >
          <Icon name="search" size="md" />
        </button>

        <button
          type="button"
          onClick={onNotifications}
          aria-label={t("topBar.notifications")}
          className="relative grid size-11 shrink-0 place-items-center rounded-full border border-hair bg-white text-ink disabled:opacity-50"
          disabled={!onNotifications}
        >
          <Icon name="bell" size="md" />
          {notificationCount > 0 ? (
            <span
              aria-hidden
              className="absolute top-2 right-2 size-2 rounded-full bg-sun"
            />
          ) : null}
        </button>
      </div>
    </header>
  );
}
