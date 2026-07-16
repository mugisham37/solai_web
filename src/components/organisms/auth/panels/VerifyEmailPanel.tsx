import { Mail } from "lucide-react";

export function VerifyEmailPanel({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Mail className="size-12" strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm text-text-muted">We sent a 6-digit code to</p>
      <p className="mt-1 text-base font-semibold text-text">{email}</p>
    </div>
  );
}
