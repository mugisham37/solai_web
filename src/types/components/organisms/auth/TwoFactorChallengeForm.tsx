"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { OtpCodeField } from "@/components/molecules/OtpCodeField";
import { ResendTimer } from "@/components/molecules/ResendTimer";
import { TwoFactorSetupPanel } from "@/components/organisms/auth/panels/TwoFactorSetupPanel";
import { RecoveryCodeForm } from "@/components/organisms/auth/RecoveryCodeForm";
import { twoFactor } from "@/lib/auth-client";
import { getAuthErrorMessage, getLockoutSeconds } from "@/lib/auth/errors";

export function TwoFactorChallengeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"totp" | "recovery">("totp");
  const [useSms, setUseSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const id = window.setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [lockoutSeconds]);

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (lockoutSeconds && lockoutSeconds > 0) return;

    setLoading(true);
    try {
      const result = useSms
        ? await twoFactor.verifyOtp({ code })
        : await twoFactor.verifyTotp({ code });

      if (result.error) {
        const lockout = getLockoutSeconds(result.error);
        if (lockout) setLockoutSeconds(lockout);
        setError(getAuthErrorMessage(result.error, "Code is invalid or expired"));
        return;
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSendSms = async () => {
    setUseSms(true);
    setError("");
    await twoFactor.sendOtp();
  };

  if (mode === "recovery") {
    return (
      <AuthLayout panel={<TwoFactorSetupPanel />}>
        <RecoveryCodeForm onBack={() => setMode("totp")} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout panel={<TwoFactorSetupPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Two-factor authentication
      </h1>
      <p className="mt-1.5 mb-4 text-[15px] text-text-muted">
        {useSms
          ? "Enter the code we sent to your phone."
          : "Enter the 6-digit code from your authenticator app."}
      </p>

      <FormErrorBanner message={error} className="mb-4" />

      {lockoutSeconds && lockoutSeconds > 0 ? (
        <p className="mb-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          Too many attempts — try again in {lockoutSeconds}s
        </p>
      ) : null}

      <form onSubmit={handleVerifyTotp}>
        <OtpCodeField value={code} onChange={setCode} disabled={loading} />
        <button
          type="submit"
          disabled={loading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Verify <Check className="size-4" />
            </>
          )}
        </button>
      </form>

      {!useSms ? (
        <button
          type="button"
          onClick={handleSendSms}
          className="mt-4 w-full text-center text-sm text-brand hover:underline"
        >
          Text me a code instead
        </button>
      ) : (
        <ResendTimer
          seconds={60}
          onResend={async () => {
            await twoFactor.sendOtp();
          }}
        />
      )}

      <button
        type="button"
        onClick={() => setMode("recovery")}
        className="mt-4 w-full text-center text-sm text-text-muted hover:text-text"
      >
        Use a recovery code instead
      </button>

      <Link
        href="/login"
        className="mt-6 block text-center text-sm text-text-muted hover:text-text"
      >
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
