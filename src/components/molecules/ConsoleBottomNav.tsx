"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/atoms/Icon";
import { CONSOLE_BOTTOM_NAV } from "@/data/console-nav";
import { matchConsoleRoute } from "@/lib/console/section";
import { cn } from "@/lib/cn";

type ConsoleBottomNavProps = {
  breachBadge: number;
  className?: string;
};

export function ConsoleBottomNav({
  breachBadge,
  className,
}: ConsoleBottomNavProps) {
  const t = useTranslations("console");
  const pathname = usePathname();
  const { section: activeSection } = matchConsoleRoute(pathname);

  return (
    <nav
      aria-label={t("nav.bottomLabel")}
      className={cn(
        "sticky bottom-0 z-[25] flex shrink-0 border-t border-hair bg-white/95 pt-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] backdrop-blur-[14px] @[1000px]:hidden",
        className,
      )}
    >
      {CONSOLE_BOTTOM_NAV.map((item) => {
        const active = item.section === activeSection;
        const showDot = item.badge === "breach" && breachBadge > 0;

        return (
          <Link
            key={item.section}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-[52px] flex-1 flex-col items-center gap-0.5 px-1 py-1.5 text-[0.62rem] font-bold transition-colors duration-[180ms] ease-[var(--ease-standard)]",
              active ? "text-sun-deep" : "text-ink-45",
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute top-0 left-1/2 h-[3px] w-[26px] -translate-x-1/2 rounded-b-[3px] bg-sun"
              />
            ) : null}
            {showDot ? (
              <span
                aria-hidden
                className="absolute top-[0.32rem] right-[calc(50%-15px)] size-2 rounded-full border-2 border-white bg-clay"
              />
            ) : null}
            <Icon
              name={item.icon}
              size="lg"
              className={cn(
                "size-[22px] transition-transform duration-[240ms] ease-[var(--ease-standard)]",
                active && "motion-safe:-translate-y-0.5",
              )}
            />
            <span className="max-w-full truncate px-0.5">
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
