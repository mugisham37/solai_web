"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  cancelMomoPaymentAction,
  confirmPaymentAction,
  placeCodOrderAction,
  startMomoPaymentAction,
} from "@/app/actions/buyer/payment";
import { ActionButton } from "@/components/atoms/ActionButton";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { ErrorText } from "@/components/atoms/ErrorText";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { AreaSelect } from "@/components/molecules/AreaSelect";
import { BuyerRise } from "@/components/molecules/BuyerRise";
import { CheckoutTopBar } from "@/components/molecules/CheckoutTopBar";
import { PaymentCountdown } from "@/components/molecules/PaymentCountdown";
import { PaymentMethodOption } from "@/components/molecules/PaymentMethodOption";
import { PriceLedger } from "@/components/molecules/PriceLedger";
import { BuyerProtectionSheet } from "@/components/organisms/BuyerProtectionSheet";
import { ToastProvider, useToastContext } from "@/components/providers/ToastProvider";
import { calcLineTotal, findArea } from "@/lib/buyer/pricing";
import { productPublicPath } from "@/lib/buyer/store";
import { formatMoney } from "@/lib/money";
import { useRouter } from "@/i18n/navigation";
import type {
  BuyerCheckoutSession,
  BuyerDeliveryMode,
  BuyerPaymentMethod,
  BuyerProduct,
  BuyerShop,
  PlaceBuyerOrderInput,
} from "@/types/buyer";
import { cn } from "@/lib/cn";

type CheckoutScreen = "form" | "prompt" | "failed" | "cod" | "paid";

type CheckoutShellProps = {
  shop: BuyerShop;
  product: BuyerProduct;
  session: BuyerCheckoutSession;
};

function digits(v: string) {
  return v.replace(/\D/g, "");
}

function formatPhoneDisplay(raw: string) {
  const d = digits(raw);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
}

