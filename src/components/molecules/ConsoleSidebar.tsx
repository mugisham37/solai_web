"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ConsoleBrand } from "@/components/atoms/ConsoleBrand";
import { NavItem } from "@/components/molecules/NavItem";
import { CONSOLE_NAV } from "@/data/console-nav";
import { matchConsoleRoute } from "@/lib/console/section";
import { CONSOLE_MOTION } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { usePathname } from "@/i18n/navigation";
import type { ConsoleAgent } from "@/types/console";

type ConsoleSidebarProps = {
  agent: ConsoleAgent;
  breachBadge: number;
  className?: string;
};

type PillMetrics = { y: number; height: number };

export function ConsoleSidebar({
  agent,
  breachBadge,
  className,
}: ConsoleSidebarProps) {
  const t = useTranslations("console");
  const pathname = usePathname();
  const { section: activeSection } = matchConsoleRoute(pathname);
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
  }, [measure, activeSection, breachBadge]);

  return (
    <aside
      className={cn(
        "hidden w-[236px] shrink-0 flex-col border-r border-hair bg-white px-2.5 py-4 @[1000px]:flex",
        className,
      )}
    >
      <div className="mb-3 px-2">
        <ConsoleBrand />
      </div>

      <nav
        aria-label={t("nav.sidebarLabel")}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div ref={listRef} className="relative flex flex-col gap-0.5">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-0 rounded-[11px] bg-deep"
            style={{
              height: pill.height,
              transform: `translateY(${pill.y}px)`,
              transition: `transform ${CONSOLE_MOTION.navPill.duration}s var(--ease-standard), height 0.2s var(--ease-standard)`,
            }}
          />
          {CONSOLE_NAV.map((item) => (
            <NavItem
              key={item.section}
              href={item.href}
              label={t(item.labelKey)}
              icon={item.icon}
              active={item.section === activeSection}
              badgeCount={item.badge === "breach" ? breachBadge : 0}
            />
          ))}
        </div>

        <div className="mt-auto border-t border-hair pt-3 px-1">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-deep text-[0.72rem] font-bold text-on-deep">
              {agent.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">
                {agent.name}
              </span>
              <span className="block truncate text-xs text-ink-45">
                {t(`roles.${agent.role}`)}
              </span>
            </span>
          </div>
          <p className="mt-1 px-2 text-[0.68rem] leading-snug text-ink-45">
            {t("nav.signedAs")}
          </p>
        </div>
      </nav>
    </aside>
  );
}
