"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Fingerprint,
  Loader2,
  Mail,
  User,
  Zap,
} from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { AuthMethodTabs, type AuthMethod } from "@/components/molecules/AuthMethodTabs";
import { ConsentCheckbox } from "@/components/molecules/ConsentCheckbox";
import { ConsentRegion } from "@/components/molecules/ConsentRegion";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SignUpPanel } from "@/components/organisms/auth/panels/SignUpPanel";
import { storePendingEmailAction } from "@/lib/actions/auth";
import { createPasskeySignupContextAction } from "@/lib/actions/passkey";
import { signUp, signIn, passkey } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { signUpEmailSchema } from "@/lib/validations/auth";
import { MagicLinkPending } from "@/components/organisms/auth/MagicLinkPending";

export function SignUpForm() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [magicSent, setMagicSent] = useState(false);
  const [passkeyState, setPasskeyState] = useState<
    "idle" | "waiting" | "success" | "unsupported"
  >("idle");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = signUpEmailSchema.safeParse({
      name,
      email,
      password,
      termsAccepted,
      marketingOptIn,
    });

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
      const result = await signUp.email({
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Could not create account"));
        return;
      }

      await storePendingEmailAction(parsed.data.email);
      router.push("/verify-email");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setFieldErrors({ email: "Enter a valid email address" });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.magicLink({
        email,
        name: name || undefined,
        callbackURL: "/2fa-setup",
        newUserCallbackURL: "/2fa-setup",
        errorCallbackURL: "/auth/link-expired?type=magic",
      });

      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Could not send magic link"));
        return;
      }

      setMagicSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!window.PublicKeyCredential) {
      setPasskeyState("unsupported");
      return;
    }

    if (!email || !name) {
      setFieldErrors({
        email: !email ? "Enter a valid email address" : "",
        name: !name ? "Enter your full name" : "",
      });
      return;
    }

    setPasskeyState("waiting");
    setLoading(true);
    try {
      const context = await createPasskeySignupContextAction({ email, name });
      const result = await passkey.addPasskey({
        name: `${name} passkey`,
        context,
      });

      if (result.error) {
        setPasskeyState("idle");
        setError(getAuthErrorMessage(result.error, "Could not create passkey"));
        return;
      }

      setPasskeyState("success");
      await storePendingEmailAction(email);
      router.push("/verify-email");
    } catch {
      setPasskeyState("idle");
      setError("Passkey registration was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <AuthLayout panel={<SignUpPanel />}>
        <MagicLinkPending
          email={email}
          onResend={async () => {
            await signIn.magicLink({
              email,
              name: name || undefined,
              callbackURL: "/2fa-setup",
              newUserCallbackURL: "/2fa-setup",
              errorCallbackURL: "/auth/link-expired?type=magic",
            });
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout panel={<SignUpPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Create your account
      </h1>
      <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
        Start free. No credit card required.
      </p>

      <AuthMethodTabs value={method} onChange={setMethod} />

      <FormErrorBanner message={error} className="mb-4" />

      {method === "email" && (
        <form className="flex flex-col gap-4" onSubmit={handleEmailSignup}>
          <AuthField
            id="signup-name"
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Kalisa Mugisha"
            autoComplete="name"
            icon={<User className="size-4" />}
            error={fieldErrors.name}
          />
          <AuthField
            id="signup-email"
            label="Email address"
            value={email}
            onChange={setEmail}
            placeholder="kalisa@inema.rw"
            autoComplete="email"
            icon={<Mail className="size-4" />}
            error={fieldErrors.email}
          />
          <PasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={setPassword}
            showStrength
            error={fieldErrors.password}
          />
          <div className="flex flex-col gap-2">
            <ConsentCheckbox
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
              required
            >
              <>
                I agree to the <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
              </>
            </ConsentCheckbox>
            <ConsentCheckbox
              checked={marketingOptIn}
              onCheckedChange={setMarketingOptIn}
            >
              Send me product updates and tips.
            </ConsentCheckbox>
            {fieldErrors.termsAccepted ? (
              <p className="text-xs text-danger">{fieldErrors.termsAccepted}</p>
            ) : null}
          </div>
          <ConsentRegion />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#4A6BEE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Create account <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      )}

      {method === "passkey" && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-full bg-brand-soft text-brand">
            <Fingerprint className="size-10" />
          </div>
          <h3 className="text-lg font-semibold text-text">Use a passkey</h3>
          <p className="mt-2 text-sm text-text-muted">
            Sign up with Face ID, Touch ID, or your security key. No password
            needed.
          </p>
          <form className="mt-6 flex flex-col gap-4 text-left" onSubmit={handlePasskeySignup}>
            <AuthField
              id="passkey-name"
              label="Full name"
              value={name}
              onChange={setName}
              placeholder="Kalisa Mugisha"
              autoComplete="name"
              icon={<User className="size-4" />}
              error={fieldErrors.name}
            />
            <AuthField
              id="passkey-email"
              label="Email address"
              value={email}
              onChange={setEmail}
              placeholder="kalisa@inema.rw"
              autoComplete="email"
              icon={<Mail className="size-4" />}
              error={fieldErrors.email}
            />
            {passkeyState === "waiting" ? (
              <p className="text-sm text-text-muted">
                Waiting for your device…{" "}
                <button
                  type="button"
                  className="text-brand"
                  onClick={() => {
                    setPasskeyState("idle");
                    setLoading(false);
                  }}
                >
                  Cancel
                </button>
              </p>
            ) : null}
            {passkeyState === "unsupported" ? (
              <p className="text-sm text-text-muted">
                Passkeys aren&apos;t available in this browser. Try email or magic
                link instead.
              </p>
            ) : null}
            {passkeyState === "success" ? (
              <p className="text-sm text-success">Passkey created successfully.</p>
            ) : null}
            <button
              type="submit"
              disabled={loading || passkeyState === "waiting"}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-[#4A6BEE] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Fingerprint className="size-4" /> Create passkey
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {method === "magic" && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-[72px] items-center justify-center rounded-full bg-brand-soft text-brand">
            <Zap className="size-10" />
          </div>
          <h3 className="text-lg font-semibold text-text">Magic link</h3>
          <p className="mt-2 text-sm text-text-muted">
            We&apos;ll email you a one-time link. No password to remember.
          </p>
          <form className="mt-6 flex flex-col gap-4 text-left" onSubmit={handleMagicLink}>
            <AuthField
              id="magic-email"
              label="Email address"
              value={email}
              onChange={setEmail}
              placeholder="kalisa@inema.rw"
              autoComplete="email"
              icon={<Mail className="size-4" />}
              error={fieldErrors.email}
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
                  <Mail className="size-4" /> Send magic link
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
