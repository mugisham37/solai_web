"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const labels: Record<AppLocale, string> = {
  en: "EN",
  rw: "RW",
  sw: "SW",
  fr: "FR",
};

type LanguageSwitcherProps = {
  className?: string;
  ariaLabel: string;
};

export function LanguageSwitcher({ className, ariaLabel }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex gap-0.5 rounded-pill bg-white/10 p-0.5",
        className,
      )}
      role="group"
      aria-label={ariaLabel}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          aria-pressed={locale === loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "rounded-pill px-2 py-1 text-[0.7rem] font-bold tracking-wide",
            locale === loc ? "bg-sun text-sun-ink" : "text-on-deep-30",
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
