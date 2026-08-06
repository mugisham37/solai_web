"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { saveShopSettingsAction } from "@/app/actions/dashboard/settings";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { StatusChip } from "@/components/atoms/StatusChip";
import { ChangeWalletSheet } from "@/components/molecules/ChangeWalletSheet";
import { ToggleRow } from "@/components/molecules/ToggleRow";
import { useToastContext } from "@/components/providers/ToastProvider";
import { formatMoney } from "@/lib/money";
import { sanitiseSlug } from "@/lib/slug";
import type { DashboardShop } from "@/types/dashboard";

type SettingsViewProps = {
  shop: DashboardShop;
};

export function SettingsView({ shop }: SettingsViewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();
  const [walletOpen, setWalletOpen] = useState(false);

  const [name, setName] = useState(shop.name);
  const [slug, setSlug] = useState(shop.slug);
  const [city, setCity] = useState(shop.city);
  const [lang, setLang] = useState(shop.lang);
  const [deliveryEnabled, setDeliveryEnabled] = useState(shop.deliveryEnabled);
  const [pickupEnabled, setPickupEnabled] = useState(shop.pickupEnabled);
  const [notifySms, setNotifySms] = useState(shop.notifySms);
  const [notifyWa, setNotifyWa] = useState(shop.notifyWa);
  const [weekly, setWeekly] = useState(false);

  const save = () => {
    startTransition(async () => {
      const result = await saveShopSettingsAction({
        name,
        slug: sanitiseSlug(slug),
        city,
        lang,
        deliveryEnabled,
        pickupEnabled,
        notifySms,
        notifyWa,
      });
      if (!result.ok) {
        toast(
          "error" in result && result.error === "validation"
            ? t("settings.save.validation")
            : t("settings.save.failed"),
        );
        return;
      }
      toast(t("settings.save.done"));
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
        {t("titles.settings")}
      </h1>

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3 rounded-card border border-hair bg-white p-4">
            <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.shopTitle")}
            </p>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                {t("settings.fields.name")}
              </span>
              <input
                className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 outline-none focus:border-ink"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="text-[0.73rem] text-ink-45">
                {t("settings.fields.nameHint")}
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                {t("settings.fields.link")}
              </span>
              <span className="flex min-h-11 overflow-hidden rounded-xl border border-ink-20">
                <span className="grid place-items-center bg-paper-2 px-3 text-sm font-bold text-ink-45">
                  solai.shop/
                </span>
                <input
                  className="min-w-0 flex-1 bg-white px-3 py-2.5 outline-none"
                  value={slug}
                  onChange={(e) => setSlug(sanitiseSlug(e.target.value))}
                />
              </span>
              <span className="text-[0.73rem] text-ink-45">
                {t("settings.fields.linkHint")}
              </span>
            </label>

            <div className="flex flex-col gap-3 @[560px]:flex-row">
              <label className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  {t("settings.fields.city")}
                </span>
                <input
                  className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 outline-none focus:border-ink"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  {t("settings.fields.language")}
                </span>
                <select
                  className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 outline-none focus:border-ink"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">{t("settings.langs.en")}</option>
                  <option value="rw">{t("settings.langs.rw")}</option>
                  <option value="sw">{t("settings.langs.sw")}</option>
                  <option value="fr">{t("settings.langs.fr")}</option>
                </select>
              </label>
            </div>

            <ActionButton
              type="button"
              variant="sun"
              className="self-start"
              disabled={pending}
              onClick={save}
            >
              {pending ? t("settings.save.saving") : t("settings.save.cta")}
            </ActionButton>
          </div>

          <div className="rounded-card border border-hair bg-white px-3 py-1">
            <p className="px-1 pt-2 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.deliveryTitle")}
            </p>
            <div className="divide-y divide-hair">
              <ToggleRow
                title={t("settings.delivery.moto.title")}
                subtitle={t("settings.delivery.moto.sub", {
                  price: formatMoney(
                    { amountMinor: 1200, currency: shop.currency },
                    locale,
                  ),
                  city: city || shop.city,
                })}
                checked={deliveryEnabled}
                onCheckedChange={setDeliveryEnabled}
              />
              <ToggleRow
                title={t("settings.delivery.pickup.title")}
                subtitle={t("settings.delivery.pickup.sub")}
                checked={pickupEnabled}
                onCheckedChange={setPickupEnabled}
              />
            </div>
          </div>

          <div className="rounded-card border border-hair bg-white px-3 py-1">
            <p className="px-1 pt-2 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.notifyTitle")}
            </p>
            <div className="divide-y divide-hair">
              <ToggleRow
                title={t("settings.notify.sms.title")}
                subtitle={t("settings.notify.sms.sub")}
                checked={notifySms}
                onCheckedChange={setNotifySms}
              />
              <ToggleRow
                title={t("settings.notify.wa.title")}
                subtitle={t("settings.notify.wa.sub")}
                checked={notifyWa}
                onCheckedChange={setNotifyWa}
              />
              <ToggleRow
                title={t("settings.notify.weekly.title")}
                subtitle={t("settings.notify.weekly.sub")}
                checked={weekly}
                onCheckedChange={setWeekly}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.wallet.title")}
            </p>
            <div className="flex items-center gap-2.5">
              <IconTile variant="sun">
                <Icon name="wallet" />
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.91rem] font-bold text-ink">
                  {shop.walletLabel}
                </span>
                <span className="block text-[0.73rem] text-ink-45">
                  {shop.walletMasked} · {shop.holderName}
                </span>
              </span>
            </div>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              block
              className="mt-3"
              onClick={() => setWalletOpen(true)}
            >
              {t("settings.wallet.change")}
            </ActionButton>
            <p className="mt-2.5 text-[0.73rem] text-ink-45">
              {t("settings.wallet.note")}
            </p>
          </div>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.planTitle")}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.91rem] font-bold text-ink">
                {shop.plan === "free"
                  ? t("plans.free.name")
                  : t("plans.plus.name")}
              </span>
              <StatusChip
                tone="sun"
                label={
                  shop.plan === "free"
                    ? t("settings.planFeeFree")
                    : t("settings.planFeePlus")
                }
              />
            </div>
            <ActionButton asChild variant="line" size="sm" block className="mt-3">
              <Link href="/dashboard/money/plans">{t("settings.seePlans")}</Link>
            </ActionButton>
          </div>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("settings.accountTitle")}
            </p>
            <div className="flex flex-col gap-2">
              <ActionButton type="button" variant="line" size="sm" block>
                <Icon name="download" size="sm" />
                {t("settings.downloadData")}
              </ActionButton>
              <ActionButton type="button" variant="line" size="sm" block>
                {t("settings.backupNumber")}
              </ActionButton>
              <ActionButton
                type="button"
                variant="plain"
                className="justify-start text-clay"
                aria-label={t("settings.closeShopAria")}
              >
                {t("settings.closeShop")}
              </ActionButton>
            </div>
            <p className="mt-2.5 text-[0.73rem] text-ink-45">
              {t("settings.closeShopNote")}
            </p>
          </div>
        </div>
      </div>

      <ChangeWalletSheet
        draftId={shop.draftId}
        walletMasked={shop.walletMasked}
        open={walletOpen}
        onOpenChange={setWalletOpen}
      />
    </div>
  );
}
