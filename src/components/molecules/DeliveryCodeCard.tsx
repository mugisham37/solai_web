"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { copyText } from "@/lib/clipboard";
import { useToastContext } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/cn";

type DeliveryCodeCardProps = {
  code: string;
  eyebrow: string;
  body: React.ReactNode;
  copyLabel: string;
  copiedToast: string;
  whatLabel: string;
  onWhat: () => void;
  compact?: boolean;
  className?: string;
};

export function DeliveryCodeCard({
  code,
  eyebrow,
  body,
  copyLabel,
  copiedToast,
  whatLabel,
  onWhat,
  compact,
  className,
}: DeliveryCodeCardProps) {
  const { toast } = useToastContext();

  return (
    <div
      className={cn(
        "rounded-card border border-sun/45 bg-gradient-to-b from-sun/10 to-transparent p-4 text-center",
        compact && "from-transparent",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className="font-display my-2 text-[3rem] font-extrabold tracking-[0.2em] uppercase">
        {code}
      </p>
      {!compact ? (
        <div className="mb-3 flex justify-center gap-2">
          <ActionButton
            type="button"
            variant="line"
            size="sm"
            onClick={async () => {
              const outcome = await copyText(code);
              toast(outcome === "copied" ? copiedToast : copiedToast);
            }}
          >
            <Icon name="copy" size="sm" className="size-3.5" />
            {copyLabel}
          </ActionButton>
          <ActionButton type="button" variant="line" size="sm" onClick={onWhat}>
            <Icon name="info" size="sm" className="size-3.5" />
            {whatLabel}
          </ActionButton>
        </div>
      ) : null}
      <div className="mx-auto max-w-[38ch] text-[0.96rem] leading-relaxed text-ink-70">
        {body}
      </div>
    </div>
  );
}
