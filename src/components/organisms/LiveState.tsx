"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Chip } from "@/components/atoms/Chip";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { StatusRow } from "@/components/atoms/StatusRow";
import { Text } from "@/components/atoms/Text";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { QrPanel } from "@/components/molecules/QrPanel";
import { ShopLinkBar } from "@/components/molecules/ShopLinkBar";
import { formatMoney } from "@/lib/money";
import { isExternalHref } from "@/lib/buyer/paths";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { LiveSummary } from "@/types/live";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type LiveStateProps = {
  t: TranslateFn;
  tRich: (key: string) => React.ReactNode;
  locale: string;
  summary: LiveSummary;
  host: string;
  storefrontHref: string;
  onToast: (message: string) => void;
  onChangeLink: () => void;
  onEnlargeQr: () => void;
};

export function LiveState({
  t,
  tRich,
  locale,
  summary,
  host,
  storefrontHref,
  onToast,
  onChangeLink,
  onEnlargeQr,
}: LiveStateProps) {
  const reduceMotion = useReducedMotion();

  const price = formatMoney(
    { amountMinor: summary.product.priceMinor, currency: summary.product.currency },
    locale,
  );

  return (
    <motion.section
      className="flex flex-1 flex-col gap-4 px-3.5 py-4 md:px-6 md:py-8 @[1000px]:gap-5 @[1000px]:p-9"
      aria-label={t("shop.ariaLabel")}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      {/* One restrained arrival. No confetti — the job is not finished and the
          screen must not imply it is. */}
      <header className={cn("text-center", !reduceMotion && "celebration-glow")}>
        <motion.span
          className="mx-auto mb-4 grid size-[72px] place-items-center rounded-full bg-sea text-white"
          aria-hidden
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
        >
          <Icon name="check" size="lg" className="size-8 stroke-[2.4]" />
        </motion.span>

        <Heading level={1} size="display" className="text-d1">
          {tRich("shop.title")}
        </Heading>

        <Text className="mx-auto mt-2.5 max-w-[44ch] text-ink-70">
          {tRich("shop.lede")}
        </Text>
      </header>

      <div className="grid items-start gap-5 @[1000px]:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] @[1000px]:gap-8">
        {/* Left rail: the link, what is switched on, and where money goes. */}
        <div className="flex flex-col gap-3.5">
          <section className="rounded-card border border-hair bg-white p-4">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <Eyebrow variant="quiet">{t("shop.linkEyebrow")}</Eyebrow>
              {summary.slugChangesRemaining > 0 ? (
                <button
                  type="button"
                  onClick={onChangeLink}
                  className="flex items-center gap-1 rounded-lg p-1 text-[0.84rem] font-semibold text-ink-45 transition-colors hover:text-ink"
                >
                  <Icon name="edit" size="sm" className="size-3.5" />
                  {t("shop.changeLink")}
                </button>
              ) : null}
            </div>

            <ShopLinkBar
              host={host}
              slug={summary.shopSlug}
              shopUrl={summary.shopUrl}
              openHref={storefrontHref}
              copyLabel={t("shop.copyLink")}
              copySuccess={t("toast.linkCopied")}
              copyFailure={t("toast.copyFailed")}
              openLabel={t("shop.openShop")}
              onToast={onToast}
            />

            <Text size="tiny" className="mt-2">
              {summary.slugChangesRemaining > 0 ? t("shop.linkHint") : t("shop.linkHintUsed")}
            </Text>
          </section>

          <section className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-1">
              {t("shop.statusEyebrow")}
            </Eyebrow>

            <ul aria-label={t("shop.statusListLabel")}>
              <StatusRow
                status="done"
                statusLabel={t("status.done")}
                title={summary.product.title}
                subtitle={
                  summary.product.madeToOrder
                    ? t("status.listingSubMadeToOrder", {
                        price,
                        images: summary.product.imageCount,
                      })
                    : t("status.listingSub", {
                        price,
                        stock: summary.product.stock,
                        images: summary.product.imageCount,
                      })
                }
                trailing={<Chip variant="live">{t("status.listingChip")}</Chip>}
              />
              <StatusRow
                status="done"
                statusLabel={t("status.done")}
                title={t("status.paymentsTitle")}
                subtitle={t("status.paymentsSub")}
              />
              <StatusRow
                status="done"
                statusLabel={t("status.done")}
                title={t("status.payoutTitle")}
                subtitle={t("status.payoutSub", {
                  rail: summary.payout.railLabel,
                  masked: summary.payout.maskedIdentifier,
                  holder: summary.payout.holderName,
                })}
              />
              <StatusRow
                status="done"
                statusLabel={t("status.done")}
                title={t("status.protectionTitle")}
                subtitle={t("status.protectionSub")}
              />
              {/* Deliberately incomplete. A shop nobody knows about earns nothing,
                  and this row is what carries the seller to screen 5. */}
              <StatusRow
                status="waiting"
                statusLabel={t("status.todo")}
                title={t("status.customersTitle")}
                subtitle={t("status.customersSub")}
                waitingIcon="users"
                trailing={<Chip variant="line">{t("status.customersChip")}</Chip>}
              />
            </ul>
          </section>

          <section className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-2.5">
              {t("shop.moneyEyebrow")}
            </Eyebrow>
            <MoneyFlow variant="four" current={1} />
            <Text size="tiny" className="mt-2.5">
              {t("shop.moneyHint")}
            </Text>
          </section>
        </div>

        {/* Right rail: the QR, what a sale looks like, and the buyer's view. */}
        <div className="flex flex-col gap-3.5">
          <section className="rounded-card border border-hair bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Eyebrow variant="quiet">{t("shop.qrEyebrow")}</Eyebrow>
              <Chip variant="line">{t("shop.qrChip")}</Chip>
            </div>

            <QrPanel
              shopUrl={summary.shopUrl}
              slug={summary.shopSlug}
              labels={{
                qrAlt: t("shop.qrAlt", { url: `${host}${summary.shopSlug}` }),
                download: t("shop.qrDownload"),
                print: t("shop.qrPrint"),
                enlarge: t("shop.qrEnlarge"),
                savedToast: t("toast.qrSaved"),
                failedToast: t("toast.qrFailed"),
              }}
              onToast={onToast}
              onEnlarge={onEnlargeQr}
            />

            <Text size="tiny" className="mt-2.5">
              {t("shop.qrHint")}
            </Text>
          </section>

          <section className="rounded-card bg-deep p-4 text-on-deep">
            <Eyebrow onDark>{t("shop.buyerEyebrow")}</Eyebrow>
            <ol className="mt-3 flex flex-col gap-3">
              {["shop.buyerStep1", "shop.buyerStep2", "shop.buyerStep3"].map((key, index) => (
                <li key={key} className="flex items-start gap-2.5">
                  <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-[0.72rem] font-bold text-sun-ink">
                    {index + 1}
                  </span>
                  <Text size="small" surface="dark">
                    {t(key)}
                  </Text>
                </li>
              ))}
            </ol>
          </section>

          <a
            href={storefrontHref}
            {...(isExternalHref(storefrontHref)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex min-h-11 items-center gap-2.5 rounded-tile border border-hair bg-white p-3 text-left transition-colors hover:bg-paper-2"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper-2 text-ink">
              <Icon name="eye" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.93rem] font-bold leading-snug">
                {t("shop.previewTitle")}
              </span>
              <span className="mt-0.5 block text-[0.76rem] text-ink-45">
                {t("shop.previewSub")}
              </span>
            </span>
            <Icon name="arrowRight" className="text-ink-45" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
