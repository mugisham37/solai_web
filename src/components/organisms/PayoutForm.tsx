"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/ui/input";
import { AiField } from "@/components/molecules/AiField";
import { BankAccountFields } from "@/components/molecules/BankAccountFields";
import { ConsentCheckbox } from "@/components/molecules/ConsentCheckbox";
import {
  DestinationMetaInstant,
  DestinationMetaSlower,
  DestinationOption,
} from "@/components/molecules/DestinationOption";
import {
  DEFAULT_COUNTRY_CODE,
  PhoneNumberField,
  type PhoneNumberFieldValue,
} from "@/components/molecules/PhoneNumberField";
import { ReassuranceRail } from "@/components/molecules/ReassuranceRail";
import { PayoutActionBar } from "@/components/organisms/PayoutActionBar";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { fetchBanksForCountry } from "@/lib/payout/banks";
import { buildFormSnapshot } from "@/lib/payout/form-utils";
import {
  destinationTypeFromForm,
  payoutFormSchema,
  type PayoutFormValues,
} from "@/lib/schemas/payout";
import { getCountryByCode, type CountryCode } from "@/data/countries";
import type { Draft } from "@/types/build";
import type { DestinationKind, PayoutFormSnapshot, WalletMode } from "@/types/payout";
import { cn } from "@/lib/cn";

type PayoutFormProps = {
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: string;
  draft: Draft | null;
  suggestedShopName: string;
  onSubmitForm: (snapshot: PayoutFormSnapshot) => void;
  onPrivacyClick: () => void;
  submitting?: boolean;
};

