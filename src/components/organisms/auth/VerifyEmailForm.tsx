"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { OtpCodeField } from "@/components/molecules/OtpCodeField";
import { ResendTimer } from "@/components/molecules/ResendTimer";
import { VerifyEmailPanel } from "@/components/organisms/auth/panels/VerifyEmailPanel";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as emailService from "@/lib/api/services/email";
import * as usersService from "@/lib/api/services/users";
import { getPostAuthPath, useSession } from "@/providers/session-provider";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const router = useRouter();
  const { updateUser } = useSession();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await emailService.verifyEmail({ code });
      const profile = await usersService.getProfile();
      updateUser(profile);
      router.push(getPostAuthPath(profile));
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await emailService.sendVerificationCode();
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    }
  };

  return (
    <AuthLayout panel={<VerifyEmailPanel email={email} />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Verify your email
      </h1>
      <p className="mt-1.5 text-[15px] text-text-muted">
        Enter the 6-digit code we sent to{" "}
        <strong className="text-text">{email}</strong>
      </p>

      <FormErrorBanner message={error} className="mt-4" />

      <form onSubmit={handleVerify}>
        <OtpCodeField value={code} onChange={setCode} disabled={loading} />
        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#4A6BEE] disabled:opacity-60"
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

      <ResendTimer seconds={60} onResend={handleResend} disabled={loading} />

      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-text-muted transition-colors hover:text-text"
      >
        <ArrowLeft className="size-3.5" /> Back to sign up
      </button>
    </AuthLayout>
  );
}
