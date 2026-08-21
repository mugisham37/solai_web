"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  addDisputeDetailAction,
  cancelHeldOrderAction,
  confirmReceivedAction,
  markCourierCollectedAction,
  rateOrderAction,
  reportBuyerProblemAction,
} from "@/app/actions/buyer/order";
import { ActionButton } from "@/components/atoms/ActionButton";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { SecureBadge } from "@/components/atoms/SecureBadge";
import { StatusChip } from "@/components/atoms/StatusChip";
import { DeliveryCodeCard } from "@/components/molecules/DeliveryCodeCard";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { OrderTimeline } from "@/components/molecules/OrderTimeline";
import { PriceLedger } from "@/components/molecules/PriceLedger";
import { BuyerRise } from "@/components/molecules/BuyerRise";
import { ToastProvider, useToastContext } from "@/components/providers/ToastProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { shopPublicUrl } from "@/lib/buyer/store";
import { copyText } from "@/lib/clipboard";
import { formatMoney } from "@/lib/money";
import { BUYER_MOTION } from "@/lib/motion";
import { Link, useRouter } from "@/i18n/navigation";
import type {
  BuyerOrder,
  BuyerProblemReason,
  BuyerRating,
} from "@/types/buyer";
import type { EscrowStageIndex } from "@/types/escrow";
import { cn } from "@/lib/cn";

const PROBLEM_REASONS: BuyerProblemReason[] = [
  "neverArrived",
  "notAsDescribed",
  "damaged",
  "missing",
  "codeEarly",
];

function stageFor(status: BuyerOrder["status"]): EscrowStageIndex {
  switch (status) {
    case "held":
    case "disputed":
      return 1;
    case "transit":
      return 2;
    case "done":
    case "refunded":
      return 3;
  }
}

function secureMeta(
  status: BuyerOrder["status"],
  t: ReturnType<typeof useTranslations<"protected">>,
): { label: string; tone: "sea" | "clay" | "ok" } {
  switch (status) {
    case "done":
      return { label: t("secureDone"), tone: "ok" };
    case "refunded":
      return { label: t("secureRefunded"), tone: "ok" };
    case "disputed":
      return { label: t("secureReview"), tone: "clay" };
    default:
      return { label: t("secureProtected"), tone: "sea" };
  }
}

