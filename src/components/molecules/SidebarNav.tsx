"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DashboardBrand } from "@/components/atoms/DashboardBrand";
import { Icon } from "@/components/atoms/Icon";
import { NavItem } from "@/components/molecules/NavItem";
import { DASHBOARD_NAV } from "@/data/dashboard-nav";
import { matchDashboardRoute } from "@/lib/dashboard/section";
import { DASHBOARD_MOTION } from "@/lib/motion";
import { cn } from "@/lib/cn";

type SidebarNavProps = {
  ordersBadge: number;
  shopName: string;
  shopCity: string;
  className?: string;
};

type PillMetrics = {
  y: number;
  height: number;
};

export function SidebarNav({
  ordersBadge,
  shopName,
  shopCity,
  className,
}: SidebarNavProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const { section: activeSection } = matchDashboardRoute(pathname);
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<PillMetrics>({ y: 0, height: 0 });

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    setPill({
      y: active.offsetTop - list.offsetTop,
      height: active.offsetHeight,
    });
  }, []);

  useEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, activeSection, ordersBadge]);

  return (
    <aside
      className={cn(
        "hidden w-[236px] shrink-0 flex-col border-r border-hair bg-white px-2.5 py-4 @[1000px]:flex",
        className,
      )}
    >
      <div className="mb-3 px-2">
        <DashboardBrand />
      </div>

      <nav aria-label={t("nav.sidebarLabel")} className="flex min-h-0 flex-1 flex-col">
        <div ref={listRef} className="relative flex flex-col gap-0.5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-0 rounded-[11px] bg-deep"
            style={{
              height: pill.height,
              transform: `translateY(${pill.y}px)`,
              transition: `transform ${DASHBOARD_MOTION.navPill.duration}s var(--ease-standard), height 0.2s var(--ease-standard)`,
            }}
          />
          {DASHBOARD_NAV.map((item) => (
            <NavItem
              key={item.section}
              href={item.href}
              label={t(item.labelKey)}
              icon={item.icon}
              active={item.section === activeSection}
              badgeCount={item.badge === "needsYou" ? ordersBadge : 0}
            />
          ))}
        </div>

        <div className="mt-auto border-t border-hair pt-3">
          <Link
            href="/dashboard/settings"
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left hover:bg-paper-2"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-paper-2 text-ink">
              <Icon name="store" size="md" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">{shopName}</span>
              <span className="block truncate text-xs text-ink-45">{shopCity}</span>
            </span>
            <Icon name="chevronRight" size="sm" className="text-ink-45" />
          </Link>
        </div>
      </nav>
    </aside>
  );
}