export function PayoutForm({
  t,
  locale,
  draft,
  suggestedShopName,
  onSubmitForm,
  onPrivacyClick,
  submitting,
}: PayoutFormProps) {
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneMeta, setPhoneMeta] = useState<PhoneNumberFieldValue | null>(null);
  const [walletDisplay, setWalletDisplay] = useState("");
  const [airtelDisplay, setAirtelDisplay] = useState("");
  const [banks, setBanks] = useState<Awaited<ReturnType<typeof fetchBanksForCountry>>>([]);
  const [destinationKind, setDestinationKind] = useState<DestinationKind>("wallet");
  const [walletMode, setWalletMode] = useState<WalletMode>("same");

  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNational: "",
      shopName: suggestedShopName,
      consent: false,
      destinationType: "wallet-same",
      destinationKind: "wallet",
      walletMode: "same",
    } as PayoutFormValues,
  });

  const countryCode = useWatch({ control: form.control, name: "countryCode" });
  const shopName = useWatch({ control: form.control, name: "shopName" });
  const consent = useWatch({ control: form.control, name: "consent" });
  const bankId = useWatch({ control: form.control, name: "bankId" });
  const accountNumber = useWatch({ control: form.control, name: "accountNumber" });

  useEffect(() => {
    void fetchBanksForCountry(countryCode).then(setBanks);
  }, [countryCode]);

  const network = phoneMeta?.network ?? null;
  const walletTitle = network?.name ?? t("dest.walletDefaultTitle");
  const walletSub = t("dest.walletSameSub");

  const disabledReason = useMemo(() => {
    if (!phoneMeta?.e164 || !network) return t("form.disabledPhone");
    if (!shopName.trim()) return t("form.disabledShop");
    if (!consent) return t("form.disabledConsent");
    if (destinationKind === "bank" && (!bankId || (accountNumber?.length ?? 0) < 6)) {
      return t("form.disabledBank");
    }
    if (destinationKind === "airtel" && !airtelDisplay.replace(/\D/g, "").length) {
      return t("form.disabledAirtel");
    }
    if (destinationKind === "wallet" && walletMode === "other" && walletDisplay.replace(/\D/g, "").length < 8) {
      return t("form.disabledWallet");
    }
    return undefined;
  }, [
    accountNumber?.length,
    airtelDisplay,
    bankId,
    consent,
    destinationKind,
    network,
    phoneMeta?.e164,
    shopName,
    t,
    walletDisplay,
    walletMode,
  ]);

  const canSubmit = !disabledReason;

  const barHint =
    destinationKind === "bank" ? t("action.hintBank") : t("action.hintWallet");

  const syncDestinationType = useCallback(
    (kind: DestinationKind, mode: WalletMode) => {
      const dt = destinationTypeFromForm(kind, mode);
      form.setValue("destinationKind", kind);
      form.setValue("walletMode", mode);
      form.setValue("destinationType", dt);
    },
    [form],
  );

  const handleSubmit = form.handleSubmit(() => {
    if (!phoneMeta?.e164) return;
    const snapshot = buildFormSnapshot({
      countryCode: countryCode as CountryCode,
      phoneNational: phoneMeta.nationalDigits,
      phoneDisplay,
      phoneE164: phoneMeta.e164,
      detectedNetworkId: network?.id ?? null,
      destinationKind,
      walletMode,
      walletPhoneNational: walletMode === "other" ? walletDisplay.replace(/\D/g, "") : undefined,
      airtelPhoneNational: destinationKind === "airtel" ? airtelDisplay.replace(/\D/g, "") : undefined,
      bankId: destinationKind === "bank" ? bankId : undefined,
      accountNumber: destinationKind === "bank" ? accountNumber : undefined,
      shopName,
      consent: Boolean(consent),
    });
    onSubmitForm(snapshot);
  });

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 px-3.5 py-4 pb-6 md:px-6 md:py-8 md:pb-8 @[1000px]:px-8">
        <div className="grid items-start gap-5 @[1000px]:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] @[1000px]:gap-8">
          <div className="flex max-w-[600px] flex-col gap-4 @[1000px]:max-w-none">
            <div>
              <Eyebrow>{t("form.eyebrow")}</Eyebrow>
              <Heading level={1} size="display" className="text-d1 mt-2 normal-case">
                {t("form.title")}
              </Heading>
              <Text className="mt-2 text-ink-70">{t("form.lede")}</Text>
            </div>

            <PhoneNumberField
              label={
                <>
                  <Icon name="phone" size="sm" className="size-3.5" />
                  {t("form.phoneLabel")}
                </>
              }
              countryCode={countryCode as CountryCode}
              onCountryChange={(code) => {
                form.setValue("countryCode", code);
                form.setValue("phoneNational", phoneMeta?.nationalDigits ?? "");
              }}
              value={phoneDisplay}
              onChange={(v) => {
                setPhoneDisplay(v.display);
                setPhoneMeta(v);
                form.setValue("phoneNational", v.nationalDigits, { shouldValidate: false });
              }}
              onBlur={() => form.trigger("phoneNational")}
              error={form.formState.errors.phoneNational?.message}
              helpText={t("form.phoneHelp")}
              detectingLabel={t("form.networkDetecting")}
              unknownLabel={t("form.networkUnknown")}
            />

            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-45">
                <Icon name="wallet" size="sm" className="size-3.5" />
                {t("form.destLabel")}
              </span>
              <div className="flex flex-col gap-2" role="radiogroup" aria-label={t("form.destLabel")}>
                <DestinationOption
                  id="dest-wallet"
                  title={walletTitle}
                  subtitle={walletSub}
                  meta={<DestinationMetaInstant label={t("dest.instant")} />}
                  selected={destinationKind === "wallet"}
                  onSelect={() => {
                    setDestinationKind("wallet");
                    syncDestinationType("wallet", walletMode);
                  }}
                  revealOpen={destinationKind === "wallet"}
                  reveal={
                    <>
                      <div
                        className="inline-flex flex-wrap rounded-pill border border-ink-20 bg-white p-0.5"
                        role="tablist"
                        aria-label={t("dest.walletWhich")}
                      >
                        {(["same", "other"] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            role="tab"
                            aria-selected={walletMode === mode}
                            className={cn(
                              "min-h-9 rounded-pill px-3 py-2 text-[0.82rem] font-bold",
                              walletMode === mode ? "bg-deep text-on-deep" : "text-ink-45",
                            )}
                            onClick={() => {
                              setWalletMode(mode);
                              syncDestinationType("wallet", mode);
                            }}
                          >
                            {mode === "same" ? t("dest.sameNumber") : t("dest.otherNumber")}
                          </button>
                        ))}
                      </div>
                      {walletMode === "other" ? (
                        <PhoneNumberField
                          label={t("dest.walletNumberLabel")}
                          countryCode={countryCode as CountryCode}
                          onCountryChange={() => {}}
                          value={walletDisplay}
                          onChange={(v) => {
                            setWalletDisplay(v.display);
                            form.setValue("walletPhoneNational", v.nationalDigits);
                          }}
                          helpText={t("dest.walletCheckHint")}
                          detectingLabel=""
                          unknownLabel=""
                        />
                      ) : null}
                      <Text className="text-xs text-ink-45">{t("dest.walletSpeedNote")}</Text>
                    </>
                  }
                />

                <DestinationOption
                  id="dest-airtel"
                  title={t("dest.airtelTitle")}
                  subtitle={t("dest.airtelSub")}
                  meta={<DestinationMetaInstant label={t("dest.instant")} />}
                  selected={destinationKind === "airtel"}
                  onSelect={() => {
                    setDestinationKind("airtel");
                    syncDestinationType("airtel", "same");
                  }}
                  revealOpen={destinationKind === "airtel"}
                  reveal={
                    <PhoneNumberField
                      label={t("dest.airtelNumberLabel")}
                      countryCode={countryCode as CountryCode}
                      onCountryChange={() => {}}
                      value={airtelDisplay}
                      onChange={(v) => {
                        setAirtelDisplay(v.display);
                        form.setValue("airtelPhoneNational", v.nationalDigits);
                      }}
                      helpText={t("dest.airtelHint")}
                      detectingLabel=""
                      unknownLabel=""
                    />
                  }
                />

                <DestinationOption
                  id="dest-bank"
                  title={t("dest.bankTitle")}
                  subtitle={t("dest.bankSub")}
                  meta={<DestinationMetaSlower label={t("dest.slower")} />}
                  selected={destinationKind === "bank"}
                  onSelect={() => {
                    setDestinationKind("bank");
                    syncDestinationType("bank", "same");
                  }}
                  revealOpen={destinationKind === "bank"}
                  reveal={
                    <BankAccountFields
                      banks={banks}
                      bankId={bankId ?? ""}
                      onBankChange={(id) => form.setValue("bankId", id, { shouldValidate: true })}
                      accountNumber={accountNumber ?? ""}
                      onAccountChange={(v) => form.setValue("accountNumber", v, { shouldValidate: true })}
                      bankLabel={t("dest.bankSelect")}
                      accountLabel={t("dest.accountLabel")}
                      hint={t("dest.bankHint")}
                      note={t("dest.bankNote", {
                        fee: getCountryByCode(countryCode as CountryCode).currency === "RWF" ? "RWF 500" : t("dest.bankFeeGeneric"),
                      })}
                    />
                  }
                />
              </div>
            </div>

            <AiField
              label={
                <>
                  <Icon name="store" size="sm" className="size-3.5" />
                  {t("form.shopLabel")}
                </>
              }
              aiBadge={t("form.shopSuggested")}
              restoreLabel={t("form.shopRestore")}
              originalValue={suggestedShopName}
              value={shopName}
              onChange={(v) => form.setValue("shopName", v, { shouldValidate: true })}
              hint={
                <span className="text-[0.73rem] text-ink-45">{t("form.shopHint")}</span>
              }
            >
              <Input
                className="min-h-11 rounded-xl"
                aria-label={t("form.shopLabel")}
                maxLength={40}
                autoComplete="organization"
                value={shopName}
                onChange={(e) => form.setValue("shopName", e.target.value)}
                onBlur={() => form.trigger("shopName")}
              />
            </AiField>

            <ConsentCheckbox
              checked={Boolean(consent)}
              onChange={(v) => form.setValue("consent", v, { shouldValidate: true })}
              error={form.formState.errors.consent?.message}
            >
              {t("form.consent")}
            </ConsentCheckbox>
          </div>

          <ReassuranceRail
            t={t}
            draft={draft}
            shopNamePreview={shopName}
            locale={locale}
            onPrivacyClick={onPrivacyClick}
          />
        </div>
      </div>

      <PayoutActionBar
        hint={barHint}
        ctaLabel={t("action.sendCode")}
        disabled={!canSubmit}
        disabledReason={disabledReason}
        onSubmit={() => void handleSubmit()}
        loading={submitting}
      />
    </>
  );
}
