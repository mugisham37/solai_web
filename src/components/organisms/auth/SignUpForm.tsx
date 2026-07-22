"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, Mail, User } from "lucide-react";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { ConsentCheckbox } from "@/components/molecules/ConsentCheckbox";
import { ConsentRegion } from "@/components/molecules/ConsentRegion";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SignUpPanel } from "@/components/organisms/auth/panels/SignUpPanel";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as authService from "@/lib/api/services/auth";
import { signUpEmailSchema } from "@/lib/validations/auth";
import {
  getPostAuthPath,
  useSession,
} from "@/providers/session-provider";

export function SignUpForm() {
  const router = useRouter();
  const { setSession } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      const session = await authService.register({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        terms_accepted: parsed.data.termsAccepted,
        marketing_opt_in: parsed.data.marketingOptIn ?? false,
      });
      setSession(session);
      router.push(getPostAuthPath(session.user));
    } catch (err) {
      setError(formatRetryMessage(parseApiError(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout panel={<SignUpPanel />}>
      <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Create your account
      </h1>
      <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
        Start free. No credit card required.
      </p>

      <FormErrorBanner message={error} className="mb-4" />

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

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
