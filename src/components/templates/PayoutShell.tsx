"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  checkSellerPhone,
  createSellerAccount,
  payoutNameEnquiry,
  requestPayoutOtp,
  verifyPayoutOtp,
} from "@/app/actions/payout";
import { PanelErrorBoundary } from "@/components/build/PanelErrorBoundary";
import { AlreadyRegisteredState } from "@/components/organisms/AlreadyRegisteredState";
import { HolderConfirmState } from "@/components/organisms/HolderConfirmState";
import { PayoutDoneState } from "@/components/organisms/PayoutDoneState";
import { PayoutErrorState } from "@/components/organisms/PayoutErrorState";
import { PayoutForm } from "@/components/organisms/PayoutForm";
import { PayoutLockedState } from "@/components/organisms/PayoutLockedState";
import { PayoutTopBar } from "@/components/organisms/PayoutTopBar";
import { PayoutWorkingState } from "@/components/organisms/PayoutWorkingState";
import { PrivacySheet } from "@/components/organisms/PrivacySheet";
import { UnsupportedNetworkState } from "@/components/organisms/UnsupportedNetworkState";
import { VerifyState } from "@/components/organisms/VerifyState";
import { BUILD_STEPS } from "@/data/build";
import { getCountryByCode } from "@/data/countries";
import { getDraftMemory } from "@/lib/draft-store";
import { nameEnquiryFromSnapshot, requiresHolderConfirm } from "@/lib/payout/form-utils";
import { PAYOUT_PROGRESS } from "@/lib/payout-reducer";
import { usePayoutState } from "@/hooks/usePayoutState";
import type { Draft } from "@/types/build";
import type {
  CheckPhoneResult,
  ExistingShopSummary,
  HolderInfo,
  PayoutFormSnapshot,
  PayoutRail,
  StoredPayoutDestination,
} from "@/types/payout";
import { OTP_MAX_ATTEMPTS, PAYOUT_TERMS_VERSION } from "@/types/payout";
import { maskPhoneE164 } from "@/lib/phone/format";

type PayoutShellProps = {
  draftId: string;
};

function railFromSnapshot(snapshot: PayoutFormSnapshot): PayoutRail {
  if (snapshot.destinationKind === "bank") return "bank";
  if (snapshot.destinationKind === "airtel") return "airtel-money";
  if (snapshot.detectedNetworkId === "mpesa") return "mpesa";
  if (snapshot.detectedNetworkId === "airtel") return "airtel-money";
  return "mtn-momo";
}

function destinationForAccount(snapshot: PayoutFormSnapshot, holderName: string): StoredPayoutDestination {
  const rail = railFromSnapshot(snapshot);
  let masked = maskPhoneE164(snapshot.phoneE164);
  if (snapshot.destinationKind === "bank") {
    const acct = snapshot.accountNumber ?? "";
    masked = `${snapshot.bankName ?? "Bank"} · ${acct.length > 4 ? `••••${acct.slice(-4)}` : acct}`;
  } else if (snapshot.destinationKind === "airtel" && snapshot.airtelPhoneE164) {
    masked = maskPhoneE164(snapshot.airtelPhoneE164);
  } else if (snapshot.walletMode === "other" && snapshot.walletPhoneE164) {
    masked = maskPhoneE164(snapshot.walletPhoneE164);
  }
  return {
    rail,
    maskedIdentifier: masked,
    verifiedHolderName: holderName,
    verifiedAt: new Date().toISOString(),
    bankId: snapshot.bankId,
    bankName: snapshot.bankName,
  };
}

function existingShopFrom(check: CheckPhoneResult): ExistingShopSummary {
  return {
    shopName: check.shopName ?? "",
    productCount: check.productCount ?? 0,
    joinedAt: check.joinedAt ?? "",
  };
}

