import { getTranslations } from "next-intl/server";

type DashboardPlaceholderProps = {
  titleKey: string;
  descriptionKey?: string;
};

/** Temporary section body until the view organism lands in a later phase. */
export async function DashboardPlaceholder({
  titleKey,
  descriptionKey = "placeholder.lede",
}: DashboardPlaceholderProps) {
  const t = await getTranslations("dashboard");

  return (
    <section className="rounded-card border border-hair bg-white p-5">
      <p className="text-xs font-bold tracking-wide text-ink-45 uppercase">
        {t("placeholder.eyebrow")}
      </p>
      <h2 className="mt-2 font-display text-d2 font-extrabold text-ink uppercase">
        {t(titleKey)}
      </h2>
      <p className="mt-2 max-w-prose text-sm text-ink-70">{t(descriptionKey)}</p>
    </section>
  );
}
