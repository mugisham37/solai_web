"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Fingerprint, Loader2, Mail, Zap } from "lucide-react";
import { AuthDivider } from "@/components/atoms/AuthDivider";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SignInPanel } from "@/components/organisms/auth/panels/SignInPanel";
import { MagicLinkPending } from "@/components/organisms/auth/MagicLinkPending";
import { storePendingEmailAction } from "@/lib/actions/auth";
import { signIn } from "@/lib/auth-client";
import { getAuthErrorMessage, getLockoutSeconds } from "@/lib/auth/errors";
import { signInSchema } from "@/lib/validations/auth";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [magicSent, setMagicSent] = useState(false);
  const [passkeyState, setPasskeyState] = useState<
    "idle" | "waiting" | "unsupported"
  >("idle");

  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const id = window.setInterval(() => {
      setLockoutSeconds((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [lockoutSeconds]);

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

    if (lockoutSeconds && lockoutSeconds > 0) return;

    setLoading(true);
    try {
      const result = await signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        const lockout = getLockoutSeconds(result.error);
        if (lockout) setLockoutSeconds(lockout);
        const message = getAuthErrorMessage(
          result.error,
          "Email or password is incorrect.",
        );
        if (message.toLowerCase().includes("verify")) {
          await storePendingEmailAction(parsed.data.email);
          router.push("/verify-email");
          return;
        }
        setError(message);
        return;
      }

      if (
        result.data &&
        "twoFactorRedirect" in result.data &&
        result.data.twoFactorRedirect
      ) {
        router.push("/two-factor");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError("");
    if (!email) {
      setFieldErrors({ email: "Enter a valid email address" });
      return;
    }
    setLoading(true);
    try {
      const result = await signIn.magicLink({
        email,
        callbackURL: "/dashboard",
        errorCallbackURL: "/auth/link-expired?type=magic",
      });
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Could not send magic link"));
        return;
      }
      setMagicSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasskey = async () => {
    setError("");
    if (!window.PublicKeyCredential) {
      setPasskeyState("unsupported");
      return;
    }
    setPasskeyState("waiting");
    setLoading(true);
    try {
      const result = await signIn.passkey({
        fetchOptions: {
          onSuccess: () => router.push("/dashboard"),
        },
      });
      if (result.error) {
        setPasskeyState("idle");
        setError(getAuthErrorMessage(result.error, "Passkey sign-in failed"));
      }
    } catch {
      setPasskeyState("idle");
      setError("Passkey sign-in was cancelled or failed.");
    } finally {
      setLoading(false);
      setPasskeyState("idle");
    }
  };

  if (magicSent) {
    return (
      <AuthLayout panel={<SignInPanel />}>
        <MagicLinkPending email={email} onResend={handleMagicLink} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout panel={<SignInPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Welcome back
      </h1>
      <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
        Sign in to your SolAI dashboard.
      </p>

      <FormErrorBanner message={error} className="mb-4" />

      {lockoutSeconds && lockoutSeconds > 0 ? (
        <p className="mb-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          Too many attempts — try again in {lockoutSeconds}s
        </p>
      ) : null}

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
          disabled={loading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
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

      <AuthDivider text="or continue with" />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handlePasskey}
          disabled={loading || passkeyState === "waiting"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Fingerprint className="size-[18px]" /> Passkey
        </button>
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Zap className="size-[18px]" /> Magic link
        </button>
      </div>

      {passkeyState === "waiting" ? (
        <p className="mt-3 text-center text-sm text-text-muted">
          Waiting for your device…
        </p>
      ) : null}
      {passkeyState === "unsupported" ? (
        <p className="mt-3 text-center text-sm text-text-muted">
          Passkeys aren&apos;t available in this browser. Try email or magic link
          instead.
        </p>
      ) : null}

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}
