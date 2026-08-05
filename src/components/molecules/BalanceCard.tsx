"use client";

import { Link } from "@/i18n/navigation";
import { MoneyCount } from "@/components/atoms/MoneyCount";
import { cn } from "@/lib/cn";
import type { Money } from "@/types/money";

type BalanceCardProps = {
  label: string;
  value: Money;
  locale: string;
  hint?: string;
  href?: string;
  tone?: "deep" | "berry" | "sea";
  className?: string;
};

const labelTone = {
  deep: "text-on-deep-30",
  berry: "text-berry-muted",
  sea: "text-sea-muted",
} as const;

const valueTone = {
  deep: "text-on-deep",
  berry: "text-berry-muted",
  sea: "text-sea-muted",
} as const;

const hintTone = {
  deep: "text-on-deep-60",
  berry: "text-berry-muted",
  sea: "text-sea-muted",
} as const;

/**
 * Balance surface. Links to Money when href is set — KPIs must not use this pattern.
 */
export function BalanceCard({
  label,
  value,
  hint,
  locale,
  href,
  tone = "deep",
  className,
}: BalanceCardProps) {
  const body = (
    <>
      <p className={cn("text-[0.73rem]", labelTone[tone])}>{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-[1.8rem] font-extrabold tracking-tight",
          valueTone[tone],
        )}
      >
        <MoneyCount
          value={value}
          locale={locale}
          className={valueTone[tone]}
        />
      </p>
      {hint ? (
        <p className={cn("mt-1 text-sm", hintTone[tone])}>{hint}</p>
      ) : null}
    </>
  );

  const classes = cn(
    "block rounded-card p-4 text-left transition-[filter] hover:brightness-[1.02]",
    tone === "deep" && "bg-deep text-on-deep",
    tone === "berry" && "border border-berry/30 bg-berry/10",
    tone === "sea" && "border border-sea/25 bg-sea/10",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}
