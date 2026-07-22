"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "@/components/molecules/AuthField";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as twoFactorService from "@/lib/api/services/twoFactor";
import { clearChallenge } from "@/lib/api/types";
import {
  getPostAuthPath,
  useSession,
} from "@/providers/session-provider";

interface RecoveryCodeFormProps {
  challengeToken: string;
  onBack?: () => void;
}

export function RecoveryCodeForm({
  challengeToken,
  onBack,
}: RecoveryCodeFormProps) {
  const router = useRouter();
  const { setSession } = useSession();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [used, setUsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await twoFactorService.challengeRecovery({
        challenge_token: challengeToken,
        code,
      });
      clearChallenge();
      setUsed(true);
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

  return (
    <div>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Recovery code
      </h1>
      <p className="mt-1.5 mb-4 text-[15px] text-text-muted">
        Enter one of your backup codes.{" "}
        <strong className="text-text">
          This code will be permanently consumed on use.
        </strong>
      </p>

      <FormErrorBanner message={error} className="mb-4" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          id="recovery-code"
          label="Recovery code"
          value={code}
          onChange={setCode}
          placeholder="HXKW-9F3P"
          autoComplete="one-time-code"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Sign in <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {used ? (
        <p className="mt-4 text-sm text-text-muted">
          Consider regenerating recovery codes in{" "}
          <Link href="/settings/profile" className="text-brand">
            security settings
          </Link>
          .
        </p>
      ) : null}

      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text"
        >
          <ArrowLeft className="size-3.5" /> Back to code entry
        </button>
      ) : null}
    </div>
  );
}
