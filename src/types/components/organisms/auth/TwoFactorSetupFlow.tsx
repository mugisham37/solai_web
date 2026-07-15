"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  ArrowRight,
  Copy,
  Download,
  Loader2,
  Mail,
  Shield,
  Smartphone,
} from "lucide-react";
import { CodeSecret } from "@/components/atoms/CodeSecret";
import { AuthLayout } from "@/components/organisms/AuthLayout";
import { AuthField } from "@/components/molecules/AuthField";
import { ConsentCheckbox } from "@/components/molecules/ConsentCheckbox";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { OtpCodeField } from "@/components/molecules/OtpCodeField";
import { ResendTimer } from "@/components/molecules/ResendTimer";
import { TwoFactorMethodOption } from "@/components/molecules/TwoFactorMethodOption";
import { TwoFactorSetupPanel } from "@/components/organisms/auth/panels/TwoFactorSetupPanel";
import { authClient, twoFactor } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth/errors";

type Method = "app" | "sms";
type Step = "choose" | "verify-sms" | "codes" | "done";

export function TwoFactorSetupFlow() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("app");
  const [step, setStep] = useState<Step>("choose");
  const [phone, setPhone] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [manualSecret, setManualSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totpPrepared, setTotpPrepared] = useState(false);

  const prepareTotp = useCallback(async () => {
    if (totpPrepared) return;
    const result = await twoFactor.enable({ issuer: "SolAI" });
    if (result.error) {
      setError(getAuthErrorMessage(result.error, "Could not start 2FA setup"));
      return;
    }
    if (result.data?.totpURI) setTotpUri(result.data.totpURI);
    if (result.data?.backupCodes) setBackupCodes(result.data.backupCodes);
    const secretMatch = result.data?.totpURI?.match(/secret=([^&]+)/);
    if (secretMatch?.[1]) setManualSecret(secretMatch[1]);
    setTotpPrepared(true);
  }, [totpPrepared]);

  const selectAppMethod = () => {
    setMethod("app");
    void prepareTotp();
  };

  const didInitApp = useRef(false);
  useEffect(() => {
    if (didInitApp.current) return;
    didInitApp.current = true;
    void prepareTotp();
  }, [prepareTotp]);

  const handleEnableApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (totpCode.length !== 6) {
      setError("Enter the 6-digit code from your app");
      return;
    }
    setLoading(true);
    try {
      const result = await twoFactor.verifyTotp({ code: totpCode });
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Code is invalid or expired"));
        return;
      }
      setStep("codes");
    } finally {
      setLoading(false);
    }
  };

  const handleEnableSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authClient.updateUser({
        phoneNumber: `+250${phone.replace(/\s/g, "")}`,
      } as { name?: string; image?: string });
      await twoFactor.sendOtp();
      setStep("verify-sms");
    } catch {
      setError("Could not send SMS code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const enableResult = await twoFactor.enable({ issuer: "SolAI" });
      if (enableResult.data?.backupCodes) {
        setBackupCodes(enableResult.data.backupCodes);
      }
      const result = await twoFactor.verifyOtp({ code: smsCode });
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "Code is invalid or expired"));
        return;
      }
      setStep("codes");
    } finally {
      setLoading(false);
    }
  };

  const copyCodes = async () => {
    await navigator.clipboard.writeText(backupCodes.join("\n"));
  };

  const downloadCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solai-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AuthLayout panel={<TwoFactorSetupPanel />}>
      {step === "choose" && (
        <>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Set up 2FA
          </h1>
          <p className="mt-1.5 mb-6 text-[15px] text-text-muted">
            Choose how you&apos;d like to receive your second factor.
          </p>
          <FormErrorBanner message={error} className="mb-4" />
          <div className="flex flex-col gap-3">
            <TwoFactorMethodOption
              selected={method === "app"}
              onSelect={selectAppMethod}
              icon={<Smartphone className="size-6" />}
              title="Authenticator app"
              description="Google Authenticator, Authy, 1Password, etc."
            />
            <TwoFactorMethodOption
              selected={method === "sms"}
              onSelect={() => setMethod("sms")}
              icon={<Mail className="size-6" />}
              title="SMS"
              description="We'll text a code to your phone number."
            />
          </div>

          {method === "app" ? (
            <form className="mt-4" onSubmit={handleEnableApp}>
              {totpUri ? (
                <div className="flex flex-col items-center">
                  <div className="rounded-md border border-border p-3">
                    <QRCode value={totpUri} size={160} />
                  </div>
                  {manualSecret ? (
                    <div className="mt-4 text-center">
                      <span className="text-xs text-text-muted">
                        Can&apos;t scan? Enter manually:
                      </span>
                      <div className="mt-2">
                        <CodeSecret secret={manualSecret} />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-4">
                <label className="mb-1 block text-[13px] font-medium">
                  Enter 6-digit code from app
                </label>
                <OtpCodeField value={totpCode} onChange={setTotpCode} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Enable 2FA <Shield className="size-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="mt-4" onSubmit={handleEnableSms}>
              <AuthField
                id="sms-phone"
                label="Phone number"
                value={phone}
                onChange={setPhone}
                placeholder="788 000 000"
                type="tel"
                prefix={
                  <span className="pr-1 text-[13px] text-text-subtle">+250</span>
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Send verification code <Shield className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mt-4 w-full text-center text-sm text-text-muted hover:text-text"
          >
            Skip for now, set up later
          </button>
        </>
      )}

      {step === "verify-sms" && (
        <form onSubmit={handleVerifySms}>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Verify your phone
          </h1>
          <p className="mt-1.5 mb-4 text-[15px] text-text-muted">
            Enter the code we texted to <strong>+250{phone}</strong>
          </p>
          <FormErrorBanner message={error} className="mb-4" />
          <OtpCodeField value={smsCode} onChange={setSmsCode} />
          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify & enable 2FA"}
          </button>
          <ResendTimer
            seconds={60}
            onResend={async () => {
              await twoFactor.sendOtp();
            }}
          />
        </form>
      )}

      {step === "codes" && (
        <>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Recovery codes
          </h1>
          <p className="mt-1.5 mb-4 text-[15px] text-text-muted">
            Save these codes somewhere safe. Each can be used once if you lose
            access to your 2FA device.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, i) => (
              <div
                key={code}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-sm"
              >
                <span className="w-4 text-[11px] text-text-subtle">{i + 1}</span>
                <code>{code}</code>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyCodes}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm hover:bg-surface-2"
            >
              <Copy className="size-3.5" /> Copy all
            </button>
            <button
              type="button"
              onClick={downloadCodes}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm hover:bg-surface-2"
            >
              <Download className="size-3.5" /> Download .txt
            </button>
          </div>
          <ConsentCheckbox checked={saved} onCheckedChange={setSaved} className="mt-4">
            I&apos;ve saved these recovery codes in a safe place.
          </ConsentCheckbox>
          <button
            type="button"
            disabled={!saved}
            onClick={() => setStep("done")}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE] disabled:pointer-events-none disabled:opacity-40"
          >
            Continue <ArrowRight className="size-4" />
          </button>
        </>
      )}

      {step === "done" && (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/12 text-success">
            <Shield className="size-8" />
          </div>
          <h1 className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            Account secured
          </h1>
          <p className="mt-2 text-[15px] text-text-muted">
            Two-factor authentication is active. You&apos;ll be asked for a code on
            each new sign-in.
          </p>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-[#4A6BEE]"
          >
            Go to onboarding <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