export function PayoutShell({ draftId }: PayoutShellProps) {
  const t = useTranslations("payout");
  /** `BUILD_STEPS` carries fully-qualified keys, so the step labels resolve from the root. */
  const tRoot = useTranslations();
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { payoutState, dispatch } = usePayoutState();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [verifyError, setVerifyError] = useState<string | undefined>();

  const draft = useMemo(() => getDraftMemory(draftId) ?? null, [draftId]);
  const suggestedShop = draft?.title.en ?? draft?.title[Object.keys(draft?.title ?? {})[0] ?? "en"] ?? "";

  const stepLabels = useMemo(
    () => Object.fromEntries(BUILD_STEPS.map((s) => [s.labelKey, tRoot(s.labelKey)])),
    [tRoot],
  );

  const stepperLabels = useMemo(
    () => ({
      nav: tCommon("progressNav"),
      done: tCommon("stepDone"),
      current: tCommon("stepCurrent"),
    }),
    [tCommon],
  );

  const progressPct = PAYOUT_PROGRESS[payoutState.state];

  const runAccountCreation = useCallback(
    async (form: PayoutFormSnapshot, holderName: string) => {
      dispatch({ type: "GO_WORKING", form, phase: "link" });
      const localDraft = getDraftMemory(draftId);
      if (localDraft) {
        await fetch(`/api/draft/${draftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft: localDraft }),
        });
      }
      const destination = destinationForAccount(form, holderName);
      const idempotencyKey = `${draftId}:${form.phoneE164}:${form.shopName}`;
      dispatch({ type: "SET_WORKING_PHASE", phase: "migrate" });
      const result = await createSellerAccount({
        draftId,
        phoneE164: form.phoneE164,
        shopName: form.shopName,
        destination,
        consentVersion: PAYOUT_TERMS_VERSION,
        idempotencyKey,
      });
      if (!result.ok) {
        dispatch({
          type: "GO_ERROR",
          form,
          message: result.message,
          retryTarget: "working",
          holderName,
        });
        return;
      }
      dispatch({
        type: "GO_DONE",
        summary: {
          destination,
          shopName: form.shopName,
          shopSlug: result.shopSlug,
          productReadyLabel: t("done.oneProduct"),
        },
      });
    },
    [dispatch, draftId, t],
  );

  /** The failed attempt already resolved a holder name; only ask the rail
   * again if that attempt died before it got one. */
  const retryAccountCreation = useCallback(
    async (form: PayoutFormSnapshot, knownHolderName?: string) => {
      const holderName =
        knownHolderName ?? (await payoutNameEnquiry(nameEnquiryFromSnapshot(form))).holderName;
      await runAccountCreation(form, holderName);
    },
    [runAccountCreation],
  );

  const startOtpFlow = useCallback(
    async (form: PayoutFormSnapshot, holder?: HolderInfo) => {
      setBusy(true);
      const reg = await checkSellerPhone(form.phoneE164);
      if (reg.registered && reg.shopName) {
        dispatch({ type: "GO_INUSE", form, existingShop: existingShopFrom(reg) });
        setBusy(false);
        return;
      }
      const country = getCountryByCode(form.countryCode);
      const net = country.networks.find((n) => n.id === form.detectedNetworkId);
      if (net && !net.payoutSupported && form.destinationKind === "wallet" && form.walletMode === "same") {
        dispatch({
          type: "GO_UNSUPPORTED",
          form,
          networkName: net.name,
        });
        setBusy(false);
        return;
      }
      const send = await requestPayoutOtp(form.phoneE164, "sms");
      if (!send.ok) {
        if (send.code === "in_use") {
          // The check above said this number was free, so the shop was
          // created between the two calls: ask again rather than dressing up
          // the OTP error message as a shop name.
          const latest = await checkSellerPhone(form.phoneE164);
          dispatch({ type: "GO_INUSE", form, existingShop: existingShopFrom(latest) });
        } else if (send.code === "unsupported") {
          dispatch({ type: "GO_UNSUPPORTED", form, networkName: net?.name ?? t("unsupported.unknownNet") });
        } else {
          dispatch({
            type: "GO_ERROR",
            form,
            message: send.message ?? t("error.lede"),
            retryTarget: "form",
          });
        }
        setBusy(false);
        return;
      }
      dispatch({ type: "GO_VERIFY", form, holder: holder ?? undefined });
      setBusy(false);
    },
    [dispatch, t],
  );

  const onSubmitForm = useCallback(
    async (snapshot: PayoutFormSnapshot) => {
      setBusy(true);
      try {
        if (requiresHolderConfirm(snapshot)) {
          const holder = await payoutNameEnquiry(nameEnquiryFromSnapshot(snapshot));
          dispatch({ type: "GO_CONFIRM", form: snapshot, holder });
        } else {
          await startOtpFlow(snapshot);
        }
      } catch {
        dispatch({
          type: "GO_ERROR",
          form: snapshot,
          message: t("error.lede"),
          retryTarget: "form",
        });
      } finally {
        setBusy(false);
      }
    },
    [dispatch, startOtpFlow, t],
  );

  const onVerify = useCallback(
    async (code: string) => {
      if (payoutState.state !== "verify") return;
      setBusy(true);
      setVerifyError(undefined);
      const form = payoutState.form;
      const holderName =
        payoutState.holder?.holderName ??
        (await payoutNameEnquiry(nameEnquiryFromSnapshot(form))).holderName;
      const result = await verifyPayoutOtp(form.phoneE164, code);
      if (!result.ok) {
        if (result.code === "locked" && result.lockoutUntil) {
          dispatch({ type: "GO_LOCKED", form, lockoutUntil: result.lockoutUntil });
        } else {
          const nextAttempt = payoutState.otpAttempts + 1;
          dispatch({ type: "OTP_FAILED", attempts: nextAttempt });
          if (nextAttempt >= OTP_MAX_ATTEMPTS && result.lockoutUntil) {
            dispatch({ type: "GO_LOCKED", form, lockoutUntil: result.lockoutUntil });
          } else {
            setVerifyError(t("verify.invalid"));
          }
        }
        setBusy(false);
        return;
      }
      await runAccountCreation(form, holderName);
      setBusy(false);
    },
    [dispatch, payoutState, runAccountCreation, t],
  );

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-paper">
      <PayoutTopBar
        stepLabels={stepLabels}
        stepperLabels={stepperLabels}
        draftSavedLabel={t("topbar.draftSaved")}
        backHref={`/build/${draftId}?screen=draft`}
        backLabel={t("topbar.back")}
        progressPct={progressPct}
      />

      <PanelErrorBoundary retryLabel={t("error.retry")} title={t("error.panel")}>
        {payoutState.state === "form" ? (
          <PayoutForm
            t={t}
            locale={locale}
            draft={draft as Draft | null}
            suggestedShopName={suggestedShop}
            onSubmitForm={(s) => void onSubmitForm(s)}
            onPrivacyClick={() => setPrivacyOpen(true)}
            submitting={busy}
          />
        ) : null}

        {payoutState.state === "confirm" ? (
          <HolderConfirmState
            t={t}
            holder={payoutState.holder}
            onConfirm={() => void startOtpFlow(payoutState.form, payoutState.holder)}
            onReject={() => dispatch({ type: "GO_FORM" })}
          />
        ) : null}

        {payoutState.state === "verify" ? (
          <VerifyState
            t={t}
            phoneE164={payoutState.form.phoneE164}
            attempts={payoutState.otpAttempts}
            error={verifyError}
            verifying={busy}
            onWrongNumber={() => dispatch({ type: "GO_FORM" })}
            onVerify={(code) => void onVerify(code)}
            onResend={() => void requestPayoutOtp(payoutState.form.phoneE164, "sms")}
            onVoice={() => void requestPayoutOtp(payoutState.form.phoneE164, "voice")}
          />
        ) : null}

        {payoutState.state === "working" ? (
          <PayoutWorkingState t={t} phase={payoutState.phase} />
        ) : null}

        {payoutState.state === "done" ? (
          <PayoutDoneState t={t} summary={payoutState.summary} draftId={draftId} />
        ) : null}

        {payoutState.state === "locked" ? (
          <PayoutLockedState
            t={t}
            lockoutUntil={payoutState.lockoutUntil}
            onDifferentNumber={() => dispatch({ type: "GO_FORM" })}
          />
        ) : null}

        {payoutState.state === "inuse" ? (
          <AlreadyRegisteredState
            t={t}
            locale={locale}
            shop={payoutState.existingShop}
            onSignIn={() => dispatch({ type: "GO_VERIFY", form: payoutState.form })}
            onDifferentNumber={() => dispatch({ type: "GO_FORM" })}
          />
        ) : null}

        {payoutState.state === "unsupported" ? (
          <UnsupportedNetworkState t={t} onChooseOther={() => dispatch({ type: "GO_FORM" })} />
        ) : null}

        {payoutState.state === "error" ? (
          <PayoutErrorState
            t={t}
            message={payoutState.message}
            onRetry={() => {
              if (payoutState.retryTarget === "working") {
                void retryAccountCreation(payoutState.form, payoutState.holderName);
              } else if (payoutState.retryTarget === "verify") {
                dispatch({ type: "GO_VERIFY", form: payoutState.form });
              } else {
                dispatch({ type: "GO_FORM" });
              }
            }}
            onBack={() => dispatch({ type: "GO_FORM" })}
          />
        ) : null}
      </PanelErrorBoundary>

      <PrivacySheet open={privacyOpen} onOpenChange={setPrivacyOpen} t={t} />
    </div>
  );
}
