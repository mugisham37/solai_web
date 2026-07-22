"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SignInPanel } from "@/components/organisms/auth/panels/SignInPanel";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as authService from "@/lib/api/services/auth";
import { isMfaRequired, storeChallenge } from "@/lib/api/types";
import { signInSchema } from "@/lib/validations/auth";
import {
  getPostAuthPath,
  useSession,
} from "@/providers/session-provider";

export function SignInForm() {
  const router = useRouter();
  const { setSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = signInSchema.safeParse({ email, password });
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
      const response = await authService.login(parsed.data);
      if (isMfaRequired(response)) {
        storeChallenge({
          challengeToken: response.challenge_token,
          methods: response.methods,
        });
        router.push("/two-factor");
        return;
      }

      setSession(response);
      router.push(getPostAuthPath(response.user));
    } catch (err) {
      const apiError = parseApiError(err);
      setError(formatRetryMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={<SignInPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Welcome back
      </h1>
      <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
        Sign in to your SolAI dashboard.
      </p>

      <FormErrorBanner message={error} className="mb-4" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          label="Email address"
          value={email}
          onChange={setEmail}
          placeholder="kalisa@inema.rw"
          autoComplete="email"
          icon={<Mail className="size-4" />}
          error={fieldErrors.email}
        />
        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter password"
          labelAction={
            <Link href="/forgot-password" className="text-xs font-normal text-brand">
              Forgot?
            </Link>
          }
          error={fieldErrors.password}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#4A6BEE] disabled:opacity-60"
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

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}
