"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { switchConsoleRoleAction } from "@/app/actions/console/session";
import { ConsoleBrand } from "@/components/atoms/ConsoleBrand";
import { Icon } from "@/components/atoms/Icon";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { CONSOLE_VIEW_TITLE_KEY } from "@/data/console-nav";
import { matchConsoleRoute } from "@/lib/console/section";
import { cn } from "@/lib/cn";
import type { ConsoleAgent, ConsoleRole } from "@/types/console";

const ROLES: ConsoleRole[] = ["support", "finance", "admin"];

type ConsoleTopBarProps = {
  agent: ConsoleAgent;
  className?: string;
};

export function ConsoleTopBar({ agent, className }: ConsoleTopBarProps) {
  const t = useTranslations("console");
  const pathname = usePathname();
  const router = useRouter();
  const { view, backHref } = matchConsoleRoute(pathname);
  const titleKey = CONSOLE_VIEW_TITLE_KEY[view];
  const [pending, startTransition] = useTransition();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-hair bg-paper/94 backdrop-blur-[14px]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 @[700px]:px-6 @[700px]:py-3">
        <div className="@[1000px]:hidden">
          <ConsoleBrand />
        </div>

        {backHref ? (
          <Link
            href={backHref}
            className="grid size-11 place-items-center rounded-full border border-hair bg-white text-ink hover:bg-paper-2"
            aria-label={t("nav.back")}
          >
            <Icon name="arrowLeft" size="md" />
          </Link>
        ) : null}

        <h1 className="hidden min-w-0 flex-1 truncate font-display text-base font-extrabold tracking-tight text-ink uppercase @[1000px]:block">
          {t(titleKey)}
        </h1>

        <div className="ml-auto flex items-center gap-1.5" role="group" aria-label={t("nav.actAs")}>
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              disabled={pending}
              aria-pressed={agent.role === role}
              className={cn(
                "min-h-9 rounded-pill border px-2.5 text-[0.72rem] font-bold transition-colors",
                agent.role === role
                  ? "border-deep bg-deep text-on-deep"
                  : "border-ink-20 bg-white text-ink-70 hover:bg-paper-2",
              )}
              onClick={() => {
                startTransition(async () => {
                  await switchConsoleRoleAction(role);
                  router.refresh();
                });
              }}
            >
              {t(`roles.short.${role}`)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
