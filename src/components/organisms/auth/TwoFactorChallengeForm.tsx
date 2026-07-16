"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { OtpCodeField } from "@/components/molecules/OtpCodeField";
import { ResendTimer } from "@/components/molecules/ResendTimer";
import { TwoFactorSetupPanel } from "@/components/organisms/auth/panels/TwoFactorSetupPanel";
import { RecoveryCodeForm } from "@/components/organisms/auth/RecoveryCodeForm";
import { useDemoSession } from "@/hooks/use-demo-session";
import { simulateAuthDelay } from "@/lib/demo-auth";

export function TwoFactorChallengeForm() {
  const router = useRouter();
  const { signIn } = useDemoSession();
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"totp" | "recovery">("totp");
  const [useSms, setUseSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    await simulateAuthDelay();
    setLoading(false);
    signIn({ email: "you@solai.app", onboardingComplete: true });
    router.push("/dashboard");
  };

  const handleSendSms = async () => {
    setUseSms(true);
    setError("");
    await simulateAuthDelay();
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

      <form onSubmit={handleVerifyTotp}>
        <OtpCodeField value={code} onChange={setCode} disabled={loading} />
        <button
          type="submit"
          disabled={loading}
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
            await simulateAuthDelay();
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
