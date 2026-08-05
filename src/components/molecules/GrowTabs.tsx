"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/dashboard/grow", key: "catalogue" as const },
  { href: "/dashboard/grow/boost", key: "boost" as const },
] as const;

export function GrowTabs() {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label={t("grow.tabsLabel")}
      className="flex gap-1 rounded-pill border border-hair bg-paper-2 p-1"
    >
      {TABS.map((tab) => {
        const selected = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={selected}
            className={cn(
              "min-h-11 flex-1 rounded-pill px-3 py-2 text-center text-[0.82rem] font-bold transition-colors",
              selected
                ? "bg-white text-ink shadow-sm"
                : "text-ink-45 hover:text-ink",
            )}
          >
            {t(`grow.tabs.${tab.key}`)}
          </Link>
        );
      })}
    </div>
  );
}