function CheckoutShellInner({ shop, product, session }: CheckoutShellProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [screen, setScreen] = useState<CheckoutScreen>("form");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [protOpen, setProtOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [mode, setMode] = useState<BuyerDeliveryMode>(
    session.areaId === "pickup" ? "pickup" : "deliver",
  );
  const deliverAreas = useMemo(
    () => shop.deliveryAreas.filter((a) => a.id !== "pickup"),
    [shop.deliveryAreas],
  );
  const [areaId, setAreaId] = useState(
    session.areaId === "pickup"
      ? (deliverAreas[0]?.id ?? "kimironko")
      : session.areaId,
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pay, setPay] = useState<BuyerPaymentMethod>("mtn");
  const [sameNum, setSameNum] = useState(true);
  const [payNum, setPayNum] = useState("");
  const [airtelNum, setAirtelNum] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [promptPhone, setPromptPhone] = useState("");
  const [countdownKey, setCountdownKey] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const area = findArea(shop.deliveryAreas, areaId) ?? deliverAreas[0];
  const breakdown = useMemo(() => {
    const ship =
      mode === "pickup"
        ? { amountMinor: 0, currency: product.price.currency }
        : (area?.fee ?? { amountMinor: 0, currency: product.price.currency });
    return calcLineTotal(product.price, session.qty, ship);
  }, [product.price, session.qty, mode, area]);

  const backHref = productPublicPath(shop.slug, product.id);
  const image = product.images[0];

  const resolvedPayPhone = () => {
    if (pay === "mtn") return sameNum ? phone : payNum;
    if (pay === "airtel") return airtelNum;
    return phone;
  };

  const isValid = () => {
    if (!name.trim()) return false;
    if (digits(phone).length < 9) return false;
    if (pay === "mtn" && !sameNum && digits(payNum).length < 9) return false;
    if (pay === "airtel" && digits(airtelNum).length < 9) return false;
    return true;
  };

  const showFieldErrors = () => {
    setNameErr(!name.trim() ? t("errName") : "");
    setPhoneErr(digits(phone).length < 9 ? t("errPhone") : "");
  };

  const formValid = isValid();

  const buildInput = (): PlaceBuyerOrderInput => ({
    sessionId: session.id,
    buyerName: name,
    buyerPhone: digits(phone),
    deliveryMode: mode,
    areaId: mode === "pickup" ? "pickup" : areaId,
    landmark,
    paymentMethod: pay,
    payPhone: digits(resolvedPayPhone()),
  });

  const goFailed = () => {
    startTransition(async () => {
      await cancelMomoPaymentAction(session.id);
      setScreen("failed");
    });
  };

  const startPay = () => {
    setShowErrors(true);
    showFieldErrors();
    if (!isValid()) return;
    if (pay === "cod") {
      setScreen("cod");
      return;
    }
    startTransition(async () => {
      const result = await startMomoPaymentAction(buildInput());
      if (!result.ok) {
        toast(t("errGeneric"));
        if (result.reason === "oos") setScreen("failed");
        return;
      }
      setPromptPhone(result.promptPhone);
      setCountdownKey((k) => k + 1);
      setScreen("prompt");
    });
  };

  const finishPaid = (id: string) => {
    setOrderId(id);
    setScreen("paid");
  };

  const approvePayment = () => {
    startTransition(async () => {
      const result = await confirmPaymentAction(buildInput());
      if (!result.ok) {
        toast(t("errGeneric"));
        setScreen("failed");
        return;
      }
      finishPaid(result.orderId);
    });
  };

  const placeCod = () => {
    startTransition(async () => {
      const result = await placeCodOrderAction({
        ...buildInput(),
        paymentMethod: "cod",
      });
      if (!result.ok) {
        toast(t("errGeneric"));
        return;
      }
      finishPaid(result.orderId);
    });
  };

  const [goBar, setGoBar] = useState(false);

  useEffect(() => {
    if (screen !== "paid" || !orderId) return;
    requestAnimationFrame(() => setGoBar(true));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 400 : 1600;
    const id = window.setTimeout(() => {
      router.push(`/order/${orderId}`);
    }, delay);
    return () => window.clearTimeout(id);
  }, [screen, orderId, router]);

  const shipLabel =
    mode === "pickup"
      ? t("collecting")
      : t("deliveryArea", { area: area?.label ?? "" });

  const ctaLabel =
    pay === "cod"
      ? t("placeOrder", { total: formatMoney(breakdown.total, locale) })
      : t("payCta", { total: formatMoney(breakdown.total, locale) });

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1240px] flex-col bg-paper">
      <CheckoutTopBar
        title={t("title")}
        secureLabel={t("secure")}
        backHref={backHref}
        backLabel={t("back")}
      />

      <BuyerRise motionKey={screen} className="flex flex-1 flex-col">
      {screen === "form" ? (
        <>
          <div className="flex flex-1 flex-col gap-4 px-3.5 pt-4 pb-4 @[700px]:px-6 @[700px]:pt-6">
            <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] @[1000px]:items-start @[1000px]:gap-8">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="font-display text-d1 font-extrabold uppercase">{t("headline")}</h1>
                  <p className="mt-1.5 text-[0.96rem] leading-relaxed text-ink-70">{t("lede")}</p>
                </div>

                <div className="flex flex-col gap-4 rounded-card border border-hair bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Eyebrow variant="quiet">{t("where")}</Eyebrow>
                    <StatusChip label={t("step1")} tone="grey" />
                  </div>
                  <div className="flex flex-wrap gap-2" role="group" aria-label={t("modeLabel")}>
                    {(["deliver", "pickup"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={mode === m}
                        className={cn(
                          "rounded-pill border px-2.5 py-1 text-[0.72rem] font-bold",
                          mode === m
                            ? "border-sun bg-sun/10"
                            : "border-ink-20 text-ink-70",
                        )}
                        onClick={() => setMode(m)}
                      >
                        {m === "deliver" ? t("deliver") : t("pickup")}
                      </button>
                    ))}
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                      {t("name")}
                    </span>
                    <input
                      className="w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-sun"
                      autoComplete="name"
                      placeholder={t("namePh")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={(e) => {
                        setShowErrors(true);
                        setNameErr(!e.currentTarget.value.trim() ? t("errName") : "");
                      }}
                    />
                    <ErrorText message={showErrors ? nameErr : undefined} />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                      {t("phone")}
                    </span>
                    <span className="flex">
                      <span className="rounded-l-xl border border-r-0 border-ink-20 bg-paper-2 px-2.5 py-3 text-[0.88rem] font-bold">
                        +250
                      </span>
                      <input
                        className="w-full rounded-r-xl border border-ink-20 bg-white px-3 py-3 text-[0.95rem] outline-none focus:border-sun"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder={t("phonePh")}
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneDisplay(e.target.value))}
                        onBlur={(e) => {
                          setShowErrors(true);
                          setPhoneErr(
                            digits(e.currentTarget.value).length < 9 ? t("errPhone") : "",
                          );
                        }}
                      />
                    </span>
                    <span className="text-[0.72rem] text-ink-45">{t("phoneHint")}</span>
                    <ErrorText message={showErrors ? phoneErr : undefined} />
                  </label>

                  {mode === "deliver" ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                          {t("area")}
                        </span>
                        <AreaSelect
                          areas={deliverAreas}
                          value={areaId}
                          onChange={setAreaId}
                          label={t("area")}
                          formatOption={(a) =>
                            t("areaFee", {
                              area: a.label,
                              fee: formatMoney(a.fee, locale),
                            })
                          }
                        />
                      </div>
                      <label className="flex flex-col gap-1">
                        <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                          {t("landmark")}
                        </span>
                        <textarea
                          className="min-h-[80px] w-full resize-y rounded-xl border border-ink-20 bg-white px-3.5 py-3 text-[0.95rem] outline-none focus:border-sun"
                          placeholder={t("landmarkPh")}
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                        <span className="text-[0.72rem] text-ink-45">{t("landmarkHint")}</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] leading-relaxed text-ink-70">
                      <Icon name="mapPin" size="md" className="mt-0.5 shrink-0" />
                      <span>{t("pickupNote", { name: shop.name.split(" ")[0] ?? shop.name })}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 rounded-card border border-hair bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Eyebrow variant="quiet">{t("howPay")}</Eyebrow>
                    <StatusChip label={t("step2")} tone="grey" />
                  </div>
                  <div className="flex flex-col gap-2" role="radiogroup" aria-label={t("howPay")}>
                    <PaymentMethodOption
                      selected={pay === "mtn"}
                      onSelect={() => setPay("mtn")}
                      icon="wallet"
                      iconTone="sun"
                      title={t("mtn")}
                      subtitle={t("mtnSub")}
                      badge={t("mostUsed")}
                    >
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={sameNum}
                          onChange={setSameNum}
                          label={t("sameNum")}
                        />
                        <span className="text-[0.96rem] text-ink-70">{t("sameNum")}</span>
                      </div>
                      {!sameNum ? (
                        <label className="flex flex-col gap-1">
                          <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                            {t("momoNum")}
                          </span>
                          <span className="flex">
                            <span className="rounded-l-xl border border-r-0 border-ink-20 bg-white px-2.5 py-3 text-[0.88rem] font-bold">
                              +250
                            </span>
                            <input
                              className="w-full rounded-r-xl border border-ink-20 bg-white px-3 py-3 outline-none focus:border-sun"
                              inputMode="tel"
                              placeholder={t("momoPh")}
                              value={payNum}
                              onChange={(e) => setPayNum(formatPhoneDisplay(e.target.value))}
                            />
                          </span>
                        </label>
                      ) : null}
                    </PaymentMethodOption>

                    <PaymentMethodOption
                      selected={pay === "airtel"}
                      onSelect={() => setPay("airtel")}
                      icon="wallet"
                      iconTone="sun"
                      title={t("airtel")}
                      subtitle={t("airtelSub")}
                    >
                      <label className="flex flex-col gap-1">
                        <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                          {t("airtelNum")}
                        </span>
                        <span className="flex">
                          <span className="rounded-l-xl border border-r-0 border-ink-20 bg-white px-2.5 py-3 text-[0.88rem] font-bold">
                            +250
                          </span>
                          <input
                            className="w-full rounded-r-xl border border-ink-20 bg-white px-3 py-3 outline-none focus:border-sun"
                            inputMode="tel"
                            placeholder={t("airtelPh")}
                            value={airtelNum}
                            onChange={(e) => setAirtelNum(formatPhoneDisplay(e.target.value))}
                          />
                        </span>
                      </label>
                    </PaymentMethodOption>

                    <PaymentMethodOption
                      selected={pay === "cod"}
                      onSelect={() => setPay("cod")}
                      icon="coins"
                      title={t("cod")}
                      subtitle={t("codSub")}
                    >
                      <p className="text-[0.96rem] text-ink-70">{t("codBody")}</p>
                      <p className="text-[0.74rem] text-ink-45">{t("codHint")}</p>
                    </PaymentMethodOption>

                    <PaymentMethodOption
                      selected={pay === "card"}
                      onSelect={() => setPay("card")}
                      icon="card"
                      title={t("card")}
                      subtitle={t("cardSub")}
                    >
                      <label className="flex flex-col gap-1">
                        <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                          {t("cardNumber")}
                        </span>
                        <input
                          className="w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 outline-none focus:border-sun"
                          inputMode="numeric"
                          placeholder="1234 1234 1234 1234"
                        />
                      </label>
                      <div className="flex gap-2">
                        <label className="flex flex-1 flex-col gap-1">
                          <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                            {t("expiry")}
                          </span>
                          <input
                            className="w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 outline-none focus:border-sun"
                            placeholder="MM / YY"
                          />
                        </label>
                        <label className="flex flex-1 flex-col gap-1">
                          <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                            {t("cvc")}
                          </span>
                          <input
                            className="w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 outline-none focus:border-sun"
                            inputMode="numeric"
                            placeholder="123"
                          />
                        </label>
                      </div>
                      <p className="text-[0.74rem] text-ink-45">{t("cardNote")}</p>
                    </PaymentMethodOption>
                  </div>
                </div>

                <div className="flex gap-2 rounded-xl bg-sea/15 p-3 text-[0.81rem] leading-relaxed text-sea-muted">
                  <Icon name="shield" size="md" className="mt-0.5 shrink-0" />
                  <span>
                    {t.rich("paySolaiNote", {
                      strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
                      name: shop.name.split(" ")[0] ?? shop.name,
                    })}{" "}
                    <button
                      type="button"
                      className="font-semibold underline"
                      onClick={() => setProtOpen(true)}
                    >
                      {t("howItWorks")}
                    </button>
                  </span>
                </div>
                <p className="text-[0.74rem] text-ink-45">{t("terms")}</p>
              </div>

              <div className="flex flex-col gap-4 @[1000px]:sticky @[1000px]:top-[4.6rem]">
                <div className="rounded-card border border-hair bg-white p-4">
                  <Eyebrow variant="quiet" className="mb-3">
                    {t("yourOrder")}
                  </Eyebrow>
                  <div className="flex items-start gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-paper-2">
                      {image ? (
                        <BeadedBracelet
                          paletteIndex={image.palette}
                          beadCount={image.beads}
                          gradientId={`chk-${product.id}`}
                          className="size-full rounded-none"
                          aspectClass="aspect-square h-full"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.92rem] font-bold">{product.title}</p>
                      <p className="text-[0.74rem] text-ink-45">
                        {t("lineMeta", { variant: session.variant, qty: session.qty })}
                      </p>
                      <p className="text-[0.74rem] text-ink-45">
                        {t("fromSeller", { name: shop.name })}
                      </p>
                    </div>
                  </div>
                  <hr className="my-3 border-0 border-t border-hair" />
                  <PriceLedger
                    locale={locale}
                    className="bg-transparent p-0"
                    footnote={t("feeNote")}
                    rows={[
                      {
                        label: t("itemLine", {
                          item: product.shortLabel,
                          qty: session.qty,
                        }),
                        value: breakdown.itemLine,
                      },
                      {
                        label: shipLabel,
                        value: breakdown.isPickup ? t("free") : breakdown.ship,
                      },
                      { label: t("youPayNow"), value: breakdown.total, total: true },
                    ]}
                  />
                </div>

                <div className="rounded-card border border-berry/30 bg-berry/10 p-4">
                  <div className="flex items-start gap-3">
                    <IconTile variant="berry">
                      <Icon name="shield" size="md" />
                    </IconTile>
                    <div>
                      <p className="text-[0.92rem] font-bold text-berry-muted">{t("heldTitle")}</p>
                      <p className="mt-0.5 text-[0.74rem] text-berry-muted">{t("heldBody")}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-card bg-paper-2 p-4">
                  <p className="mb-2 text-[0.92rem] font-bold">{t("afterTitle")}</p>
                  <div className="flex flex-col gap-1.5 text-[0.74rem] text-ink-45">
                    <span>{t("after1")}</span>
                    <span>{t("after2", { name: shop.name.split(" ")[0] ?? shop.name })}</span>
                    <span>{t("after3")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-28 border-t border-hair bg-paper/95 px-3.5 py-2.5 pb-[calc(0.7rem+env(safe-area-inset-bottom))] backdrop-blur-[14px] @[700px]:px-6">
            <div className="mx-auto flex max-w-[1100px] items-center gap-2.5">
              <div className="shrink-0">
                <span className="block text-[0.74rem] text-ink-45">{t("total")}</span>
                <MoneyDisplay value={breakdown.total} locale={locale} className="text-d3" />
              </div>
              <ActionButton
                type="button"
                variant="sun"
                size="lg"
                className="flex-1 @[700px]:ml-auto @[700px]:min-w-[300px] @[700px]:flex-none"
                disabled={!formValid || pending}
                onClick={startPay}
              >
                {ctaLabel}
              </ActionButton>
            </div>
          </div>
        </>
      ) : null}

      {screen === "prompt" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col justify-center gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="sun" className="mx-auto mb-4 size-14 rounded-[18px]">
              <Icon name="phone" size="lg" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("promptTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">
              {t("promptLede", { phone: `+250 ${formatPhoneDisplay(promptPhone)}` })}
            </p>
          </div>
          <div className="rounded-2xl bg-[#111] p-4 font-mono text-[0.85rem] leading-relaxed text-[#eee]">
            {t("simNetwork")}
            <br />
            <br />
            {t("simPay")} <b>{formatMoney(breakdown.total, locale)}</b> {t("simTo")}
            <br />
            <b>{t("simMerchant", { name: shop.name })}</b>
            <br />
            <br />
            {t("simPin")}
          </div>
          <p className="text-center text-[0.74rem] text-ink-45">{t("simNote")}</p>
          <PaymentCountdown
            key={countdownKey}
            onTimeout={goFailed}
            waitingLabel={t("waiting")}
            stayLabel={t("dontClose")}
          />
          <div className="flex flex-col gap-2">
            <ActionButton
              type="button"
              variant="line"
              block
              onClick={() => {
                setCountdownKey((k) => k + 1);
                toast(t("resent"));
              }}
            >
              <Icon name="refresh" size="md" />
              {t("resend")}
            </ActionButton>
            <ActionButton
              type="button"
              variant="plain"
              block
              onClick={() => {
                startTransition(async () => {
                  await cancelMomoPaymentAction(session.id);
                  setScreen("form");
                });
              }}
            >
              {t("cancelChange")}
            </ActionButton>
          </div>
          <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0" />
            <span>{t("promptHelp")}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <ActionButton type="button" variant="line" size="sm" disabled={pending} onClick={approvePayment}>
              {t("simApproved")}
            </ActionButton>
            <ActionButton type="button" variant="line" size="sm" onClick={goFailed}>
              {t("simFailed")}
            </ActionButton>
          </div>
        </div>
      ) : null}

      {screen === "failed" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col justify-center gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="clay" className="mx-auto mb-4 size-14 rounded-[18px]">
              <Icon name="alert" size="lg" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("failTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">
              {t.rich("failLede", {
                strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </p>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-2.5">
              {t("failUsual")}
            </Eyebrow>
            <div className="flex flex-col gap-2">
              {[t("fail1"), t("fail2", { total: formatMoney(breakdown.total, locale) }), t("fail3")].map(
                (text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-paper-2 text-[0.75rem] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[0.96rem] text-ink-70">{text}</span>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ActionButton type="button" variant="sun" size="lg" block disabled={pending} onClick={startPay}>
              <Icon name="refresh" size="md" />
              {t("tryAgain")}
            </ActionButton>
            <ActionButton type="button" variant="line" block onClick={() => setScreen("form")}>
              {t("differentWay")}
            </ActionButton>
            <ActionButton
              type="button"
              variant="line"
              block
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(t("waHelpText", { product: product.title, shop: shop.name }))}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <Icon name="whatsapp" size="md" />
              {t("askHelp")}
            </ActionButton>
          </div>
          <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0" />
            <span>{t("failBasket")}</span>
          </div>
        </div>
      ) : null}

      {screen === "cod" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col justify-center gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="sea" className="mx-auto mb-4 size-14 rounded-[18px]">
              <Icon name="coins" size="lg" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("codTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">{t("codLede")}</p>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <div className="flex flex-col gap-3">
              {[
                t("codStep1", { name: shop.name.split(" ")[0] ?? shop.name }),
                t.rich("codStep2", {
                  strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
                  total: formatMoney(breakdown.total, locale),
                }),
                t("codStep3"),
                t("codStep4"),
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-[0.72rem] font-bold text-sun-ink">
                    {i + 1}
                  </span>
                  <span className="text-[0.96rem] text-ink-70">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0" />
            <span>{t("codExact")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <ActionButton type="button" variant="sun" size="lg" block disabled={pending} onClick={placeCod}>
              {t("placeOrderBtn")}
            </ActionButton>
            <ActionButton type="button" variant="line" block onClick={() => setScreen("form")}>
              {t("payNowInstead")}
            </ActionButton>
          </div>
        </div>
      ) : null}

      {screen === "paid" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-1 flex-col items-center justify-center gap-5 px-3.5 py-8 text-center @[700px]:px-6">
          <IconTile variant="sea" className="size-16 rounded-[20px] bg-sea text-white">
            <Icon name="check" size="lg" className="stroke-[2.4]" />
          </IconTile>
          <div>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("paidTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">{t("paidLede")}</p>
          </div>
          <div className="h-1.5 w-full max-w-[280px] overflow-hidden rounded-pill bg-paper-2">
            <span
              className="block h-full bg-sea transition-[width] duration-[1200ms] linear"
              style={{ width: goBar ? "100%" : "0%" }}
            />
          </div>
          {orderId ? (
            <ActionButton
              type="button"
              variant="sun"
              size="lg"
              onClick={() => router.push(`/order/${orderId}`)}
            >
              {t("seeOrder")}
              <Icon name="arrowRight" size="md" />
            </ActionButton>
          ) : null}
        </div>
      ) : null}
      </BuyerRise>

      <BuyerProtectionSheet
        open={protOpen}
        onOpenChange={setProtOpen}
        shopName={shop.name}
      />
    </div>
  );
}

export function CheckoutShell(props: CheckoutShellProps) {
  return (
    <ToastProvider>
      <CheckoutShellInner {...props} />
    </ToastProvider>
  );
}
