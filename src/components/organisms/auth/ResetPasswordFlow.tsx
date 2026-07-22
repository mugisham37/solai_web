"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { ResendTimer } from "@/components/molecules/ResendTimer";
import { ResetPasswordPanel } from "@/components/organisms/auth/panels/ResetPasswordPanel";
import { ExpiredLinkScreen } from "@/components/organisms/auth/ExpiredLinkScreen";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as authService from "@/lib/api/services/auth";
import { emailOnlySchema, resetPasswordSchema } from "@/lib/validations/auth";

type Step = "request" | "sent";

export function ResetPasswordRequestFlow() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = emailOnlySchema.safeParse({ email });
    if (!parsed.success) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email: parsed.data.email });
      setStep("sent");
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authService.forgotPassword({ email });
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    }
  };

  return (
    <AuthLayout panel={<ResetPasswordPanel />}>
      {step === "request" ? (
        <>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Reset password
          </h1>
          <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
            Enter the email on your account and we&apos;ll send a reset link if
            it exists.
          </p>
          <FormErrorBanner message={error} className="mb-4" />
          <form className="flex flex-col gap-4" onSubmit={handleRequest}>
            <AuthField
              id="reset-email"
              label="Email address"
              value={email}
              onChange={setEmail}
              placeholder="kalisa@inema.rw"
              autoComplete="email"
              icon={<Mail className="size-4" />}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Mail className="size-8" />
          </div>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Check your inbox
          </h1>
          <p className="mt-2 text-[15px] text-text-muted">
            If an account exists for{" "}
            <strong className="text-text">{email}</strong>, we sent a reset
            link. It expires in 1 hour.
          </p>
          <ResendTimer
            seconds={60}
            onResend={handleResend}
            resendLabel="Resend link"
            className="mt-4"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => (window.location.href = "/login")}
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text"
      >
        <ArrowLeft className="size-3.5" /> Back to sign in
      </button>
    </AuthLayout>
  );
}

export function ResetPasswordSetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!token) {
    return <ExpiredLinkScreen type="reset" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: parsed.data.password,
      });
      router.push("/login");
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={<ResetPasswordPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Set new password
      </h1>
      <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
        Choose a strong password for your account.
      </p>
      <FormErrorBanner message={error} className="mb-4" />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
          showStrength
          error={fieldErrors.password}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Repeat password"
          error={fieldErrors.confirmPassword}
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
              Set password & sign in <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text"
      >
        <ArrowLeft className="size-3.5" /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
