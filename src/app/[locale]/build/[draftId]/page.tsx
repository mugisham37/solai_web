import { setRequestLocale } from "next-intl/server";
import { BuildTemplate } from "@/components/templates/BuildTemplate";

type BuildPageProps = {
  params: Promise<{ locale: string; draftId: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function BuildPage({ params, searchParams }: BuildPageProps) {
  const { locale, draftId } = await params;
  setRequestLocale(locale);
  const { q } = await searchParams;

  return <BuildTemplate draftId={draftId} initialQuery={q} />;
}
