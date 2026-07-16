import Link from "next/link";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { ResetPasswordPanel } from "@/components/organisms/auth/panels/ResetPasswordPanel";

interface ExpiredLinkScreenProps {
  type?: "magic" | "reset";
}

export function ExpiredLinkScreen({ type = "magic" }: ExpiredLinkScreenProps) {
  const isReset = type === "reset";

  return (
    <AuthLayout panel={<ResetPasswordPanel />}>
      <div className="text-center">
        <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
          Link expired
        </h1>
        <p className="mt-2 text-[15px] text-text-muted">
          {isReset
            ? "This password reset link has already been used or has expired."
            : "This sign-in link has already been used or has expired."}
        </p>
        <Link
          href={isReset ? "/forgot-password" : "/login"}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE]"
        >
          {isReset ? "Request a new reset link" : "Request a new sign-in link"}
        </Link>
      </div>
    </AuthLayout>
  );
}
