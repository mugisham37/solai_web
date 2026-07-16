"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface OtpCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function OtpCodeField({
  value,
  onChange,
  disabled,
  error,
  className,
}: OtpCodeFieldProps) {
  return (
    <div className={cn("mt-6", className)}>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="one-time-code"
        containerClassName="justify-center gap-2"
      >
        <InputOTPGroup className="gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              aria-label={`Digit ${i + 1}`}
              className="size-14 rounded-md border-[1.5px] border-border bg-bg font-mono text-2xl font-semibold first:rounded-md last:rounded-md data-[active=true]:border-brand data-[active=true]:ring-[3px] data-[active=true]:ring-brand-soft"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error ? (
        <p className="mt-2 text-center text-xs text-danger">{error}</p>
      ) : null}
    </div>
  );
}
