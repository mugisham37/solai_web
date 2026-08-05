"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { switchPlanAction } from "@/app/actions/dashboard/plan";
import { StatusChip } from "@/components/atoms/StatusChip";
import { useToastContext } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/cn";
import type { ShopPlan } from "@/types/dashboard";

type PlanCardProps = {
  plan: ShopPlan;
  current: ShopPlan;
  name: string;
  price: string;
  features: string;
};

export function PlanCard({
  plan,
  current,
  name,
  price,
  features,
}: PlanCardProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();
  const active = current === plan;

  const onSelect = () => {
    if (active || pending) return;
    startTransition(async () => {
      const result = await switchPlanAction(plan);
      if (!result.ok) {
        toast(t("plans.switchFailed"));
        return;
      }
      toast(
        plan === "plus" ? t("plans.switchedPlus") : t("plans.switchedFree"),
      );
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={pending}
      aria-pressed={active}
      className={cn(
        "rounded-card border bg-white p-4 text-left transition-[border-color,background,filter] hover:brightness-[1.01]",
        active
          ? "border-sun bg-sun/10"
          : "border-hair hover:border-ink-20",
        pending && "opacity-70",
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
          {name}
        </span>
        <StatusChip
          tone={active ? "sun" : "line"}
          label={active ? t("plans.yourPlan") : t("plans.switch")}
        />
      </span>
      <span className="mt-1.5 block font-display text-d2 font-extrabold tracking-tight text-ink">
        {price}
      </span>
      <span className="mt-1 block text-[0.73rem] text-ink-45">{features}</span>
    </button>
  );
}
