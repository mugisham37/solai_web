"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { OtpInput } from "@/components/molecules/OtpInput";
import { releaseOrderAction } from "@/app/actions/dashboard/release-order";
import { useToastContext } from "@/components/providers/ToastProvider";
import { orderNet } from "@/lib/dashboard/derive";
import { formatMoney } from "@/lib/money";
import { DASHBOARD_MOTION, MOTION_EASE } from "@/lib/motion";
import type { DashboardOrder } from "@/types/dashboard";

type DeliverViewProps = {
  order: DashboardOrder;
  /** Shown in the prototype so QA can try wrong/right codes. */
  showDemoCode?: boolean;
};

export function DeliverView({ order, showDemoCode = true }: DeliverViewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const reduceMotion = useReducedMotion();
  const [code, setCode] = useState("");
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const groupRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const net = orderNet(order);

  const cellLabels = [
    t("deliver.digit1"),
    t("deliver.digit2"),
    t("deliver.digit3"),
    t("deliver.digit4"),
  ] as const;

  useEffect(() => {
    if (reduceMotion) return;
    const tmo = window.setTimeout(() => {
      groupRef.current?.querySelector("input")?.focus();
    }, 220);
    return () => window.clearTimeout(tmo);
  }, [reduceMotion]);

  const announce = (message: string) => {
    if (statusRef.current) statusRef.current.textContent = message;
  };

  const onRelease = () => {
    if (!complete || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await releaseOrderAction(order.id, code);
      if (!result.ok) {
        const message =
          result.error === "wrong_code"
            ? t("deliver.wrongCode")
            : result.error === "rate_limited"
              ? t("deliver.rateLimited")
              : result.error === "not_releasable"
                ? t("deliver.notReleasable")
                : t("deliver.failed");

        setError(message);
        announce(message);

        if (result.error === "wrong_code") {
          setCode("");
          setComplete(false);
          window.setTimeout(() => {
            groupRef.current?.querySelector("input")?.focus();
          }, 50);
        }
        return;
      }

      const amount = formatMoney(result.payout.amount, locale);
      toast(t("deliver.releasedToast", { amount }));
      announce(t("deliver.releasedAnnounce"));
      router.push(`/dashboard/orders/${order.id}/paid`);
      router.refresh();
    });
  };

  return (
    <motion.div
      className="mx-auto flex w-full max-w-[520px] flex-col gap-6"
      initial={reduceMotion ? false : { opacity: 0, y: DASHBOARD_MOTION.viewRise.y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DASHBOARD_MOTION.viewRise.duration, ease: MOTION_EASE }}
    >
      <div className="text-center">
        <span className="mx-auto mb-3 grid size-[52px] place-items-center rounded-2xl bg-sun text-sun-ink">
          <Icon name="key" size="lg" className="size-6" />
        </span>
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {t("deliver.title")}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[40ch] text-[0.95rem] text-ink-70">
          {t("deliver.lede", { buyer: order.buyerName })}
        </p>
      </div>

      <div ref={groupRef}>
        <OtpInput
          value={code}
          length={4}
          error={Boolean(error)}
          disabled={pending}
          cellLabels={cellLabels}
          onChange={(value, isComplete) => {
            setCode(value);
            setComplete(isComplete);
            if (error) setError(null);
          }}
        />
      </div>

      <p className="text-center text-[0.73rem] text-ink-45" aria-live="polite">
        {error ? (
          <span className="font-bold text-clay">{error}</span>
        ) : showDemoCode ? (
          t.rich("deliver.demoHint", {
            code: order.deliveryCode,
            strong: (chunks) => <span className="font-bold text-ink">{chunks}</span>,
          })
        ) : (
          t("deliver.hint")
        )}
      </p>
      <p ref={statusRef} className="sr-only" aria-live="assertive" />

      <div className="rounded-card bg-paper-2 p-4">
        <div className="flex flex-col gap-3.5">
          <Step n={1} text={t("deliver.step1")} />
          <Step
            n={2}
            text={t("deliver.step2", { amount: formatMoney(net, locale) })}
          />
          <Step n={3} text={t("deliver.step3")} />
        </div>
      </div>

      <ActionButton
        type="button"
        variant="sun"
        size="lg"
        block
        disabled={!complete || pending}
        onClick={onRelease}
      >
        {pending ? t("deliver.releasing") : t("deliver.release")}
        {!pending ? <Icon name="arrowRight" /> : null}
      </ActionButton>

      <ActionButton asChild variant="plain" className="self-center">
        <Link href={`/dashboard/orders/${order.id}`}>{t("deliver.back")}</Link>
      </ActionButton>

      <span className="sr-only">
        <MoneyDisplay value={net} locale={locale} />
      </span>
    </motion.div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-sun text-[0.7rem] font-bold text-sun-ink">
        {n}
      </span>
      <p className="text-sm text-ink-70">{text}</p>
    </div>
  );
}
