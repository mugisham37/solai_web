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
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as twoFactorService from "@/lib/api/services/twoFactor";
import { clearChallenge, loadChallenge } from "@/lib/api/types";
import {
  getPostAuthPath,
  useSession,
} from "@/providers/session-provider";

export function TwoFactorChallengeForm() {
  const router = useRouter();
  const { setSession } = useSession();
  const challenge = loadChallenge();
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"totp" | "recovery">("totp");
  const [useSms, setUseSms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!challenge) {
      router.replace("/login");
    }
  }, [challenge, router]);

  if (!challenge) return null;

  const hasSms = challenge.methods.includes("sms");
  const hasTotp = challenge.methods.includes("totp");

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const endpoint = useSms
        ? twoFactorService.challengeSmsVerify
        : twoFactorService.challengeTotp;
      const session = await endpoint({
        challenge_token: challenge.challengeToken,
        code,
      });
      clearChallenge();
      setSession(session);
      router.push(getPostAuthPath(session.user));
    } catch (err) {
      const apiError = parseApiError(err);
      if (
        apiError.code === "auth.challenge_expired" ||
        apiError.code === "auth.challenge_attempts_exceeded"
      ) {
        clearChallenge();
        router.replace("/login");
      }
      setError(formatRetryMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleSendSms = async () => {
    if (!hasSms) return;
    setUseSms(true);
    setError("");
    setLoading(true);
    try {
      await twoFactorService.challengeSmsSend({
        challenge_token: challenge.challengeToken,
      });
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    } finally {
      setLoading(false);
    }
  };

  if (mode === "recovery") {
    return (
      <AuthLayout panel={<TwoFactorSetupPanel />}>
        <RecoveryCodeForm
          challengeToken={challenge.challengeToken}
          onBack={() => setMode("totp")}
        />
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

      {!useSms && hasSms ? (
        <button
          type="button"
          onClick={handleSendSms}
          disabled={loading}
          className="mt-4 w-full text-center text-sm text-brand hover:underline"
        >
          Text me a code instead
        </button>
      ) : null}

      {useSms ? (
        <ResendTimer
          seconds={60}
          onResend={handleSendSms}
          disabled={loading}
        />
      ) : null}

      {!useSms && hasTotp ? (
        <button
          type="button"
          onClick={() => setMode("recovery")}
          className="mt-4 w-full text-center text-sm text-text-muted hover:text-text"
        >
          Use a recovery code instead
        </button>
      ) : null}

      <Link
        href="/login"
        className="mt-6 block text-center text-sm text-text-muted hover:text-text"
      >
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
