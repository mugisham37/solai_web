"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { PanelErrorBoundary } from "@/components/build/PanelErrorBoundary";
import { AiField } from "@/components/molecules/AiField";
import { PriceField } from "@/components/molecules/PriceField";
import { TonePicker } from "@/components/molecules/TonePicker";
import { VariantInput } from "@/components/molecules/VariantInput";
import { Chip } from "@/components/atoms/Chip";
import { Icon } from "@/components/atoms/Icon";
import { TONE_OPTIONS } from "@/data/build";
import { draftFormSchema, type DraftFormValues } from "@/lib/schemas/draft-form";
import type { Draft, Tone } from "@/types/build";

type ListingDetailsPanelProps = {
  t: (key: string) => string;
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  onBlurSave: () => void;
  onWhyPrice: () => void;
  onRewriteTone: (tone: Tone) => void;
  originalTitle: string;
  originalPriceMinor: number;
};

export function ListingDetailsPanel({
  t,
  draft,
  onDraftChange,
  onBlurSave,
  onWhyPrice,
  onRewriteTone,
  originalTitle,
  originalPriceMinor,
}: ListingDetailsPanelProps) {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [lang, setLang] = useState<"en" | "rw">("en");

  const form = useForm<DraftFormValues>({
    resolver: zodResolver(draftFormSchema),
    values: {
      title: draft.title.en ?? "",
      priceMinor: draft.price.amountMinor,
      stock: draft.stock,
      madeToOrder: draft.madeToOrder,
      descriptionEn: draft.description.en ?? "",
      descriptionRw: draft.description.rw ?? "",
      variants: [...draft.variants],
      condition: draft.condition,
      leadTimeDays: draft.leadTimeDays,
      weightGrams: draft.weightGrams,
      courierEnabled: draft.courierEnabled,
      pickupEnabled: draft.pickupEnabled,
    },
  });

  const syncDraft = (partial: Partial<DraftFormValues>) => {
    const v = { ...form.getValues(), ...partial };
    onDraftChange({
      ...draft,
      title: { ...draft.title, en: v.title },
      description: { en: v.descriptionEn, rw: v.descriptionRw },
      price: { ...draft.price, amountMinor: v.priceMinor },
      stock: v.stock,
      madeToOrder: v.madeToOrder,
      variants: v.variants,
      condition: v.condition,
      leadTimeDays: v.leadTimeDays ?? draft.leadTimeDays,
      weightGrams: v.weightGrams ?? draft.weightGrams,
      courierEnabled: v.courierEnabled,
      pickupEnabled: v.pickupEnabled,
      updatedAt: new Date().toISOString(),
    });
  };

  const priceMinor = useWatch({ control: form.control, name: "priceMinor" });
  const titleValue = useWatch({ control: form.control, name: "title" }) ?? "";
  const stock = useWatch({ control: form.control, name: "stock" }) ?? 0;
  const madeToOrder = useWatch({ control: form.control, name: "madeToOrder" }) ?? false;
  const descriptionEn = useWatch({ control: form.control, name: "descriptionEn" }) ?? "";
  const descriptionRw = useWatch({ control: form.control, name: "descriptionRw" }) ?? "";
  const variants = useWatch({ control: form.control, name: "variants" }) ?? [];
  const courierEnabled = useWatch({ control: form.control, name: "courierEnabled" }) ?? true;
  const priceDisplay = new Intl.NumberFormat(locale).format(priceMinor ?? 0);

  return (
    <PanelErrorBoundary title={t("details.errorTitle")} retryLabel={t("details.errorRetry")}>
      <div className="flex flex-col gap-4 pb-24">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-45">{t("details.category")}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Chip variant="sun">{draft.category}</Chip>
          </div>
        </div>

        <AiField
          label={t("details.nameLabel")}
          aiBadge={t("details.aiWrote")}
          restoreLabel={t("details.restore")}
          originalValue={originalTitle}
          value={titleValue}
          onChange={(val) => {
            form.setValue("title", val);
            syncDraft({ title: val });
          }}
          onBlur={onBlurSave}
          hint={
            <span className="text-xs text-ink-45">
              {titleValue.length}/70 · {t("details.nameHint")}
            </span>
          }
        >
          <input
            className="w-full rounded-xl border border-ink-20 px-3 py-3"
            maxLength={70}
            value={titleValue}
            onChange={(e) => {
              form.setValue("title", e.target.value);
              syncDraft({ title: e.target.value });
            }}
            onBlur={onBlurSave}
          />
        </AiField>

        <PriceField
          label={t("details.priceLabel")}
          aiBadge={t("details.suggested")}
          restoreLabel={t("details.restore")}
          originalDisplay={new Intl.NumberFormat(locale).format(originalPriceMinor)}
          valueDisplay={priceDisplay}
          onChange={(minor) => {
            form.setValue("priceMinor", minor);
            syncDraft({ priceMinor: minor });
          }}
          onBlur={onBlurSave}
          price={{ ...draft.price, amountMinor: priceMinor ?? draft.price.amountMinor }}
          confidenceLabel={t(`details.confidence.${draft.price.confidence}`)}
          whyLabel={t("details.whyPrice")}
          onWhy={onWhyPrice}
          rangeHint={t("details.rangeHint")}
        />

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-45">{t("details.stockLabel")}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input
              type="number"
              className="w-[110px] rounded-xl border border-ink-20 px-3 py-3"
              value={stock}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                if (!Number.isNaN(n)) {
                  form.setValue("stock", n);
                  syncDraft({ stock: n });
                }
              }}
              onBlur={onBlurSave}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={madeToOrder}
                onChange={(e) => {
                  form.setValue("madeToOrder", e.target.checked);
                  syncDraft({ madeToOrder: e.target.checked });
                  onBlurSave();
                }}
              />
              {t("details.madeToOrder")}
            </label>
          </div>
        </div>

        <AiField
          label={
            <span className="flex w-full flex-wrap items-center gap-2">
              {t("details.descriptionLabel")}
              <span className="ml-auto inline-flex rounded-pill bg-paper-2 p-0.5" role="tablist">
                {(["en", "rw"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="tab"
                    aria-selected={lang === l}
                    className={`rounded-pill px-2 py-0.5 text-xs font-bold ${lang === l ? "bg-white" : ""}`}
                    onClick={() => setLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </span>
            </span>
          }
          aiBadge={t("details.aiWrote")}
          restoreLabel={t("details.restore")}
          originalValue={draft.description.en ?? ""}
          value={lang === "en" ? descriptionEn : descriptionRw}
          onChange={() => {}}
          onBlur={onBlurSave}
        >
          <motion.textarea
            className="min-h-24 w-full rounded-xl border border-ink-20 px-3 py-3"
            value={lang === "en" ? descriptionEn : descriptionRw}
            onChange={(e) => {
              if (lang === "en") {
                form.setValue("descriptionEn", e.target.value);
                syncDraft({ descriptionEn: e.target.value });
              } else {
                form.setValue("descriptionRw", e.target.value);
                syncDraft({ descriptionRw: e.target.value });
              }
            }}
            onBlur={onBlurSave}
            key={lang}
            initial={reduceMotion ? false : { opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
          <TonePicker
            prefix={t("details.rewriteAs")}
            options={TONE_OPTIONS.map((o) => ({ id: o.id, label: t(o.labelKey) }))}
            onSelect={onRewriteTone}
          />
        </AiField>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-45">{t("details.variantsLabel")}</span>
          <VariantInput
            variants={variants}
            onChange={(variants) => {
              form.setValue("variants", variants);
              syncDraft({ variants });
              onBlurSave();
            }}
            placeholder={t("details.variantsPlaceholder")}
            ariaLabel={t("details.variantsLabel")}
          />
        </div>

        <div className="flex items-center justify-between rounded-tile border border-hair p-3">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Icon name="truck" />
            {t("details.courierTitle")}
          </span>
          <input
            type="checkbox"
            checked={courierEnabled}
            onChange={(e) => {
              form.setValue("courierEnabled", e.target.checked);
              syncDraft({ courierEnabled: e.target.checked });
              onBlurSave();
            }}
            aria-label={t("details.courierTitle")}
          />
        </div>

        <p className="rounded-xl bg-paper-2 p-3 text-sm text-ink-70">{t("details.notPublic")}</p>
      </div>
    </PanelErrorBoundary>
  );
}
