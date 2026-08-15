import { getTranslations, setRequestLocale } from "next-intl/server";
import { StartHandoffState } from "@/components/organisms/StartHandoffState";

type StartPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function StartPage({ params, searchParams }: StartPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { q } = await searchParams;
  const t = await getTranslations("start");

  return (
    <StartHandoffState
      q={q?.trim() || undefined}
      eyebrow={t("eyebrow")}
      title={t("title")}
      lede={t("lede")}
      errorTitle={t("errorTitle")}
      retryLabel={t("retry")}
    />
  );
}