function downloadReceipt(order: BuyerOrder, statusLabel: string) {
  const lines = [
    "SolAI receipt",
    `Order #${order.id}`,
    `Seller: ${order.sellerName}`,
    `Item: ${order.productTitle} x ${order.qty} (${order.variant})`,
    `Item total: ${formatMoney(order.item, "en")}`,
    `Delivery: ${formatMoney(order.delivery, "en")}`,
    `Total: ${formatMoney(order.total, "en")}`,
    `Paid by: ${order.paymentLabel}`,
    `Status: ${statusLabel}`,
    "Buyer protection: funds held by SolAI until delivery is confirmed.",
    "Disputes answered within 48 hours.",
  ].join("\r\n");
  const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `solai-receipt-${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function SlaCountdown({
  deadlineAt,
  t,
}: {
  deadlineAt: number;
  t: ReturnType<typeof useTranslations<"protected">>;
}) {
  const [left, setLeft] = useState(() => Math.max(0, deadlineAt - Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft(Math.max(0, deadlineAt - Date.now()));
    }, 60_000);
    return () => window.clearInterval(id);
  }, [deadlineAt]);
  const hours = Math.max(1, Math.ceil(left / (60 * 60 * 1000)));
  return <strong className="font-bold">{t("slaLeft", { hours })}</strong>;
}

type ProtectedShellProps = { order: BuyerOrder };

function ProtectedShellInner({ order }: ProtectedShellProps) {
  const t = useTranslations("protected");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();
  const [codeOpen, setCodeOpen] = useState(false);
  const [problemOpen, setProblemOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [detail, setDetail] = useState("");
  const trackBarRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = trackBarRef.current;
    if (!el || order.status !== "transit" || !order.courier) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.transitionDuration = reduce
      ? "0ms"
      : `${BUYER_MOTION.trackFill.duration * 1000}ms`;
    el.style.width = "0%";
    const id = requestAnimationFrame(() => {
      el.style.width = `${order.courier!.trackPct}%`;
    });
    return () => cancelAnimationFrame(id);
  }, [order.status, order.courier]);

  const stage = stageFor(order.status);
  const secure = secureMeta(order.status, t);
  const shipLabel =
    order.deliveryMode === "pickup"
      ? t("collecting")
      : t("deliveryArea", { area: order.areaLabel });

  const refresh = () => router.refresh();

  const askSeller = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(t("waSeller", { seller: order.sellerName, id: order.id }))}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const confirmReceived = () => {
    startTransition(async () => {
      const result = await confirmReceivedAction({
        orderId: order.id,
        phoneLast4,
      });
      if (!result.ok) {
        setConfirmErr(
          result.reason === "wrong_phone" ? t("confirmWrong") : t("confirmErr"),
        );
        return;
      }
      setConfirmOpen(false);
      toast(t("confirmToast", { total: formatMoney(order.total, locale), seller: order.sellerFirstName }));
      refresh();
    });
  };

  const report = (reason: BuyerProblemReason) => {
    startTransition(async () => {
      const result = await reportBuyerProblemAction(order.id, reason);
      if (!result.ok) {
        toast(t("errGeneric"));
        return;
      }
      setProblemOpen(false);
      toast(t("reportToast"));
      refresh();
    });
  };

  const cancel = () => {
    startTransition(async () => {
      const result = await cancelHeldOrderAction(order.id);
      if (!result.ok) {
        toast(t("cancelBlocked"));
        return;
      }
      toast(t("cancelToast"));
      refresh();
    });
  };

  const rate = (rating: BuyerRating) => {
    startTransition(async () => {
      await rateOrderAction(order.id, rating);
      toast(rating === "good" ? t("rateGood") : t("rateOther"));
      refresh();
    });
  };

  const shareShop = async () => {
    const url = shopPublicUrl(order.slug);
    if (navigator.share) {
      try {
        await navigator.share({ title: order.sellerName, url });
        return;
      } catch {
        /* fall through */
      }
    }
    const outcome = await copyText(url);
    toast(outcome === "copied" ? t("shareCopied") : t("shareFailed"));
  };

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1240px] flex-col bg-paper">
      <header className="sticky top-0 z-30 shrink-0 border-b border-hair bg-paper/94 backdrop-blur-[14px]">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 @[700px]:px-6 @[700px]:py-3">
          <span className="flex items-center gap-2 text-[0.9rem] font-bold">
            <span className="grid size-6 place-items-center rounded-lg bg-sun text-sun-ink">
              <Icon name="bolt" size="sm" className="size-3.5" />
            </span>
            {t("orderTitle", { id: order.id })}
          </span>
          <span className="flex-1" />
          <SecureBadge
            label={secure.label}
            className={cn(
              secure.tone === "clay" && "text-clay",
              secure.tone === "ok" && "text-sea-muted",
            )}
          />
        </div>
      </header>

      <BuyerRise motionKey={order.status} className="flex flex-1 flex-col">
      {order.sellerSuspended ? (
        <div className="mx-3.5 mt-3 flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70 @[700px]:mx-6">
          <Icon name="info" size="md" className="mt-0.5 shrink-0" />
          <span>{t("suspendedBanner")}</span>
        </div>
      ) : null}

      {/* HELD */}
      {order.status === "held" ? (
        <div className="flex flex-1 flex-col gap-4 px-3.5 pt-4 pb-8 @[700px]:px-6 @[700px]:pt-6">
          <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] @[1000px]:items-start @[1000px]:gap-8">
            <div className="flex flex-col gap-4">
              <div className="px-1 py-2 text-center">
                <IconTile variant="berry" className="mx-auto mb-3 size-14 rounded-[18px]">
                  <Icon name="shield" size="lg" />
                </IconTile>
                <h1 className="font-display text-d1 font-extrabold uppercase">{t("heldTitle")}</h1>
                <p className="mx-auto mt-2 max-w-[44ch] text-[0.96rem] text-ink-70">
                  {t("heldLede", { name: order.sellerFirstName })}
                </p>
              </div>
              <MoneyFlow audience="buyerOrder" current={stage} />
              <DeliveryCodeCard
                code={order.deliveryCode}
                eyebrow={t("codeEyebrow")}
                copyLabel={t("copy")}
                copiedToast={t("codeCopied")}
                whatLabel={t("whatIsThis")}
                onWhat={() => setCodeOpen(true)}
                body={t.rich("codeBody", {
                  strong: (c) => <strong className="font-bold">{c}</strong>,
                  name: order.sellerFirstName,
                })}
              />
              <div className="flex gap-2 rounded-xl bg-clay/10 p-3 text-[0.81rem] leading-relaxed text-clay">
                <Icon name="alert" size="md" className="mt-0.5 shrink-0" />
                <span>
                  {t.rich("codeWarn", {
                    strong: (c) => <strong className="font-bold">{c}</strong>,
                  })}
                </span>
              </div>
              <div className="rounded-card border border-hair bg-white p-4">
                <Eyebrow variant="quiet" className="mb-3">
                  {t("timeline")}
                </Eyebrow>
                <OrderTimeline events={order.events} />
              </div>
              <div className="rounded-card border border-hair bg-white p-4">
                <Eyebrow variant="quiet" className="mb-2.5">
                  {t("expect")}
                </Eyebrow>
                <div className="flex items-start gap-3">
                  <IconTile variant="sea">
                    <Icon name="clock" size="md" />
                  </IconTile>
                  <div>
                    <p className="text-[0.92rem] font-bold">{order.deliveryWindowTitle}</p>
                    <p className="text-[0.74rem] text-ink-45">{order.deliveryWindowNote}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 @[1000px]:sticky @[1000px]:top-[4.6rem]">
              <OrderSummaryCard order={order} locale={locale} shipLabel={shipLabel} t={t} onReceipt={() => {
                downloadReceipt(order, "held");
                toast(t("receiptSaved"));
              }} />
              <div className="rounded-card border border-berry/30 bg-berry/10 p-4">
                <p className="mb-1 text-[0.92rem] font-bold text-berry-muted">{t("moneyWhere")}</p>
                <p className="text-[0.74rem] text-berry-muted">
                  {t("moneyWhereBody", { name: order.sellerFirstName })}
                </p>
              </div>
              <div className="rounded-card border border-hair bg-white p-4">
                <Eyebrow variant="quiet" className="mb-2.5">
                  {t("needSomething")}
                </Eyebrow>
                <div className="flex flex-col gap-2">
                  <ActionButton type="button" variant="whatsapp" size="sm" block onClick={askSeller}>
                    <Icon name="whatsapp" size="md" />
                    {t("messageSeller", { name: order.sellerFirstName })}
                  </ActionButton>
                  <ActionButton type="button" variant="line" size="sm" block onClick={() => setProblemOpen(true)}>
                    {t("somethingWrong")}
                  </ActionButton>
                  <ActionButton type="button" variant="line" size="sm" block disabled={pending} onClick={cancel}>
                    {t("cancelOrder")}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="plain"
                    size="sm"
                    block
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await markCourierCollectedAction(order.id);
                        refresh();
                      })
                    }
                  >
                    {t("demoTransit")}
                  </ActionButton>
                </div>
                <p className="mt-2.5 text-[0.74rem] text-ink-45">{t("cancelNote")}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* TRANSIT */}
      {order.status === "transit" ? (
        <div className="flex flex-1 flex-col gap-4 px-3.5 pt-4 pb-8 @[700px]:px-6 @[700px]:pt-6">
          <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] @[1000px]:items-start @[1000px]:gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <Eyebrow>{t("transitEyebrow")}</Eyebrow>
                <h1 className="font-display text-d1 mt-1.5 font-extrabold uppercase">{t("transitTitle")}</h1>
                <p className="mt-2 text-[0.96rem] text-ink-70">{t("transitLede")}</p>
              </div>
              <MoneyFlow audience="buyerOrder" current={stage} />
              <DeliveryCodeCard
                code={order.deliveryCode}
                eyebrow={t("readOut")}
                copyLabel={t("copy")}
                copiedToast={t("codeCopied")}
                whatLabel={t("whatIsThis")}
                onWhat={() => setCodeOpen(true)}
                compact
                body={t("readOutBody")}
              />
              {order.courier ? (
                <div className="rounded-card border border-hair bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-deep text-[0.78rem] font-bold text-on-deep">
                      {order.courier.initials}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.92rem] font-bold">
                        {order.courier.name} · {order.courier.vehicleLabel}
                      </span>
                      <span className="text-[0.74rem] text-ink-45">{order.courier.collectedLabel}</span>
                    </span>
                    <ActionButton
                      type="button"
                      variant="line"
                      size="sm"
                      onClick={() => toast(t("callCourierToast"))}
                    >
                      {t("call")}
                    </ActionButton>
                  </div>
                  <div className="mt-3.5 h-2 overflow-hidden rounded-pill bg-paper-2">
                    <span
                      ref={trackBarRef}
                      className="block h-full bg-sea transition-[width] duration-[1200ms] ease-[var(--ease-standard)]"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[0.74rem] text-ink-45">
                    <span>{t("collected")}</span>
                    <span>{order.courier.etaLabel}</span>
                  </div>
                </div>
              ) : null}
              <div className="rounded-card border border-hair bg-white p-4">
                <Eyebrow variant="quiet" className="mb-3">
                  {t("timeline")}
                </Eyebrow>
                <OrderTimeline events={order.events} />
              </div>
              <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
                <Icon name="info" size="md" className="mt-0.5 shrink-0" />
                <span>{t("transitNote")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 @[1000px]:sticky @[1000px]:top-[4.6rem]">
              <div className="rounded-card border border-sea/30 bg-sea/10 p-4">
                <p className="mb-1 text-[0.92rem] font-bold text-sea-muted">{t("alreadyHave")}</p>
                <p className="mb-3 text-[0.74rem] text-sea-muted">{t("alreadyHaveBody")}</p>
                <ActionButton
                  type="button"
                  block
                  className="border-transparent bg-sea text-white hover:brightness-105"
                  onClick={() => {
                    setPhoneLast4("");
                    setConfirmErr("");
                    setConfirmOpen(true);
                  }}
                >
                  <Icon name="check" size="md" />
                  {t("iReceived")}
                </ActionButton>
              </div>
              <div className="rounded-card border border-hair bg-white p-4">
                <Eyebrow variant="quiet" className="mb-2.5">
                  {t("needSomething")}
                </Eyebrow>
                <div className="flex flex-col gap-2">
                  <ActionButton type="button" variant="whatsapp" size="sm" block onClick={askSeller}>
                    <Icon name="whatsapp" size="md" />
                    {t("messageSeller", { name: order.sellerFirstName })}
                  </ActionButton>
                  <ActionButton type="button" variant="line" size="sm" block onClick={() => setProblemOpen(true)}>
                    {t("somethingWrong")}
                  </ActionButton>
                </div>
              </div>
              <div className="rounded-card bg-paper-2 p-4">
                <p className="mb-1 text-[0.92rem] font-bold">{t("nobodyConfirms")}</p>
                <p className="text-[0.74rem] text-ink-45">
                  {t.rich("nobodyConfirmsBody", {
                    strong: (c) => <strong className="font-bold">{c}</strong>,
                    name: order.sellerFirstName,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* DONE */}
      {order.status === "done" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="sea" className="mx-auto mb-4 size-[60px] rounded-[20px] bg-sea text-white">
              <Icon name="check" size="lg" className="stroke-[2.4]" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("doneTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">
              {t("doneLede", { name: order.sellerFirstName })}
            </p>
          </div>
          <MoneyFlow audience="buyerOrder" complete current={3} />
          <div className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-2.5">
              {t("receipt")}
            </Eyebrow>
            <PriceLedger
              locale={locale}
              className="bg-transparent p-0"
              rows={[
                {
                  label: `${order.productTitle} × ${order.qty}`,
                  value: order.item,
                },
                { label: shipLabel, value: order.delivery.amountMinor ? order.delivery : t("free") },
                { label: t("paidBy"), value: order.paymentLabel },
                {
                  label: t("codeAccepted"),
                  value: order.codeAcceptedLabel ?? "—",
                },
                { label: t("total"), value: order.total, total: true },
              ]}
            />
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              block
              className="mt-3"
              onClick={() => {
                downloadReceipt(order, "completed");
                toast(t("receiptSaved"));
              }}
            >
              <Icon name="download" size="sm" className="size-3.5" />
              {t("downloadReceipt")}
            </ActionButton>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-2.5">
              {t("howWasIt")}
            </Eyebrow>
            <p className="mb-3 text-[0.96rem] text-ink-70">{t("howWasItLede")}</p>
            <div className="flex flex-wrap gap-2">
              {(["good", "late", "bad"] as const).map((r) => (
                <ActionButton
                  key={r}
                  type="button"
                  variant={order.rating === r ? "sun" : "line"}
                  disabled={pending}
                  onClick={() => rate(r)}
                >
                  {r === "good" ? <Icon name="check" size="md" /> : null}
                  {t(`rate.${r}`)}
                </ActionButton>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton asChild variant="sun">
              <Link href={`/${order.slug}`}>{t("buyAgain", { name: order.sellerFirstName })}</Link>
            </ActionButton>
            <ActionButton type="button" variant="line" onClick={shareShop}>
              <Icon name="share" size="md" />
              {t("tellSomeone")}
            </ActionButton>
          </div>
        </div>
      ) : null}

      {/* DISPUTE */}
      {order.status === "disputed" && order.dispute ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="clay" className="mx-auto mb-4 size-14 rounded-[18px]">
              <Icon name="alert" size="lg" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("disputeTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">
              {t.rich("disputeLede", {
                strong: (c) => <strong className="font-bold">{c}</strong>,
                total: formatMoney(order.total, locale),
                name: order.sellerFirstName,
              })}
            </p>
          </div>
          <div className="rounded-card border border-berry/30 bg-berry/10 p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.74rem] text-berry-muted">{t("frozen")}</p>
                <MoneyDisplay value={order.total} locale={locale} className="text-d2 text-berry-muted" />
              </div>
              <StatusChip label={t("caseId", { id: order.dispute.caseId })} tone="held" />
            </div>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-3">
              {t("whatNow")}
            </Eyebrow>
            <div className="flex flex-col gap-3">
              {[t("dispute1"), t("dispute2", { name: order.sellerFirstName }), t("dispute3")].map(
                (text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-[0.72rem] font-bold text-sun-ink">
                      {i + 1}
                    </span>
                    <span className="text-[0.96rem] text-ink-70">{text}</span>
                  </div>
                ),
              )}
            </div>
            <div className="mt-3 flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
              <Icon name="clock" size="md" className="mt-0.5 shrink-0" />
              <span>
                {t.rich("slaNote", {
                  strong: (c) => <strong className="font-bold">{c}</strong>,
                })}{" "}
                <SlaCountdown deadlineAt={order.dispute.slaDeadlineAt} t={t} />
              </span>
            </div>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-2.5">
              {t("youToldUs")}
            </Eyebrow>
            <p className="text-[0.96rem] text-ink-70">{order.dispute.reason}</p>
            {order.dispute.detail ? (
              <p className="mt-2 text-[0.85rem] text-ink-45">{order.dispute.detail}</p>
            ) : null}
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              block
              className="mt-3"
              onClick={() => setAddOpen(true)}
            >
              {t("addDetail")}
            </ActionButton>
          </div>
          <ActionButton
            type="button"
            variant="line"
            block
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(t("waSupport", { caseId: order.dispute!.caseId, id: order.id }))}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <Icon name="whatsapp" size="md" />
            {t("messageSupport")}
          </ActionButton>
        </div>
      ) : null}

      {/* REFUNDED */}
      {order.status === "refunded" ? (
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-5 px-3.5 py-8 @[700px]:px-6">
          <div className="text-center">
            <IconTile variant="sea" className="mx-auto mb-4 size-[60px] rounded-[20px] bg-sea text-white">
              <Icon name="check" size="lg" className="stroke-[2.4]" />
            </IconTile>
            <h1 className="font-display text-d1 font-extrabold uppercase">{t("refundedTitle")}</h1>
            <p className="mt-2 text-[0.96rem] text-ink-70">
              {t("refundedLede", {
                total: formatMoney(order.total, locale),
                name: order.sellerFirstName,
              })}
            </p>
          </div>
          <div className="rounded-card border border-sea/30 bg-sea/10 p-4">
            <PriceLedger
              locale={locale}
              className="bg-transparent p-0"
              rows={[
                { label: t("refundedTo"), value: order.refund?.toLabel ?? order.paymentLabel },
                { label: t("sent"), value: order.refund?.sentLabel ?? "—" },
                { label: t("usuallyArrives"), value: order.refund?.arrivesLabel ?? "—" },
                { label: t("amount"), value: order.total, total: true },
              ]}
            />
          </div>
          <div className="flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0" />
            <span>{t("refundTrace")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              type="button"
              variant="line"
              onClick={() => {
                downloadReceipt(order, "refunded");
                toast(t("receiptSaved"));
              }}
            >
              <Icon name="download" size="md" />
              {t("downloadReceipt")}
            </ActionButton>
            <ActionButton asChild variant="sun">
              <Link href={`/${order.slug}`}>{t("tryDifferent")}</Link>
            </ActionButton>
          </div>
        </div>
      ) : null}
      </BuyerRise>

      {/* Sheets */}
      <Sheet open={codeOpen} onOpenChange={setCodeOpen}>
        <SheetContent className="inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card">
          <div className="mb-4 flex items-center justify-between">
            <SheetTitle className="font-display text-d3 font-bold uppercase">{t("codeSheetTitle")}</SheetTitle>
            <button type="button" className="grid size-11 place-items-center rounded-full border border-hair" aria-label={t("close")} onClick={() => setCodeOpen(false)}>
              <Icon name="x" size="md" />
            </button>
          </div>
          <SheetDescription className="sr-only">{t("codeSheetTitle")}</SheetDescription>
          <div className="flex flex-col gap-3">
            {[
              { icon: "key" as const, tone: "sun" as const, text: t.rich("codeSheet1", { strong: (c) => <strong className="font-bold">{c}</strong>, name: order.sellerFirstName }) },
              { icon: "wallet" as const, tone: "sea" as const, text: t.rich("codeSheet2", { strong: (c) => <strong className="font-bold">{c}</strong> }) },
              { icon: "alert" as const, tone: "clay" as const, text: t.rich("codeSheet3", { strong: (c) => <strong className="font-bold">{c}</strong> }) },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-3">
                <IconTile variant={row.tone}>
                  <Icon name={row.icon} size="md" />
                </IconTile>
                <p className="text-[0.96rem] text-ink-70">{row.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 rounded-xl bg-paper-2 p-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0" />
            <span>{t("codeSheetNote")}</span>
          </div>
          <ActionButton type="button" variant="sun" block className="mt-4" onClick={() => setCodeOpen(false)}>
            {t("gotIt")}
          </ActionButton>
        </SheetContent>
      </Sheet>

      <Sheet open={problemOpen} onOpenChange={setProblemOpen}>
        <SheetContent className="inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card">
          <div className="mb-3 flex items-center justify-between">
            <SheetTitle className="font-display text-d3 font-bold uppercase">{t("problemTitle")}</SheetTitle>
            <button type="button" className="grid size-11 place-items-center rounded-full border border-hair" aria-label={t("close")} onClick={() => setProblemOpen(false)}>
              <Icon name="x" size="md" />
            </button>
          </div>
          <SheetDescription className="mb-4 text-sm text-ink-70">{t("problemLede")}</SheetDescription>
          <div className="flex flex-col gap-2">
            {PROBLEM_REASONS.map((r) => (
              <ActionButton key={r} type="button" variant="line" block disabled={pending} onClick={() => report(r)}>
                {t(`reasons.${r}`)}
              </ActionButton>
            ))}
          </div>
          <p className="mt-3 text-[0.74rem] text-ink-45">{t("problemNote")}</p>
        </SheetContent>
      </Sheet>

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent className="inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card">
          <SheetTitle className="font-display text-d3 font-bold uppercase">{t("confirmTitle")}</SheetTitle>
          <SheetDescription className="mt-2 text-sm text-ink-70">{t("confirmLede")}</SheetDescription>
          <label className="mt-4 flex flex-col gap-1">
            <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
              {t("confirmPhone")}
            </span>
            <input
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-sun"
            />
            {confirmErr ? <p className="text-[0.75rem] font-semibold text-clay">{confirmErr}</p> : null}
          </label>
          <ActionButton type="button" variant="sun" block className="mt-4" disabled={pending || phoneLast4.length !== 4} onClick={confirmReceived}>
            {t("confirmCta")}
          </ActionButton>
        </SheetContent>
      </Sheet>

      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="inset-auto right-0 bottom-0 left-0 max-h-[90vh] overflow-auto rounded-t-[22px] border border-hair bg-white p-5 text-ink sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(100%-2rem,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card">
          <SheetTitle className="font-display text-d3 font-bold uppercase">{t("addTitle")}</SheetTitle>
          <label className="mt-4 flex flex-col gap-1">
            <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">{t("addLabel")}</span>
            <textarea
              className="min-h-[100px] w-full rounded-xl border border-ink-20 bg-white px-3.5 py-3 outline-none focus:border-sun"
              placeholder={t("addPh")}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </label>
          <ActionButton type="button" variant="line" block className="mt-3" onClick={() => toast(t("photoSoon"))}>
            <Icon name="camera" size="md" />
            {t("addPhoto")}
          </ActionButton>
          <ActionButton
            type="button"
            variant="sun"
            block
            className="mt-2"
            disabled={pending || !detail.trim()}
            onClick={() =>
              startTransition(async () => {
                await addDisputeDetailAction(order.id, detail);
                setAddOpen(false);
                toast(t("detailSent"));
                refresh();
              })
            }
          >
            {t("sendDetail")}
          </ActionButton>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OrderSummaryCard({
  order,
  locale,
  shipLabel,
  t,
  onReceipt,
}: {
  order: BuyerOrder;
  locale: string;
  shipLabel: string;
  t: ReturnType<typeof useTranslations<"protected">>;
  onReceipt: () => void;
}) {
  return (
    <div className="rounded-card border border-hair bg-white p-4">
      <Eyebrow variant="quiet" className="mb-3">
        {t("yourOrder")}
      </Eyebrow>
      <div className="flex items-start gap-3">
        <div className="size-[60px] shrink-0 overflow-hidden rounded-xl bg-paper-2">
          <BeadedBracelet
            paletteIndex={order.palette}
            beadCount={order.beads}
            gradientId={`ord-${order.id}`}
            className="size-full rounded-none"
            aspectClass="aspect-square h-full"
          />
        </div>
        <div className="flex-1">
          <p className="text-[0.92rem] font-bold">{order.productTitle}</p>
          <p className="text-[0.74rem] text-ink-45">
            {t("lineMeta", { variant: order.variant, qty: order.qty })}
          </p>
          <p className="text-[0.74rem] text-ink-45">
            {t("fromSeller", { name: order.sellerName })}
          </p>
        </div>
      </div>
      <hr className="my-3 border-0 border-t border-hair" />
      <PriceLedger
        locale={locale}
        className="bg-transparent p-0"
        rows={[
          {
            label: t("itemLine", { item: order.shortLabel, qty: order.qty }),
            value: order.item,
          },
          {
            label: shipLabel,
            value: order.delivery.amountMinor === 0 ? t("free") : order.delivery,
          },
          { label: t("paidHeld"), value: order.total, total: true },
        ]}
      />
      <ActionButton type="button" variant="line" size="sm" block className="mt-3" onClick={onReceipt}>
        <Icon name="download" size="sm" className="size-3.5" />
        {t("downloadReceipt")}
      </ActionButton>
    </div>
  );
}

export function ProtectedShell(props: ProtectedShellProps) {
  return (
    <ToastProvider>
      <ProtectedShellInner {...props} />
    </ToastProvider>
  );
}
