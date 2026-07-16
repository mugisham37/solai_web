"use client";

import { Mail } from "lucide-react";
import { ResendTimer } from "@/components/molecules/ResendTimer";

interface MagicLinkPendingProps {
  email: string;
  onResend: () => void | Promise<void>;
  title?: string;
  subtitle?: string;
}

export function MagicLinkPending({
  email,
  onResend,
  title = "Check your inbox",
  subtitle,
}: MagicLinkPendingProps) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Mail className="size-8" />
      </div>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        {title}
      </h1>
      <p className="mt-2 text-[15px] text-text-muted">
        {subtitle ?? (
          <>
            We sent a sign-in link to <strong className="text-text">{email}</strong>.
            It expires in 5 minutes.
          </>
        )}
      </p>
      <ResendTimer
        seconds={60}
        onResend={onResend}
        resendLabel="Resend link"
        className="mt-6"
      />
    </div>
  );
}
