"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ErrorText } from "@/components/atoms/ErrorText";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { OtpInput } from "@/components/molecules/OtpInput";
import { ResendControl } from "@/components/molecules/ResendControl";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { formatE164ForDisplay } from "@/lib/phone/format";
import { OTP_MAX_ATTEMPTS } from "@/types/payout";

type PayoutT = (key: string, values?: Record<string, string | number>) => string;

type VerifyStateProps = {
  t: PayoutT;
  phoneE164: string;
  attempts: number;
  onWrongNumber: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  onVoice: () => void;
  resendSeconds: number;
  resendKey: number;
  error?: string;
  verifying?: boolean;
};

export function VerifyState({
  t,
  phoneE164,
  attempts,
  onWrongNumber,
  onVerify,
  onResend,
  onVoice,
  resendSeconds,
  resendKey,
  error,
  verifying,
}: VerifyStateProps) {
  const [otp, setOtp] = useState("");
  const [complete, setComplete] = useState(false);
  const bad = Boolean(error);
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const tmo = window.setTimeout(() => {
      groupRef.current?.querySelector("input")?.focus();
    }, 120);
    return () => window.clearTimeout(tmo);
  }, [reduceMotion]);

  const cellLabels = [
    t("verify.digit1"),
    t("verify.digit2"),
    t("verify.digit3"),
    t("verify.digit4"),
    t("verify.digit5"),
    t("verify.digit6"),
  ];

  return (
    <motion.div
      className="flex flex-1 flex-col px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
        <div>
          <Eyebrow>{t("verify.eyebrow")}</Eyebrow>
          <Heading level={1} size="display" className="text-d1 mt-2 normal-case">
            {t("verify.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">
            {t("verify.lede", { phone: formatE164ForDisplay(phoneE164) })}{" "}
            <button type="button" className="font-semibold underline" onClick={onWrongNumber}>
              {t("verify.wrongNumber")}
            </button>
          </Text>
        </div>

        <div ref={groupRef}>
          <OtpInput
            value={otp}
            error={bad}
            disabled={verifying}
            cellLabels={cellLabels}
            onChange={(v, isComplete) => {
              setOtp(v);
              setComplete(isComplete);
            }}
          />
        </div>
        <ErrorText message={error} className="justify-center" />
        <div className="rounded-xl bg-sea/10 p-3 text-sm text-sea-deep-text">{t("verify.voiceTip")}</div>

        <ResendControl
          key={resendKey}
          onResend={onResend}
          onVoice={onVoice}
          seconds={resendSeconds}
          resendLabel={t("verify.resend")}
          voiceLabel={t("verify.voice")}
          countdownTemplate={(s) => t("verify.countdown", { time: s })}
        />

        <ActionButton
          type="button"
          variant="sun"
          disabled={!complete || verifying}
          onClick={() => onVerify(otp)}
        >
          {t("verify.submit")}
          <Icon name="arrowRight" />
        </ActionButton>
        <p className="text-xs text-ink-45" aria-live="polite">
          {t("verify.attempts", { current: attempts, max: OTP_MAX_ATTEMPTS })}
        </p>
      </div>
    </motion.div>
  );
}
