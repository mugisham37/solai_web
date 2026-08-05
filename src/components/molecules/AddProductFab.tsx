"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type AddProductFabProps = {
  className?: string;
};

/** Phone/tablet only — desktop uses the Products header button. */
export function AddProductFab({ className }: AddProductFabProps) {
  const t = useTranslations("dashboard");

  return (
    <Link
      href="/start"
      aria-label={t("products.add")}
      className={cn(
        "fixed right-4 bottom-[76px] z-30 grid size-[52px] place-items-center rounded-[18px] bg-sun text-sun-ink shadow-sun @[1000px]:hidden",
        className,
      )}
    >
      <Icon name="plus" className="size-6 stroke-[2.2]" />
    </Link>
  );
}
