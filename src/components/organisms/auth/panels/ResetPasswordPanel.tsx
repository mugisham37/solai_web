import { KeyRound } from "lucide-react";

export function ResetPasswordPanel() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <KeyRound className="size-12 text-brand" strokeWidth={1.5} />
      <p className="mt-4 max-w-[280px] text-[15px] leading-relaxed text-text-muted">
        We&apos;ll send you a secure link to reset your password. No security
        questions, no hassle.
      </p>
    </div>
  );
}
